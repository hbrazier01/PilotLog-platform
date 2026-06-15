/**
 * AIR-352 — Aircraft Foundation Tests
 *
 * Tests Aircraft lifecycle:
 *   create_aircraft → update_aircraft → deactivate_aircraft
 *
 * Ownership enforcement:
 *   - update rejected if caller is not owner (WHERE clause on owner_signer_address)
 *   - deactivate rejected if caller is not owner (WHERE clause on owner_signer_address)
 *
 * Identity rule: signerAddress (chain-verified) is the identity primitive.
 * No walletAddress / userId / ownerAddress accepted from payload.
 *
 * Uniqueness: tail_number is globally unique among active aircraft.
 */
import { assertSQL, assert } from "../helpers.ts";
import { createWalletClient, createPublicClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { contractAddressesEvmMain } from "@pilotlog-sandbox/contracts-evm";
import type { Client } from "pg";

const wallet0 = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
);
const wallet1 = privateKeyToAccount(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
);

const effectstreamL2Abi = [{
  inputs: [{ name: "data", type: "bytes" }],
  name: "effectstreamSubmitGameInput",
  outputs: [],
  stateMutability: "payable",
  type: "function",
}] as const;

async function submit(account: ReturnType<typeof privateKeyToAccount>, actionArray: unknown[]) {
  const addresses = contractAddressesEvmMain();
  const contractAddr = addresses.chain31337["EffectstreamL2Module#MyEffectstreamL2"];
  const walletClient = createWalletClient({ account, chain: hardhat, transport: http() });
  const publicClient = createPublicClient({ chain: hardhat, transport: http() });
  const hash = await walletClient.writeContract({
    address: contractAddr,
    abi: effectstreamL2Abi,
    functionName: "effectstreamSubmitGameInput",
    args: [toHex(JSON.stringify(actionArray))],
  });
  await publicClient.waitForTransactionReceipt({ hash });
}

const API_PORT = 9999;

export async function aircraftTest(db: Client) {
  console.log("\n[aircraft] Aircraft creation lifecycle...");

  // ── 1. create_aircraft ──────────────────────────────────────────────────────
  await submit(wallet0, ["create_aircraft", "N123AB", "Cirrus", "SR20 G6", 2022, "Single Engine Land"]);

  let aircraftId: number | null = null;

  await assertSQL(
    "create_aircraft: row inserted with owner_signer_address, status=active",
    db,
    `SELECT * FROM aircraft WHERE owner_signer_address = '${wallet0.address.toLowerCase()}' AND tail_number = 'N123AB' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => {
      aircraftId = res.rows[0].id;
      return (
        res.rows[0].status === "active" &&
        res.rows[0].manufacturer === "Cirrus" &&
        res.rows[0].model === "SR20 G6" &&
        res.rows[0].year === 2022 &&
        res.rows[0].aircraft_category === "Single Engine Land" &&
        res.rows[0].owner_signer_address === wallet0.address.toLowerCase()
      );
    },
  );

  // ── 2. Midnight identity: signerAddress preserved ──────────────────────────
  await assertSQL(
    "create_aircraft: owner_signer_address matches chain-verified signer (Midnight identity)",
    db,
    `SELECT owner_signer_address FROM aircraft WHERE tail_number = 'N123AB' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => res.rows[0].owner_signer_address === wallet0.address.toLowerCase(),
  );

  // ── 3. GET /api/aircraft ────────────────────────────────────────────────────
  await assert("GET /api/aircraft returns the new aircraft", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/aircraft`);
    const data = await res.json();
    return (
      Array.isArray(data.aircraft) &&
      data.aircraft.some((a: any) => a.tail_number === "N123AB" && a.owner_signer_address === wallet0.address.toLowerCase())
    );
  });

  // ── 4. GET /api/aircraft/:id ────────────────────────────────────────────────
  if (aircraftId !== null) {
    await assert(`GET /api/aircraft/${aircraftId} returns specific aircraft`, async () => {
      const res = await fetch(`http://localhost:${API_PORT}/api/aircraft/${aircraftId}`);
      const data = await res.json();
      return data.aircraft?.tail_number === "N123AB";
    });
  }

  // ── 5. GET /api/my-aircraft/:signer ────────────────────────────────────────
  await assert("GET /api/my-aircraft/:signer returns owner's aircraft", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/my-aircraft/${wallet0.address.toLowerCase()}`);
    const data = await res.json();
    return (
      Array.isArray(data.aircraft) &&
      data.aircraft.some((a: any) => a.tail_number === "N123AB")
    );
  });

  console.log("\n[aircraft] Aircraft update lifecycle...");

  // ── 6. update_aircraft (authorized) ────────────────────────────────────────
  if (aircraftId !== null) {
    await submit(wallet0, ["update_aircraft", aircraftId, "Cirrus", "SR22 GTS", 2023, "Single Engine Land"]);

    await assertSQL(
      "update_aircraft: owner can update manufacturer/model/year",
      db,
      `SELECT * FROM aircraft WHERE id = ${aircraftId}`,
      (res) => res.rows.length === 1 && res.rows[0].model === "SR22 GTS",
      (res) => res.rows[0].model === "SR22 GTS" && res.rows[0].year === 2023,
    );

    // ── 7. update_aircraft (unauthorized) ───────────────────────────────────
    await submit(wallet1, ["update_aircraft", aircraftId, "Cessna", "172", 2010, "Single Engine Land"]);

    // The unauthorized wallet1 tx lands in the same block — wait long enough for it to process
    // then verify the row is unchanged (still Cirrus/SR22 GTS from the authorized update)
    await new Promise((r) => setTimeout(r, 3000));
    await assertSQL(
      "update_aircraft: unauthorized update has no effect (ownership enforced)",
      db,
      `SELECT * FROM aircraft WHERE id = ${aircraftId}`,
      (res) => res.rows.length === 1,
      (res) => res.rows[0].manufacturer === "Cirrus" && res.rows[0].model === "SR22 GTS",
    );
  }

  console.log("\n[aircraft] Aircraft deactivation lifecycle...");

  // ── 8. Register a second aircraft for deactivation test ────────────────────
  await submit(wallet1, ["create_aircraft", "N99999", "Cessna", "172", 1975, "Single Engine Land"]);

  let deactivateId: number | null = null;
  await assertSQL(
    "create second aircraft for deactivation test",
    db,
    `SELECT * FROM aircraft WHERE owner_signer_address = '${wallet1.address.toLowerCase()}' AND tail_number = 'N99999' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { deactivateId = res.rows[0].id; return true; },
  );

  if (deactivateId !== null) {
    // ── 9. deactivate_aircraft (unauthorized) ─────────────────────────────
    await submit(wallet0, ["deactivate_aircraft", deactivateId]);

    // Wait for the unauthorized tx to be processed before checking the row is unchanged
    await new Promise((r) => setTimeout(r, 3000));
    await assertSQL(
      "deactivate_aircraft: unauthorized deactivation has no effect (ownership enforced)",
      db,
      `SELECT * FROM aircraft WHERE id = ${deactivateId}`,
      (res) => res.rows.length === 1,
      (res) => res.rows[0].status === "active",
    );

    // ── 10. deactivate_aircraft (authorized) ──────────────────────────────
    await submit(wallet1, ["deactivate_aircraft", deactivateId]);

    await assertSQL(
      "deactivate_aircraft: owner can deactivate, status=inactive",
      db,
      `SELECT * FROM aircraft WHERE id = ${deactivateId}`,
      (res) => res.rows.length === 1 && res.rows[0].status === "inactive",
      (res) => res.rows[0].status === "inactive",
    );

    // ── 11. Deactivated aircraft absent from GET /api/aircraft ─────────────
    await assert("GET /api/aircraft does not return inactive aircraft", async () => {
      const res = await fetch(`http://localhost:${API_PORT}/api/aircraft`);
      const data = await res.json();
      return !data.aircraft.some((a: any) => a.id === deactivateId);
    });
  }

  // ── 12. Tail number uniqueness ─────────────────────────────────────────────
  // Deactivated aircraft free their tail number — re-registering N99999 should succeed
  await submit(wallet0, ["create_aircraft", "N99999", "Piper", "PA-28", 1980, "Single Engine Land"]);

  await assertSQL(
    "tail_number uniqueness: deactivated tail can be re-registered by a different owner",
    db,
    `SELECT * FROM aircraft WHERE tail_number = 'N99999' AND status = 'active' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => res.rows[0].owner_signer_address === wallet0.address.toLowerCase(),
  );

  console.log("\n[aircraft] All lifecycle tests complete.");
}

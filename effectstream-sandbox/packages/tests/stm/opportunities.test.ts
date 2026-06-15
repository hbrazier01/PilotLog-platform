/**
 * AIR-351 — Opportunities Foundation Tests
 *
 * Tests Student Request and CFI Availability lifecycles:
 *   create → accept → withdraw
 *
 * Ownership enforcement:
 *   - withdraw rejected if caller is not owner (via SQL WHERE clause)
 *
 * Identity rule: signerAddress (chain-verified) is the identity primitive.
 * No walletAddress / userId / profileId accepted from payload.
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

export async function opportunitiesTest(db: Client) {
  console.log("\n[opportunities] Student Request lifecycle...");

  // ── 1. create_student_request ──────────────────────────────────────────────
  await submit(wallet0, ["create_student_request", "N12345", "Looking for CFI for PPL"]);

  let requestId: number | null = null;

  await assertSQL(
    "create_student_request: row inserted with owner_signer_address and status=open",
    db,
    `SELECT * FROM student_request WHERE owner_signer_address = '${wallet0.address.toLowerCase()}' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => {
      requestId = res.rows[0].id;
      return res.rows[0].status === "open" && res.rows[0].aircraft_ident === "N12345";
    },
  );

  // ── 2. GET /api/student-requests ───────────────────────────────────────────
  await assert("GET /api/student-requests returns the new request", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/student-requests`);
    const data = await res.json();
    return Array.isArray(data.studentRequests) &&
      data.studentRequests.some((r: any) => r.owner_signer_address === wallet0.address.toLowerCase());
  });

  // ── 3. accept_student_request ──────────────────────────────────────────────
  if (requestId !== null) {
    await submit(wallet1, ["accept_student_request", requestId]);

    await assertSQL(
      "accept_student_request: status=accepted, accepted_signer_address set",
      db,
      `SELECT * FROM student_request WHERE id = ${requestId}`,
      (res) => res.rows.length === 1 && res.rows[0].status === "accepted",
      (res) =>
        res.rows[0].status === "accepted" &&
        res.rows[0].accepted_signer_address === wallet1.address.toLowerCase(),
    );
  }

  // ── 4. create another request and withdraw it ──────────────────────────────
  await submit(wallet0, ["create_student_request", "N99999", "withdraw test"]);

  let withdrawId: number | null = null;
  await assertSQL(
    "create second student_request for withdraw test",
    db,
    `SELECT * FROM student_request WHERE owner_signer_address = '${wallet0.address.toLowerCase()}' AND aircraft_ident = 'N99999' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { withdrawId = res.rows[0].id; return true; },
  );

  if (withdrawId !== null) {
    // Unauthorized withdraw: wallet1 cannot withdraw wallet0's request
    await submit(wallet1, ["withdraw_student_request", withdrawId]);

    await assertSQL(
      "withdraw_student_request: unauthorized withdraw has no effect (ownership enforced)",
      db,
      `SELECT * FROM student_request WHERE id = ${withdrawId}`,
      (res) => res.rows.length === 1,
      (res) => res.rows[0].status === "open",
    );

    // Authorized withdraw: wallet0 withdraws its own request
    await submit(wallet0, ["withdraw_student_request", withdrawId]);

    await assertSQL(
      "withdraw_student_request: owner successfully withdraws",
      db,
      `SELECT * FROM student_request WHERE id = ${withdrawId}`,
      (res) => res.rows.length === 1 && res.rows[0].status === "withdrawn",
      (res) => res.rows[0].status === "withdrawn",
    );
  }

  console.log("\n[opportunities] CFI Availability lifecycle...");

  // ── 5. create_cfi_availability ─────────────────────────────────────────────
  await submit(wallet1, ["create_cfi_availability", "N54321", 150, "Available weekends"]);

  let availabilityId: number | null = null;

  await assertSQL(
    "create_cfi_availability: row inserted with owner_signer_address and status=open",
    db,
    `SELECT * FROM cfi_availability WHERE owner_signer_address = '${wallet1.address.toLowerCase()}' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => {
      availabilityId = res.rows[0].id;
      return res.rows[0].status === "open" && res.rows[0].aircraft_ident === "N54321";
    },
  );

  // ── 6. GET /api/cfi-availability ───────────────────────────────────────────
  await assert("GET /api/cfi-availability returns the new listing", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/cfi-availability`);
    const data = await res.json();
    return Array.isArray(data.cfiAvailability) &&
      data.cfiAvailability.some((r: any) => r.owner_signer_address === wallet1.address.toLowerCase());
  });

  // ── 7. accept_cfi_availability ─────────────────────────────────────────────
  if (availabilityId !== null) {
    await submit(wallet0, ["accept_cfi_availability", availabilityId]);

    await assertSQL(
      "accept_cfi_availability: status=accepted, accepted_signer_address set",
      db,
      `SELECT * FROM cfi_availability WHERE id = ${availabilityId}`,
      (res) => res.rows.length === 1 && res.rows[0].status === "accepted",
      (res) =>
        res.rows[0].status === "accepted" &&
        res.rows[0].accepted_signer_address === wallet0.address.toLowerCase(),
    );
  }

  // ── 8. create another availability and withdraw it ────────────────────────
  await submit(wallet1, ["create_cfi_availability", "N77777", 200, "withdraw test"]);

  let withdrawAvailId: number | null = null;
  await assertSQL(
    "create second cfi_availability for withdraw test",
    db,
    `SELECT * FROM cfi_availability WHERE owner_signer_address = '${wallet1.address.toLowerCase()}' AND aircraft_ident = 'N77777' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { withdrawAvailId = res.rows[0].id; return true; },
  );

  if (withdrawAvailId !== null) {
    // Unauthorized withdraw: wallet0 cannot withdraw wallet1's availability
    await submit(wallet0, ["withdraw_cfi_availability", withdrawAvailId]);

    await assertSQL(
      "withdraw_cfi_availability: unauthorized withdraw has no effect (ownership enforced)",
      db,
      `SELECT * FROM cfi_availability WHERE id = ${withdrawAvailId}`,
      (res) => res.rows.length === 1,
      (res) => res.rows[0].status === "open",
    );

    // Authorized withdraw: wallet1 withdraws its own listing
    await submit(wallet1, ["withdraw_cfi_availability", withdrawAvailId]);

    await assertSQL(
      "withdraw_cfi_availability: owner successfully withdraws",
      db,
      `SELECT * FROM cfi_availability WHERE id = ${withdrawAvailId}`,
      (res) => res.rows.length === 1 && res.rows[0].status === "withdrawn",
      (res) => res.rows[0].status === "withdrawn",
    );
  }

  console.log("\n[opportunities] All lifecycle tests complete.");
}

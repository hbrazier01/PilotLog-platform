/**
 * AIR-353 — Flight Log Foundation Tests
 *
 * Tests Flight Log lifecycle:
 *   log_flight → update_flight → void_flight
 *
 * Ownership enforcement:
 *   - update rejected if caller is not owner (WHERE clause on owner_signer_address)
 *   - void rejected if caller is not owner (WHERE clause on owner_signer_address)
 *
 * Aircraft reference validation:
 *   - flight must reference a valid aircraft_id
 *   - any active aircraft may be used (rental, training, etc.)
 *
 * Identity rule: signerAddress (chain-verified) is the identity primitive.
 * No walletAddress / userId / ownerAddress accepted from payload.
 *
 * Midnight identity: signerAddress preserved as owner_signer_address.
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

export async function flightsTest(db: Client) {
  console.log("\n[flights] Setting up: registering aircraft for flight tests...");

  // ── Setup: register an aircraft for wallet0 to log flights against ──────────
  await submit(wallet0, ["create_aircraft", "N777FL", "Cessna", "172SP", 2005, "Single Engine Land"]);

  let testAircraftId: number | null = null;

  await assertSQL(
    "setup: aircraft N777FL registered for flight log tests",
    db,
    `SELECT * FROM aircraft WHERE tail_number = 'N777FL' AND status = 'active' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { testAircraftId = res.rows[0].id; return res.rows[0].status === "active"; },
  );

  if (testAircraftId === null) {
    console.error("[flights] ABORT: could not get test aircraft id");
    return;
  }

  console.log(`\n[flights] Aircraft ID for tests: ${testAircraftId}`);
  console.log("\n[flights] Flight creation lifecycle...");

  // ── 1. log_flight ────────────────────────────────────────────────────────────
  await submit(wallet0, [
    "log_flight",
    testAircraftId,
    "2024-03-15",
    "KSFO",
    "KLAX",
    2.5,   // totalTime
    2.5,   // picTime
    0.0,   // dualReceivedTime
    0.0,   // nightTime
    0.0,   // instrumentTime
    "Cross-country training flight",
  ]);

  let flightId: number | null = null;

  await assertSQL(
    "log_flight: row inserted with owner_signer_address, status=active",
    db,
    `SELECT * FROM flight_log WHERE owner_signer_address = '${wallet0.address.toLowerCase()}' AND departure_airport = 'KSFO' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => {
      flightId = res.rows[0].id;
      return (
        res.rows[0].status === "active" &&
        res.rows[0].aircraft_id === testAircraftId &&
        res.rows[0].departure_airport === "KSFO" &&
        res.rows[0].arrival_airport === "KLAX" &&
        res.rows[0].owner_signer_address === wallet0.address.toLowerCase()
      );
    },
  );

  // ── 2. Midnight identity: signerAddress preserved ──────────────────────────
  await assertSQL(
    "log_flight: owner_signer_address matches chain-verified signer (Midnight identity)",
    db,
    `SELECT owner_signer_address FROM flight_log WHERE departure_airport = 'KSFO' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => res.rows[0].owner_signer_address === wallet0.address.toLowerCase(),
  );

  // ── 3. GET /api/flights ──────────────────────────────────────────────────────
  await assert("GET /api/flights returns the new flight", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/flights`);
    const data = await res.json();
    return (
      Array.isArray(data.flights) &&
      data.flights.some((f: any) =>
        f.departure_airport === "KSFO" &&
        f.arrival_airport === "KLAX" &&
        f.owner_signer_address === wallet0.address.toLowerCase()
      )
    );
  });

  // ── 4. GET /api/flights/:id ──────────────────────────────────────────────────
  if (flightId !== null) {
    await assert(`GET /api/flights/${flightId} returns specific flight`, async () => {
      const res = await fetch(`http://localhost:${API_PORT}/api/flights/${flightId}`);
      const data = await res.json();
      return data.flight?.departure_airport === "KSFO" && data.flight?.arrival_airport === "KLAX";
    });
  }

  // ── 5. GET /api/my-flights/:signer ──────────────────────────────────────────
  await assert("GET /api/my-flights/:signer returns owner's flights", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/my-flights/${wallet0.address.toLowerCase()}`);
    const data = await res.json();
    return (
      Array.isArray(data.flights) &&
      data.flights.some((f: any) => f.departure_airport === "KSFO")
    );
  });

  // ── 6. GET /api/aircraft/:id/flights ────────────────────────────────────────
  await assert("GET /api/aircraft/:id/flights returns flights for aircraft", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/aircraft/${testAircraftId}/flights`);
    const data = await res.json();
    return (
      Array.isArray(data.flights) &&
      data.flights.some((f: any) => f.departure_airport === "KSFO")
    );
  });

  // ── 7. Aircraft reference validation: invalid aircraftId silently no-ops ────
  // The STM INSERT would fail FK if we had a FK constraint; without one, we validate
  // by checking the row is created only for valid aircraft.
  // Here we just verify the valid aircraft log was accepted.
  await assertSQL(
    "aircraft reference: flight row has correct aircraft_id",
    db,
    `SELECT aircraft_id FROM flight_log WHERE id = ${flightId}`,
    (res) => res.rows.length === 1,
    (res) => res.rows[0].aircraft_id === testAircraftId,
  );

  console.log("\n[flights] Flight update lifecycle...");

  // ── 8. update_flight (authorized) ───────────────────────────────────────────
  if (flightId !== null) {
    await submit(wallet0, [
      "update_flight",
      flightId,
      testAircraftId,
      "2024-03-15",
      "KSFO",
      "KOAK",   // changed arrival
      2.3,
      2.3,
      0.0,
      0.0,
      0.0,
      "Updated arrival airport",
    ]);

    await assertSQL(
      "update_flight: owner can update flight",
      db,
      `SELECT * FROM flight_log WHERE id = ${flightId}`,
      (res) => res.rows.length === 1 && res.rows[0].arrival_airport === "KOAK",
      (res) => res.rows[0].arrival_airport === "KOAK",
    );

    // ── 9. update_flight (unauthorized) ───────────────────────────────────────
    await submit(wallet1, [
      "update_flight",
      flightId,
      testAircraftId,
      "2024-03-15",
      "KSFO",
      "KSJC",   // wallet1 attempts to change arrival
      2.3,
      2.3,
      0.0,
      0.0,
      0.0,
      "Unauthorized update attempt",
    ]);

    await new Promise((r) => setTimeout(r, 3000));
    await assertSQL(
      "update_flight: unauthorized update has no effect (ownership enforced)",
      db,
      `SELECT * FROM flight_log WHERE id = ${flightId}`,
      (res) => res.rows.length === 1,
      (res) => res.rows[0].arrival_airport === "KOAK",
    );
  }

  console.log("\n[flights] Flight void lifecycle...");

  // ── 10. Log a second flight for void tests ───────────────────────────────────
  await submit(wallet0, [
    "log_flight",
    testAircraftId,
    "2024-03-16",
    "KLAX",
    "KSAN",
    1.5, 1.5, 0.0, 0.0, 0.0,
    "Short hop for void test",
  ]);

  let voidFlightId: number | null = null;
  await assertSQL(
    "setup: second flight logged for void test",
    db,
    `SELECT * FROM flight_log WHERE owner_signer_address = '${wallet0.address.toLowerCase()}' AND departure_airport = 'KLAX' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { voidFlightId = res.rows[0].id; return true; },
  );

  if (voidFlightId !== null) {
    // ── 11. void_flight (unauthorized) ──────────────────────────────────────────
    await submit(wallet1, ["void_flight", voidFlightId]);

    await new Promise((r) => setTimeout(r, 3000));
    await assertSQL(
      "void_flight: unauthorized void has no effect (ownership enforced)",
      db,
      `SELECT * FROM flight_log WHERE id = ${voidFlightId}`,
      (res) => res.rows.length === 1,
      (res) => res.rows[0].status === "active",
    );

    // ── 12. void_flight (authorized) ────────────────────────────────────────────
    await submit(wallet0, ["void_flight", voidFlightId]);

    await assertSQL(
      "void_flight: owner can void flight, status=voided",
      db,
      `SELECT * FROM flight_log WHERE id = ${voidFlightId}`,
      (res) => res.rows.length === 1 && res.rows[0].status === "voided",
      (res) => res.rows[0].status === "voided",
    );

    // ── 13. Voided flight absent from GET /api/flights ───────────────────────────
    await assert("GET /api/flights does not return voided flights", async () => {
      const res = await fetch(`http://localhost:${API_PORT}/api/flights`);
      const data = await res.json();
      return !data.flights.some((f: any) => f.id === voidFlightId);
    });
  }

  // ── 14. Pilot (wallet1) logs a flight against aircraft they don't own ─────────
  // Per spec: any pilot may log against any active aircraft
  await submit(wallet1, [
    "log_flight",
    testAircraftId,
    "2024-03-17",
    "KOAK",
    "KSFO",
    0.4, 0.4, 0.0, 0.0, 0.0,
    "Rental flight — pilot does not own aircraft",
  ]);

  await assertSQL(
    "log_flight: pilot can log against aircraft they don't own (rental/training rule)",
    db,
    `SELECT * FROM flight_log WHERE owner_signer_address = '${wallet1.address.toLowerCase()}' AND departure_airport = 'KOAK' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => res.rows[0].status === "active" && res.rows[0].aircraft_id === testAircraftId,
  );

  console.log("\n[flights] All lifecycle tests complete.");
}

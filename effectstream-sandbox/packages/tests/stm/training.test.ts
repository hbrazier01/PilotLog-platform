/**
 * AIR-354 — Training Record Foundation Tests
 *
 * Tests Training Record lifecycle:
 *   create_training_record → update_training_record → complete_training_record
 *
 * Relationship model:
 *   Student (signerAddress) → Instructor → Flight Log → Aircraft
 *
 * Ownership enforcement:
 *   - update rejected if caller is not student owner (WHERE student_signer_address)
 *   - completion rejected if caller is not student owner
 *
 * Flight validation:
 *   - training INSERT uses subquery: flight_log must exist and be active
 *   - invalid flight_log_id produces no row (INSERT from empty SELECT)
 *
 * Identity rule: signerAddress (chain-verified) is the identity primitive.
 * No walletAddress / userId / ownerAddress accepted from payload.
 *
 * Midnight identity: signerAddress preserved as student_signer_address.
 *
 * Training Types validated at STM layer:
 *   Discovery Flight, PPL Lesson, Solo Preparation, Cross Country Training,
 *   Night Training, Instrument Training, Commercial Training, CFI Training
 */
import { assertSQL, assert } from "../helpers.ts";
import { createWalletClient, createPublicClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { contractAddressesEvmMain } from "@pilotlog-sandbox/contracts-evm";
import type { Client } from "pg";

// wallet0 = student, wallet1 = instructor / unauthorized actor
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

export async function trainingTest(db: Client) {
  console.log("\n[training] Setting up: aircraft and flight log for training tests...");

  // ── Setup: register aircraft ─────────────────────────────────────────────────
  await submit(wallet0, ["create_aircraft", "N354TR", "Cessna", "172S", 2008, "Single Engine Land"]);

  let testAircraftId: number | null = null;
  await assertSQL(
    "setup: aircraft N354TR registered",
    db,
    `SELECT * FROM aircraft WHERE tail_number = 'N354TR' AND status = 'active' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { testAircraftId = res.rows[0].id; return res.rows[0].status === "active"; },
  );

  if (testAircraftId === null) {
    console.error("[training] ABORT: could not get test aircraft id");
    return;
  }

  // ── Setup: log a flight for training to reference ────────────────────────────
  await submit(wallet0, [
    "log_flight",
    testAircraftId,
    "2024-06-01",
    "KPAO",
    "KHAF",
    1.2, 0.0, 1.2, 0.0, 0.0,
    "PPL dual instruction flight",
  ]);

  let testFlightId: number | null = null;
  await assertSQL(
    "setup: flight log created for training reference",
    db,
    `SELECT * FROM flight_log WHERE owner_signer_address = '${wallet0.address.toLowerCase()}' AND departure_airport = 'KPAO' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { testFlightId = res.rows[0].id; return res.rows[0].status === "active"; },
  );

  if (testFlightId === null) {
    console.error("[training] ABORT: could not get test flight id");
    return;
  }

  console.log(`\n[training] Test aircraft ID: ${testAircraftId}, flight ID: ${testFlightId}`);
  console.log("\n[training] Training record creation lifecycle...");

  // ── 1. create_training_record ────────────────────────────────────────────────
  await submit(wallet0, [
    "create_training_record",
    wallet1.address,        // instructorSignerAddress
    testFlightId,           // flightLogId
    "PPL Lesson",           // trainingType
    "First PPL dual lesson — pattern work and stalls",
  ]);

  let trainingId: number | null = null;

  await assertSQL(
    "create_training_record: row inserted with student_signer_address, status=active",
    db,
    `SELECT * FROM training_record WHERE student_signer_address = '${wallet0.address.toLowerCase()}' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => {
      trainingId = res.rows[0].id;
      return (
        res.rows[0].status === "active" &&
        res.rows[0].training_type === "PPL Lesson" &&
        res.rows[0].flight_log_id === testFlightId &&
        res.rows[0].aircraft_id === testAircraftId &&
        res.rows[0].student_signer_address === wallet0.address.toLowerCase() &&
        res.rows[0].instructor_signer_address === wallet1.address.toLowerCase()
      );
    },
  );

  // ── 2. Midnight identity: student_signer_address = chain-verified signer ─────
  await assertSQL(
    "create_training_record: student_signer_address matches chain-verified signer (Midnight identity)",
    db,
    `SELECT student_signer_address FROM training_record WHERE id = ${trainingId}`,
    (res) => res.rows.length === 1,
    (res) => res.rows[0].student_signer_address === wallet0.address.toLowerCase(),
  );

  // ── 3. aircraft_id derived from flight_log (relationship integrity) ──────────
  await assertSQL(
    "create_training_record: aircraft_id derived from referenced flight_log (relationship)",
    db,
    `SELECT tr.aircraft_id, fl.aircraft_id as fl_aircraft_id FROM training_record tr JOIN flight_log fl ON tr.flight_log_id = fl.id WHERE tr.id = ${trainingId}`,
    (res) => res.rows.length === 1,
    (res) => res.rows[0].aircraft_id === res.rows[0].fl_aircraft_id,
  );

  // ── 4. GET /api/training-records ────────────────────────────────────────────
  await assert("GET /api/training-records returns the new training record", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/training-records`);
    const data = await res.json();
    return (
      Array.isArray(data.trainingRecords) &&
      data.trainingRecords.some((r: any) =>
        r.student_signer_address === wallet0.address.toLowerCase() &&
        r.training_type === "PPL Lesson"
      )
    );
  });

  // ── 5. GET /api/training-records/:id ────────────────────────────────────────
  if (trainingId !== null) {
    await assert(`GET /api/training-records/${trainingId} returns specific record`, async () => {
      const res = await fetch(`http://localhost:${API_PORT}/api/training-records/${trainingId}`);
      const data = await res.json();
      return (
        data.trainingRecord?.training_type === "PPL Lesson" &&
        data.trainingRecord?.student_signer_address === wallet0.address.toLowerCase()
      );
    });
  }

  // ── 6. GET /api/my-training-records/:signer ──────────────────────────────────
  await assert("GET /api/my-training-records/:signer returns student's records", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/my-training-records/${wallet0.address.toLowerCase()}`);
    const data = await res.json();
    return (
      Array.isArray(data.trainingRecords) &&
      data.trainingRecords.some((r: any) => r.training_type === "PPL Lesson")
    );
  });

  // ── 7. GET /api/flights/:id/training ────────────────────────────────────────
  await assert("GET /api/flights/:id/training returns training records for flight", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/flights/${testFlightId}/training`);
    const data = await res.json();
    return (
      Array.isArray(data.trainingRecords) &&
      data.trainingRecords.some((r: any) => r.student_signer_address === wallet0.address.toLowerCase())
    );
  });

  // ── 8. Flight validation: invalid flight_log_id produces no row ──────────────
  const fakeFlightId = 999999;
  await submit(wallet0, [
    "create_training_record",
    wallet1.address,
    fakeFlightId,           // does not exist
    "Discovery Flight",
    "Should not insert — flight does not exist",
  ]);

  await new Promise((r) => setTimeout(r, 3000));
  await assertSQL(
    "flight validation: create_training_record with invalid flight_log_id inserts no row",
    db,
    `SELECT * FROM training_record WHERE flight_log_id = ${fakeFlightId}`,
    (res) => res.rows.length === 0,
    (_res) => true,
  );

  // ── 9. Training type validation: invalid type produces no row ────────────────
  await submit(wallet0, [
    "create_training_record",
    wallet1.address,
    testFlightId,
    "Joyriding",            // not a valid training type
    "Invalid type — should not insert",
  ]);

  await new Promise((r) => setTimeout(r, 3000));
  await assertSQL(
    "training type validation: invalid training_type rejected by STM (no row inserted)",
    db,
    `SELECT * FROM training_record WHERE training_type = 'Joyriding'`,
    (res) => res.rows.length === 0,
    (_res) => true,
  );

  console.log("\n[training] Update lifecycle...");

  // ── 10. update_training_record (authorized) ──────────────────────────────────
  if (trainingId !== null) {
    await submit(wallet0, [
      "update_training_record",
      trainingId,
      "Solo Preparation",   // updated training type
      "Updated: pattern work solo prep",
    ]);

    await assertSQL(
      "update_training_record: owner can update training type and notes",
      db,
      `SELECT * FROM training_record WHERE id = ${trainingId}`,
      (res) => res.rows.length === 1,
      (res) => res.rows[0].training_type === "Solo Preparation",
    );

    // ── 11. update_training_record (unauthorized) ─────────────────────────────
    await submit(wallet1, [
      "update_training_record",
      trainingId,
      "CFI Training",       // wallet1 attempts unauthorized update
      "Unauthorized update attempt",
    ]);

    await new Promise((r) => setTimeout(r, 3000));
    await assertSQL(
      "update_training_record: unauthorized update has no effect (ownership enforced)",
      db,
      `SELECT * FROM training_record WHERE id = ${trainingId}`,
      (res) => res.rows.length === 1,
      (res) => res.rows[0].training_type === "Solo Preparation",
    );
  }

  console.log("\n[training] Completion lifecycle...");

  // ── 12. Create a second training record for completion tests ─────────────────
  await submit(wallet0, [
    "create_training_record",
    wallet1.address,
    testFlightId,
    "Cross Country Training",
    "X-country training flight for completion test",
  ]);

  let completeTrainingId: number | null = null;
  await assertSQL(
    "setup: second training record for completion test",
    db,
    `SELECT * FROM training_record WHERE student_signer_address = '${wallet0.address.toLowerCase()}' AND training_type = 'Cross Country Training' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { completeTrainingId = res.rows[0].id; return true; },
  );

  if (completeTrainingId !== null) {
    // ── 13. complete_training_record (unauthorized) ───────────────────────────
    await submit(wallet1, ["complete_training_record", completeTrainingId]);

    await new Promise((r) => setTimeout(r, 3000));
    await assertSQL(
      "complete_training_record: unauthorized completion has no effect (ownership enforced)",
      db,
      `SELECT * FROM training_record WHERE id = ${completeTrainingId}`,
      (res) => res.rows.length === 1,
      (res) => res.rows[0].status === "active",
    );

    // ── 14. complete_training_record (authorized) ─────────────────────────────
    await submit(wallet0, ["complete_training_record", completeTrainingId]);

    await assertSQL(
      "complete_training_record: student owner can complete, status=completed",
      db,
      `SELECT * FROM training_record WHERE id = ${completeTrainingId}`,
      (res) => res.rows.length === 1,
      (res) => res.rows[0].status === "completed",
    );

    // ── 15. Completed record absent from GET /api/training-records (active only) ─
    await assert("GET /api/training-records does not return completed records", async () => {
      const res = await fetch(`http://localhost:${API_PORT}/api/training-records`);
      const data = await res.json();
      return !data.trainingRecords.some((r: any) => r.id === completeTrainingId);
    });

    // ── 16. Completed record still returned by :id endpoint ──────────────────
    await assert("GET /api/training-records/:id returns completed record (history preserved)", async () => {
      const res = await fetch(`http://localhost:${API_PORT}/api/training-records/${completeTrainingId}`);
      const data = await res.json();
      return data.trainingRecord?.status === "completed";
    });
  }

  // ── 17. Student → Instructor → Flight → Aircraft relationship ─────────────────
  await assertSQL(
    "relationship integrity: student, instructor, flight, aircraft references preserved",
    db,
    `SELECT tr.id, tr.student_signer_address, tr.instructor_signer_address, tr.flight_log_id, tr.aircraft_id, fl.aircraft_id as fl_aircraft FROM training_record tr JOIN flight_log fl ON tr.flight_log_id = fl.id WHERE tr.id = ${trainingId}`,
    (res) => res.rows.length === 1,
    (res) => {
      const r = res.rows[0];
      return (
        r.student_signer_address === wallet0.address.toLowerCase() &&
        r.instructor_signer_address === wallet1.address.toLowerCase() &&
        r.flight_log_id === testFlightId &&
        r.aircraft_id === r.fl_aircraft  // aircraft_id matches flight's aircraft
      );
    },
  );

  console.log("\n[training] All lifecycle tests complete.");
}

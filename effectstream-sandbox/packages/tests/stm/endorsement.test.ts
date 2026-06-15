/**
 * AIR-355 — Endorsement Foundation Tests
 *
 * Tests Endorsement lifecycle:
 *   create_endorsement → approve_endorsement / reject_endorsement
 *
 * Relationship model:
 *   Student (signerAddress) → Training Record → Instructor → Endorsement
 *
 * Ownership enforcement:
 *   - create: signerAddress becomes student_signer_address
 *   - approve/reject: only instructor_signer_address may approve/reject
 *   - non-instructor approve/reject has no effect
 *
 * Training validation:
 *   - training_record_id must exist and be active
 *   - invalid training_record_id produces no row (INSERT from empty SELECT)
 *
 * Identity rule: signerAddress (chain-verified) is the identity primitive.
 * No walletAddress / userId / ownerAddress accepted from payload.
 *
 * Endorsement Types validated at STM layer:
 *   Discovery Flight Complete, Pre-Solo Review, Solo Ready, Cross Country Ready,
 *   Night Training Complete, Instrument Training Complete,
 *   Commercial Training Complete, CFI Training Complete
 */
import { assertSQL, assert } from "../helpers.ts";
import { createWalletClient, createPublicClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { contractAddressesEvmMain } from "@pilotlog-sandbox/contracts-evm";
import type { Client } from "pg";

// wallet0 = student, wallet1 = instructor, wallet2 = unauthorized actor
const wallet0 = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
);
const wallet1 = privateKeyToAccount(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
);
const wallet2 = privateKeyToAccount(
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
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

export async function endorsementTest(db: Client) {
  console.log("\n[endorsement] Setting up: aircraft, flight, and training record...");

  // ── Setup: register aircraft ─────────────────────────────────────────────────
  await submit(wallet0, ["create_aircraft", "N355EN", "Piper", "PA-28", 2010, "Single Engine Land"]);

  let testAircraftId: number | null = null;
  await assertSQL(
    "setup: aircraft N355EN registered",
    db,
    `SELECT * FROM aircraft WHERE tail_number = 'N355EN' AND status = 'active' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { testAircraftId = res.rows[0].id; return res.rows[0].status === "active"; },
  );

  if (testAircraftId === null) {
    console.error("[endorsement] ABORT: could not get test aircraft id");
    return;
  }

  // ── Setup: log a flight ───────────────────────────────────────────────────────
  await submit(wallet0, [
    "log_flight",
    testAircraftId, "2024-07-01", "KSQL", "KPAO",
    1.5, 0.0, 1.5, 0.0, 0.0,
    "Pre-solo dual instruction",
  ]);

  let testFlightId: number | null = null;
  await assertSQL(
    "setup: flight logged for endorsement test",
    db,
    `SELECT * FROM flight_log WHERE owner_signer_address = '${wallet0.address.toLowerCase()}' AND departure_airport = 'KSQL' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { testFlightId = res.rows[0].id; return res.rows[0].status === "active"; },
  );

  if (testFlightId === null) {
    console.error("[endorsement] ABORT: could not get test flight id");
    return;
  }

  // ── Setup: create training record ────────────────────────────────────────────
  await submit(wallet0, [
    "create_training_record",
    wallet1.address,   // instructorSignerAddress
    testFlightId,
    "Solo Preparation",
    "Pre-solo training record for endorsement test",
  ]);

  let testTrainingId: number | null = null;
  await assertSQL(
    "setup: training record created for endorsement test",
    db,
    `SELECT * FROM training_record WHERE student_signer_address = '${wallet0.address.toLowerCase()}' AND training_type = 'Solo Preparation' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { testTrainingId = res.rows[0].id; return res.rows[0].status === "active"; },
  );

  if (testTrainingId === null) {
    console.error("[endorsement] ABORT: could not get test training id");
    return;
  }

  console.log(`\n[endorsement] Aircraft: ${testAircraftId}, Flight: ${testFlightId}, Training: ${testTrainingId}`);
  console.log("\n[endorsement] Endorsement creation lifecycle...");

  // ── 1. create_endorsement ────────────────────────────────────────────────────
  await submit(wallet0, [
    "create_endorsement",
    testTrainingId,
    "Pre-Solo Review",
    "Student demonstrated pre-solo knowledge and proficiency",
  ]);

  let endorsementId: number | null = null;

  await assertSQL(
    "create_endorsement: row inserted with student_signer_address, status=pending",
    db,
    `SELECT * FROM endorsement WHERE student_signer_address = '${wallet0.address.toLowerCase()}' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => {
      endorsementId = res.rows[0].id;
      return (
        res.rows[0].status === "pending" &&
        res.rows[0].endorsement_type === "Pre-Solo Review" &&
        res.rows[0].training_record_id === testTrainingId &&
        res.rows[0].student_signer_address === wallet0.address.toLowerCase() &&
        res.rows[0].instructor_signer_address === wallet1.address.toLowerCase()
      );
    },
  );

  // ── 2. Midnight identity: student_signer_address = chain-verified signer ─────
  await assertSQL(
    "create_endorsement: student_signer_address matches chain-verified signer (Midnight identity)",
    db,
    `SELECT student_signer_address FROM endorsement WHERE id = ${endorsementId}`,
    (res) => res.rows.length === 1,
    (res) => res.rows[0].student_signer_address === wallet0.address.toLowerCase(),
  );

  // ── 3. instructor_signer_address derived from training record ─────────────────
  await assertSQL(
    "create_endorsement: instructor_signer_address derived from training record (relationship integrity)",
    db,
    `SELECT e.instructor_signer_address, tr.instructor_signer_address as tr_instructor FROM endorsement e JOIN training_record tr ON e.training_record_id = tr.id WHERE e.id = ${endorsementId}`,
    (res) => res.rows.length === 1,
    (res) => res.rows[0].instructor_signer_address === res.rows[0].tr_instructor,
  );

  // ── 4. Training validation: invalid training_record_id produces no row ────────
  const fakeTrainingId = 999999;
  await submit(wallet0, [
    "create_endorsement",
    fakeTrainingId,
    "Solo Ready",
    "Should not insert — training record does not exist",
  ]);

  await new Promise((r) => setTimeout(r, 3000));
  await assertSQL(
    "training validation: create_endorsement with invalid training_record_id inserts no row",
    db,
    `SELECT * FROM endorsement WHERE training_record_id = ${fakeTrainingId}`,
    (res) => res.rows.length === 0,
    (_res) => true,
  );

  // ── 5. Endorsement type validation: invalid type produces no row ──────────────
  await submit(wallet0, [
    "create_endorsement",
    testTrainingId,
    "Joyriding Endorsement",
    "Invalid type — should not insert",
  ]);

  await new Promise((r) => setTimeout(r, 3000));
  await assertSQL(
    "endorsement type validation: invalid endorsement_type rejected by STM (no row inserted)",
    db,
    `SELECT * FROM endorsement WHERE endorsement_type = 'Joyriding Endorsement'`,
    (res) => res.rows.length === 0,
    (_res) => true,
  );

  // ── 6. API: GET /api/endorsements ────────────────────────────────────────────
  await assert("GET /api/endorsements returns the new endorsement", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/endorsements`);
    const data = await res.json();
    return (
      Array.isArray(data.endorsements) &&
      data.endorsements.some((e: any) =>
        e.student_signer_address === wallet0.address.toLowerCase() &&
        e.endorsement_type === "Pre-Solo Review"
      )
    );
  });

  // ── 7. API: GET /api/endorsements/:id ────────────────────────────────────────
  if (endorsementId !== null) {
    await assert(`GET /api/endorsements/${endorsementId} returns specific endorsement`, async () => {
      const res = await fetch(`http://localhost:${API_PORT}/api/endorsements/${endorsementId}`);
      const data = await res.json();
      return (
        data.endorsement?.endorsement_type === "Pre-Solo Review" &&
        data.endorsement?.status === "pending" &&
        data.endorsement?.student_signer_address === wallet0.address.toLowerCase()
      );
    });
  }

  // ── 8. API: GET /api/my-endorsements/:signer ─────────────────────────────────
  await assert("GET /api/my-endorsements/:signer returns student's endorsements", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/my-endorsements/${wallet0.address.toLowerCase()}`);
    const data = await res.json();
    return (
      Array.isArray(data.endorsements) &&
      data.endorsements.some((e: any) => e.endorsement_type === "Pre-Solo Review")
    );
  });

  // ── 9. API: GET /api/my-endorsements/:signer for instructor ──────────────────
  await assert("GET /api/my-endorsements/:signer returns instructor's pending endorsements", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/my-endorsements/${wallet1.address.toLowerCase()}`);
    const data = await res.json();
    return (
      Array.isArray(data.endorsements) &&
      data.endorsements.some((e: any) =>
        e.instructor_signer_address === wallet1.address.toLowerCase() &&
        e.status === "pending"
      )
    );
  });

  // ── 10. API: GET /api/training-records/:id/endorsements ──────────────────────
  await assert("GET /api/training-records/:id/endorsements returns endorsements for training record", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/training-records/${testTrainingId}/endorsements`);
    const data = await res.json();
    return (
      Array.isArray(data.endorsements) &&
      data.endorsements.some((e: any) => e.student_signer_address === wallet0.address.toLowerCase())
    );
  });

  console.log("\n[endorsement] Unauthorized approval/rejection...");

  // ── 11. Unauthorized approval (non-instructor cannot approve) ─────────────────
  await submit(wallet2, ["approve_endorsement", endorsementId]);

  await new Promise((r) => setTimeout(r, 3000));
  await assertSQL(
    "approve_endorsement: unauthorized actor (non-instructor) cannot approve (ownership enforced)",
    db,
    `SELECT * FROM endorsement WHERE id = ${endorsementId}`,
    (res) => res.rows.length === 1,
    (res) => res.rows[0].status === "pending",
  );

  // ── 12. Unauthorized rejection (non-instructor cannot reject) ─────────────────
  await submit(wallet2, ["reject_endorsement", endorsementId, "Unauthorized rejection attempt"]);

  await new Promise((r) => setTimeout(r, 3000));
  await assertSQL(
    "reject_endorsement: unauthorized actor (non-instructor) cannot reject (ownership enforced)",
    db,
    `SELECT * FROM endorsement WHERE id = ${endorsementId}`,
    (res) => res.rows.length === 1,
    (res) => res.rows[0].status === "pending",
  );

  console.log("\n[endorsement] Instructor approval lifecycle...");

  // ── 13. Create a second endorsement for rejection test ────────────────────────
  await submit(wallet0, [
    "create_endorsement",
    testTrainingId,
    "Solo Ready",
    "Solo readiness endorsement for rejection test",
  ]);

  let rejectEndorsementId: number | null = null;
  await assertSQL(
    "setup: second endorsement for rejection test",
    db,
    `SELECT * FROM endorsement WHERE student_signer_address = '${wallet0.address.toLowerCase()}' AND endorsement_type = 'Solo Ready' ORDER BY id DESC LIMIT 1`,
    (res) => res.rows.length >= 1,
    (res) => { rejectEndorsementId = res.rows[0].id; return res.rows[0].status === "pending"; },
  );

  if (rejectEndorsementId !== null) {
    // ── 14. reject_endorsement (authorized instructor) ────────────────────────
    await submit(wallet1, ["reject_endorsement", rejectEndorsementId, "Student needs more pattern work"]);

    await assertSQL(
      "reject_endorsement: instructor can reject, status=rejected",
      db,
      `SELECT * FROM endorsement WHERE id = ${rejectEndorsementId}`,
      (res) => res.rows.length === 1 && res.rows[0].status === "rejected",
      (res) => {
        return (
          res.rows[0].status === "rejected" &&
          res.rows[0].approved_by_signer_address === wallet1.address.toLowerCase()
        );
      },
    );
  }

  // ── 15. approve_endorsement (authorized instructor) ───────────────────────────
  if (endorsementId !== null) {
    await submit(wallet1, ["approve_endorsement", endorsementId]);

    await assertSQL(
      "approve_endorsement: instructor can approve, status=approved, approved_by_signer_address set",
      db,
      `SELECT * FROM endorsement WHERE id = ${endorsementId}`,
      (res) => res.rows.length === 1 && res.rows[0].status === "approved",
      (res) => {
        return (
          res.rows[0].status === "approved" &&
          res.rows[0].approved_by_signer_address === wallet1.address.toLowerCase()
        );
      },
    );

    // ── 16. Midnight identity: approved_by_signer_address = chain-verified signer
    await assertSQL(
      "approve_endorsement: approved_by_signer_address matches chain-verified instructor signer (Midnight identity)",
      db,
      `SELECT approved_by_signer_address FROM endorsement WHERE id = ${endorsementId}`,
      (res) => res.rows.length === 1,
      (res) => res.rows[0].approved_by_signer_address === wallet1.address.toLowerCase(),
    );
  }

  // ── 17. Student → Training → Instructor → Endorsement relationship ────────────
  await assertSQL(
    "relationship integrity: student, training, instructor references preserved",
    db,
    `SELECT e.id, e.student_signer_address, e.instructor_signer_address, e.training_record_id, tr.student_signer_address as tr_student, tr.instructor_signer_address as tr_instructor FROM endorsement e JOIN training_record tr ON e.training_record_id = tr.id WHERE e.id = ${endorsementId}`,
    (res) => res.rows.length === 1,
    (res) => {
      const r = res.rows[0];
      return (
        r.student_signer_address === wallet0.address.toLowerCase() &&
        r.instructor_signer_address === wallet1.address.toLowerCase() &&
        r.student_signer_address === r.tr_student &&
        r.instructor_signer_address === r.tr_instructor
      );
    },
  );

  console.log("\n[endorsement] All lifecycle tests complete.");
}

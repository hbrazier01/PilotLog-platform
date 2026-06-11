import { assertSQL } from "../helpers.ts";
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

// Simulated mn_addr_preprod style wallet identities for identity-preservation checks
const STUDENT_WALLET = "mn_addr_preprod_student_pilotlog_test_001";
const CFI_WALLET = "mn_addr_preprod_cfi_pilotlog_test_001";

const effectstreamL2Abi = [
  {
    inputs: [{ name: "data", type: "bytes" }],
    name: "effectstreamSubmitGameInput",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

async function submit(walletClient: any, publicClient: any, contractAddr: string, args: unknown[]) {
  const hash = await walletClient.writeContract({
    address: contractAddr,
    abi: effectstreamL2Abi,
    functionName: "effectstreamSubmitGameInput",
    args: [toHex(JSON.stringify(args))],
  });
  await publicClient.waitForTransactionReceipt({ hash });
}

export async function offerFileTest(db: Client) {
  const addresses = contractAddressesEvmMain();
  const contractAddr = addresses.chain31337["EffectstreamL2Module#MyEffectstreamL2"];
  const walletClient0 = createWalletClient({ account: wallet0, chain: hardhat, transport: http() });
  const walletClient1 = createWalletClient({ account: wallet1, chain: hardhat, transport: http() });
  const publicClient = createPublicClient({ chain: hardhat, transport: http() });

  // ── Student Request: create → accept ──────────────────────────────────────

  await submit(walletClient0, publicClient, contractAddr, [
    "create_student_request", STUDENT_WALLET, "N12345", "Looking for CFI training",
  ]);

  let acceptRequestId!: number;
  await assertSQL(
    "create_student_request: active row in student_request with correct identity",
    db,
    `SELECT * FROM student_request WHERE wallet_address = '${STUDENT_WALLET}' AND aircraft_ident = 'N12345'`,
    (res) => res.rows.length >= 1,
    (res) => {
      acceptRequestId = res.rows[0].request_id;
      return res.rows[0].wallet_address === STUDENT_WALLET && res.rows[0].aircraft_ident === "N12345";
    },
  );

  await submit(walletClient1, publicClient, contractAddr, [
    "accept_student_request", CFI_WALLET, acceptRequestId,
  ]);

  await assertSQL(
    "accept_student_request: history row with student owner + cfi_wallet identity",
    db,
    `SELECT * FROM student_request_history WHERE request_id = ${acceptRequestId} AND event = 'accepted'`,
    (res) => res.rows.length >= 1,
    (res) => {
      const r = res.rows[0];
      return r.wallet_address === STUDENT_WALLET && r.cfi_wallet === CFI_WALLET && r.event === "accepted";
    },
  );

  await assertSQL(
    "accept_student_request: active row removed from student_request",
    db,
    `SELECT * FROM student_request WHERE request_id = ${acceptRequestId}`,
    (res) => res.rows.length === 0,
    (res) => res.rows.length === 0,
  );

  // ── Student Request: create → withdraw ────────────────────────────────────

  await submit(walletClient0, publicClient, contractAddr, [
    "create_student_request", STUDENT_WALLET, "N12346", "Request to be withdrawn",
  ]);

  let withdrawRequestId!: number;
  await assertSQL(
    "create_student_request (withdraw): active row appears",
    db,
    `SELECT * FROM student_request WHERE wallet_address = '${STUDENT_WALLET}' AND aircraft_ident = 'N12346'`,
    (res) => res.rows.length >= 1,
    (res) => {
      withdrawRequestId = res.rows[0].request_id;
      return true;
    },
  );

  await submit(walletClient0, publicClient, contractAddr, [
    "withdraw_student_request", STUDENT_WALLET, withdrawRequestId,
  ]);

  await assertSQL(
    "withdraw_student_request: history row event = withdrawn, identity preserved",
    db,
    `SELECT * FROM student_request_history WHERE request_id = ${withdrawRequestId} AND event = 'withdrawn'`,
    (res) => res.rows.length >= 1,
    (res) => {
      const r = res.rows[0];
      return r.wallet_address === STUDENT_WALLET && r.event === "withdrawn" && r.cfi_wallet === null;
    },
  );

  await assertSQL(
    "withdraw_student_request: active row removed",
    db,
    `SELECT * FROM student_request WHERE request_id = ${withdrawRequestId}`,
    (res) => res.rows.length === 0,
    (res) => res.rows.length === 0,
  );

  // ── CFI Availability: create → accept ─────────────────────────────────────

  await submit(walletClient1, publicClient, contractAddr, [
    "create_cfi_availability", CFI_WALLET, "N12345", 150.0, "Available weekends",
  ]);

  let acceptAvailId!: number;
  await assertSQL(
    "create_cfi_availability: active row in cfi_availability with correct identity",
    db,
    `SELECT * FROM cfi_availability WHERE wallet_address = '${CFI_WALLET}' AND aircraft_ident = 'N12345'`,
    (res) => res.rows.length >= 1,
    (res) => {
      acceptAvailId = res.rows[0].availability_id;
      return res.rows[0].wallet_address === CFI_WALLET && parseFloat(res.rows[0].hourly_rate) === 150.0;
    },
  );

  await submit(walletClient0, publicClient, contractAddr, [
    "accept_cfi_availability", STUDENT_WALLET, acceptAvailId,
  ]);

  await assertSQL(
    "accept_cfi_availability: history row with cfi owner + student_wallet identity",
    db,
    `SELECT * FROM cfi_availability_history WHERE availability_id = ${acceptAvailId} AND event = 'accepted'`,
    (res) => res.rows.length >= 1,
    (res) => {
      const r = res.rows[0];
      return r.wallet_address === CFI_WALLET && r.student_wallet === STUDENT_WALLET && r.event === "accepted";
    },
  );

  await assertSQL(
    "accept_cfi_availability: active row removed from cfi_availability",
    db,
    `SELECT * FROM cfi_availability WHERE availability_id = ${acceptAvailId}`,
    (res) => res.rows.length === 0,
    (res) => res.rows.length === 0,
  );

  // ── CFI Availability: create → withdraw ───────────────────────────────────

  await submit(walletClient1, publicClient, contractAddr, [
    "create_cfi_availability", CFI_WALLET, "N12347", 175.0, "Listing to be withdrawn",
  ]);

  let withdrawAvailId!: number;
  await assertSQL(
    "create_cfi_availability (withdraw): active row appears",
    db,
    `SELECT * FROM cfi_availability WHERE wallet_address = '${CFI_WALLET}' AND aircraft_ident = 'N12347'`,
    (res) => res.rows.length >= 1,
    (res) => {
      withdrawAvailId = res.rows[0].availability_id;
      return true;
    },
  );

  await submit(walletClient1, publicClient, contractAddr, [
    "withdraw_cfi_availability", CFI_WALLET, withdrawAvailId,
  ]);

  await assertSQL(
    "withdraw_cfi_availability: history row event = withdrawn, identity preserved",
    db,
    `SELECT * FROM cfi_availability_history WHERE availability_id = ${withdrawAvailId} AND event = 'withdrawn'`,
    (res) => res.rows.length >= 1,
    (res) => {
      const r = res.rows[0];
      return r.wallet_address === CFI_WALLET && r.event === "withdrawn" && r.student_wallet === null;
    },
  );

  await assertSQL(
    "withdraw_cfi_availability: active row removed",
    db,
    `SELECT * FROM cfi_availability WHERE availability_id = ${withdrawAvailId}`,
    (res) => res.rows.length === 0,
    (res) => res.rows.length === 0,
  );
}

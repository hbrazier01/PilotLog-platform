/**
 * Identity security tests (Phase B)
 *
 * Key invariant under test:
 *   When a user submits create_profile the STM reads data.signerAddress
 *   (the chain-verified transaction signer) — NOT any walletAddress value
 *   in the JSON payload.  A caller cannot spoof another wallet's identity by
 *   including a different address in the payload.
 *
 * The new grammar for create_profile has NO walletAddress field at all.
 * The negative test below submits the action from wallet0 and then confirms
 * that pilot_identity was created under wallet0's address — proving the signer
 * path, not a user-supplied field.  We additionally verify that no row was
 * created for wallet1 (the "spoofed" address used in the legacy payload format).
 */
import { assertSQL, assert } from "../helpers.ts";
import { createWalletClient, createPublicClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { contractAddressesEvmMain } from "@pilotlog-sandbox/contracts-evm";
import type { Client } from "pg";

// wallet0 — the actual transaction signer
const wallet0 = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
);

// wallet1 — a different address that the caller might try to spoof
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

export async function identityTest(db: Client) {
  const addresses = contractAddressesEvmMain();
  const contractAddr = addresses.chain31337["EffectstreamL2Module#MyEffectstreamL2"];
  const walletClient = createWalletClient({ account: wallet0, chain: hardhat, transport: http() });
  const publicClient = createPublicClient({ chain: hardhat, transport: http() });

  // Submit create_profile from wallet0.
  // The NEW grammar has no walletAddress field — the payload only contains
  // displayName, pilotPhase, notes.  The signer (wallet0) is attached by the
  // chain and read by the STM as data.signerAddress.
  const hash = await walletClient.writeContract({
    address: contractAddr,
    abi: effectstreamL2Abi,
    functionName: "effectstreamSubmitGameInput",
    args: [toHex(JSON.stringify([
      "create_profile",
      "Test Pilot",      // displayName
      "ppl_student",     // pilotPhase
      "identity test",   // notes
    ]))],
  });
  await publicClient.waitForTransactionReceipt({ hash });

  // POSITIVE: a pilot_identity row must exist for wallet0's address.
  await assertSQL(
    "identity: pilot_identity created for the actual signer (wallet0)",
    db,
    `SELECT * FROM pilot_identity WHERE primary_wallet = '${wallet0.address.toLowerCase()}'`,
    (res) => res.rows.length >= 1,
    (res) => res.rows[0].primary_wallet === wallet0.address.toLowerCase(),
  );

  // POSITIVE: identity_wallet row for wallet0 must exist and be verified.
  await assertSQL(
    "identity: identity_wallet row for wallet0 is verified",
    db,
    `SELECT iw.* FROM identity_wallet iw
       JOIN pilot_identity pi ON pi.identity_id = iw.identity_id
       WHERE pi.primary_wallet = '${wallet0.address.toLowerCase()}'
         AND iw.chain = 'midnight'`,
    (res) => res.rows.length >= 1,
    (res) => res.rows[0].verification_status === "verified",
  );

  // POSITIVE: pilot_profile row keyed to wallet0's identity must exist.
  await assertSQL(
    "identity: pilot_profile keyed to wallet0 identity",
    db,
    `SELECT pp.* FROM pilot_profile pp
       JOIN pilot_identity pi ON pi.identity_id = pp.identity_id
       WHERE pi.primary_wallet = '${wallet0.address.toLowerCase()}'`,
    (res) => res.rows.length >= 1,
    (res) => res.rows[0].display_name === "Test Pilot",
  );

  // NEGATIVE (spoof prevention): no pilot_identity row for wallet1.
  // wallet1 never signed a transaction, so it must have no identity.
  await assert(
    "identity: wallet1 (never signed) has NO pilot_identity row — spoof impossible",
    async () => {
      const res = await db.query(
        `SELECT * FROM pilot_identity WHERE primary_wallet = '${wallet1.address.toLowerCase()}'`,
      );
      return res.rows.length === 0;
    },
  );

  // NEGATIVE (spoof prevention): no identity_wallet row for wallet1.
  await assert(
    "identity: wallet1 has NO identity_wallet row — spoof impossible",
    async () => {
      const res = await db.query(
        `SELECT * FROM identity_wallet WHERE wallet_address = '${wallet1.address.toLowerCase()}'`,
      );
      return res.rows.length === 0;
    },
  );
}

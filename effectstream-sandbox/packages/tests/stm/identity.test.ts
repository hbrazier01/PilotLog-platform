/**
 * Identity security tests (Phase C)
 *
 * Key invariant under test:
 *   When a user submits create_profile the STM reads data.signerAddress
 *   (the chain-verified transaction signer) — NOT any walletAddress value
 *   in the JSON payload.  A caller cannot spoof another wallet's identity by
 *   including a different address in the payload.
 *
 * The grammar for create_profile has NO walletAddress field at all.
 * We submit from wallet0, then confirm profile_log.signer = wallet0.address —
 * proving the Effectstream signer path is used, not a user-supplied field.
 * We additionally verify no profile_log row exists for wallet1 (never signed).
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
  // Payload contains only displayName/pilotPhase/notes — no walletAddress field.
  // The STM reads data.signerAddress (chain-verified) as the identity.
  const hash = await walletClient.writeContract({
    address: contractAddr,
    abi: effectstreamL2Abi,
    functionName: "effectstreamSubmitGameInput",
    args: [toHex(JSON.stringify([
      "create_profile",
      "Identity Test Pilot", // displayName
      "ppl_student",         // pilotPhase
      "identity test",       // notes
    ]))],
  });
  await publicClient.waitForTransactionReceipt({ hash });

  // POSITIVE: profile_log row exists with signer = wallet0.address.
  await assertSQL(
    "identity: profile_log.signer = wallet0 (chain-verified, not user-supplied)",
    db,
    `SELECT * FROM profile_log WHERE signer = '${wallet0.address.toLowerCase()}' AND display_name = 'Identity Test Pilot'`,
    (res) => res.rows.length >= 1,
    (res) => res.rows[0].signer === wallet0.address.toLowerCase(),
  );

  // NEGATIVE: no profile_log row for wallet1 (never signed a transaction).
  await assert(
    "identity: wallet1 (never signed) has NO profile_log row — spoof impossible",
    async () => {
      const res = await db.query(
        `SELECT * FROM profile_log WHERE signer = '${wallet1.address.toLowerCase()}'`,
      );
      return res.rows.length === 0;
    },
  );
}

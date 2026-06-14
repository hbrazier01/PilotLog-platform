import { assertSQL } from "../helpers.ts";
import { createWalletClient, createPublicClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { contractAddressesEvmMain } from "@pilotlog-sandbox/contracts-evm";
import type { Client } from "pg";

export const wallet0 = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
);

const effectstreamL2Abi = [{
  inputs: [{ name: "data", type: "bytes" }],
  name: "effectstreamSubmitGameInput",
  outputs: [],
  stateMutability: "payable",
  type: "function",
}] as const;

export const TEST_PROFILE = {
  signerAddress: wallet0.address.toLowerCase(),
  displayName: "Test Pilot",
  pilotPhase: "ppl_student",
  notes: "minimal effectstream proof",
};

export async function submitInputTest(db: Client) {
  const addresses = contractAddressesEvmMain();
  const contractAddr = addresses.chain31337["EffectstreamL2Module#MyEffectstreamL2"];
  const walletClient = createWalletClient({ account: wallet0, chain: hardhat, transport: http() });
  const publicClient = createPublicClient({ chain: hardhat, transport: http() });

  const hash = await walletClient.writeContract({
    address: contractAddr,
    abi: effectstreamL2Abi,
    functionName: "effectstreamSubmitGameInput",
    args: [toHex(JSON.stringify([
      "create_profile",
      TEST_PROFILE.displayName,
      TEST_PROFILE.pilotPhase,
      TEST_PROFILE.notes,
    ]))],
  });
  await publicClient.waitForTransactionReceipt({ hash });

  await assertSQL(
    "submit-input: pilot_profile row created for signer_address",
    db,
    `SELECT * FROM pilot_profile WHERE signer_address = '${TEST_PROFILE.signerAddress}';`,
    (res) => res.rows.length >= 1,
    (res) =>
      res.rows[0].display_name === TEST_PROFILE.displayName &&
      res.rows[0].pilot_phase === TEST_PROFILE.pilotPhase &&
      res.rows[0].notes === TEST_PROFILE.notes,
  );
}

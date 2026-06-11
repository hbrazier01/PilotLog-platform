import { assertSQL } from "../helpers.ts";
import { createWalletClient, createPublicClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { contractAddressesEvmMain } from "@pilotlog-sandbox/contracts-evm";
import type { Client } from "pg";

const wallet0 = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
);

const effectstreamL2Abi = [{
  inputs: [{ name: "data", type: "bytes" }],
  name: "effectstreamSubmitGameInput",
  outputs: [],
  stateMutability: "payable",
  type: "function",
}] as const;

export const TEST_FLIGHT = {
  walletAddress: wallet0.address.toLowerCase(),
  aircraftIdent: "N999ZP",
  airportFrom: "KAPA",
  airportTo: "KADS",
  totalTime: 1.2,
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
    args: [toHex(JSON.stringify(["log_flight", TEST_FLIGHT.walletAddress, TEST_FLIGHT.aircraftIdent, TEST_FLIGHT.airportFrom, TEST_FLIGHT.airportTo, TEST_FLIGHT.totalTime]))],
  });
  await publicClient.waitForTransactionReceipt({ hash });

  await assertSQL(
    "submit-input: flights row created for aircraft N999ZP",
    db,
    `SELECT * FROM flights WHERE aircraft_ident = '${TEST_FLIGHT.aircraftIdent}' AND airport_from = '${TEST_FLIGHT.airportFrom}';`,
    (res) => res.rows.length >= 1,
    (res) =>
      res.rows[0].aircraft_ident === TEST_FLIGHT.aircraftIdent &&
      res.rows[0].airport_from === TEST_FLIGHT.airportFrom &&
      res.rows[0].airport_to === TEST_FLIGHT.airportTo,
  );
}

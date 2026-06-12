import {
  EffectstreamConfig,
  sendTransaction,
  walletLogin,
  WalletMode,
} from "@effectstream/wallets";
import { hardhat } from "viem/chains";

// EFFECTSTREAM_L2_ADDRESS is the deterministic Hardhat address of the first deployed contract.
// For other networks, replace this with the deployed EffectstreamL2 contract address.
export const effectstreamConfig = new EffectstreamConfig(
  "minimal",
  "mainEvmRPC",
  "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  hardhat,
  undefined,
  undefined,
  false,
);

let wallet = null;

async function login() {
  const result = await walletLogin({
    mode: WalletMode.EvmInjected,
    chain: effectstreamConfig.effectstreamL2Chain,
  });
  if (!result.success) throw new Error("Cannot login");
  wallet = result.result;
  return wallet;
}

async function sendTransactionEffectstreamL2(input) {
  if (!wallet) throw new Error("Login first");
  return await sendTransaction(
    wallet,
    ["my_action_name", input ?? "no-text"],
    effectstreamConfig,
    "wait-effectstream-processed",
  );
}

// Generic action sender — accepts any grammar action array e.g. ["create_student_request", addr, aircraft, notes]
async function sendAction(actionArray) {
  if (!wallet) throw new Error("Login first via effectstream.login()");
  return await sendTransaction(
    wallet,
    actionArray,
    effectstreamConfig,
    "wait-effectstream-processed",
  );
}

window.effectstream = {
  login,
  sendTransactionEffectstreamL2,
  sendAction,
  getWallet: () => wallet,
};

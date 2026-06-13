import {
  createWalletClient,
  custom,
  encodeFunctionData,
  toHex,
} from "viem";
import { hardhat } from "viem/chains";

// Deterministic Hardhat address of the first deployed contract.
const EFFECTSTREAM_L2_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const EFFECTSTREAM_ABI = [
  {
    inputs: [{ name: "data", type: "bytes" }],
    name: "effectstreamSubmitGameInput",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

let walletClient = null;
let account = null;

async function login() {
  if (!window.ethereum) throw new Error("No EVM wallet found (install MetaMask)");

  const [addr] = await window.ethereum.request({ method: "eth_requestAccounts" });
  account = addr;

  walletClient = createWalletClient({
    account,
    chain: hardhat,
    transport: custom(window.ethereum),
  });

  return { address: account };
}

async function sendAction(actionArray) {
  if (!walletClient || !account) throw new Error("Login first via effectstream.login()");

  // Encode action array the same way @effectstream/wallets does:
  // utf8ToHex(JSON.stringify(actionArray)) -> bytes arg
  const jsonStr = JSON.stringify(actionArray);
  const hexPayload = toHex(jsonStr); // 0x-prefixed hex of UTF-8 bytes

  const calldata = encodeFunctionData({
    abi: EFFECTSTREAM_ABI,
    functionName: "effectstreamSubmitGameInput",
    args: [hexPayload],
  });

  const hash = await walletClient.sendTransaction({
    account,
    to: EFFECTSTREAM_L2_ADDRESS,
    data: calldata,
    value: 0n,
  });

  return { success: true, type: "self-sequenced", hash };
}

async function sendTransactionEffectstreamL2(input) {
  return await sendAction(["my_action_name", input ?? "no-text"]);
}

window.effectstream = {
  login,
  sendTransactionEffectstreamL2,
  sendAction,
  getWallet: () => ({ address: account }),
};

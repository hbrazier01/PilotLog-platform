/**
 * Midnight wallet Effectstream validation (AIR-344).
 *
 * Auth path:
 *   1. Detect 1AM wallet via window.midnight['1am']
 *   2. Connect using WalletMode.Midnight (native Midnight signing)
 *   3. sendTransaction → batcher path (preferBatchedMode: true)
 *   4. Batcher verifies Midnight signature, submits to EVM contract
 *
 * Signer identity recorded in the STM is the Midnight unshielded address.
 * No EVM key derivation. No MetaMask required.
 */

import {
  EffectstreamConfig,
  sendTransaction,
  walletLogin,
  WalletMode,
} from "@effectstream/wallets";
import { hardhat } from "viem/chains";

const BATCHER_URL = "http://localhost:3333";

let wallet = null;
let mnAddr = null;

// ── Config ────────────────────────────────────────────────────────────────────

let effectstreamConfig = null;

async function loadConfig() {
  if (effectstreamConfig) return effectstreamConfig;
  const res = await fetch("/api/contract-address");
  if (!res.ok) throw new Error(`/api/contract-address failed (${res.status})`);
  const { contractAddress } = await res.json();
  effectstreamConfig = new EffectstreamConfig(
    "minimal",
    "mainEvmRPC",
    contractAddress,
    hardhat,
    undefined,
    BATCHER_URL,
    true, // preferBatchedMode — required for Midnight wallet
  );
  return effectstreamConfig;
}

// ── Login ─────────────────────────────────────────────────────────────────────

async function login() {
  const config = await loadConfig();

  const result = await walletLogin({
    mode: WalletMode.Midnight,
    networkId: "undeployed",
  });

  if (!result.success) {
    throw new Error("Midnight wallet login failed: " + (result.errorMessage ?? "unknown"));
  }

  wallet = result.result;
  mnAddr = wallet.walletAddress;
  console.log("[effectstream] Midnight wallet connected. address:", mnAddr);

  return { address: mnAddr, signerAddress: null };
}

// ── Action submission ─────────────────────────────────────────────────────────

async function sendCreateProfile(displayName, pilotPhase, notes) {
  if (!wallet) throw new Error("Call effectstream.login() first");

  const config = await loadConfig();
  const actionArray = ["create_profile", displayName, pilotPhase, notes ?? ""];
  const result = await sendTransaction(wallet, actionArray, config, "wait-receipt");
  console.log("[tx-debug] create_profile result:", result);
  return {
    success: true,
    type: result.type,
    address: mnAddr,
    ...result,
  };
}

async function sendAction(actionArray) {
  if (!wallet) throw new Error("Call effectstream.login() first");
  const config = await loadConfig();
  const result = await sendTransaction(wallet, actionArray, config, "wait-receipt");
  console.log("[tx-debug]", actionArray[0], "result:", result);
  return {
    success: true,
    type: result.type,
    address: mnAddr,
    ...result,
  };
}

window.effectstream = {
  login,
  sendCreateProfile,
  sendAction,
  getWallet: () => ({ address: mnAddr }),
};

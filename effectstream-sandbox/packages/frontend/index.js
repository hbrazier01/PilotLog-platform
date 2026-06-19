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

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

let effectstreamConfig = null;

async function loadConfig() {
  if (effectstreamConfig) return effectstreamConfig;

  const res = await fetch("/api/contract-address");

  if (!res.ok) {
    throw new Error(`/api/contract-address failed (${res.status})`);
  }

  const { contractAddress } = await res.json();

  effectstreamConfig = new EffectstreamConfig(
    "minimal",
    "mainEvmRPC",
    contractAddress,
    hardhat,
    undefined,
    BATCHER_URL,
    true
  );

  return effectstreamConfig;
}

// ─────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────

async function login() {
  await loadConfig();

  const result = await walletLogin({
    mode: WalletMode.Midnight,
    networkId: "undeployed",
  });

  if (!result.success) {
    wallet = null;
    mnAddr = null;

    throw new Error(
      "Midnight wallet login failed: " +
        (result.errorMessage ?? "unknown")
    );
  }

  wallet = result.result;
  mnAddr = wallet.walletAddress;

  console.log(
    "[effectstream] Midnight wallet connected. address:",
    mnAddr
  );

  return {
    address: mnAddr,
    signerAddress: null,
  };
}

/**
 * Force a fresh Midnight connection before every transaction.
 *
 * Lace / Midnight sometimes keeps a stale wallet object alive even
 * though the underlying authenticator channel has been closed.
 *
 * Re-authenticating here prevents:
 *   Remote API with channel 'midnight-authenticator' was shutdown
 *   object can no longer be used
 */
async function ensureWalletReady() {
  if (!wallet || !mnAddr) {
    return await login();
  }

  try {
    return await login();
  } catch (error) {
    wallet = null;
    mnAddr = null;
    throw error;
  }
}

function isWalletStaleOrLockedError(error) {
  const message = String(
    error?.message ??
      error?.reason ??
      error ??
      ""
  ).toLowerCase();

  return (
    message.includes("wallet is locked") ||
    message.includes("object can no longer be used") ||
    message.includes("remote api") ||
    message.includes("channel") ||
    message.includes("rejected")
  );
}

// ─────────────────────────────────────────────────────────────
// Transaction helper
// ─────────────────────────────────────────────────────────────

async function executeTransaction(actionArray) {
  await ensureWalletReady();

  const config = await loadConfig();

  try {
    const result = await sendTransaction(
      wallet,
      actionArray,
      config,
      "wait-receipt"
    );

    console.log(
      "[tx-debug]",
      actionArray[0],
      "result:",
      result
    );

    return {
      success: true,
      type: result.type,
      address: mnAddr,
      ...result,
    };
  } catch (error) {
    if (!isWalletStaleOrLockedError(error)) {
      throw error;
    }

    console.warn(
      "[effectstream] Wallet session expired. Reconnecting..."
    );

    wallet = null;
    mnAddr = null;

    await ensureWalletReady();

    const retryResult = await sendTransaction(
      wallet,
      actionArray,
      config,
      "wait-receipt"
    );

    console.log(
      "[tx-debug] retry",
      actionArray[0],
      "result:",
      retryResult
    );

    return {
      success: true,
      type: retryResult.type,
      address: mnAddr,
      ...retryResult,
    };
  }
}

// ─────────────────────────────────────────────────────────────
// PilotLog actions
// ─────────────────────────────────────────────────────────────

async function sendCreateProfile(
  displayName,
  pilotPhase,
  notes
) {
  return await executeTransaction([
    "create_profile",
    displayName,
    pilotPhase,
    notes ?? "",
  ]);
}

async function sendAction(actionArray) {
  return await executeTransaction(actionArray);
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

window.effectstream = {
  login,
  sendCreateProfile,
  sendAction,
  getWallet: () => ({
    address: mnAddr,
  }),
};
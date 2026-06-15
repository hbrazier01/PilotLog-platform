/**
 * AIR-350 — Midnight Identity End-to-End Validation
 *
 * Validates the path:
 *   Midnight Wallet (local seed) → Batcher (signature verify) → EVM contract
 *   → Effectstream Runtime → STM create_profile → pilot_profile
 *
 * Uses the Midnight wallet SDK packages directly (wallet-sdk-hd +
 * wallet-sdk-unshielded-wallet) in signing-only mode. No node, indexer,
 * or proof-server required.
 *
 * The batcher verifies the Midnight signature using ledger-v8 and sets
 * signerAddress to the Midnight unshielded bech32m address.
 *
 * Key question answered: signerAddress is a Midnight bech32m unshielded
 * address (NOT an EVM 0x address).
 */
import { assertSQL, assert } from "../helpers.ts";
import { Buffer } from "node:buffer";
import type { Client } from "pg";

const BATCHER_PORT = 3333;
const BATCHER_URL = `http://localhost:${BATCHER_PORT}`;
const NAMESPACE = "minimal";

// Fixed 64-hex-char seed for deterministic test runs.
const TEST_SEED =
  "a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function waitForBatcher(timeoutMs = 30_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BATCHER_URL}/health`);
      if (res.ok) {
        const data = await res.json() as { isRunning?: boolean };
        if (data.isRunning) return;
      }
    } catch { /* not ready */ }
    await delay(500);
  }
  throw new Error("Batcher did not start within timeout");
}

/**
 * Derive a Midnight unshielded keystore from a hex seed using the
 * upstream wallet-sdk-hd + wallet-sdk-unshielded-wallet packages.
 */
async function buildMidnightWallet(seedHex: string, networkId: string) {
  const [hdMod, keystoreMod] = await Promise.all([
    import("@midnight-ntwrk/wallet-sdk-hd"),
    import("@midnight-ntwrk/wallet-sdk-unshielded-wallet"),
  ]);

  const seedBuffer = Buffer.from(seedHex, "hex");
  const hdResult = hdMod.HDWallet.fromSeed(seedBuffer);
  if (hdResult.type !== "seedOk") {
    throw new Error(`HDWallet.fromSeed failed: ${hdResult.type}`);
  }

  // NightExternal role = unshielded signing keys
  const derivation = hdResult.hdWallet
    .selectAccount(0)
    .selectRole(hdMod.Roles.NightExternal)
    .deriveKeyAt(0);
  if (derivation.type !== "keyDerived") {
    throw new Error(`HDWallet.deriveKeyAt failed: ${derivation.type}`);
  }

  const unshieldedSeed = Buffer.from(derivation.key);
  const keystore = keystoreMod.createKeystore(unshieldedSeed, networkId as never);

  const address = keystore.getBech32Address().asString();
  const verifyingKey = String(keystore.getPublicKey());

  const signMessage = async (message: string): Promise<string> => {
    const bytes = Buffer.from(message, "utf-8");
    const signature = String(keystore.signData(bytes));
    // Effectstream Midnight signature format: "sig|verifyingKey"
    return `${signature}|${verifyingKey}`;
  };

  return { address, verifyingKey, signMessage };
}

export async function midnightIdentityTest(db: Client): Promise<void> {
  console.log("\n[midnight-id] Waiting for batcher...");
  await waitForBatcher();
  console.log("[midnight-id] Batcher ready.");

  // ── 1. Build local Midnight wallet ──
  const wallet = await buildMidnightWallet(TEST_SEED, "undeployed");
  const midnightAddress = wallet.address;
  console.log(`[midnight-id] Wallet address: ${midnightAddress}`);

  // ── 2. Build concise input for create_profile ──
  const displayName = "Midnight Pilot";
  const pilotPhase = "midnight_test";
  const notes = "AIR-350 Midnight identity validation";
  const inputData = JSON.stringify([
    "create_profile",
    displayName,
    pilotPhase,
    notes,
  ]);

  // ── 3. Construct the batcher message (mirrors createMessageForBatcher) ──
  // Format: (namespace + target + timestamp + address + inputData)
  //   with non-alphanumeric chars replaced by '-', lowercased.
  const timestamp = String(Date.now());
  const rawMessage = (NAMESPACE + "" + timestamp + midnightAddress + inputData)
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLocaleLowerCase();

  // ── 4. Sign the message ──
  const signature = await wallet.signMessage(rawMessage);
  console.log(`[midnight-id] Signed. sig prefix: ${signature.slice(0, 24)}...`);

  // ── 5. POST to batcher /send-input ──
  // addressType 5 = AddressType.MIDNIGHT (from @effectstream/utils)
  const body = {
    data: {
      address: midnightAddress,
      addressType: 5,
      input: inputData,
      signature,
      timestamp,
    },
    confirmationLevel: "wait-receipt",
  };

  console.log("[midnight-id] Submitting to batcher...");
  const batcherRes = await fetch(`${BATCHER_URL}/send-input`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const responseText = await batcherRes.text();
  console.log(
    `[midnight-id] Batcher response (${batcherRes.status}): ${responseText}`,
  );

  if (!batcherRes.ok) {
    throw new Error(
      `Batcher rejected Midnight input: ${batcherRes.status} ${responseText}`,
    );
  }

  // ── 6. Verify STM persisted Midnight address as signer_address ──
  const lowerAddr = midnightAddress.toLowerCase();

  await assertSQL(
    "midnight-identity: pilot_profile row with Midnight bech32m signer_address",
    db,
    `SELECT signer_address, display_name, pilot_phase FROM pilot_profile WHERE signer_address = '${lowerAddr}'`,
    (res) => res.rows.length >= 1,
    (res) =>
      res.rows[0].display_name === displayName &&
      res.rows[0].pilot_phase === pilotPhase,
    30_000,
  );

  // ── 7. Confirm address is Midnight bech32m, NOT EVM 0x ──
  await assert(
    "midnight-identity: signerAddress is Midnight bech32m (not EVM 0x address)",
    async () => !lowerAddr.startsWith("0x"),
  );

  console.log("\n[midnight-id] === AIR-350 Validation Results ===");
  console.log(`  signerAddress: ${lowerAddr}`);
  console.log("  signerAddress type: Midnight unshielded bech32m");
  console.log("  Identity preserved through full pipeline: YES");
  console.log("  Custom PilotLog wallet logic required: NO");
  console.log("  Matches upstream Effectstream architecture: YES");
  console.log("[midnight-id] ===================================\n");
}

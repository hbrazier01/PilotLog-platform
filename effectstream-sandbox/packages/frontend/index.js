/**
 * Effectstream browser client — NO MetaMask required.
 *
 * Auth path (DEV-ONLY RELAY):
 *   1. Detect 1AM wallet via window.midnight['1am']
 *   2. Connect → get unshielded mn_addr
 *   3. For each action: POST /relay/submit { mnAddr, action }
 *   4. Server derives deterministic EVM key from mn_addr, signs + submits tx
 *   5. Returns { hash, signerAddress }
 *
 * The relay is TEMPORARY. Replace when 1AM adds direct EVM signing support.
 * No window.ethereum dependency anywhere in this file.
 */

let mnAddr = null;

async function detectOneAmWallet(timeoutMs = 3000) {
  return new Promise((resolve) => {
    const wallet = window.midnight?.["1am"];
    if (wallet) {
      resolve(wallet);
      return;
    }
    let attempts = 0;
    const max = timeoutMs / 100;
    const interval = setInterval(() => {
      const w = window.midnight?.["1am"];
      if (w) {
        clearInterval(interval);
        resolve(w);
      } else if (++attempts >= max) {
        clearInterval(interval);
        resolve(null);
      }
    }, 100);
  });
}

async function login() {
  const wallet = await detectOneAmWallet();

  if (wallet) {
    // Use 1AM wallet — the canonical PilotLog identity
    const api = await wallet.connect("preview");
    const { unshieldedAddress } = await api.getUnshieldedAddress();
    mnAddr = unshieldedAddress;
    console.log("[effectstream] 1AM wallet connected:", mnAddr);
  } else {
    // Dev fallback when 1AM wallet is not installed
    mnAddr = "dev-pilot-fallback";
    console.warn(
      "[effectstream] 1AM wallet not found — using dev fallback address.",
      "Install 1AM from https://1am.xyz/install-beta for full identity.",
    );
  }

  return { address: mnAddr };
}

async function sendAction(actionArray) {
  if (!mnAddr) throw new Error("Call effectstream.login() first");

  const response = await fetch("/relay/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mnAddr, action: actionArray }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `relay submit failed (${response.status})`);
  }

  const result = await response.json();
  console.log("[tx-debug] effectstream relay submit:", result);
  return {
    success: true,
    type: "server-relay",
    hash: result.hash,
    signerAddress: result.signerAddress,
  };
}

async function sendTransactionEffectstreamL2(input) {
  return await sendAction(["my_action_name", input ?? "no-text"]);
}

window.effectstream = {
  login,
  sendTransactionEffectstreamL2,
  sendAction,
  getWallet: () => ({ address: mnAddr }),
};

/**
 * Minimal batcher for Midnight wallet validation (AIR-344).
 *
 * Accepts Midnight-signed inputs from the browser, verifies the signature,
 * and submits batches to the EffectstreamL2 EVM contract using a Hardhat key.
 *
 * Signer identity in the STM is the Midnight unshielded address — no EVM
 * key derivation required.
 */
import { main, suspend } from "effection";
import {
  createNewBatcher,
  EffectstreamL2DefaultAdapter,
  type BatcherConfig,
  type DefaultBatcherInput,
} from "@effectstream/batcher-sdk";
import { contractAddressesEvmMain } from "@pilotlog-sandbox/contracts-evm";
import { hardhat } from "viem/chains";

const BATCHER_PORT = 3333;
const BATCH_INTERVAL_MS = 1000;
const SECURITY_NAMESPACE = "minimal";

// Hardhat account #1 (account #0 is used by the sync node / tests)
const BATCHER_PRIVATE_KEY =
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" as `0x${string}`;

const contractAddress =
  contractAddressesEvmMain().chain31337[
    "EffectstreamL2Module#MyEffectstreamL2"
  ] as `0x${string}`;

const adapter = new EffectstreamL2DefaultAdapter(
  contractAddress,
  BATCHER_PRIVATE_KEY,
  0n,
  "mainEvmRPC",
  hardhat,
);

const config: BatcherConfig<DefaultBatcherInput> = {
  pollingIntervalMs: BATCH_INTERVAL_MS,
  enableHttpServer: true,
  namespace: SECURITY_NAMESPACE,
  confirmationLevel: "wait-receipt",
  enableEventSystem: false,
  port: BATCHER_PORT,
};

const batcher = createNewBatcher(config);
batcher
  .addBlockchainAdapter("effectstream-l2", adapter, {
    criteriaType: "time",
    timeWindowMs: BATCH_INTERVAL_MS,
  })
  .setDefaultTarget("effectstream-l2");

main(function* () {
  console.log(`[batcher] Starting Midnight wallet batcher on port ${BATCHER_PORT}`);
  console.log(`[batcher] Contract: ${contractAddress}`);
  console.log(`[batcher] Namespace: ${SECURITY_NAMESPACE}`);
  try {
    yield* batcher.runBatcher();
  } catch (error) {
    console.error("[batcher] Error:", error);
    yield* batcher.gracefulShutdownOp();
  }
  yield* suspend();
});

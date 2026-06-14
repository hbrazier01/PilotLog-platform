import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import {
  keccak256,
  toBytes,
  toHex,
  createWalletClient,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { contractAddressesEvmMain } from "@pilotlog-sandbox/contracts-evm";

const EFFECTSTREAM_ABI = [
  {
    inputs: [{ name: "data", type: "bytes" }],
    name: "effectstreamSubmitGameInput",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const server = Fastify({ logger: false });

server.register(fastifyStatic, {
  root: path.join(import.meta.dirname!, "dist"),
});

/**
 * DEV-ONLY SERVER RELAY — TEMPORARY
 *
 * The 1AM wallet is a Midnight wallet and cannot sign EVM transactions.
 * The Effectstream sandbox uses Hardhat EVM, so a direct browser→EVM path
 * requires MetaMask.  Until a native Midnight→Effectstream signer path exists,
 * this relay holds the signing burden server-side.
 *
 * The relay derives a deterministic EVM private key from the caller's mn_addr
 * using keccak256(utf8Bytes(mnAddr)).  This guarantees the same Midnight wallet
 * always maps to the same EVM signerAddress in the STM, preserving identity
 * continuity without requiring MetaMask in the browser.
 *
 * DO NOT use in production.  Replace when 1AM adds direct EVM signing support.
 */
server.post<{ Body: { mnAddr: string; action: unknown[] } }>(
  "/relay/submit",
  async (request, reply) => {
    const { mnAddr, action } = request.body;

    if (!mnAddr || !Array.isArray(action)) {
      return reply
        .status(400)
        .send({ error: "mnAddr and action[] are required" });
    }

    // Derive a deterministic 32-byte private key from the mn_addr so that the
    // same Midnight wallet always maps to the same EVM signer in the STM.
    const privKey = keccak256(toBytes(mnAddr)) as `0x${string}`;
    const account = privateKeyToAccount(privKey);

    const addresses = contractAddressesEvmMain();
    const contractAddr =
      addresses.chain31337["EffectstreamL2Module#MyEffectstreamL2"];

    if (!contractAddr) {
      return reply.status(503).send({
        error: "Contract not deployed — run the Effectstream node first",
      });
    }

    const walletClient = createWalletClient({
      account,
      chain: hardhat,
      transport: http(),
    });

    const hexPayload = toHex(JSON.stringify(action)) as `0x${string}`;

    const hash = await walletClient.writeContract({
      address: contractAddr,
      abi: EFFECTSTREAM_ABI,
      functionName: "effectstreamSubmitGameInput",
      args: [hexPayload],
      value: 0n,
    });

    console.log(
      `[relay] mnAddr=${mnAddr} signerAddress=${account.address} tx=${hash}`,
    );

    return reply.send({ success: true, hash, signerAddress: account.address });
  },
);

server.setNotFoundHandler((_req, reply) => {
  reply.sendFile("index.html");
});

await server.listen({ port: 10599, host: "0.0.0.0" });
console.log("Frontend serving on http://localhost:10599");

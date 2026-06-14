import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { contractAddressesEvmMain } from "@pilotlog-sandbox/contracts-evm";

const server = Fastify({ logger: false });

server.register(fastifyStatic, {
  root: path.join(import.meta.dirname!, "dist"),
});

/**
 * Returns the deployed EVM contract address for the Effectstream sandbox.
 * The frontend reads this on init to build its EffectstreamConfig.
 */
server.get("/api/contract-address", async (_request, reply) => {
  const addresses = contractAddressesEvmMain();
  const contractAddress =
    addresses.chain31337?.["EffectstreamL2Module#MyEffectstreamL2"];

  if (!contractAddress) {
    return reply.status(503).send({
      error: "Contract not deployed — run the Effectstream node first",
    });
  }

  return reply.send({ contractAddress });
});

server.setNotFoundHandler((_req, reply) => {
  reply.sendFile("index.html");
});

await server.listen({ port: 10599, host: "0.0.0.0" });
console.log("Frontend serving on http://localhost:10599");

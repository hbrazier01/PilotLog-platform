import { runPreparedQuery } from "@effectstream/db";
import { getAllFlights, getAllStudentRequests, getAllCfiAvailability, getProfile, getAllProfiles } from "@pilotlog-sandbox/database";
import type { Pool } from "pg";
import type { StartConfigApiRouter } from "@effectstream/runtime";
import type { FastifyInstance } from "fastify";

export const apiRouter: StartConfigApiRouter = async function (
  server: FastifyInstance,
  dbConn: Pool,
): Promise<void> {
  server.get("/flights", async (_request, reply) => {
    const result = await runPreparedQuery(
      getAllFlights.run(undefined, dbConn),
      "/flights",
    );
    reply.send({ flights: result });
  });

  server.get("/student-requests", async (_request, reply) => {
    const result = await runPreparedQuery(
      getAllStudentRequests.run(undefined, dbConn),
      "/student-requests",
    );
    reply.send({ studentRequests: result });
  });

  server.get("/cfi-availability", async (_request, reply) => {
    const result = await runPreparedQuery(
      getAllCfiAvailability.run(undefined, dbConn),
      "/cfi-availability",
    );
    reply.send({ cfiAvailability: result });
  });

  server.get("/profile/:walletAddress", async (request, reply) => {
    const { walletAddress } = request.params as { walletAddress: string };
    const rows = await runPreparedQuery(
      getProfile.run({ wallet_address: walletAddress }, dbConn),
      "/profile/:walletAddress",
    );
    if (!rows || rows.length === 0) {
      reply.status(404).send({ error: "Profile not found" });
      return;
    }
    reply.send({ profile: rows[0] });
  });

  server.get("/profiles", async (_request, reply) => {
    const result = await runPreparedQuery(
      getAllProfiles.run(undefined, dbConn),
      "/profiles",
    );
    reply.send({ profiles: result });
  });

};

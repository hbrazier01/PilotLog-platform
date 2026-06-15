import { runPreparedQuery } from "@effectstream/db";
import {
  getAllProfiles,
  getProfileBySigner,
  getAllStudentRequests,
  getAllCfiAvailability,
} from "@pilotlog-sandbox/database";
import type { Pool } from "pg";
import type { StartConfigApiRouter } from "@effectstream/runtime";
import type { FastifyInstance } from "fastify";

export const apiRouter: StartConfigApiRouter = async function (
  server: FastifyInstance,
  dbConn: Pool,
): Promise<void> {
  server.get("/api/profiles", async (_request, reply) => {
    const result = await runPreparedQuery(
      getAllProfiles.run(undefined, dbConn),
      "/api/profiles",
    );
    reply.send({ profiles: result });
  });

  server.get<{ Params: { signer: string } }>("/api/profile/:signer", async (request, reply) => {
    const { signer } = request.params;
    const result = await runPreparedQuery(
      getProfileBySigner.run({ signer_address: signer.toLowerCase() }, dbConn),
      "/api/profile/:signer",
    );
    if (result.length === 0) {
      return reply.status(404).send({ error: "Profile not found" });
    }
    reply.send({ profile: result[0] });
  });

  server.get("/api/student-requests", async (_request, reply) => {
    const result = await runPreparedQuery(
      getAllStudentRequests.run(undefined, dbConn),
      "/api/student-requests",
    );
    reply.send({ studentRequests: result });
  });

  server.get("/api/cfi-availability", async (_request, reply) => {
    const result = await runPreparedQuery(
      getAllCfiAvailability.run(undefined, dbConn),
      "/api/cfi-availability",
    );
    reply.send({ cfiAvailability: result });
  });
};

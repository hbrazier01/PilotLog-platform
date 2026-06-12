import { runPreparedQuery } from "@effectstream/db";
import { getAllFlights, getAllStudentRequests, getAllCfiAvailability } from "@pilotlog-sandbox/database";
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

};

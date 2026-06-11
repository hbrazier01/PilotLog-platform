import { runPreparedQuery } from "@effectstream/db";
import { getAllFlights } from "@pilotlog-sandbox/database";
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

};

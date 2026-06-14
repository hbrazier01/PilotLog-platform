import { runPreparedQuery } from "@effectstream/db";
import { getAllProfiles } from "@pilotlog-sandbox/database";
import type { Pool } from "pg";
import type { StartConfigApiRouter } from "@effectstream/runtime";
import type { FastifyInstance } from "fastify";

export const apiRouter: StartConfigApiRouter = async function (
  server: FastifyInstance,
  dbConn: Pool,
): Promise<void> {
  server.get("/profiles", async (_request, reply) => {
    const result = await runPreparedQuery(
      getAllProfiles.run(undefined, dbConn),
      "/profiles",
    );
    reply.send({ profiles: result });
  });
};

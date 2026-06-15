import { runPreparedQuery } from "@effectstream/db";
import {
  getAllProfiles,
  getProfileBySigner,
  getAllStudentRequests,
  getAllCfiAvailability,
  getAllAircraft,
  getAircraftById,
  getAircraftBySigner,
  getAllFlights,
  getFlightById,
  getFlightsBySigner,
  getFlightsByAircraft,
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

  server.get("/api/aircraft", async (_request, reply) => {
    const result = await runPreparedQuery(
      getAllAircraft.run(undefined, dbConn),
      "/api/aircraft",
    );
    reply.send({ aircraft: result });
  });

  server.get<{ Params: { id: string } }>("/api/aircraft/:id", async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid aircraft id" });
    }
    const result = await runPreparedQuery(
      getAircraftById.run({ id }, dbConn),
      "/api/aircraft/:id",
    );
    if (result.length === 0) {
      return reply.status(404).send({ error: "Aircraft not found" });
    }
    reply.send({ aircraft: result[0] });
  });

  server.get<{ Params: { signer: string } }>("/api/my-aircraft/:signer", async (request, reply) => {
    const { signer } = request.params;
    const result = await runPreparedQuery(
      getAircraftBySigner.run({ owner_signer_address: signer.toLowerCase() }, dbConn),
      "/api/my-aircraft/:signer",
    );
    reply.send({ aircraft: result });
  });

  server.get("/api/flights", async (_request, reply) => {
    const result = await runPreparedQuery(
      getAllFlights.run(undefined, dbConn),
      "/api/flights",
    );
    reply.send({ flights: result });
  });

  server.get<{ Params: { id: string } }>("/api/flights/:id", async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid flight id" });
    }
    const result = await runPreparedQuery(
      getFlightById.run({ id }, dbConn),
      "/api/flights/:id",
    );
    if (result.length === 0) {
      return reply.status(404).send({ error: "Flight not found" });
    }
    reply.send({ flight: result[0] });
  });

  server.get<{ Params: { signer: string } }>("/api/my-flights/:signer", async (request, reply) => {
    const { signer } = request.params;
    const result = await runPreparedQuery(
      getFlightsBySigner.run({ owner_signer_address: signer.toLowerCase() }, dbConn),
      "/api/my-flights/:signer",
    );
    reply.send({ flights: result });
  });

  server.get<{ Params: { id: string } }>("/api/aircraft/:id/flights", async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid aircraft id" });
    }
    const result = await runPreparedQuery(
      getFlightsByAircraft.run({ aircraft_id: id }, dbConn),
      "/api/aircraft/:id/flights",
    );
    reply.send({ flights: result });
  });
};

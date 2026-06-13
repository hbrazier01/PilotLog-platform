import { Stm } from "@effectstream/sm";
import type { BaseStfInput } from "@effectstream/sm";
import type { StartConfigGameStateTransitions } from "@effectstream/runtime";
import { type SyncStateUpdateStream, World } from "@effectstream/coroutine";
import {
  insertFlight,
  insertStudentRequest,
  getStudentRequest,
  insertStudentRequestHistory,
  deleteStudentRequest,
  insertCfiAvailability,
  getCfiAvailability,
  insertCfiAvailabilityHistory,
  deleteCfiAvailability,
  upsertProfile,
} from "@pilotlog-sandbox/database";
import { grammar } from "./grammar.ts";

const stm = new Stm<typeof grammar, {}>(grammar);

stm.addStateTransition("log_flight", function* (data) {
  const { parsedInput } = data;

  yield* World.resolve(insertFlight, {
    wallet_address: parsedInput.walletAddress,
    aircraft_ident: parsedInput.aircraftIdent,
    airport_from: parsedInput.airportFrom,
    airport_to: parsedInput.airportTo,
    total_time: parsedInput.totalTime,
  });
});

stm.addStateTransition("create_student_request", function* (data) {
  const { parsedInput } = data;

  yield* World.resolve(insertStudentRequest, {
    wallet_address: parsedInput.walletAddress,
    aircraft_ident: parsedInput.aircraftIdent,
    notes: parsedInput.notes,
  });
});

stm.addStateTransition("accept_student_request", function* (data) {
  const { parsedInput } = data;

  const rows = yield* World.resolve(getStudentRequest, {
    request_id: parsedInput.requestId,
  });

  if (!rows || rows.length === 0) {
    throw new Error(`Student request ${parsedInput.requestId} not found`);
  }

  const req = rows[0];

  yield* World.resolve(insertStudentRequestHistory, {
    request_id: req.request_id,
    wallet_address: req.wallet_address,
    cfi_wallet: parsedInput.walletAddress,
    aircraft_ident: req.aircraft_ident,
    notes: req.notes,
    event: "accepted",
  });

  yield* World.resolve(deleteStudentRequest, {
    request_id: req.request_id,
  });
});

stm.addStateTransition("withdraw_student_request", function* (data) {
  const { parsedInput } = data;

  const rows = yield* World.resolve(getStudentRequest, {
    request_id: parsedInput.requestId,
  });

  if (!rows || rows.length === 0) {
    throw new Error(`Student request ${parsedInput.requestId} not found`);
  }

  const req = rows[0];

  if (req.wallet_address !== parsedInput.walletAddress) {
    throw new Error("Unauthorized: only the requesting student can withdraw");
  }

  yield* World.resolve(insertStudentRequestHistory, {
    request_id: req.request_id,
    wallet_address: req.wallet_address,
    cfi_wallet: null,
    aircraft_ident: req.aircraft_ident,
    notes: req.notes,
    event: "withdrawn",
  });

  yield* World.resolve(deleteStudentRequest, {
    request_id: req.request_id,
  });
});

stm.addStateTransition("create_cfi_availability", function* (data) {
  const { parsedInput } = data;

  yield* World.resolve(insertCfiAvailability, {
    wallet_address: parsedInput.walletAddress,
    aircraft_ident: parsedInput.aircraftIdent,
    hourly_rate: parsedInput.hourlyRate,
    notes: parsedInput.notes,
  });
});

stm.addStateTransition("accept_cfi_availability", function* (data) {
  const { parsedInput } = data;

  const rows = yield* World.resolve(getCfiAvailability, {
    availability_id: parsedInput.availabilityId,
  });

  if (!rows || rows.length === 0) {
    throw new Error(`CFI availability ${parsedInput.availabilityId} not found`);
  }

  const avail = rows[0];

  yield* World.resolve(insertCfiAvailabilityHistory, {
    availability_id: avail.availability_id,
    wallet_address: avail.wallet_address,
    student_wallet: parsedInput.walletAddress,
    aircraft_ident: avail.aircraft_ident,
    hourly_rate: parseFloat(avail.hourly_rate),
    notes: avail.notes,
    event: "accepted",
  });

  yield* World.resolve(deleteCfiAvailability, {
    availability_id: avail.availability_id,
  });
});

stm.addStateTransition("withdraw_cfi_availability", function* (data) {
  const { parsedInput } = data;

  const rows = yield* World.resolve(getCfiAvailability, {
    availability_id: parsedInput.availabilityId,
  });

  if (!rows || rows.length === 0) {
    throw new Error(`CFI availability ${parsedInput.availabilityId} not found`);
  }

  const avail = rows[0];

  if (avail.wallet_address !== parsedInput.walletAddress) {
    throw new Error("Unauthorized: only the listing CFI can withdraw");
  }

  yield* World.resolve(insertCfiAvailabilityHistory, {
    availability_id: avail.availability_id,
    wallet_address: avail.wallet_address,
    student_wallet: null,
    aircraft_ident: avail.aircraft_ident,
    hourly_rate: parseFloat(avail.hourly_rate),
    notes: avail.notes,
    event: "withdrawn",
  });

  yield* World.resolve(deleteCfiAvailability, {
    availability_id: avail.availability_id,
  });
});

stm.addStateTransition("create_profile", function* (data) {
  const { parsedInput } = data;

  yield* World.resolve(upsertProfile, {
    wallet_address: parsedInput.walletAddress,
    display_name: parsedInput.displayName,
    pilot_phase: parsedInput.pilotPhase,
    notes: parsedInput.notes,
  });
});

stm.addStateTransition("update_profile", function* (data) {
  const { parsedInput } = data;

  yield* World.resolve(upsertProfile, {
    wallet_address: parsedInput.walletAddress,
    display_name: parsedInput.displayName,
    pilot_phase: parsedInput.pilotPhase,
    notes: parsedInput.notes,
  });
});

export const gameStateTransitions: StartConfigGameStateTransitions = function* (
  _blockHeight: number,
  input: BaseStfInput,
): SyncStateUpdateStream<void> {
  yield* stm.processInput(input);
};

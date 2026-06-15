import { Stm } from "@effectstream/sm";
import type { BaseStfInput } from "@effectstream/sm";
import type { StartConfigGameStateTransitions } from "@effectstream/runtime";
import { type SyncStateUpdateStream, World } from "@effectstream/coroutine";
import {
  insertProfile,
  insertStudentRequest,
  acceptStudentRequest,
  withdrawStudentRequest,
  insertCfiAvailability,
  acceptCfiAvailability,
  withdrawCfiAvailability,
  insertAircraft,
  updateAircraft,
  deactivateAircraft,
  insertFlightLog,
  updateFlightLog,
  voidFlightLog,
  insertTrainingRecord,
  updateTrainingRecord,
  completeTrainingRecord,
  insertEndorsement,
  approveEndorsement,
  rejectEndorsement,
} from "@pilotlog-sandbox/database";
import { grammar } from "./grammar.ts";

const stm = new Stm<typeof grammar, {}>(grammar);

stm.addStateTransition("create_profile", function* (data) {
  const { parsedInput, signerAddress, blockHeight } = data;
  yield* World.resolve(insertProfile, {
    signer_address: signerAddress!.toLowerCase(),
    display_name: parsedInput.displayName,
    pilot_phase: parsedInput.pilotPhase,
    notes: parsedInput.notes ?? "",
    block_height: blockHeight,
  });
});

stm.addStateTransition("create_student_request", function* (data) {
  const { parsedInput, signerAddress, blockHeight } = data;
  yield* World.resolve(insertStudentRequest, {
    owner_signer_address: signerAddress!.toLowerCase(),
    aircraft_ident: parsedInput.aircraftIdent,
    notes: parsedInput.notes ?? "",
    block_height: blockHeight,
  });
});

stm.addStateTransition("accept_student_request", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(acceptStudentRequest, {
    id: parsedInput.requestId,
    accepted_signer_address: signerAddress!.toLowerCase(),
  });
});

stm.addStateTransition("withdraw_student_request", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(withdrawStudentRequest, {
    id: parsedInput.requestId,
    owner_signer_address: signerAddress!.toLowerCase(),
  });
});

stm.addStateTransition("create_cfi_availability", function* (data) {
  const { parsedInput, signerAddress, blockHeight } = data;
  yield* World.resolve(insertCfiAvailability, {
    owner_signer_address: signerAddress!.toLowerCase(),
    aircraft_ident: parsedInput.aircraftIdent,
    hourly_rate: parsedInput.hourlyRate,
    notes: parsedInput.notes ?? "",
    block_height: blockHeight,
  });
});

stm.addStateTransition("accept_cfi_availability", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(acceptCfiAvailability, {
    id: parsedInput.availabilityId,
    accepted_signer_address: signerAddress!.toLowerCase(),
  });
});

stm.addStateTransition("withdraw_cfi_availability", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(withdrawCfiAvailability, {
    id: parsedInput.availabilityId,
    owner_signer_address: signerAddress!.toLowerCase(),
  });
});

stm.addStateTransition("create_aircraft", function* (data) {
  const { parsedInput, signerAddress, blockHeight } = data;
  yield* World.resolve(insertAircraft, {
    owner_signer_address: signerAddress!.toLowerCase(),
    tail_number: parsedInput.tailNumber,
    manufacturer: parsedInput.manufacturer,
    model: parsedInput.model,
    year: parsedInput.year,
    aircraft_category: parsedInput.aircraftCategory,
    block_height: blockHeight,
  });
});

stm.addStateTransition("update_aircraft", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(updateAircraft, {
    id: parsedInput.aircraftId,
    owner_signer_address: signerAddress!.toLowerCase(),
    manufacturer: parsedInput.manufacturer,
    model: parsedInput.model,
    year: parsedInput.year,
    aircraft_category: parsedInput.aircraftCategory,
  });
});

stm.addStateTransition("deactivate_aircraft", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(deactivateAircraft, {
    id: parsedInput.aircraftId,
    owner_signer_address: signerAddress!.toLowerCase(),
  });
});

stm.addStateTransition("log_flight", function* (data) {
  const { parsedInput, signerAddress, blockHeight } = data;
  yield* World.resolve(insertFlightLog, {
    owner_signer_address: signerAddress!.toLowerCase(),
    aircraft_id: parsedInput.aircraftId,
    flight_date: parsedInput.date,
    departure_airport: parsedInput.departureAirport,
    arrival_airport: parsedInput.arrivalAirport,
    total_time: parsedInput.totalTime,
    pic_time: parsedInput.picTime,
    dual_received_time: parsedInput.dualReceivedTime,
    night_time: parsedInput.nightTime,
    instrument_time: parsedInput.instrumentTime,
    notes: parsedInput.notes ?? "",
    block_height: blockHeight,
  });
});

stm.addStateTransition("update_flight", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(updateFlightLog, {
    id: parsedInput.flightId,
    owner_signer_address: signerAddress!.toLowerCase(),
    aircraft_id: parsedInput.aircraftId,
    flight_date: parsedInput.date,
    departure_airport: parsedInput.departureAirport,
    arrival_airport: parsedInput.arrivalAirport,
    total_time: parsedInput.totalTime,
    pic_time: parsedInput.picTime,
    dual_received_time: parsedInput.dualReceivedTime,
    night_time: parsedInput.nightTime,
    instrument_time: parsedInput.instrumentTime,
    notes: parsedInput.notes ?? "",
  });
});

stm.addStateTransition("void_flight", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(voidFlightLog, {
    id: parsedInput.flightId,
    owner_signer_address: signerAddress!.toLowerCase(),
  });
});


stm.addStateTransition("create_training_record", function* (data) {
  const { parsedInput, signerAddress, blockHeight } = data;
  // Validate training type
  const validTypes = [
    "Discovery Flight", "PPL Lesson", "Solo Preparation", "Cross Country Training",
    "Night Training", "Instrument Training", "Commercial Training", "CFI Training",
  ];
  if (!validTypes.includes(parsedInput.trainingType)) return;

  // Validate referenced flight log exists and is active
  // (FK validation handled at DB layer — flight_log_id FK enforced by STM lookup)
  yield* World.resolve(insertTrainingRecord, {
    student_signer_address: signerAddress!.toLowerCase(),
    instructor_signer_address: parsedInput.instructorSignerAddress.toLowerCase(),
    flight_log_id: parsedInput.flightLogId,
    training_type: parsedInput.trainingType,
    notes: parsedInput.notes ?? "",
    block_height: blockHeight,
  });
});

stm.addStateTransition("update_training_record", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(updateTrainingRecord, {
    id: parsedInput.trainingRecordId,
    student_signer_address: signerAddress!.toLowerCase(),
    training_type: parsedInput.trainingType,
    notes: parsedInput.notes ?? "",
  });
});

stm.addStateTransition("complete_training_record", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(completeTrainingRecord, {
    id: parsedInput.trainingRecordId,
    student_signer_address: signerAddress!.toLowerCase(),
  });
});



stm.addStateTransition("create_endorsement", function* (data) {
  const { parsedInput, signerAddress, blockHeight } = data;
  const validTypes = [
    "Discovery Flight Complete", "Pre-Solo Review", "Solo Ready", "Cross Country Ready",
    "Night Training Complete", "Instrument Training Complete",
    "Commercial Training Complete", "CFI Training Complete",
  ];
  if (!validTypes.includes(parsedInput.endorsementType)) return;

  yield* World.resolve(insertEndorsement, {
    training_record_id: parsedInput.trainingRecordId,
    student_signer_address: signerAddress!.toLowerCase(),
    endorsement_type: parsedInput.endorsementType,
    notes: parsedInput.notes ?? "",
    block_height: blockHeight,
  });
});

stm.addStateTransition("approve_endorsement", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(approveEndorsement, {
    id: parsedInput.endorsementId,
    approved_by_signer_address: signerAddress!.toLowerCase(),
  });
});

stm.addStateTransition("reject_endorsement", function* (data) {
  const { parsedInput, signerAddress } = data;
  yield* World.resolve(rejectEndorsement, {
    id: parsedInput.endorsementId,
    approved_by_signer_address: signerAddress!.toLowerCase(),
  });
});

export const gameStateTransitions: StartConfigGameStateTransitions = function* (
  _blockHeight: number,
  input: BaseStfInput,
): SyncStateUpdateStream<void> {
  yield* stm.processInput(input);
};

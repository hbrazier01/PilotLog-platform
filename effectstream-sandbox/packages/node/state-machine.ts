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

export const gameStateTransitions: StartConfigGameStateTransitions = function* (
  _blockHeight: number,
  input: BaseStfInput,
): SyncStateUpdateStream<void> {
  yield* stm.processInput(input);
};

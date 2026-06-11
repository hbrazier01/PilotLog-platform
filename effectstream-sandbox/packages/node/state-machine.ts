import { Stm } from "@effectstream/sm";
import type { BaseStfInput } from "@effectstream/sm";
import type { StartConfigGameStateTransitions } from "@effectstream/runtime";
import { type SyncStateUpdateStream, World } from "@effectstream/coroutine";
import { insertFlight } from "@pilotlog-sandbox/database";
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

export const gameStateTransitions: StartConfigGameStateTransitions = function* (
  _blockHeight: number,
  input: BaseStfInput,
): SyncStateUpdateStream<void> {
  yield* stm.processInput(input);
};

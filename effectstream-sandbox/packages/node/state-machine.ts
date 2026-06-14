import { Stm } from "@effectstream/sm";
import type { BaseStfInput } from "@effectstream/sm";
import type { StartConfigGameStateTransitions } from "@effectstream/runtime";
import { type SyncStateUpdateStream, World } from "@effectstream/coroutine";
import { insertProfile } from "@pilotlog-sandbox/database";
import { grammar } from "./grammar.ts";

const stm = new Stm<typeof grammar, {}>(grammar);

stm.addStateTransition("create_profile", function* (data) {
  const { parsedInput, signerAddress, blockHeight } = data;
  yield* World.resolve(insertProfile, {
    signer: signerAddress!,
    display_name: parsedInput.displayName,
    pilot_phase: parsedInput.pilotPhase,
    block_height: blockHeight,
  });
});

export const gameStateTransitions: StartConfigGameStateTransitions = function* (
  _blockHeight: number,
  input: BaseStfInput,
): SyncStateUpdateStream<void> {
  yield* stm.processInput(input);
};

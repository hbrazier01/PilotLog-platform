import { Type } from "@sinclair/typebox";
import type { GrammarDefinition } from "@effectstream/concise";

export const grammar = {
  log_flight: [
    ["walletAddress", Type.String({ maxLength: 256 })],
    ["aircraftIdent", Type.String({ maxLength: 16 })],
    ["airportFrom", Type.String({ maxLength: 8 })],
    ["airportTo", Type.String({ maxLength: 8 })],
    ["totalTime", Type.Number({ minimum: 0, maximum: 999 })],
  ],
} as const satisfies GrammarDefinition;

import { Type } from "@sinclair/typebox";
import type { GrammarDefinition } from "@effectstream/concise";

export const grammar = {
  create_profile: [
    ["displayName", Type.String({ maxLength: 128 })],
    ["pilotPhase", Type.String({ maxLength: 64 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
} as const satisfies GrammarDefinition;

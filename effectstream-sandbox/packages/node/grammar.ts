import { Type } from "@sinclair/typebox";
import type { GrammarDefinition } from "@effectstream/concise";

export const grammar = {
  create_profile: [
    ["displayName", Type.String({ maxLength: 128 })],
    ["pilotPhase", Type.String({ maxLength: 64 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  create_student_request: [
    ["aircraftIdent", Type.String({ maxLength: 16 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  accept_student_request: [
    ["requestId", Type.Integer({ minimum: 1 })],
  ],
  withdraw_student_request: [
    ["requestId", Type.Integer({ minimum: 1 })],
  ],
  create_cfi_availability: [
    ["aircraftIdent", Type.String({ maxLength: 16 })],
    ["hourlyRate", Type.Number({ minimum: 0, maximum: 99999 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  accept_cfi_availability: [
    ["availabilityId", Type.Integer({ minimum: 1 })],
  ],
  withdraw_cfi_availability: [
    ["availabilityId", Type.Integer({ minimum: 1 })],
  ],
} as const satisfies GrammarDefinition;

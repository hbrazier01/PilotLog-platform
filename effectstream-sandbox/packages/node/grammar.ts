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
  create_student_request: [
    ["walletAddress", Type.String({ maxLength: 256 })],
    ["aircraftIdent", Type.String({ maxLength: 16 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  accept_student_request: [
    ["walletAddress", Type.String({ maxLength: 256 })],
    ["requestId", Type.Integer({ minimum: 1 })],
  ],
  withdraw_student_request: [
    ["walletAddress", Type.String({ maxLength: 256 })],
    ["requestId", Type.Integer({ minimum: 1 })],
  ],
  create_cfi_availability: [
    ["walletAddress", Type.String({ maxLength: 256 })],
    ["aircraftIdent", Type.String({ maxLength: 16 })],
    ["hourlyRate", Type.Number({ minimum: 0 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  accept_cfi_availability: [
    ["walletAddress", Type.String({ maxLength: 256 })],
    ["availabilityId", Type.Integer({ minimum: 1 })],
  ],
  withdraw_cfi_availability: [
    ["walletAddress", Type.String({ maxLength: 256 })],
    ["availabilityId", Type.Integer({ minimum: 1 })],
  ],
  create_profile: [
    ["walletAddress", Type.String({ maxLength: 256 })],
    ["displayName", Type.String({ maxLength: 128 })],
    ["pilotPhase", Type.String({ maxLength: 64 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  update_profile: [
    ["walletAddress", Type.String({ maxLength: 256 })],
    ["displayName", Type.String({ maxLength: 128 })],
    ["pilotPhase", Type.String({ maxLength: 64 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  create_identity: [
    ["walletAddress", Type.String({ maxLength: 256 })],
    ["chain", Type.String({ maxLength: 64 })],
  ],
  link_wallet: [
    ["identityId", Type.String({ maxLength: 64 })],
    ["chain", Type.String({ maxLength: 64 })],
    ["walletAddress", Type.String({ maxLength: 256 })],
    ["verificationStatus", Type.String({ maxLength: 32 })],
  ],
  unlink_wallet: [
    ["identityId", Type.String({ maxLength: 64 })],
    ["chain", Type.String({ maxLength: 64 })],
    ["walletAddress", Type.String({ maxLength: 256 })],
  ],
} as const satisfies GrammarDefinition;

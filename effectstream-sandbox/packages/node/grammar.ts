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
  // walletAddress removed: the STM reads signerAddress from the chain-verified
  // transaction signer instead of trusting a user-supplied field.
  create_profile: [
    ["displayName", Type.String({ maxLength: 128 })],
    ["pilotPhase", Type.String({ maxLength: 64 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  update_profile: [
    ["displayName", Type.String({ maxLength: 128 })],
    ["pilotPhase", Type.String({ maxLength: 64 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  // chain is user-supplied (which chain the primary wallet is on); the wallet
  // address itself comes from signerAddress.
  create_identity: [
    ["chain", Type.String({ maxLength: 64 })],
  ],
  // link_wallet: signer proves ownership of the identity; walletAddress is the
  // NEW wallet being added (legitimately user-supplied data, not the signer).
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

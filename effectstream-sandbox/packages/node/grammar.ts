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
  create_aircraft: [
    ["tailNumber", Type.String({ maxLength: 10 })],
    ["manufacturer", Type.String({ maxLength: 64 })],
    ["model", Type.String({ maxLength: 64 })],
    ["year", Type.Integer({ minimum: 1900, maximum: 2100 })],
    ["aircraftCategory", Type.String({ maxLength: 64 })],
  ],
  update_aircraft: [
    ["aircraftId", Type.Integer({ minimum: 1 })],
    ["manufacturer", Type.String({ maxLength: 64 })],
    ["model", Type.String({ maxLength: 64 })],
    ["year", Type.Integer({ minimum: 1900, maximum: 2100 })],
    ["aircraftCategory", Type.String({ maxLength: 64 })],
  ],
  deactivate_aircraft: [
    ["aircraftId", Type.Integer({ minimum: 1 })],
  ],
  log_flight: [
    ["aircraftId", Type.Integer({ minimum: 1 })],
    ["date", Type.String({ maxLength: 16 })],
    ["departureAirport", Type.String({ maxLength: 10 })],
    ["arrivalAirport", Type.String({ maxLength: 10 })],
    ["totalTime", Type.Number({ minimum: 0, maximum: 999 })],
    ["picTime", Type.Number({ minimum: 0, maximum: 999 })],
    ["dualReceivedTime", Type.Number({ minimum: 0, maximum: 999 })],
    ["nightTime", Type.Number({ minimum: 0, maximum: 999 })],
    ["instrumentTime", Type.Number({ minimum: 0, maximum: 999 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  update_flight: [
    ["flightId", Type.Integer({ minimum: 1 })],
    ["aircraftId", Type.Integer({ minimum: 1 })],
    ["date", Type.String({ maxLength: 16 })],
    ["departureAirport", Type.String({ maxLength: 10 })],
    ["arrivalAirport", Type.String({ maxLength: 10 })],
    ["totalTime", Type.Number({ minimum: 0, maximum: 999 })],
    ["picTime", Type.Number({ minimum: 0, maximum: 999 })],
    ["dualReceivedTime", Type.Number({ minimum: 0, maximum: 999 })],
    ["nightTime", Type.Number({ minimum: 0, maximum: 999 })],
    ["instrumentTime", Type.Number({ minimum: 0, maximum: 999 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  void_flight: [
    ["flightId", Type.Integer({ minimum: 1 })],
  ],

  create_training_record: [
    ["instructorSignerAddress", Type.String({ maxLength: 128 })],
    ["flightLogId", Type.Integer({ minimum: 1 })],
    ["trainingType", Type.String({ maxLength: 64 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  update_training_record: [
    ["trainingRecordId", Type.Integer({ minimum: 1 })],
    ["trainingType", Type.String({ maxLength: 64 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  complete_training_record: [
    ["trainingRecordId", Type.Integer({ minimum: 1 })],
  ],

  create_endorsement: [
    ["trainingRecordId", Type.Integer({ minimum: 1 })],
    ["endorsementType", Type.String({ maxLength: 128 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
  approve_endorsement: [
    ["endorsementId", Type.Integer({ minimum: 1 })],
  ],
  reject_endorsement: [
    ["endorsementId", Type.Integer({ minimum: 1 })],
    ["notes", Type.String({ maxLength: 1024 })],
  ],
} as const satisfies GrammarDefinition;

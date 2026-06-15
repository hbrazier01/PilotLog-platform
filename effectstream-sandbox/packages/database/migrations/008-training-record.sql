-- Training Record Foundation (AIR-354)
-- Identity uses student_signer_address (Effectstream signerAddress — chain-verified).
-- No walletAddress / userId / ownerAddress accepted from browser input.
--
-- Training Records connect Students → Instructors → Flight Logs → Aircraft.
-- aircraft_id is derived from the referenced flight_log (denormalized for query convenience).
-- Instructor signer address does not require a profile in V1.
--
-- Training Types validated at STM layer:
--   Discovery Flight, PPL Lesson, Solo Preparation, Cross Country Training,
--   Night Training, Instrument Training, Commercial Training, CFI Training
--
-- Future: add FK constraints on flight_log_id and aircraft_id when DB enforces referential integrity.

CREATE TABLE training_record (
  id                        SERIAL        PRIMARY KEY,
  student_signer_address    TEXT          NOT NULL,
  instructor_signer_address TEXT          NOT NULL,
  flight_log_id             INTEGER       NOT NULL,
  aircraft_id               INTEGER       NOT NULL,
  training_type             TEXT          NOT NULL,
  status                    TEXT          NOT NULL DEFAULT 'active',
  notes                     TEXT          NOT NULL DEFAULT '',
  created_at                TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  block_height              INTEGER       NOT NULL
);

CREATE INDEX training_record_student_idx    ON training_record (student_signer_address);
CREATE INDEX training_record_instructor_idx ON training_record (instructor_signer_address);
CREATE INDEX training_record_flight_idx     ON training_record (flight_log_id);

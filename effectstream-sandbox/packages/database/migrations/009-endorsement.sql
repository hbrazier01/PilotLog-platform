-- Endorsement Foundation (AIR-355)
-- Identity uses student_signer_address (Effectstream signerAddress — chain-verified).
-- No walletAddress / userId / ownerAddress accepted from browser input.
--
-- Endorsements connect Students → Training Records → Instructors.
-- student_signer_address: the signer who submitted create_endorsement.
-- approved_by_signer_address: the signer who submitted approve_endorsement (instructor).
--
-- Endorsement Types validated at STM layer:
--   Discovery Flight Complete, Pre-Solo Review, Solo Ready, Cross Country Ready,
--   Night Training Complete, Instrument Training Complete,
--   Commercial Training Complete, CFI Training Complete

CREATE TABLE endorsement (
  id                          SERIAL        PRIMARY KEY,
  training_record_id          INTEGER       NOT NULL,
  student_signer_address      TEXT          NOT NULL,
  instructor_signer_address   TEXT          NOT NULL,
  approved_by_signer_address  TEXT,
  endorsement_type            TEXT          NOT NULL,
  status                      TEXT          NOT NULL DEFAULT 'pending',
  notes                       TEXT          NOT NULL DEFAULT '',
  created_at                  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  block_height                INTEGER       NOT NULL
);

CREATE INDEX endorsement_student_idx    ON endorsement (student_signer_address);
CREATE INDEX endorsement_instructor_idx ON endorsement (instructor_signer_address);
CREATE INDEX endorsement_training_idx   ON endorsement (training_record_id);

-- Opportunities: Student Requests and CFI Availability
-- Identity uses owner_signer_address (Effectstream signerAddress — chain-verified).
-- No wallet_address / userId / profileId accepted from browser input.

CREATE TABLE student_request (
  id                     SERIAL      PRIMARY KEY,
  owner_signer_address   TEXT        NOT NULL,
  aircraft_ident         TEXT        NOT NULL,
  notes                  TEXT        NOT NULL DEFAULT '',
  status                 TEXT        NOT NULL DEFAULT 'open',
  accepted_signer_address TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  block_height           INTEGER     NOT NULL
);

CREATE TABLE cfi_availability (
  id                     SERIAL      PRIMARY KEY,
  owner_signer_address   TEXT        NOT NULL,
  aircraft_ident         TEXT        NOT NULL,
  hourly_rate            NUMERIC(8,2) NOT NULL,
  notes                  TEXT        NOT NULL DEFAULT '',
  status                 TEXT        NOT NULL DEFAULT 'open',
  accepted_signer_address TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  block_height           INTEGER     NOT NULL
);

-- Aircraft Foundation (AIR-352)
-- Identity uses owner_signer_address (Effectstream signerAddress — chain-verified).
-- No walletAddress / userId / ownerAddress accepted from browser input.
--
-- Uniqueness strategy: tail_number is unique globally among active aircraft.
-- Rationale: In the real world, aircraft tail numbers (N-numbers, etc.) are
-- globally unique identifiers assigned by aviation authorities. Enforcing global
-- uniqueness among active records prevents accidental duplicate registrations
-- while allowing deactivated aircraft to free their tail number for historical
-- reference. A partial unique index covers only status = 'active' rows.

CREATE TABLE aircraft (
  id                     SERIAL      PRIMARY KEY,
  owner_signer_address   TEXT        NOT NULL,
  tail_number            TEXT        NOT NULL,
  manufacturer           TEXT        NOT NULL,
  model                  TEXT        NOT NULL,
  year                   INTEGER     NOT NULL,
  aircraft_category      TEXT        NOT NULL,
  status                 TEXT        NOT NULL DEFAULT 'active',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  block_height           INTEGER     NOT NULL
);

-- Global uniqueness of tail_number among active aircraft
CREATE UNIQUE INDEX aircraft_tail_number_active_unique
  ON aircraft (tail_number)
  WHERE status = 'active';

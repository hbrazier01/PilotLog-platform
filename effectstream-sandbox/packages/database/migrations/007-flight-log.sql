-- Flight Log Foundation (AIR-353)
-- Identity uses owner_signer_address (Effectstream signerAddress — chain-verified).
-- No walletAddress / userId / ownerAddress accepted from browser input.
--
-- Aircraft reference: flights reference aircraft by aircraft_id (FK to aircraft.id).
-- A pilot may log a flight against any active aircraft (rental, training, etc).
-- Aircraft ownership is NOT required to log a flight.

CREATE TABLE flight_log (
  id                    SERIAL        PRIMARY KEY,
  owner_signer_address  TEXT          NOT NULL,
  aircraft_id           INTEGER       NOT NULL,
  flight_date           DATE          NOT NULL,
  departure_airport     TEXT          NOT NULL,
  arrival_airport       TEXT          NOT NULL,
  total_time            NUMERIC(6,1)  NOT NULL DEFAULT 0,
  pic_time              NUMERIC(6,1)  NOT NULL DEFAULT 0,
  dual_received_time    NUMERIC(6,1)  NOT NULL DEFAULT 0,
  night_time            NUMERIC(6,1)  NOT NULL DEFAULT 0,
  instrument_time       NUMERIC(6,1)  NOT NULL DEFAULT 0,
  notes                 TEXT          NOT NULL DEFAULT '',
  status                TEXT          NOT NULL DEFAULT 'active',
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  block_height          INTEGER       NOT NULL
);

CREATE INDEX flight_log_owner_signer_idx ON flight_log (owner_signer_address);
CREATE INDEX flight_log_aircraft_idx ON flight_log (aircraft_id);

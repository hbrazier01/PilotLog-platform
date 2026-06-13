-- Pilot profiles: canonical identity keyed by wallet address (mn_addr)
-- wallet_address is the Midnight Network address (mn_addr_preprod... or mn_addr...)
-- This is the single source of truth for PilotLog user identity.
CREATE TABLE pilot_profile (
  wallet_address TEXT PRIMARY KEY,
  display_name   TEXT NOT NULL DEFAULT '',
  pilot_phase    TEXT NOT NULL DEFAULT '',
  notes          TEXT NOT NULL DEFAULT '',
  trust_score    INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

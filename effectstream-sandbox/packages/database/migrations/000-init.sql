CREATE TABLE pilot_profile (
  id SERIAL PRIMARY KEY,
  signer_address TEXT NOT NULL,
  display_name TEXT NOT NULL,
  pilot_phase TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  block_height INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

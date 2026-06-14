CREATE TABLE profile_log (
  id SERIAL PRIMARY KEY,
  signer TEXT NOT NULL,
  display_name TEXT NOT NULL,
  pilot_phase TEXT NOT NULL,
  block_height INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

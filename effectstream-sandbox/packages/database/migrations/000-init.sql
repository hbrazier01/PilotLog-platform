CREATE TABLE flights (
  flight_id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  aircraft_ident TEXT NOT NULL,
  airport_from TEXT NOT NULL,
  airport_to TEXT NOT NULL,
  total_time NUMERIC(6, 1) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

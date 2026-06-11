-- Active student requests (student seeking CFI instruction)
CREATE TABLE student_request (
  request_id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  aircraft_ident TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Completed student request lifecycle events (accepted or withdrawn)
CREATE TABLE student_request_history (
  history_id SERIAL PRIMARY KEY,
  request_id INT NOT NULL,
  wallet_address TEXT NOT NULL,
  cfi_wallet TEXT,
  aircraft_ident TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  event TEXT NOT NULL,
  event_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Active CFI availability listings (CFI offering instruction)
CREATE TABLE cfi_availability (
  availability_id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  aircraft_ident TEXT NOT NULL,
  hourly_rate NUMERIC(8, 2) NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Completed CFI availability lifecycle events (accepted or withdrawn)
CREATE TABLE cfi_availability_history (
  history_id SERIAL PRIMARY KEY,
  availability_id INT NOT NULL,
  wallet_address TEXT NOT NULL,
  student_wallet TEXT,
  aircraft_ident TEXT NOT NULL,
  hourly_rate NUMERIC(8, 2) NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  event TEXT NOT NULL,
  event_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

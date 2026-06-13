-- Migrate opportunity and flight tables from wallet_address to identity_id.
-- Any wallet that appears in these tables but lacks a pilot_identity row gets
-- one created automatically so back-fill can always complete.

-- ── Create identities for orphaned wallet addresses ───────────────────────────

-- flights
INSERT INTO pilot_identity (primary_wallet)
SELECT DISTINCT f.wallet_address FROM flights f
WHERE NOT EXISTS (
  SELECT 1 FROM identity_wallet iw
  WHERE iw.wallet_address = f.wallet_address AND iw.chain = 'midnight'
);
INSERT INTO identity_wallet (identity_id, chain, wallet_address, verification_status)
SELECT pi.identity_id, 'midnight', pi.primary_wallet, 'verified'
FROM pilot_identity pi
WHERE pi.primary_wallet IN (SELECT DISTINCT wallet_address FROM flights)
ON CONFLICT (chain, wallet_address) DO NOTHING;

-- student_request
INSERT INTO pilot_identity (primary_wallet)
SELECT DISTINCT sr.wallet_address FROM student_request sr
WHERE NOT EXISTS (
  SELECT 1 FROM identity_wallet iw
  WHERE iw.wallet_address = sr.wallet_address AND iw.chain = 'midnight'
);
INSERT INTO identity_wallet (identity_id, chain, wallet_address, verification_status)
SELECT pi.identity_id, 'midnight', pi.primary_wallet, 'verified'
FROM pilot_identity pi
WHERE pi.primary_wallet IN (SELECT DISTINCT wallet_address FROM student_request)
ON CONFLICT (chain, wallet_address) DO NOTHING;

-- student_request_history (student and cfi wallets)
INSERT INTO pilot_identity (primary_wallet)
SELECT DISTINCT srh.wallet_address FROM student_request_history srh
WHERE NOT EXISTS (
  SELECT 1 FROM identity_wallet iw
  WHERE iw.wallet_address = srh.wallet_address AND iw.chain = 'midnight'
);
INSERT INTO pilot_identity (primary_wallet)
SELECT DISTINCT srh.cfi_wallet FROM student_request_history srh
WHERE srh.cfi_wallet IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM identity_wallet iw
    WHERE iw.wallet_address = srh.cfi_wallet AND iw.chain = 'midnight'
  );
INSERT INTO identity_wallet (identity_id, chain, wallet_address, verification_status)
SELECT pi.identity_id, 'midnight', pi.primary_wallet, 'verified'
FROM pilot_identity pi
WHERE pi.primary_wallet IN (
  SELECT DISTINCT wallet_address FROM student_request_history
  UNION
  SELECT DISTINCT cfi_wallet FROM student_request_history WHERE cfi_wallet IS NOT NULL
)
ON CONFLICT (chain, wallet_address) DO NOTHING;

-- cfi_availability
INSERT INTO pilot_identity (primary_wallet)
SELECT DISTINCT ca.wallet_address FROM cfi_availability ca
WHERE NOT EXISTS (
  SELECT 1 FROM identity_wallet iw
  WHERE iw.wallet_address = ca.wallet_address AND iw.chain = 'midnight'
);
INSERT INTO identity_wallet (identity_id, chain, wallet_address, verification_status)
SELECT pi.identity_id, 'midnight', pi.primary_wallet, 'verified'
FROM pilot_identity pi
WHERE pi.primary_wallet IN (SELECT DISTINCT wallet_address FROM cfi_availability)
ON CONFLICT (chain, wallet_address) DO NOTHING;

-- cfi_availability_history (cfi and student wallets)
INSERT INTO pilot_identity (primary_wallet)
SELECT DISTINCT cah.wallet_address FROM cfi_availability_history cah
WHERE NOT EXISTS (
  SELECT 1 FROM identity_wallet iw
  WHERE iw.wallet_address = cah.wallet_address AND iw.chain = 'midnight'
);
INSERT INTO pilot_identity (primary_wallet)
SELECT DISTINCT cah.student_wallet FROM cfi_availability_history cah
WHERE cah.student_wallet IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM identity_wallet iw
    WHERE iw.wallet_address = cah.student_wallet AND iw.chain = 'midnight'
  );
INSERT INTO identity_wallet (identity_id, chain, wallet_address, verification_status)
SELECT pi.identity_id, 'midnight', pi.primary_wallet, 'verified'
FROM pilot_identity pi
WHERE pi.primary_wallet IN (
  SELECT DISTINCT wallet_address FROM cfi_availability_history
  UNION
  SELECT DISTINCT student_wallet FROM cfi_availability_history WHERE student_wallet IS NOT NULL
)
ON CONFLICT (chain, wallet_address) DO NOTHING;

-- ── flights ───────────────────────────────────────────────────────────────────
ALTER TABLE flights
  ADD COLUMN identity_id UUID REFERENCES pilot_identity(identity_id);

UPDATE flights f
SET identity_id = iw.identity_id
FROM identity_wallet iw
WHERE iw.wallet_address = f.wallet_address AND iw.chain = 'midnight';

ALTER TABLE flights
  ALTER COLUMN identity_id SET NOT NULL;

ALTER TABLE flights
  DROP COLUMN wallet_address;

-- ── student_request ───────────────────────────────────────────────────────────
ALTER TABLE student_request
  ADD COLUMN identity_id UUID REFERENCES pilot_identity(identity_id);

UPDATE student_request sr
SET identity_id = iw.identity_id
FROM identity_wallet iw
WHERE iw.wallet_address = sr.wallet_address AND iw.chain = 'midnight';

ALTER TABLE student_request
  ALTER COLUMN identity_id SET NOT NULL;

ALTER TABLE student_request
  DROP COLUMN wallet_address;

-- ── student_request_history ───────────────────────────────────────────────────
ALTER TABLE student_request_history
  ADD COLUMN identity_id UUID REFERENCES pilot_identity(identity_id),
  ADD COLUMN cfi_identity_id UUID REFERENCES pilot_identity(identity_id);

UPDATE student_request_history srh
SET identity_id = iw.identity_id
FROM identity_wallet iw
WHERE iw.wallet_address = srh.wallet_address AND iw.chain = 'midnight';

UPDATE student_request_history srh
SET cfi_identity_id = iw.identity_id
FROM identity_wallet iw
WHERE srh.cfi_wallet IS NOT NULL AND iw.wallet_address = srh.cfi_wallet AND iw.chain = 'midnight';

ALTER TABLE student_request_history
  ALTER COLUMN identity_id SET NOT NULL;

ALTER TABLE student_request_history
  DROP COLUMN wallet_address,
  DROP COLUMN cfi_wallet;

-- ── cfi_availability ──────────────────────────────────────────────────────────
ALTER TABLE cfi_availability
  ADD COLUMN identity_id UUID REFERENCES pilot_identity(identity_id);

UPDATE cfi_availability ca
SET identity_id = iw.identity_id
FROM identity_wallet iw
WHERE iw.wallet_address = ca.wallet_address AND iw.chain = 'midnight';

ALTER TABLE cfi_availability
  ALTER COLUMN identity_id SET NOT NULL;

ALTER TABLE cfi_availability
  DROP COLUMN wallet_address;

-- ── cfi_availability_history ──────────────────────────────────────────────────
ALTER TABLE cfi_availability_history
  ADD COLUMN identity_id UUID REFERENCES pilot_identity(identity_id),
  ADD COLUMN student_identity_id UUID REFERENCES pilot_identity(identity_id);

UPDATE cfi_availability_history cah
SET identity_id = iw.identity_id
FROM identity_wallet iw
WHERE iw.wallet_address = cah.wallet_address AND iw.chain = 'midnight';

UPDATE cfi_availability_history cah
SET student_identity_id = iw.identity_id
FROM identity_wallet iw
WHERE cah.student_wallet IS NOT NULL AND iw.wallet_address = cah.student_wallet AND iw.chain = 'midnight';

ALTER TABLE cfi_availability_history
  ALTER COLUMN identity_id SET NOT NULL;

ALTER TABLE cfi_availability_history
  DROP COLUMN wallet_address,
  DROP COLUMN student_wallet;

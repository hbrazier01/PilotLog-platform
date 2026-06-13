-- Canonical identity layer for PilotLog
-- Decouples pilot identity from a single wallet address so multiple chain
-- wallets can control one profile.

-- 1. Canonical identity record
CREATE TABLE pilot_identity (
  identity_id    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_wallet TEXT        NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Wallet links: one identity can have many wallets across chains
CREATE TABLE identity_wallet (
  id                  SERIAL      PRIMARY KEY,
  identity_id         UUID        NOT NULL REFERENCES pilot_identity(identity_id) ON DELETE CASCADE,
  chain               TEXT        NOT NULL DEFAULT 'midnight',
  wallet_address      TEXT        NOT NULL,
  verification_status TEXT        NOT NULL DEFAULT 'pending',
  linked_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (chain, wallet_address)
);

-- 3. Migrate pilot_profile to identity_id primary key.
--    For every existing profile, create a pilot_identity row keyed by the
--    existing wallet_address, then rewrite the profile row.
ALTER TABLE pilot_profile
  ADD COLUMN identity_id UUID REFERENCES pilot_identity(identity_id);

-- Back-fill: one identity per existing wallet_address.
INSERT INTO pilot_identity (primary_wallet)
SELECT DISTINCT wallet_address FROM pilot_profile;

-- Link those identities back to the profile rows.
UPDATE pilot_profile pp
SET identity_id = pi.identity_id
FROM pilot_identity pi
WHERE pp.wallet_address = pi.primary_wallet;

-- Also insert the wallet links for migrated identities.
INSERT INTO identity_wallet (identity_id, chain, wallet_address, verification_status)
SELECT identity_id, 'midnight', primary_wallet, 'verified'
FROM pilot_identity;

-- Make identity_id NOT NULL after back-fill.
ALTER TABLE pilot_profile
  ALTER COLUMN identity_id SET NOT NULL;

-- Drop old PK and promote identity_id.
ALTER TABLE pilot_profile
  DROP CONSTRAINT pilot_profile_pkey,
  ADD PRIMARY KEY (identity_id);

-- Keep wallet_address for historical reference but it is no longer the PK.

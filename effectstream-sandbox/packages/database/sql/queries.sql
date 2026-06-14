/* @name insertFlight */
INSERT INTO flights (identity_id, aircraft_ident, airport_from, airport_to, total_time)
VALUES (:identity_id!, :aircraft_ident!, :airport_from!, :airport_to!, :total_time!);

/* @name getAllFlights */
SELECT * FROM flights
ORDER BY flight_id DESC
LIMIT 100;

/* @name insertStudentRequest */
INSERT INTO student_request (identity_id, aircraft_ident, notes)
VALUES (:identity_id!, :aircraft_ident!, :notes!);

/* @name getStudentRequest */
SELECT * FROM student_request
WHERE request_id = :request_id!;

/* @name insertStudentRequestHistory */
INSERT INTO student_request_history (request_id, identity_id, cfi_identity_id, aircraft_ident, notes, event)
VALUES (:request_id!, :identity_id!, :cfi_identity_id, :aircraft_ident!, :notes!, :event!);

/* @name deleteStudentRequest */
DELETE FROM student_request
WHERE request_id = :request_id!;

/* @name insertCfiAvailability */
INSERT INTO cfi_availability (identity_id, aircraft_ident, hourly_rate, notes)
VALUES (:identity_id!, :aircraft_ident!, :hourly_rate!, :notes!);

/* @name getCfiAvailability */
SELECT * FROM cfi_availability
WHERE availability_id = :availability_id!;

/* @name insertCfiAvailabilityHistory */
INSERT INTO cfi_availability_history (availability_id, identity_id, student_identity_id, aircraft_ident, hourly_rate, notes, event)
VALUES (:availability_id!, :identity_id!, :student_identity_id, :aircraft_ident!, :hourly_rate!, :notes!, :event!);

/* @name deleteCfiAvailability */
DELETE FROM cfi_availability
WHERE availability_id = :availability_id!;

/* @name getAllStudentRequests */
SELECT * FROM student_request
ORDER BY request_id DESC
LIMIT 100;

/* @name getAllCfiAvailability */
SELECT * FROM cfi_availability
ORDER BY availability_id DESC
LIMIT 100;

/* @name upsertProfile */
INSERT INTO pilot_profile (wallet_address, display_name, pilot_phase, notes)
VALUES (:wallet_address!, :display_name!, :pilot_phase!, :notes!)
ON CONFLICT (wallet_address) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  pilot_phase  = EXCLUDED.pilot_phase,
  notes        = EXCLUDED.notes,
  updated_at   = NOW();

/* @name getProfile */
SELECT * FROM pilot_profile
WHERE wallet_address = :wallet_address!;

/* @name getProfileByIdentityId */
SELECT * FROM pilot_profile
WHERE identity_id = :identity_id!;

/* @name getAllProfiles */
SELECT * FROM pilot_profile
ORDER BY created_at DESC
LIMIT 100;

/* @name createIdentity */
INSERT INTO pilot_identity (primary_wallet)
VALUES (:primary_wallet!)
RETURNING identity_id, primary_wallet, created_at;

/* @name getIdentityByWallet */
SELECT pi.identity_id, pi.primary_wallet, pi.created_at
FROM pilot_identity pi
JOIN identity_wallet iw ON iw.identity_id = pi.identity_id
WHERE iw.wallet_address = :wallet_address! AND iw.chain = :chain!;

/* @name getIdentityByWalletAny */
SELECT pi.identity_id, pi.primary_wallet, pi.created_at
FROM pilot_identity pi
JOIN identity_wallet iw ON iw.identity_id = pi.identity_id
WHERE iw.wallet_address = :wallet_address!
LIMIT 1;

/* @name linkWallet */
INSERT INTO identity_wallet (identity_id, chain, wallet_address, verification_status)
VALUES (:identity_id!, :chain!, :wallet_address!, :verification_status!)
ON CONFLICT (chain, wallet_address) DO NOTHING;

/* @name unlinkWallet */
DELETE FROM identity_wallet
WHERE identity_id = :identity_id! AND chain = :chain! AND wallet_address = :wallet_address!;

/* @name getWalletsByIdentity */
SELECT * FROM identity_wallet
WHERE identity_id = :identity_id!
ORDER BY linked_at ASC;

/* @name upsertProfileByIdentityId */
INSERT INTO pilot_profile (identity_id, wallet_address, display_name, pilot_phase, notes)
VALUES (:identity_id!, :wallet_address!, :display_name!, :pilot_phase!, :notes!)
ON CONFLICT (identity_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  pilot_phase  = EXCLUDED.pilot_phase,
  notes        = EXCLUDED.notes,
  updated_at   = NOW();

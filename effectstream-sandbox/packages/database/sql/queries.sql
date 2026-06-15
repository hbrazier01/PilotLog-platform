/* @name insertProfile */
INSERT INTO pilot_profile (signer_address, display_name, pilot_phase, notes, block_height)
VALUES (:signer_address!, :display_name!, :pilot_phase!, :notes!, :block_height!);

/* @name getAllProfiles */
SELECT * FROM pilot_profile
ORDER BY id DESC
LIMIT 100;

/* @name getProfileBySigner */
SELECT * FROM pilot_profile
WHERE signer_address = :signer_address!
ORDER BY id DESC
LIMIT 1;

/* @name insertStudentRequest */
INSERT INTO student_request (owner_signer_address, aircraft_ident, notes, block_height)
VALUES (:owner_signer_address!, :aircraft_ident!, :notes!, :block_height!);

/* @name acceptStudentRequest */
UPDATE student_request SET status = 'accepted', accepted_signer_address = :accepted_signer_address!, updated_at = NOW() WHERE id = :id! AND status = 'open';

/* @name withdrawStudentRequest */
UPDATE student_request SET status = 'withdrawn', updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'open';

/* @name getAllStudentRequests */
SELECT * FROM student_request ORDER BY id DESC LIMIT 100;

/* @name insertCfiAvailability */
INSERT INTO cfi_availability (owner_signer_address, aircraft_ident, hourly_rate, notes, block_height)
VALUES (:owner_signer_address!, :aircraft_ident!, :hourly_rate!, :notes!, :block_height!);

/* @name acceptCfiAvailability */
UPDATE cfi_availability SET status = 'accepted', accepted_signer_address = :accepted_signer_address!, updated_at = NOW() WHERE id = :id! AND status = 'open';

/* @name withdrawCfiAvailability */
UPDATE cfi_availability SET status = 'withdrawn', updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'open';

/* @name getAllCfiAvailability */
SELECT * FROM cfi_availability ORDER BY id DESC LIMIT 100;

/* @name insertAircraft */
INSERT INTO aircraft (owner_signer_address, tail_number, manufacturer, model, year, aircraft_category, block_height)
VALUES (:owner_signer_address!, :tail_number!, :manufacturer!, :model!, :year!, :aircraft_category!, :block_height!);

/* @name updateAircraft */
UPDATE aircraft SET manufacturer = :manufacturer!, model = :model!, year = :year!, aircraft_category = :aircraft_category!, updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'active';

/* @name deactivateAircraft */
UPDATE aircraft SET status = 'inactive', updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'active';

/* @name getAllAircraft */
SELECT * FROM aircraft WHERE status = 'active' ORDER BY id DESC LIMIT 100;

/* @name getAircraftById */
SELECT * FROM aircraft WHERE id = :id!;

/* @name getAircraftBySigner */
SELECT * FROM aircraft WHERE owner_signer_address = :owner_signer_address! AND status = 'active' ORDER BY id DESC LIMIT 100;

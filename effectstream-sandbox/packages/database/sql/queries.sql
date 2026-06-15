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

-- ── Flight Log (AIR-353) ───────────────────────────────────────────────────────

/* @name insertFlightLog */
INSERT INTO flight_log (owner_signer_address, aircraft_id, flight_date, departure_airport, arrival_airport, total_time, pic_time, dual_received_time, night_time, instrument_time, notes, block_height)
VALUES (:owner_signer_address!, :aircraft_id!, :flight_date!, :departure_airport!, :arrival_airport!, :total_time!, :pic_time!, :dual_received_time!, :night_time!, :instrument_time!, :notes!, :block_height!);

/* @name updateFlightLog */
UPDATE flight_log SET aircraft_id = :aircraft_id!, flight_date = :flight_date!, departure_airport = :departure_airport!, arrival_airport = :arrival_airport!, total_time = :total_time!, pic_time = :pic_time!, dual_received_time = :dual_received_time!, night_time = :night_time!, instrument_time = :instrument_time!, notes = :notes!, updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'active';

/* @name voidFlightLog */
UPDATE flight_log SET status = 'voided', updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'active';

/* @name getAllFlights */
SELECT * FROM flight_log WHERE status = 'active' ORDER BY id DESC LIMIT 100;

/* @name getFlightById */
SELECT * FROM flight_log WHERE id = :id!;

/* @name getFlightsBySigner */
SELECT * FROM flight_log WHERE owner_signer_address = :owner_signer_address! ORDER BY id DESC LIMIT 100;

/* @name getFlightsByAircraft */
SELECT * FROM flight_log WHERE aircraft_id = :aircraft_id! AND status = 'active' ORDER BY id DESC LIMIT 100;

-- ── Training Records (AIR-354) ─────────────────────────────────────────────────

/* @name insertTrainingRecord */
INSERT INTO training_record (student_signer_address, instructor_signer_address, flight_log_id, aircraft_id, training_type, notes, block_height)
SELECT :student_signer_address!, :instructor_signer_address!, :flight_log_id!, fl.aircraft_id, :training_type!, :notes!, :block_height!
FROM flight_log fl WHERE fl.id = :flight_log_id! AND fl.status = 'active';

/* @name updateTrainingRecord */
UPDATE training_record SET training_type = :training_type!, notes = :notes!, updated_at = NOW() WHERE id = :id! AND student_signer_address = :student_signer_address! AND status = 'active';

/* @name completeTrainingRecord */
UPDATE training_record SET status = 'completed', updated_at = NOW() WHERE id = :id! AND student_signer_address = :student_signer_address! AND status = 'active';

/* @name getAllTrainingRecords */
SELECT * FROM training_record WHERE status = 'active' ORDER BY id DESC LIMIT 100;

/* @name getTrainingRecordById */
SELECT * FROM training_record WHERE id = :id!;

/* @name getTrainingRecordsBySigner */
SELECT * FROM training_record WHERE student_signer_address = :student_signer_address! ORDER BY id DESC LIMIT 100;

/* @name getTrainingRecordsByFlight */
SELECT * FROM training_record WHERE flight_log_id = :flight_log_id! ORDER BY id DESC LIMIT 100;

/* @name insertEndorsement */
INSERT INTO endorsement (training_record_id, student_signer_address, instructor_signer_address, endorsement_type, notes, block_height)
SELECT :training_record_id!, :student_signer_address!, tr.instructor_signer_address, :endorsement_type!, :notes!, :block_height!
FROM training_record tr WHERE tr.id = :training_record_id! AND tr.status = 'active';

/* @name approveEndorsement */
UPDATE endorsement SET status = 'approved', approved_by_signer_address = :approved_by_signer_address!, updated_at = NOW()
WHERE id = :id! AND instructor_signer_address = :approved_by_signer_address! AND status = 'pending';

/* @name rejectEndorsement */
UPDATE endorsement SET status = 'rejected', approved_by_signer_address = :approved_by_signer_address!, updated_at = NOW()
WHERE id = :id! AND instructor_signer_address = :approved_by_signer_address! AND status = 'pending';

/* @name getAllEndorsements */
SELECT * FROM endorsement ORDER BY id DESC LIMIT 100;

/* @name getEndorsementById */
SELECT * FROM endorsement WHERE id = :id!;

/* @name getEndorsementsBySigner */
SELECT * FROM endorsement WHERE student_signer_address = :student_signer_address! OR instructor_signer_address = :student_signer_address! ORDER BY id DESC LIMIT 100;

/* @name getEndorsementsByTrainingRecord */
SELECT * FROM endorsement WHERE training_record_id = :training_record_id! ORDER BY id DESC LIMIT 100;

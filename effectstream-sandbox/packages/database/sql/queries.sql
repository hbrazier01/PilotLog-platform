/* @name insertFlight */
INSERT INTO flights (wallet_address, aircraft_ident, airport_from, airport_to, total_time)
VALUES (:wallet_address!, :aircraft_ident!, :airport_from!, :airport_to!, :total_time!);

/* @name getAllFlights */
SELECT * FROM flights
ORDER BY flight_id DESC
LIMIT 100;

/* @name insertStudentRequest */
INSERT INTO student_request (wallet_address, aircraft_ident, notes)
VALUES (:wallet_address!, :aircraft_ident!, :notes!);

/* @name getStudentRequest */
SELECT * FROM student_request
WHERE request_id = :request_id!;

/* @name insertStudentRequestHistory */
INSERT INTO student_request_history (request_id, wallet_address, cfi_wallet, aircraft_ident, notes, event)
VALUES (:request_id!, :wallet_address!, :cfi_wallet, :aircraft_ident!, :notes!, :event!);

/* @name deleteStudentRequest */
DELETE FROM student_request
WHERE request_id = :request_id!;

/* @name insertCfiAvailability */
INSERT INTO cfi_availability (wallet_address, aircraft_ident, hourly_rate, notes)
VALUES (:wallet_address!, :aircraft_ident!, :hourly_rate!, :notes!);

/* @name getCfiAvailability */
SELECT * FROM cfi_availability
WHERE availability_id = :availability_id!;

/* @name insertCfiAvailabilityHistory */
INSERT INTO cfi_availability_history (availability_id, wallet_address, student_wallet, aircraft_ident, hourly_rate, notes, event)
VALUES (:availability_id!, :wallet_address!, :student_wallet, :aircraft_ident!, :hourly_rate!, :notes!, :event!);

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

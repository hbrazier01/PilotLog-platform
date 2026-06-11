/* @name insertFlight */
INSERT INTO flights (wallet_address, aircraft_ident, airport_from, airport_to, total_time)
VALUES (:wallet_address!, :aircraft_ident!, :airport_from!, :airport_to!, :total_time!);

/* @name getAllFlights */
SELECT * FROM flights
ORDER BY flight_id DESC
LIMIT 100;

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

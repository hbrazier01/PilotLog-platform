/* @name insertProfile */
INSERT INTO profile_log (signer, display_name, pilot_phase, block_height)
VALUES (:signer!, :display_name!, :pilot_phase!, :block_height!);

/* @name getAllProfiles */
SELECT * FROM profile_log
ORDER BY id DESC
LIMIT 100;

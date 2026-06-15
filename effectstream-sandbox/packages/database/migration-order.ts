import type { DBMigrations } from "@effectstream/runtime";
import initSql from "./migrations/000-init.sql" with { type: "text" };
import opportunitiesSql from "./migrations/005-opportunities.sql" with { type: "text" };
import aircraftSql from "./migrations/006-aircraft.sql" with { type: "text" };
import flightLogSql from "./migrations/007-flight-log.sql" with { type: "text" };
import trainingRecordSql from "./migrations/008-training-record.sql" with { type: "text" };
import endorsementSql from "./migrations/009-endorsement.sql" with { type: "text" };

export const migrationTable: DBMigrations[] = [
  { name: "000-init.sql", sql: initSql },
  { name: "005-opportunities.sql", sql: opportunitiesSql },
  { name: "006-aircraft.sql", sql: aircraftSql },
  { name: "007-flight-log.sql", sql: flightLogSql },
  { name: "008-training-record.sql", sql: trainingRecordSql },
  { name: "009-endorsement.sql", sql: endorsementSql },
];

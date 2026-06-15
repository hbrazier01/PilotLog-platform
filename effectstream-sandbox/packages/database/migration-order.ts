import type { DBMigrations } from "@effectstream/runtime";
import initSql from "./migrations/000-init.sql" with { type: "text" };
import opportunitiesSql from "./migrations/005-opportunities.sql" with { type: "text" };
import aircraftSql from "./migrations/006-aircraft.sql" with { type: "text" };

export const migrationTable: DBMigrations[] = [
  { name: "000-init.sql", sql: initSql },
  { name: "005-opportunities.sql", sql: opportunitiesSql },
  { name: "006-aircraft.sql", sql: aircraftSql },
];

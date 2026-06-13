import type { DBMigrations } from "@effectstream/runtime";
import initSql from "./migrations/000-init.sql" with { type: "text" };
import offerFileSql from "./migrations/001-offer-file.sql" with { type: "text" };
import profilesSql from "./migrations/002-profiles.sql" with { type: "text" };

export const migrationTable: DBMigrations[] = [
  { name: "000-init.sql", sql: initSql },
  { name: "001-offer-file.sql", sql: offerFileSql },
  { name: "002-profiles.sql", sql: profilesSql },
];

import { nodeModulesPolyfillPlugin } from "esbuild-plugins-node-modules-polyfill";
import { build } from "esbuild";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve @effectstream/wallets from the effectstream-reference monorepo that
// lives alongside effectstream-sandbox inside the PilotLog project root.
// Path: frontend/ -> packages/ -> effectstream-sandbox/ -> Pilotlog/ -> effectstream-reference/
const walletsPkg = path.resolve(
  __dirname,
  "../../../effectstream-reference/packages/effectstream-sdk/wallets",
);

if (!existsSync(walletsPkg)) {
  console.error("[esbuild] @effectstream/wallets not found at:", walletsPkg);
  console.error("  Expected effectstream-reference to be sibling of effectstream-sandbox.");
  process.exit(1);
}

await build({
  entryPoints: ["./index.js"],
  bundle: true,
  outfile: "dist/min.js",
  sourcemap: true,
  format: "esm",
  loader: {
    ".wasm": "file",
  },
  // @effectstream/wallets declares Cardano wallet helpers as optional peer deps.
  // Midnight deps (@midnight-ntwrk/*) are required for WalletMode.Midnight.
  external: [
    "@lucid-evolution/*",
    "@effectstream/midnight-contracts",
    "@effectstream/midnight-contracts/*",
  ],
  alias: {
    "@effectstream/wallets": `${walletsPkg}/src/mod.ts`,
  },
  plugins: [
    nodeModulesPolyfillPlugin({
      globals: {
        process: true,
        Buffer: true,
      },
    }),
  ],
});

import { cp } from "node:fs/promises";
await cp("./index.html", "./dist/index.html");
await cp("./style.css", "./dist/style.css");

console.log("Frontend built to ./dist");

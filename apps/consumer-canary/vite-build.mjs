import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, ".vite-out");

await build({
  root: here,
  configFile: false,
  logLevel: "error",
  build: {
    lib: {
      entry: join(here, "vite-entry.js"),
      formats: ["es"],
      fileName: "canary",
    },
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});

const js = readFileSync(join(outDir, "canary.js"), "utf8");
if (!js.includes("cs-button") && !js.includes("Button")) {
  throw new Error("vite canary bundle did not keep Button");
}
console.log("PASS consumer-canary vite", { bytes: Buffer.byteLength(js) });

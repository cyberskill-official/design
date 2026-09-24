import { copyFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const require18 = createRequire(join(here, "package.json"));
const React = require18("react");
const { renderToString } = require18("react-dom/server");

const copied = join(here, "provider.generated.js");
copyFileSync(join(here, "../../../components/_theme/provider.js"), copied);
const { ThemeProvider, getThemeInitScript } = await import(pathToFileURL(copied).href);

if (!String(React.version).startsWith("18")) {
  throw new Error("expected React 18, got " + React.version);
}
const html = renderToString(
  React.createElement(ThemeProvider, { theme: "light", dir: "ltr" }, "canary-18"),
);
if (!html.includes("data-theme") || !html.includes("cs-root")) {
  throw new Error("react-18 SSR missing theme root: " + html.slice(0, 200));
}
if (!getThemeInitScript().includes("prefers-color-scheme")) {
  throw new Error("react-18 missing no-flash script");
}
console.log("PASS consumer-canary react-18 ssr", { react: React.version });

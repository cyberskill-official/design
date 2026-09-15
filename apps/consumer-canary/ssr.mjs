import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const requireRoot = createRequire(join(root, "package.json"));
const React = requireRoot("react");
const { renderToString } = requireRoot("react-dom/server");

const compiled = existsSync(join(root, "packages/themes/dist/provider.js"));
const themeMod = compiled
  ? await import("@cyberskill/themes")
  : await import("../../components/_theme/provider.js");
const { ThemeProvider, getThemeInitScript } = themeMod;

if (!String(React.version).startsWith("19") && !String(React.version).startsWith("18")) {
  throw new Error("expected host React 18/19, got " + React.version);
}
const html = renderToString(
  React.createElement(ThemeProvider, { theme: "dark", contrast: "high" }, "canary-host"),
);
if (!html.includes("data-theme") || !html.includes("cs-root")) {
  throw new Error("consumer-canary SSR missing theme root");
}
const boot = getThemeInitScript({ defaultTheme: "system" });
if (!boot.includes("prefers-color-scheme")) {
  throw new Error("consumer-canary missing no-flash script");
}
console.log("PASS consumer-canary ssr", { react: React.version, themes: compiled ? "workspace" : "source" });

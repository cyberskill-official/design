import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ThemeProvider, getThemeInitScript } from "../../components/_theme/provider.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const requireRoot = createRequire(join(root, "package.json"));
const React = requireRoot("react");
const { renderToString } = requireRoot("react-dom/server");

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
console.log("PASS consumer-canary ssr", { react: React.version });

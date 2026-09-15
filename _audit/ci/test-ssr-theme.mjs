#!/usr/bin/env node
import React from "react";
import { renderToString } from "react-dom/server";
import { ThemeProvider, getThemeInitScript, resolveTheme } from "../../components/_theme/provider.js";

function assert(c, m) {
  if (!c) throw new Error(m);
}

const html = renderToString(
  React.createElement(ThemeProvider, { theme: "dark", contrast: "high", dir: "rtl", element: "hoa", variant: "plasma" }, "ok"),
);
assert(html.includes("data-theme"), "ssr emits data-theme");
assert(html.includes("cs-root"), "ssr emits scoped root");
assert(html.includes("data-cs-element"), "ssr emits elemental brand pack");
assert(html.includes("plasma"), "ssr emits brand variant");
assert(!html.includes("<script>"), "provider markup is script-free");

const boot = getThemeInitScript({ defaultTheme: "system", defaultElement: "hoa", defaultVariant: "plasma" });
assert(boot.includes("localStorage"), "init script reads storage");
assert(boot.includes("data-theme"), "init script sets data-theme");
assert(boot.includes("prefers-color-scheme"), "system theme");
assert(boot.includes("data-cs-element"), "init script can set brand pack");

assert(resolveTheme("dark") === "dark", "resolve dark");
assert(typeof resolveTheme("system") === "string", "resolve system");

const reactVersion = React.version || "";
assert(reactVersion.startsWith("18") || reactVersion.startsWith("19"), "React 18/19 host, got " + reactVersion);

console.log("PASS test-ssr-theme", { react: reactVersion });

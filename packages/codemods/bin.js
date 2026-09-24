#!/usr/bin/env node
import { renameImport } from "./transforms/rename-import.js";
import { wrapThemeProvider } from "./transforms/wrap-theme-provider.js";

const [, , name, ...rest] = process.argv;
const transforms = { "rename-import": renameImport, "wrap-theme-provider": wrapThemeProvider };
const fn = transforms[name];
if (!fn) {
  console.error("Usage: cyberskill-codemod <rename-import|wrap-theme-provider> [...files]");
  process.exit(1);
}
const result = fn(rest);
if (result && result.message) console.log(result.message);

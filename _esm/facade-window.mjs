/**
 * Compatibility-facade deprecation. Dates match docs/facade-migration.json.
 * Importing the default @cyberskill/design entry warns once per process.
 */
export const FACADE_WINDOW_START = "2026-09-13";
export const FACADE_WINDOW_END = "2027-03-13";

let warned = false;

export function warnFacadeOnce() {
  if (warned) return;
  warned = true;
  const msg =
    `@cyberskill/design is a compatibility facade until ${FACADE_WINDOW_END}. ` +
    "New apps should install @cyberskill/react, @cyberskill/tokens, and @cyberskill/themes.";
  if (typeof process !== "undefined" && typeof process.emitWarning === "function") {
    process.emitWarning(msg, { code: "CYBERSKILL_FACADE", type: "DeprecationWarning" });
  }
}

warnFacadeOnce();

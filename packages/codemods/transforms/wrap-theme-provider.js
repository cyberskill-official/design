import fs from "node:fs";

const MARKER = "/* cyberskill-theme-provider */";

export function wrapThemeProvider(files) {
  let changed = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    if (src.includes("ThemeProvider") || src.includes(MARKER)) continue;
    if (!src.includes("createRoot") && !src.includes("hydrateRoot")) continue;
    const next = `import { ThemeProvider } from "@cyberskill/themes";\n${MARKER}\n${src}`;
    fs.writeFileSync(file, next);
    changed += 1;
  }
  return { changed, message: `wrap-theme-provider: ${changed} file(s)` };
}

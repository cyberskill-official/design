import fs from "node:fs";

const MAP = {
  "@cyberskill/design": "@cyberskill/react",
};

export function renameImport(files) {
  let changed = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    let next = src;
    for (const [from, to] of Object.entries(MAP)) {
      next = next.replaceAll(`from "${from}"`, `from "${to}"`);
      next = next.replaceAll(`from '${from}'`, `from '${to}'`);
    }
    if (next !== src) {
      fs.writeFileSync(file, next);
      changed += 1;
    }
  }
  return { changed, message: `rename-import: ${changed} file(s)` };
}

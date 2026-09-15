const PACKS = [
  {
    "element": "tho",
    "intensity": "soft",
    "name": "sand",
    "label": "Thổ · Earth"
  },
  {
    "element": "tho",
    "intensity": "middle",
    "name": "studio",
    "label": "Thổ · Earth"
  },
  {
    "element": "tho",
    "intensity": "deep",
    "name": "clay",
    "label": "Thổ · Earth"
  },
  {
    "element": "hoa",
    "intensity": "soft",
    "name": "plasma",
    "label": "Hỏa · Fire"
  },
  {
    "element": "hoa",
    "intensity": "middle",
    "name": "ember",
    "label": "Hỏa · Fire"
  },
  {
    "element": "hoa",
    "intensity": "deep",
    "name": "lava",
    "label": "Hỏa · Fire"
  },
  {
    "element": "thuy",
    "intensity": "soft",
    "name": "mist",
    "label": "Thủy · Water"
  },
  {
    "element": "thuy",
    "intensity": "middle",
    "name": "river",
    "label": "Thủy · Water"
  },
  {
    "element": "thuy",
    "intensity": "deep",
    "name": "ocean",
    "label": "Thủy · Water"
  },
  {
    "element": "moc",
    "intensity": "soft",
    "name": "bamboo",
    "label": "Mộc · Wood"
  },
  {
    "element": "moc",
    "intensity": "middle",
    "name": "leaf",
    "label": "Mộc · Wood"
  },
  {
    "element": "moc",
    "intensity": "deep",
    "name": "forest",
    "label": "Mộc · Wood"
  },
  {
    "element": "kim",
    "intensity": "soft",
    "name": "titanium",
    "label": "Kim · Metal"
  },
  {
    "element": "kim",
    "intensity": "middle",
    "name": "champagne",
    "label": "Kim · Metal"
  },
  {
    "element": "kim",
    "intensity": "deep",
    "name": "steel",
    "label": "Kim · Metal"
  }
];

export function listBrandPacks() {
  return PACKS.slice();
}

export function resolveBrandPack(input) {
  if (input == null || input === "") return null;
  if (typeof input === "object") {
    return (
      PACKS.find((p) => p.element === input.element && (
        input.name ? p.name === input.name : input.intensity ? p.intensity === input.intensity : p.intensity === "middle"
      )) || null
    );
  }
  const key = String(input);
  return (
    PACKS.find((p) => p.name === key) ||
    PACKS.find((p) => p.element + ":" + p.intensity === key) ||
    PACKS.find((p) => p.element === key && p.intensity === "middle") ||
    null
  );
}

export function applyBrandPack(input, root) {
  const pack = resolveBrandPack(input);
  if (!pack || !root || typeof root.setAttribute !== "function") return null;
  root.setAttribute("data-cs-element", pack.element);
  if (pack.intensity === "middle") root.removeAttribute("data-cs-variant");
  else root.setAttribute("data-cs-variant", pack.name);
  return pack;
}

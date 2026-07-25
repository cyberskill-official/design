# Product registry — element mapping

> **Locked** (Jul 2026). Canonical product → element registry for agents and kits. Do **not** invent new product → element assignments; add or change rows only via a maintainer decision in `docs/decisions.md`.

**Source of truth.** Maps CyberSkill portfolio products to Ngũ Hành element packs. One element per product; secondary accents only in gradient washes along Tương sinh.

| Product | Element | Variant | Slot | Secondary (Tương sinh) | Markup |
|---|---|---|---|---|---|
| **Lumi** — wish assistant | Hỏa · fire | plasma | soft | tho | `data-cs-element="hoa" data-cs-variant="plasma"` |
| **Status Hub** — client portfolio portal | Thủy · water | river (default) | middle | moc | `data-cs-element="thuy"` |
| **CyberOS Agent Spine** — agent infra, memory, gates | Kim · metal | steel | deep | thuy | `data-cs-element="kim" data-cs-variant="steel"` |
| **CyberSkill Design System** — this library | Mộc · wood | leaf (default) | middle | hoa | `data-cs-element="moc"` |
| **cyberskill.world** — the studio site | Thổ · earth | studio (default) | middle | — | *(no attributes — studio is Thổ)* |
| **Client delivery suite** — kickoff · QBR · runbooks | Thổ · earth | clay | deep | kim | `data-cs-element="tho" data-cs-variant="clay"` |
| **Board / investor collateral** | Kim · metal | champagne (default) | middle | thuy | `data-cs-element="kim"` |
| **HR / employment instruments** | Mộc · wood | bamboo | soft | hoa | `data-cs-element="moc" data-cs-variant="bamboo"` |

**Slots** (soft / middle / deep) are the shared intensity ladder — see [`docs/design-styles.md`](design-styles.md). Public variant names stay stable; packs are generated from `tokens/element-seeds.json`.

**Why these:** Lumi is conversational spark (plasma). Status Hub is calm status flow (Thủy). Agent Spine is precision infrastructure (Kim·steel). Design System grows everything else (Mộc). Studio brand is Thổ. Delivery is grounded earth (clay). Board collateral is metal precision. HR instruments grow people (bamboo).

## Scope

- **UI kits stay Thổ-faithful.** `ui_kits/status-hub` and `ui_kits/website` remain Thổ recreations; per-element demos live in **Identity Lab** / Storybook Live.

- **Consuming a mapping:** scope the product root with the row's Markup and consume `--cs-accent-*`.

- Tương khắc pairs (Hỏa×Thủy · Kim×Mộc · Thổ×Thủy · Mộc×Thổ · Hỏa×Kim) are never combined as primary + secondary.

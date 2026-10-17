---
name: ui-styling
description: Compose or revise CyberSkill interfaces with existing CSS tokens, classes
  and React components.
license: MIT
metadata:
  author: claudekit
  version: 1.0.0
---

# CyberSkill ui-styling

Read the [shared CyberSkill entrypoint](../../../SKILL.md) first, then [design doctrine](../../../docs/doctrine.md). These are the canonical design contract; repository governance and user authorization still apply.

Choose static HTML or React using [consumer setup](../../../docs/consuming.md). Inspect the selected component contract and [base styles](../../../base/) before adding overrides. Reuse CyberSkill components and `--cs-*` tokens; test keyboard, focus, responsive, language and theme states relevant to the change.

The other scripts, data, templates and references in this skill directory are retained upstream resources, not CyberSkill defaults or normative instructions. Consult them only for a task-specific need after checking compatibility with the shared contract. Their installation, external-tool and framework commands are not prerequisites for this adapter. Existing upstream license and attribution files remain applicable.

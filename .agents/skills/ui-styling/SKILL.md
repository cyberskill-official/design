---
name: ui-styling
description: Compose or revise CyberSkill interfaces with existing CSS tokens, classes
  and React components.
metadata:
  author: claudekit
  version: 1.0.0
---

# CyberSkill ui-styling

Read the [shared CyberSkill entrypoint](../../../SKILL.md) first, then [design doctrine](../../../docs/doctrine.md). These are the canonical design contract; repository governance and user authorization still apply.

Choose static HTML or React using [consumer setup](../../../docs/consuming.md). Inspect the selected component contract and [base styles](../../../base/) before adding overrides. Reuse CyberSkill components and `--cs-*` tokens; test keyboard, focus, responsive, language and theme states relevant to the change.

Optional upstream scripts, data, templates and references are preserved outside skill discovery in [the repository-only archive](../../../vendor/skill-resources/). Read its inventory and licensing limitations before consulting a resource. The archive does not supply CyberSkill defaults or normative instructions; installation and framework commands in retained material are not prerequisites or authorization for this adapter.

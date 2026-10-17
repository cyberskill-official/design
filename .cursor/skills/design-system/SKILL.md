---
name: design-system
description: Revise CyberSkill tokens and component contracts using the repository
  doctrine and existing generators.
license: MIT
metadata:
  author: claudekit
  version: 1.0.0
---

# CyberSkill design-system

Read the [shared CyberSkill entrypoint](../../../SKILL.md) first, then [design doctrine](../../../docs/doctrine.md). These are the canonical design contract; repository governance and user authorization still apply.

For token work, inspect [tokens](../../../tokens/) and the relevant generator in [scripts](../../../scripts/). For a component, inspect its JSX, declaration and prompt together in [components](../../../components/). Apply the expansion and verification requirements in doctrine; preserve generated/source boundaries.

The other scripts, data, templates and references in this skill directory are retained upstream resources, not CyberSkill defaults or normative instructions. Consult them only for a task-specific need after checking compatibility with the shared contract. Their installation, external-tool and framework commands are not prerequisites for this adapter. Existing upstream license and attribution files remain applicable.

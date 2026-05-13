# Module Documentation Template

Use this template when adding a new module guide under `docs/modules`.

Keep the document short, concrete, and focused on boundaries and behavior. Remove sections that do not apply.

## Writing Guidance

- Match the title to the existing naming pattern, such as `# Chat Module` or `# Frontend Chat Module`.
- Describe the module as it exists today rather than listing intended future work.
- Prefer naming the main entry points and responsibilities over exhaustively listing every file.
- Keep the flow in `How It Works` to the main runtime path that another developer would need to understand first.

## Template

```md
# <Module Name>

## Purpose

Describe the responsibility of the module in one or two sentences.

## Main Components

- List the main public entry points and important internal building blocks.
- Backend examples: controllers, services, gateways, entities, repositories.
- Frontend examples: screens, components, hooks, services, models.
- Shared package examples: exported folders, contract groups, constants, utilities.

## How It Works

1. Describe the primary entry point or trigger.
2. Describe the main orchestration step.
3. Describe important transformations, persistence, or transport boundaries.
4. Describe the final output or side effect.

## Dependencies

- List only important module, package, or infrastructure dependencies.
- Omit this section if it would not add useful context.

## Notes

- Capture important caveats, constraints, testing helpers, or implementation details worth knowing.
- Omit this section if there is nothing notable to add.
```

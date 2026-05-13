# Pattern Documentation Template

Use this template when adding a new reusable guideline under `docs/patterns`.

Pattern docs should explain the preferred rule, why it exists, and what to avoid. Keep them practical and grounded in the current codebase.

## Writing Guidance

- Name the document after the rule or convention it captures, such as `# Backend Testing Patterns`.
- Keep recommendations prescriptive and easy to scan.
- Choose the optional sections that best fit the pattern instead of forcing every heading.
- Include examples only when they make the rule easier to apply.

## Template

```md
# <Pattern Name>

## Purpose

Explain what this pattern covers, where it applies, and what problem it solves.

## Recommended Rule

- State the preferred default clearly.
- Use actionable bullets.

## Why This Rule Exists

- Explain the architectural boundary, maintenance concern, or failure mode this pattern protects.

## Recommended Structure Or Usage Pattern

- Describe the expected folder placement, ownership, naming, or usage shape.
- Add a short code or directory example when it clarifies the rule.

## Example

- Provide a short example from the current codebase or a representative shape.
- Omit this section when the rule is already obvious without an example.

## Migration Guidance

1. Describe the safest order to adopt the pattern.
2. Keep the steps concrete and incremental.
3. Omit this section when migration guidance is unnecessary.

## Checklist

1. Add a short verification checklist when the pattern benefits from one.
2. Omit this section when it would duplicate the rule sections above.

## Anti-Patterns

- List the main mistakes or coupling risks this pattern is meant to prevent.
```

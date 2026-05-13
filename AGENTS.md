# Agent Guide

This document defines **strict rules and workflows** for AI coding agents (e.g., Codex) working in this repository.

These rules are **mandatory** unless explicitly overridden by the user.

## Purpose

- ✅ ALWAYS preserve the architectural boundaries already established in the codebase.
- ✅ ALWAYS keep generated code aligned with the current module and feature structure.
- ✅ ALWAYS reduce cleanup work after agent-generated changes.
- ❌ Do NOT assume — verify before acting.
- ✅ ALWAYS plan before coding.

## General Expectations

- ✅ ALWAYS ask whenever you have doubts regarding how to approach an issue
- ✅ ALWAYS plan before writing any code. Confirm your implementation plan with the user, and only them proceed with the execution. If necessary, draw diagrams or other forms to help the user to visualize the changes you have planned.
- ✅ ALWAYS prefer small, targeted changes over broad refactors unless the task explicitly requires wider changes.
- ✅ ALWAYS preserve unrelated user changes already present in the worktree.
- ✅ ALWAYS follow the existing naming, folder structure, and module conventions before introducing new patterns.
- ✅ ALWAYS prefer extending the current architecture over adding parallel abstractions.
- ✅ ALWAYS, before suggesting code changes, read related project module documentation and patterns, which are available at `docs/patterns` and `docs/modules`.
- ✅ ALWAYS, when creating new documentation under `docs/modules` or `docs/patterns`, start from `docs/modules/module-template.md` or `docs/patterns/pattern-template.md` and adapt the template to the specific change.
- ✅ If no documentation regarding the module you were tasked to update or create exists, ALWAYS add to your execution plan a step to document the changes following the patterns that are already being used under the docs directory on this project. If the documentation exists, ALWAYS add to your execution plan a step to update the document with the current changes.

## Project Structure

- `apps/backend`: NestJS backend.
- `apps/frontend`: React + Vite frontend.
- `packages/shared`: framework-agnostic shared types, constants, contracts, and utilities.
- `docs`: architecture and pattern documentation.

## Backend Rules

- ✅ ALWAYS keep NestJS DTO classes inside `apps/backend/src/**/dto`.
- ✅ ALWAYS keep backend service-layer inputs and outputs in local `*.contracts.ts` files.
- ❌ NEVER make backend services depend directly on DTO classes or shared transport contracts.
- ✅ ALWAYS map transport DTOs to backend-local service contracts in controllers.
- ✅ ALWAYS map backend service outputs to shared response contracts in controllers when a shared transport contract exists.
- ✅ ALWAYS keep entity construction and persistence concerns inside entities or services, not controllers.
- ❌ NEVER import DTOs into services.
- ❌ NEVER expose entities directly to controllers.

## Shared Contract Rules

- ✅ ALWAYS put only framework-agnostic transport contracts in `packages/shared/src/contracts`.
- ✅ Shared transport contracts should ALWAYS represent request and response payloads exchanged across app boundaries.
- ❌ NEVER move `class-validator`, `class-transformer`, or NestJS-specific helpers into `packages/shared`.
- ❌ NEVER use shared transport contracts as backend service-layer contracts.
- ❌ NEVER force frontend view models to match backend DTOs when the frontend intentionally reshapes data.

## Frontend Rules

- ✅ ALWAYS keep frontend code organized by feature under `apps/frontend/src/features`.
- ✅ ALWAYS keep API calls in feature `services`.
- ✅ ALWAYS keep React Query wrappers in feature `hooks`.
- ✅ ALWAYS keep UI-only models local to the frontend when they differ from transport payloads.
- ✅ ALWAYS reuse shared contracts for HTTP request and response typing when the transport shape is intentionally shared.
- ✅ ALWAYS preserve current UI patterns unless the task explicitly asks for a design change.

## When Adding New Endpoints

1. Add or update backend-local service contracts first.
2. Define or update DTOs for controller validation.
3. Add a shared transport contract only if the request or response shape is meant to be shared with another app.
4. Map DTOs to service contracts in the controller.
5. Map service outputs to shared response contracts in the controller.
6. Update frontend services to consume shared transport contracts when applicable.

## Documentation Expectations

- ✅ ALWAYS update docs when introducing a new architectural pattern or changing an existing one.
- ✅ ALWAYS prefer adding guidance to `docs/patterns` when the rule is meant to be reused.
- ✅ ALWAYS use `docs/modules/module-template.md` for new module docs and `docs/patterns/pattern-template.md` for new pattern docs.
- ✅ ALWAYS use `docs/issues/vulnerability-template.md` when documenting vulnerability findings under `docs/issues`.
- ✅ ALWAYS keep docs short, concrete, and consistent with the current codebase.

## Verification

- Run the smallest relevant verification command for the affected area.
- Preferred checks:
  - `pnpm --filter @workspace/shared build`
  - `pnpm --filter @workspace/backend build`
  - `pnpm --filter @workspace/frontend build`
- If a full build is not necessary, use the narrowest check that still validates the change.

## Avoid

- ⚠️ Large speculative refactors.
- ⚠️ Duplicating types that already exist in the correct layer.
- ⚠️ Introducing transport-layer concerns into backend services.
- ⚠️ Introducing backend framework concerns into the shared package.
- ⚠️ Changing unrelated files to satisfy personal style preferences.

## Project-Specific Rules

### End-of-Week Vulnerability Audit

- ✅ EVERY Friday, or the last working day of the week, run a backend vulnerability audit before closing weekly maintenance work.
- ✅ ALWAYS perform the audit in small batches and document findings under `docs/issues`.
- ✅ ALWAYS include the date each vulnerability was found in the issue document.
- ✅ ALWAYS use `docs/issues/vulnerability-template.md` for new vulnerability issue documents.
- ✅ ALWAYS review backend application code, runtime configuration, Docker/local infrastructure, observability exposure, and production dependency advisories.
- ✅ ALWAYS run `pnpm audit --prod` from `apps/backend` as part of the dependency batch. If network access is unavailable, document that the dependency audit could not be completed and why.
- ✅ ALWAYS keep audit findings evidence-based: include affected files, risk, evidence, and suggested remediation.
- ✅ ALWAYS preserve unrelated user changes while creating audit documentation.

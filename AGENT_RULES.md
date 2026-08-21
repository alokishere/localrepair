# LocalRepair Agent Rules

These rules govern all implementation work in this repository.

## Before coding

- Read `PRD.md`, `ARCHITECTURE.md`, `DATABASE.md`, `API.md`, `DESIGN.md`, and `PHASES.md`.
- Identify the current phase and read its acceptance criteria and stop condition.
- Inspect existing files and preserve working code.
- Confirm the change is within the MVP scope and the current phase.
- Check the API, database fields, status names, roles, and frontend routes for consistency.
- Decide the smallest test that proves the change.

## Non-negotiable rules

1. `PRD.md` is the product source of truth; these documents make its MVP scope executable.
2. `PHASES.md` controls implementation order. Implement one phase at a time.
3. Do not start the next phase until the current phase's definition of done passes.
4. Never implement future features automatically, even if the PRD mentions them.
5. Prefer a working, simple solution over a scalable abstraction.
6. Reuse existing code and do not rewrite working features without a demonstrated reason.
7. Test after every meaningful change and report what was tested.
8. Never commit secrets, real personal data, production tokens, or `.env` files.
9. Validate all backend input, including ObjectIds, enums, strings, dates, and money.
10. Enforce authorization server-side; frontend route guards are not security.
11. Never trust frontend `userId`, `role`, `technicianId`, total, or status values.
12. Follow `DATABASE.md` for schema, indexes, relationships, and status transitions.
13. Follow `API.md` for routes, response format, status codes, and authorization.
14. Follow `DESIGN.md` for UI hierarchy, responsive behavior, and state handling.
15. Use reusable React components; keep controllers and components manageable.
16. Every async UI view must handle loading, error, empty, and success states.
17. Do not install dependencies unless the current phase requires them and the simplest existing option is insufficient.
18. Do not introduce a new architecture, service, store, or library without documenting why it is needed.
19. Seed fake demo data so the primary journey is repeatable.
20. Keep the application demo-ready: clear labels, safe errors, predictable navigation, and no dead primary actions.
21. Stop feature development once MVP acceptance criteria are met; polish only if it improves the demo.

## Do not do

- Do not build microservices, Redis, Kafka, Kubernetes, or complex DevOps.
- Do not build payment gateways, subscriptions, chat, live GPS, advanced analytics, or a native app.
- Do not add AI/ML infrastructure; use a transparent rule-based diagnosis suggestion for MVP.
- Do not add Socket.IO or realtime requirements before the normal REST flow works.
- Do not create separate authentication models for customer, technician, and admin.
- Do not expose password hashes or accept role escalation from registration.
- Do not bypass ownership checks because a UI route is hidden.
- Do not silently swallow API errors or show fake success for failed mutations.
- Do not make destructive schema/data changes without checking existing records and asking when recovery is unclear.
- Do not continue to another phase when the current phase's stop condition fails.

## After coding

- Run the relevant lint, build, unit, API, or smoke checks.
- Manually exercise the changed path as the correct role and as an unauthorized role.
- Verify loading, error, empty, mobile, and refresh behavior where applicable.
- Compare changed fields/routes/statuses against all six documents and update documentation if a deliberate contract change was made.
- Confirm no secrets, debug logging, or unrelated generated files were added.
- Report files changed, tests run, known limitations, and whether the phase stop condition passed.

## Phase handoff format

At the end of a phase, provide:

```text
Phase: <number and name>
Implemented: <short list>
Verified: <commands and manual flow>
Blocked: <none or exact issue>
Stop condition: PASS / FAIL
Next phase: <only if PASS>
```

The primary demo remains: customer logs in → selects an appliance/problem → sees diagnosis guidance → finds technician → creates repair → technician accepts → status advances → estimate is approved → repair completes → customer reviews.

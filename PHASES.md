# LocalRepair Implementation Phases

This is the execution order for the AI coding agent. Complete and test one phase before starting the next. If a phase's stop condition fails, stop, report the failure, and fix only that phase.

## Phase 0 — Project setup

**Goal:** Make the existing React/Vite and Node/Express workspace run locally.

**Features/files:** environment examples, server entry, React Router, shared API client, basic app shell, error boundary or fallback.

**APIs/database/frontend:** `GET /api/health`; no persistent schema yet; public landing, login/register placeholders, role-aware route shell.

**Acceptance and tests:** frontend and backend start with documented commands; health endpoint responds; browser loads; API URL is configurable; no secrets are committed.

**Definition of done:** A clean checkout can run both apps and the landing page can reach the API.

**STOP:** Do not create feature models or pages until startup, environment handling, and the health check work.

## Phase 1 — Database and models

**Goal:** Establish the smallest consistent data model and demo seed.

**Features/files:** Mongoose connection, models listed in `DATABASE.md`, indexes, constants, seed script.

**APIs/database/frontend:** health confirms DB connection; seed users, categories, technicians, appliances, and sample repairs; no full UI required.

**Acceptance and tests:** seed is repeatable or safely idempotent; required fields and enums reject invalid data; technician geo index exists; sample login credentials are documented outside committed secrets.

**Definition of done:** MongoDB contains usable demo records matching `DATABASE.md`.

**STOP:** Do not build controllers on undocumented fields or continue if seed data cannot support the happy path.

## Phase 2 — Authentication and authorization

**Goal:** Customers and technicians can register/login and protected routes enforce roles.

**Features/files:** auth routes/controllers, bcrypt, JWT/cookie handling, auth and role middleware, auth store/pages.

**APIs:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`.

**Database/frontend:** `users`; login/register forms, protected route redirects, role-specific shells.

**Acceptance and tests:** valid customer/technician login works; duplicate email is rejected; invalid credentials fail; unauthenticated requests return 401; wrong role returns 403; password hash is never returned.

**Definition of done:** Two seeded roles can enter their correct dashboard and cannot access the other role's protected actions.

**STOP:** Never proceed while authorization is only implemented in React.

## Phase 3 — Technician discovery

**Goal:** Customers can find a verified technician relevant to an appliance category.

**Features/files:** category endpoint, technician list/profile, matching query, cards, filters, profile page.

**APIs:** `GET /api/categories`, `GET /api/technicians`, `GET /api/technicians/:id`, `GET /api/technicians/nearby`.

**Database/frontend:** categories and technicianProfiles; technician discovery and profile routes with loading, error, and empty states.

**Acceptance and tests:** only verified/available technicians appear in the customer result; category filtering works; invalid IDs are handled; technician private fields are not exposed.

**Definition of done:** A customer can choose an appliance category and view at least one seeded technician.

**STOP:** Do not add maps or complex ranking before the basic list works.

## Phase 4 — Repair diagnosis

**Goal:** Provide a simple, transparent diagnosis suggestion before booking.

**Features/files:** diagnosis rules/service, diagnosis form, result card, confirmation/edit step.

**APIs:** `POST /api/diagnosis`.

**Database/frontend:** no new collection; confirmed category, problem description, possible issue, and urgency flow into repair creation.

**Acceptance and tests:** known example such as “AC is running but not cooling” returns a sensible suggestion; unknown text returns a safe generic response; malformed input is rejected; UI states that the suggestion is not a technician diagnosis.

**Definition of done:** Diagnosis helps a customer complete a repair request without pretending to be medical/technical certainty.

**STOP:** Do not add an external AI provider during the MVP unless explicitly requested.

## Phase 5 — Booking system

**Goal:** Complete customer booking and technician accept/reject flow.

**Features/files:** repair controller/routes, ownership checks, transition service, booking wizard, detail page, status timeline.

**APIs:** `POST /api/repairs`, `GET /api/repairs`, `GET /api/repairs/:id`, `POST /api/repairs/:id/accept`, `POST /api/repairs/:id/reject`, `POST /api/repairs/:id/cancel`, `PATCH /api/repairs/:id/status`.

**Database/frontend:** repairs and repairStatusHistory; customer form, technician jobs list/detail, customer status view.

**Acceptance and tests:** customer can create a `SEARCHING` repair; technician can see matching available jobs; one technician can accept; a second cannot take it; invalid transitions fail; customer sees assigned technician; reject leaves repair searchable; unauthorized users cannot read or mutate it.

**Definition of done:** The complete booking flow works end to end before any polish or optional feature work.

**STOP:** This is the mandatory gate: do not begin Phase 6 until a seeded customer and technician complete the flow in the browser and API tests cover ownership and transitions.

## Phase 6 — Estimate and completion

**Goal:** Technician sends a basic estimate and completes the repair after customer approval.

**Features/files:** estimate model/controller, estimate card/form, approve/reject action, final-cost/status UI.

**APIs:** `POST /api/repairs/:repairId/estimate`, `GET /api/repairs/:repairId/estimate`, `POST /api/estimates/:id/approve`, `POST /api/estimates/:id/reject`.

**Database/frontend:** estimates; repair detail and technician job detail.

**Acceptance and tests:** only assigned technician creates estimate; customer can approve once; approval enables `IN_PROGRESS`; technician can complete; total is calculated server-side; estimate is unavailable to unrelated users.

**Definition of done:** Demo reaches `COMPLETED` with estimate and final cost visible.

**STOP:** Do not integrate payment.

## Phase 7 — Reviews

**Goal:** Customer can review one completed repair.

**Features/files:** review model/controller, rating form, technician rating summary.

**APIs:** `POST /api/repairs/:repairId/review`, `GET /api/technicians/:technicianId/reviews`.

**Database/frontend:** reviews and technician rating aggregates; completed-repair review UI.

**Acceptance and tests:** only the customer on a completed repair can review; rating is 1–5; duplicate review fails; technician summary updates.

**Definition of done:** Happy-path demo ends with a visible review.

**STOP:** Do not build moderation or public social features.

## Phase 8 — UI/UX polish

**Goal:** Make the MVP coherent, responsive, and demo-ready.

**Features/files:** shared components, responsive layouts, navbar/footer, badges, loaders, empty/error states, accessibility fixes.

**APIs/database:** no new API or collection.

**Acceptance and tests:** desktop and mobile layouts work; keyboard focus is visible; forms have labels and errors; buttons show disabled/loading states; no dead primary CTA; visual system follows `DESIGN.md`.

**Definition of done:** A judge can understand the product without narration for every screen.

**STOP:** Do not add unrelated features while polishing.

## Phase 9 — Testing and demo preparation

**Goal:** Prove and rehearse the primary journey.

**Features/files:** API smoke tests, critical component tests where practical, seed reset, demo notes, error logging.

**Acceptance and tests:** fresh seed; customer login; create AC repair; diagnosis; technician discovery; accept; status updates; estimate approval; completion; review; refresh preserves state; intentional 401/403/404/validation errors render safely.

**Definition of done:** The demo can be repeated from a clean database without manual database edits.

**STOP:** Fix blockers before adding future scope.

## Phase 10 — Deployment

**Goal:** Deploy the working MVP only after local verification.

**Features/files:** production env configuration, build commands, CORS, health check, safe seed strategy.

**Acceptance and tests:** production frontend build succeeds; backend connects to Atlas; cookie/token flow works over HTTPS; secrets are hosting variables; deployed happy path is tested.

**Definition of done:** A shareable demo URL works and has a rollback/reseed note.

**STOP:** Do not deploy untested future integrations.

## Deferred scope

Admin dashboard, complaints, OTP/email, cloud uploads, Socket.IO, payments, chat, maps, live GPS, AI/ML, notifications, advanced analytics, and subscriptions are future scope unless a specific judge requirement changes priorities.


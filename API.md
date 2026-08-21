# LocalRepair MVP REST API

## Conventions

Base URL: `http://localhost:3001/api` locally; use `VITE_API_URL` in the client. JSON requests use `Content-Type: application/json`. Authentication uses the JWT cookie or bearer token selected during Phase 2. Protected requests must include credentials. All responses use:

```json
{ "success": true, "message": "...", "data": {} }
```

Errors use:

```json
{ "success": false, "message": "Readable error", "errors": [] }
```

Common codes: `400` validation, `401` unauthenticated, `403` forbidden, `404` missing, `409` conflict, `422` business-rule failure, `500` unexpected server error.

## AUTH

### `POST /auth/register`

Auth: no. Role: public. Body: `{ name, email, phone?, password, role }`. Only `CUSTOMER` and `TECHNICIAN` may be self-selected; admin is never self-registered. Response `201`: `{ user, token/session }` with no password hash.

### `POST /auth/login`

Auth: no. Body: `{ email, password }`. Response `200`: current user and session. Errors: `401` invalid credentials, `403` inactive account.

### `GET /auth/me`

Auth: yes. Response `200`: current user and technician profile when applicable. `401` if session is invalid.

### `POST /auth/logout`

Auth: yes. Clears session. Response `200`.

## USERS

### `GET /users/me`

Auth: yes. Role: any. Returns the authenticated profile.

### `PATCH /users/me`

Auth: yes. Role: any. Body: editable `name`, `phone`, `avatar`. Server ignores role, password hash, and ownership fields. Response `200` updated user.

## CATEGORIES

### `GET /categories`

Auth: no. Returns active categories: `{ categories: [{ _id, name, slug, icon, description }] }`.

## APPLIANCES AND ADDRESSES

### `GET /appliances` / `POST /appliances` / `PATCH /appliances/:id` / `DELETE /appliances/:id`

Auth: customer. CRUD for the authenticated customer's appliances. POST body: `{ categoryId, brand, model?, nickname, purchaseYear? }`. The server derives `customerId`. Delete returns `204`; a referenced appliance should be deactivated or rejected rather than breaking a repair.

### `GET /addresses` / `POST /addresses` / `PATCH /addresses/:id` / `DELETE /addresses/:id`

Auth: customer. CRUD for owned addresses. POST body: `{ label, fullAddress, landmark?, city, state, pincode, location?: { coordinates: [lng, lat] } }`. `PATCH /addresses/:id/default` may set one default address. The server derives `userId`.

## DIAGNOSIS

### `POST /diagnosis`

Auth: optional; role: public/customer. Body: `{ categoryId?, problemDescription }`. Response `200`:

```json
{
  "success": true,
  "data": {
    "issue": "Possible filter blockage or low refrigerant",
    "urgency": "MEDIUM",
    "nextStep": "A technician should inspect the unit",
    "disclaimer": "This is a suggestion; the technician confirms the diagnosis."
  }
}
```

Malformed descriptions return `400`. Unknown descriptions return a generic suggestion, not a fabricated certainty.

## TECHNICIANS

### `GET /technicians`

Auth: optional/customer. Query: `categoryId?`, `verified?`, `available?`, `limit?`. Returns public technician cards only.

### `GET /technicians/:id`

Auth: optional. Returns public profile, service categories, rating, completed jobs, area, and reviews summary. `404` for missing/unavailable profile.

### `GET /technicians/nearby`

Auth: customer or public. Query: `lng`, `lat`, `categoryId?`, `radius=10`. Filters verified and available technicians and sorts by distance, rating, and completed jobs. Coordinates must be valid; otherwise `400`. If geo search is unavailable, the API may fall back to category/rating sorting and state that distance is unavailable.

### `GET /technicians/me` / `PATCH /technicians/me`

Auth: technician. Get/update own profile. Editable body: `{ bio, experienceYears, serviceCategories, skills, serviceArea, location, serviceRadiusKm }`; verification status is admin-controlled.

### `PATCH /technicians/me/availability`

Auth: technician. Body `{ isAvailable }`. Returns updated profile.

## REPAIRS / BOOKINGS

### `POST /repairs`

Auth: customer. Body:

```json
{
  "applianceId": "objectId",
  "categoryId": "objectId",
  "title": "AC not cooling",
  "problemDescription": "The AC runs but the room is not cooling.",
  "diagnosisSuggestion": { "issue": "Filter blockage", "urgency": "MEDIUM" },
  "addressId": "objectId",
  "preferredDate": "2026-08-22",
  "preferredTime": "10:00-12:00",
  "customerNotes": "Please call before arriving."
}
```

The server derives customer identity, validates ownership, creates status `SEARCHING`, and writes initial history. Response `201` returns the repair.

### `GET /repairs`

Auth: customer or technician. Customer sees own repairs; technician sees assigned jobs. Query: `status?`, `page?`, `limit?`.

### `GET /repairs/:id`

Auth: customer owner, assigned technician, or authorized admin. Returns repair, public technician/customer-safe summary, history, and estimate when permitted.

### `GET /repairs/available`

Auth: technician. Returns `SEARCHING` repairs matching the technician's categories/service area. A technician must not see private customer data beyond what is needed to decide on the job.

### `POST /repairs/:id/accept`

Auth: technician. Accepts only a `SEARCHING` repair and atomically assigns the caller. `409` if already assigned. Response `200` status `ACCEPTED`.

### `POST /repairs/:id/reject`

Auth: technician. Body `{ reason? }`. Does not assign the technician; repair remains `SEARCHING`. Response `200`.

### `PATCH /repairs/:id/status`

Auth: assigned technician for technician transitions; customer only for estimate approval/cancellation where explicitly allowed. Body `{ status, note? }`. Server enforces the state machine in `DATABASE.md`; response `200` updated repair and history entry.

### `POST /repairs/:id/cancel`

Auth: customer owner (and later admin). Body `{ reason }`. Allowed only before work begins; response `200` with `CANCELLED`.

## ESTIMATES

### `POST /repairs/:repairId/estimate`

Auth: assigned technician. Body `{ items: [{ name, description?, quantity, unitPrice }], laborCost, partsCost, tax?, discount? }`. Server calculates line totals and `totalAmount`, moves repair to `ESTIMATE_SENT`, and returns estimate. `409` if repair is not diagnosable or already has an active estimate.

### `GET /repairs/:repairId/estimate`

Auth: repair customer or assigned technician. Returns the estimate.

### `POST /estimates/:id/approve` / `POST /estimates/:id/reject`

Auth: repair customer. Optional body `{ note? }`. Approve moves repair to `CUSTOMER_APPROVED`; reject leaves it available for cancellation/rework according to business rules. Duplicate responses return `409`.

## REVIEWS

### `POST /repairs/:repairId/review`

Auth: customer who owns the completed repair. Body `{ rating, comment? }`. Rating is integer 1–5. Response `201`; duplicate or non-completed repair returns `409`/`422`.

### `GET /technicians/:technicianId/reviews`

Auth: public. Returns paginated reviews with safe customer display name/avatar only.

## Not in MVP

Admin management, complaints, notifications, OTP, uploads, payments, chat, and Socket.IO endpoints are intentionally excluded from this contract. Add an endpoint only when it has a phase, schema, authorization rule, and acceptance test.


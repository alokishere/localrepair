# LocalRepair Database

MongoDB with Mongoose is the MVP persistence layer. Collection names are lower camel case. References use ObjectId. Timestamps are enabled on all schemas. `DATABASE.md` is the contract for models and must agree with `API.md`.

## 1. Core collections

### users

```js
{
  name: String,                 // required, trimmed
  email: String,                // required, unique, lowercase
  phone: String,                // optional, unique when present
  passwordHash: String,         // required, select: false
  role: 'CUSTOMER'|'TECHNICIAN'|'ADMIN', // required, default CUSTOMER
  avatar: String,
  isActive: Boolean,            // default true
  createdAt: Date,
  updatedAt: Date
}
```

Indexes: unique `email`; sparse unique `phone`; `role`. Never return `passwordHash`.

### technicianProfiles

```js
{
  userId: ObjectId,             // required, ref User, unique
  bio: String,
  experienceYears: Number,      // min 0
  serviceCategories: [ObjectId],// ref Category
  skills: [String],
  location: { type: 'Point', coordinates: [Number] }, // [lng, lat]
  serviceRadiusKm: Number,      // default 10, min 1
  serviceArea: String,
  verificationStatus: 'PENDING'|'VERIFIED'|'REJECTED', // default PENDING
  ratingAverage: Number,        // default 0, min 0, max 5
  totalReviews: Number,         // default 0
  completedJobs: Number,        // default 0
  isAvailable: Boolean          // default false
}
```

Indexes: unique `userId`, `location: 2dsphere`, `serviceCategories`.

### categories

```js
{ name: String, slug: String, icon: String, description: String,
  isActive: Boolean /* default true */ }
```

Unique index on `slug`; index `isActive`.

### appliances

```js
{ customerId: ObjectId, categoryId: ObjectId, brand: String,
  model: String, nickname: String, purchaseYear: Number, image: String }
```

`customerId`, `categoryId`, and `nickname` are required for a saved appliance. Index `customerId`.

### addresses

```js
{ userId: ObjectId, label: String, fullAddress: String, landmark: String,
  city: String, state: String, pincode: String,
  location: { type: 'Point', coordinates: [Number] }, isDefault: Boolean }
```

Required: `userId`, `label`, `fullAddress`, `city`, `state`, `pincode`. Index `userId` and `location: 2dsphere`. Coordinates must be valid longitude/latitude when supplied.

### repairs

```js
{
  customerId: ObjectId, technicianId: ObjectId, applianceId: ObjectId,
  categoryId: ObjectId, title: String, problemDescription: String,
  diagnosisSuggestion: { issue: String, urgency: String },
  addressId: ObjectId, location: { type: 'Point', coordinates: [Number] },
  preferredDate: Date, preferredTime: String,
  status: 'SEARCHING'|'ACCEPTED'|'TECHNICIAN_ON_WAY'|'ARRIVED'|
    'DIAGNOSING'|'ESTIMATE_SENT'|'CUSTOMER_APPROVED'|'IN_PROGRESS'|
    'COMPLETED'|'CANCELLED',
  estimatedCost: Number, finalCost: Number,
  customerNotes: String, technicianNotes: String,
  acceptedAt: Date, startedAt: Date, completedAt: Date,
  cancelledAt: Date, cancellationReason: String
}
```

Required: `customerId`, `categoryId`, `title`, `problemDescription`, and either a valid `addressId` or an embedded location. New repairs default to `SEARCHING`. Index `customerId`, `technicianId`, `status`, `categoryId`, and `location: 2dsphere`.

### repairStatusHistory

```js
{ repairId: ObjectId, status: String, changedBy: ObjectId, note: String }
```

Append a record for every accepted status transition. Index `{ repairId: 1, createdAt: 1 }`.

### estimates

```js
{
  repairId: ObjectId, technicianId: ObjectId,
  items: [{ name: String, description: String, quantity: Number,
             unitPrice: Number, total: Number }],
  laborCost: Number, partsCost: Number, tax: Number, discount: Number,
  totalAmount: Number,
  status: 'SENT'|'APPROVED'|'REJECTED'|'EXPIRED',
  customerResponse: String, respondedAt: Date
}
```

`totalAmount` is calculated on the server. One active estimate per repair is sufficient for MVP. Index `repairId` and `technicianId`.

### reviews

```js
{ repairId: ObjectId, customerId: ObjectId, technicianId: ObjectId,
  rating: Number, comment: String }
```

Rating is an integer from 1–5. Unique compound index `{ repairId: 1, customerId: 1 }`; indexes `technicianId` and `repairId`.

## 2. Relationships

```text
User 1─1 TechnicianProfile
User 1─N Appliance, Address, Repair, Review
Category 1─N Appliance, Repair; TechnicianProfile N─N Category
Repair 1─N RepairStatusHistory; Repair 1─1 Estimate; Repair 1─0..1 Review
```

Do not delete referenced records casually. For a demo, deactivate users/categories rather than removing them.

## 3. Status rules

```text
SEARCHING → ACCEPTED → TECHNICIAN_ON_WAY → ARRIVED → DIAGNOSING
DIAGNOSING → ESTIMATE_SENT → CUSTOMER_APPROVED → IN_PROGRESS → COMPLETED
SEARCHING / ACCEPTED / ESTIMATE_SENT → CANCELLED (role and business-rule checked)
```

`REJECTED` is not persisted as the repair's lifecycle status in the MVP: a technician rejection is recorded in the response/audit if needed and the repair remains `SEARCHING`. Only assigned technicians can advance a job. Customer approval is required before `IN_PROGRESS`.

## 4. Validation and security

Validate enums, lengths, dates, positive money values, ObjectIds, ownership, and allowed transitions at the API boundary. Sanitize text and limit request body size. Never accept a client-provided customer/technician identity or computed total as authoritative. Use transactions only if a transition and history write must be atomic and the deployment supports them; otherwise handle failures visibly and retry safely.

## 5. Seed data

Seed at least 8 categories, 3 verified available technicians across categories, 2 customer accounts, appliances, addresses with safe demo coordinates, and repairs covering `SEARCHING`, `ACCEPTED`, and `COMPLETED`. Use clearly fake emails and development-only passwords. Never seed real personal data or production secrets.

## 6. Deferred collections

`notifications`, `otpTokens`, `complaints`, `payments`, and `messages` are described in the PRD but are not required for the MVP schema. Add them only with a corresponding phase and API contract.


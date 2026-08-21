# LocalRepair — PRD / Technical Build Specification

> MERN stack implementation blueprint for the LocalRepair hackathon MVP.
> Focus: DB schema, API contracts, application flows, folder structure, security, and build shortcuts.

---

## 1. Product Scope 

LocalRepair connects customers who need appliance repair with nearby verified repair technicians.

### MVP actors

- **Customer**
  - Register/login
  - Add/manage appliances
  - Create repair request
  - Select category/appliance/problem
  - Add address/location
  - View nearby technicians
  - Request/accept technician
  - Track repair status
  - View estimate/final bill
  - Review technician

- **Technician**
  - Register/login
  - Create technician profile
  - Select service categories
  - Set service area
  - Receive repair requests
  - Accept/reject jobs
  - Update job status
  - Add diagnosis/estimate
  - Complete job
  - View earnings/history

- **Admin**
  - Dashboard
  - Verify technicians
  - Manage users
  - Manage categories/appliances
  - Monitor repair requests
  - Handle complaints
  - Suspend accounts
  - View platform metrics

---

# 2. Recommended MERN Stack

## Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- Zod
- TanStack Query
- Zustand
- Lucide React
- Recharts

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod/Joi
- Nodemailer
- Multer
- Cloudinary/ImageKit
- Socket.IO
- Helmet
- CORS
- express-rate-limit

## Deployment

- Frontend: Vercel
- Backend: Render/Railway/Fly.io
- Database: MongoDB Atlas
- Images: Cloudinary/ImageKit

---

# 3. High-Level Architecture

```text
React Client
     |
     | Axios / Socket.IO
     v
Express API
     |
     +---- Auth Middleware
     |
     +---- Controllers
     |
     +---- Services
     |
     +---- Mongoose Models
     |
     v
MongoDB Atlas

External Services:
- Cloudinary/ImageKit -> images
- Nodemailer -> OTP/email
- Socket.IO -> realtime updates
```

---

# 4. Main User Flows

## 4.1 Customer Registration

```text
Landing
  ↓
Register
  ↓
POST /api/auth/register
  ↓
Validate input
  ↓
Create User
  ↓
Hash password
  ↓
Send OTP
  ↓
POST /api/auth/verify-email
  ↓
Account verified
  ↓
Login/Dashboard
```

## 4.2 Customer Creates Repair Request

```text
Customer Dashboard
  ↓
Create Repair
  ↓
Select Appliance Category
  ↓
Select Appliance
  ↓
Describe Problem
  ↓
Upload Photos
  ↓
Select Address
  ↓
Submit Request
  ↓
POST /api/repairs
  ↓
Find matching technicians
  ↓
Notify technicians
  ↓
Repair status = SEARCHING
```

## 4.3 Technician Accepts Job

```text
Technician Dashboard
  ↓
Available Jobs
  ↓
GET /api/repairs/available
  ↓
View Job
  ↓
Accept
  ↓
POST /api/repairs/:id/accept
  ↓
Technician assigned
  ↓
Customer notified
  ↓
Status = ACCEPTED
```

## 4.4 Repair Lifecycle

```text
SEARCHING
    ↓
ACCEPTED
    ↓
TECHNICIAN_ON_WAY
    ↓
ARRIVED
    ↓
DIAGNOSING
    ↓
ESTIMATE_SENT
    ↓
CUSTOMER_APPROVED
    ↓
IN_PROGRESS
    ↓
COMPLETED
    ↓
REVIEWED
```

Possible cancellation:

```text
SEARCHING / ACCEPTED
        ↓
     CANCELLED
```

---

# 5. User Roles

```js
role:
  CUSTOMER
  TECHNICIAN
  ADMIN
```

Use one `User` collection instead of separate customer/technician authentication collections.

Technician-specific information lives in `TechnicianProfile`.

---

# 6. MongoDB Collections

Required MVP collections:

```text
users
technicianProfiles
categories
appliances
addresses
repairs
repairStatusHistory
estimates
reviews
notifications
otpTokens
complaints
```

Optional:

```text
payments
messages
adminLogs
```

---

# 7. User Collection

```js
User {
  _id,
  name,
  email,
  phone,
  passwordHash,
  role,
  avatar,
  isEmailVerified,
  isPhoneVerified,
  isActive,
  createdAt,
  updatedAt
}
```

Indexes:

```text
email: unique
phone: unique
role
```

---

# 8. TechnicianProfile Collection

```js
TechnicianProfile {
  _id,
  userId,
  bio,
  experienceYears,
  serviceCategories: [ObjectId],
  skills: [String],

  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },

  serviceRadiusKm,
  serviceArea,
  verificationStatus,
  documents: [
    {
      type,
      url
    }
  ],

  ratingAverage,
  totalReviews,
  completedJobs,
  isAvailable,

  createdAt,
  updatedAt
}
```

Important:

```js
location: {
  type: "Point",
  coordinates: [lng, lat]
}
```

Create a `2dsphere` index.

---

# 9. Category Collection

```js
Category {
  _id,
  name,
  slug,
  icon,
  description,
  isActive,
  createdAt,
  updatedAt
}
```

Examples:

```text
AC
Refrigerator
Washing Machine
Microwave
TV
Water Purifier
Cooler
Geyser
```

---

# 10. Appliance Collection

```js
Appliance {
  _id,
  customerId,
  categoryId,
  brand,
  model,
  nickname,
  purchaseYear,
  image,
  createdAt,
  updatedAt
}
```

---

# 11. Address Collection

```js
Address {
  _id,
  userId,
  label,
  fullAddress,
  landmark,
  city,
  state,
  pincode,

  location: {
    type: "Point",
    coordinates: [lng, lat]
  },

  isDefault,
  createdAt,
  updatedAt
}
```

Create:

```text
2dsphere index on location
```

---

# 12. Repair Collection

Core collection.

```js
Repair {
  _id,

  customerId,
  technicianId,

  applianceId,
  categoryId,

  title,
  problemDescription,

  images: [String],

  addressId,

  location: {
    type: "Point",
    coordinates: [lng, lat]
  },

  preferredDate,
  preferredTime,

  status,

  estimatedCost,
  finalCost,

  customerNotes,
  technicianNotes,

  acceptedAt,
  startedAt,
  completedAt,
  cancelledAt,

  cancellationReason,

  createdAt,
  updatedAt
}
```

Statuses:

```text
SEARCHING
ACCEPTED
TECHNICIAN_ON_WAY
ARRIVED
DIAGNOSING
ESTIMATE_SENT
CUSTOMER_APPROVED
IN_PROGRESS
COMPLETED
CANCELLED
```

---

# 13. RepairStatusHistory Collection

Avoid storing every status transition only inside `Repair`.

```js
RepairStatusHistory {
  _id,
  repairId,
  status,
  changedBy,
  note,
  createdAt
}
```

This gives an audit trail.

---

# 14. Estimate Collection

```js
Estimate {
  _id,
  repairId,
  technicianId,

  items: [
    {
      name,
      description,
      quantity,
      unitPrice,
      total
    }
  ],

  laborCost,
  partsCost,
  tax,
  discount,
  totalAmount,

  status,

  customerResponse,
  respondedAt,

  createdAt,
  updatedAt
}
```

Statuses:

```text
PENDING
SENT
APPROVED
REJECTED
EXPIRED
```

---

# 15. Review Collection

```js
Review {
  _id,
  repairId,
  customerId,
  technicianId,

  rating,
  comment,

  createdAt,
  updatedAt
}
```

Constraints:

```text
One review per completed repair.
Rating: 1–5
```

---

# 16. Notification Collection

```js
Notification {
  _id,
  userId,

  type,
  title,
  message,

  data,

  isRead,

  createdAt
}
```

Types:

```text
REPAIR_CREATED
REPAIR_ACCEPTED
STATUS_CHANGED
ESTIMATE_RECEIVED
ESTIMATE_APPROVED
REPAIR_COMPLETED
NEW_REVIEW
ACCOUNT_VERIFIED
```

---

# 17. OTP Collection

```js
OtpToken {
  _id,
  userId,
  email,
  otpHash,
  purpose,
  expiresAt,
  attempts,
  createdAt
}
```

Purposes:

```text
EMAIL_VERIFICATION
PASSWORD_RESET
PHONE_VERIFICATION
```

Use TTL index on `expiresAt`.

---

# 18. Complaint Collection

```js
Complaint {
  _id,
  repairId,
  customerId,
  technicianId,

  subject,
  description,
  images,

  status,
  adminResponse,

  resolvedAt,
  createdAt,
  updatedAt
}
```

Statuses:

```text
OPEN
IN_REVIEW
RESOLVED
REJECTED
```

---

# 19. API Structure

Base URL:

```text
/api
```

---

# 20. Auth APIs

### Register

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "Alok",
  "email": "alok@example.com",
  "phone": "9999999999",
  "password": "password",
  "role": "CUSTOMER"
}
```

### Login

```http
POST /api/auth/login
```

### Verify OTP

```http
POST /api/auth/verify-otp
```

### Resend OTP

```http
POST /api/auth/resend-otp
```

### Forgot Password

```http
POST /api/auth/forgot-password
```

### Reset Password

```http
POST /api/auth/reset-password
```

### Current User

```http
GET /api/auth/me
```

### Logout

```http
POST /api/auth/logout
```

---

# 21. User APIs

```http
GET    /api/users/me
PATCH  /api/users/me
PATCH  /api/users/me/password
DELETE /api/users/me
```

Admin:

```http
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id/status
DELETE /api/users/:id
```

---

# 22. Category APIs

Public:

```http
GET /api/categories
GET /api/categories/:slug
```

Admin:

```http
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

---

# 23. Appliance APIs

Customer:

```http
GET    /api/appliances
GET    /api/appliances/:id
POST   /api/appliances
PATCH  /api/appliances/:id
DELETE /api/appliances/:id
```

---

# 24. Address APIs

```http
GET    /api/addresses
POST   /api/addresses
GET    /api/addresses/:id
PATCH  /api/addresses/:id
DELETE /api/addresses/:id
PATCH  /api/addresses/:id/default
```

---

# 25. Technician APIs

```http
GET   /api/technicians
GET   /api/technicians/:id
GET   /api/technicians/nearby
GET   /api/technicians/me
PATCH /api/technicians/me
PATCH /api/technicians/me/availability
```

Admin:

```http
GET   /api/technicians/pending
PATCH /api/technicians/:id/verify
PATCH /api/technicians/:id/reject
```

Nearby search:

```http
GET /api/technicians/nearby?lng=80.95&lat=26.85&radius=10
```

Use MongoDB:

```js
$near
$geoNear
```

---

# 26. Repair APIs

Customer:

```http
POST   /api/repairs
GET    /api/repairs
GET    /api/repairs/:id
PATCH  /api/repairs/:id
DELETE /api/repairs/:id
POST   /api/repairs/:id/cancel
```

Technician:

```http
GET  /api/repairs/available
GET  /api/repairs/my-jobs
POST /api/repairs/:id/accept
POST /api/repairs/:id/reject
PATCH /api/repairs/:id/status
```

---

# 27. Estimate APIs

Technician:

```http
POST /api/repairs/:repairId/estimate
PATCH /api/estimates/:id
```

Customer:

```http
GET  /api/repairs/:repairId/estimate
POST /api/estimates/:id/approve
POST /api/estimates/:id/reject
```

---

# 28. Review APIs

```http
POST /api/repairs/:repairId/review
GET  /api/technicians/:technicianId/reviews
PATCH /api/reviews/:id
DELETE /api/reviews/:id
```

---

# 29. Notification APIs

```http
GET   /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
DELETE /api/notifications/:id
```

---

# 30. Complaint APIs

Customer:

```http
POST /api/complaints
GET  /api/complaints
```

Admin:

```http
GET   /api/admin/complaints
GET   /api/admin/complaints/:id
PATCH /api/admin/complaints/:id
```

---

# 31. Admin APIs

```http
GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/technicians
GET /api/admin/repairs
GET /api/admin/complaints
GET /api/admin/revenue
```

Dashboard response:

```json
{
  "users": 120,
  "technicians": 45,
  "activeRepairs": 18,
  "completedRepairs": 320,
  "openComplaints": 4
}
```

---

# 32. Socket.IO Events

Connection:

```text
socket.io
```

Events:

```text
repair:new
repair:accepted
repair:status
repair:estimate
repair:completed
notification:new
```

Example:

```js
io.to(`user:${userId}`).emit("repair:status", repair);
```

Rooms:

```text
user:{userId}
repair:{repairId}
```

---

# 33. Recommended Backend Folder Structure

```text
server/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   └── cloudinary.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── TechnicianProfile.js
│   │   ├── Category.js
│   │   ├── Appliance.js
│   │   ├── Address.js
│   │   ├── Repair.js
│   │   ├── RepairStatusHistory.js
│   │   ├── Estimate.js
│   │   ├── Review.js
│   │   ├── Notification.js
│   │   ├── OtpToken.js
│   │   └── Complaint.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── technician.controller.js
│   │   ├── category.controller.js
│   │   ├── appliance.controller.js
│   │   ├── address.controller.js
│   │   ├── repair.controller.js
│   │   ├── estimate.controller.js
│   │   ├── review.controller.js
│   │   ├── notification.controller.js
│   │   └── complaint.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── repair.service.js
│   │   ├── technician.service.js
│   │   ├── notification.service.js
│   │   ├── otp.service.js
│   │   └── matching.service.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── technician.routes.js
│   │   ├── category.routes.js
│   │   ├── appliance.routes.js
│   │   ├── address.routes.js
│   │   ├── repair.routes.js
│   │   ├── estimate.routes.js
│   │   ├── review.routes.js
│   │   ├── notification.routes.js
│   │   └── complaint.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── role.js
│   │   ├── validate.js
│   │   ├── upload.js
│   │   ├── error.js
│   │   └── rateLimit.js
│   │
│   ├── validators/
│   │   ├── auth.schema.js
│   │   ├── repair.schema.js
│   │   ├── technician.schema.js
│   │   └── user.schema.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── generateToken.js
│   │   └── constants.js
│   │
│   ├── sockets/
│   │   └── index.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

# 34. Recommended React Folder Structure

```text
client/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── navbar/
│   │   ├── cards/
│   │   ├── forms/
│   │   ├── modals/
│   │   └── loaders/
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx
│   │   ├── CustomerLayout.jsx
│   │   ├── TechnicianLayout.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── technician/
│   │   └── admin/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── repairs/
│   │   ├── technicians/
│   │   ├── appliances/
│   │   ├── addresses/
│   │   ├── estimates/
│   │   ├── reviews/
│   │   └── notifications/
│   │
│   ├── hooks/
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.api.js
│   │   ├── repair.api.js
│   │   ├── technician.api.js
│   │   └── user.api.js
│   │
│   ├── store/
│   │   ├── auth.store.js
│   │   └── ui.store.js
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── lib/
│   │   ├── axios.js
│   │   └── socket.js
│   │
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

# 35. API Response Standard

Use one response format everywhere.

Success:

```json
{
  "success": true,
  "message": "Repair created successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Invalid request",
  "errors": []
}
```

---

# 36. Authentication

Recommended MVP:

```text
JWT access token
```

Prefer:

```text
HttpOnly cookie
```

instead of storing JWT in localStorage.

Middleware:

```js
authenticate
authorize("CUSTOMER")
authorize("TECHNICIAN")
authorize("ADMIN")
```

Example:

```text
authenticate
   ↓
authorize("TECHNICIAN")
   ↓
controller
```

---

# 37. Security Checklist

```text
[ ] bcrypt password hashing
[ ] JWT authentication
[ ] HttpOnly cookies
[ ] Helmet
[ ] CORS whitelist
[ ] Rate limiting
[ ] Input validation
[ ] File upload validation
[ ] Maximum file size
[ ] MongoDB ObjectId validation
[ ] Role-based access
[ ] Never expose passwordHash
[ ] Environment variables
[ ] OTP expiry
[ ] OTP attempt limit
```

---

# 38. Matching Algorithm

For hackathon MVP, do NOT build a complicated recommendation engine.

Use:

```text
1. Same service category
2. Technician is verified
3. Technician is available
4. Within service radius
5. Sort by distance
6. Then rating
7. Then completed jobs
```

Pseudo-flow:

```js
find technicians
  → category match
  → verificationStatus = VERIFIED
  → isAvailable = true
  → geo distance <= serviceRadius
  → sort by distance/rating
  → return top 10
```

---

# 39. Database Indexes

Important indexes:

```text
User.email
User.phone

TechnicianProfile.userId
TechnicianProfile.location: 2dsphere
TechnicianProfile.serviceCategories

Address.userId
Address.location: 2dsphere

Repair.customerId
Repair.technicianId
Repair.status
Repair.categoryId
Repair.location: 2dsphere

RepairStatusHistory.repairId

Review.technicianId
Review.repairId

Notification.userId

OtpToken.expiresAt: TTL
```

---

# 40. Route Protection

Frontend:

```text
/public/*
/auth/*
/customer/*
/technician/*
/admin/*
```

Example:

```text
/customer/dashboard
/customer/repairs
/customer/repairs/new
/customer/repairs/:id

/technician/dashboard
/technician/jobs
/technician/jobs/:id

/admin/dashboard
/admin/users
/admin/technicians
/admin/repairs
```

Backend must independently enforce permissions.

Never rely only on frontend route protection.

---

# 41. State Machine Rules

Do not allow random status updates.

```text
SEARCHING
→ ACCEPTED
→ TECHNICIAN_ON_WAY
→ ARRIVED
→ DIAGNOSING
→ ESTIMATE_SENT
→ CUSTOMER_APPROVED
→ IN_PROGRESS
→ COMPLETED
```

Technician can:

```text
ACCEPTED → TECHNICIAN_ON_WAY
TECHNICIAN_ON_WAY → ARRIVED
ARRIVED → DIAGNOSING
DIAGNOSING → ESTIMATE_SENT
CUSTOMER_APPROVED → IN_PROGRESS
IN_PROGRESS → COMPLETED
```

Customer can:

```text
SEARCHING → CANCELLED
ACCEPTED → CANCELLED
ESTIMATE_SENT → CUSTOMER_APPROVED
ESTIMATE_SENT → CANCELLED
```

Admin can override when necessary.

---

# 42. Environment Variables

```env
NODE_ENV=development

PORT=3001

MONGO_URI=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GOOGLE_MAPS_API_KEY=
```

Frontend:

```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

---

# 43. Build Order — Fastest Hackathon Route

Do NOT build everything simultaneously.

## Phase 1 — Foundation

```text
1. Create client/server
2. Connect MongoDB
3. Setup Express
4. Setup React Router
5. Setup Tailwind
6. Setup Axios
7. Setup error handling
```

## Phase 2 — Auth

```text
1. User model
2. Register
3. Login
4. JWT
5. Auth middleware
6. Role middleware
7. Protected routes
```

## Phase 3 — Core Repair

```text
1. Category
2. Appliance
3. Address
4. Repair
5. Repair status
```

## Phase 4 — Technician

```text
1. Technician profile
2. Verification
3. Availability
4. Nearby search
5. Accept job
```

## Phase 5 — Estimate

```text
1. Technician creates estimate
2. Customer views estimate
3. Customer approves
4. Repair starts
```

## Phase 6 — Completion

```text
1. Complete repair
2. Final cost
3. Review
4. Notification
```

## Phase 7 — Admin

```text
1. Dashboard
2. Technician verification
3. User management
4. Repair monitoring
5. Complaint management
```

## Phase 8 — Realtime

```text
Socket.IO
↓
Repair status
↓
Notifications
```

---

# 44. Hackathon Shortcuts

## Shortcut 1 — One User Model

Do NOT create:

```text
Customer.js
Technician.js
Admin.js
```

Use:

```text
User.js
```

with:

```js
role
```

Then use:

```text
TechnicianProfile.js
```

for technician-only fields.

---

## Shortcut 2 — Skip Payments in MVP

If the hackathon does not explicitly require online payment:

```text
Do not integrate Razorpay/Stripe initially.
```

Use:

```text
estimatedCost
finalCost
paymentStatus
```

and show:

```text
Cash / UPI after service
```

as the MVP payment concept.

---

## Shortcut 3 — Skip Complex Maps

If time is limited:

```text
Use latitude + longitude
```

and calculate distance.

You can add a proper map UI later.

---

## Shortcut 4 — Seed Data

Create:

```text
seed.js
```

with:

```text
10 customers
10 technicians
8 categories
20 repairs
15 reviews
```

This makes the demo look alive immediately.

---

## Shortcut 5 — Fake OTP in Development

Development:

```text
OTP = 1234
```

Production:

```text
Generate random OTP
Send using Nodemailer
```

Never hardcode the development OTP in production.

---

## Shortcut 6 — Use Service Layer Only Where Needed

Do not create 50 abstractions.

For hackathon:

```text
route
 ↓
controller
 ↓
model
```

Use services only for:

```text
matching
notifications
OTP
complex repair logic
```

---

## Shortcut 7 — Reuse Components

Create:

```text
StatusBadge
Modal
Button
Input
Select
Card
Table
EmptyState
Loader
ConfirmDialog
```

Then reuse everywhere.

---

## Shortcut 8 — One API Client

Create:

```js
api.js
```

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});
```

Do not create Axios instances for every feature.

---

## Shortcut 9 — TanStack Query

Use React Query for:

```text
GET requests
caching
loading
error
refetch
mutation
```

Avoid manually managing:

```text
isLoading
error
data
refetch
```

for every page.

---

## Shortcut 10 — Don't Build Chat First

Chat is impressive but not core.

Build:

```text
Repair request
→ technician matching
→ acceptance
→ status tracking
→ estimate
→ completion
→ review
```

before chat.

---

# 45. Demo Flow for Judges

The fastest convincing demo:

```text
1. Customer logs in
       ↓
2. Creates AC repair request
       ↓
3. Adds problem + image + location
       ↓
4. System finds nearby technicians
       ↓
5. Technician receives request
       ↓
6. Technician accepts
       ↓
7. Customer sees technician assigned
       ↓
8. Technician updates status
       ↓
9. Technician sends ₹850 estimate
       ↓
10. Customer approves
       ↓
11. Technician completes repair
       ↓
12. Customer gives 5-star review
```

This should be your primary happy-path demo.

---

# 46. What NOT to Build Before Demo

Avoid spending core hackathon time on:

```text
❌ Advanced AI diagnosis
❌ Full payment gateway
❌ Complex chat
❌ Multi-language system
❌ Microservices
❌ Redis
❌ Kafka
❌ Docker orchestration
❌ Complex recommendation engine
❌ Native mobile app
❌ Advanced analytics
❌ Blockchain
```

If time remains, add them as future scope.

---

# 47. Optional AI Feature

For a hackathon differentiator:

```text
Customer describes problem
        ↓
AI classifies appliance/category
        ↓
AI suggests likely issue
        ↓
AI estimates urgency
        ↓
Customer confirms
        ↓
Repair request created
```

Example:

```text
Input:
"AC is running but room is not cooling."

Output:
Category: AC
Possible issue: Low refrigerant / filter blockage
Urgency: Medium
```

Important:

```text
AI output = suggestion
Technician diagnosis = final
```

---

# 48. Suggested API File Naming

Keep naming predictable:

```text
*.routes.js
*.controller.js
*.service.js
*.schema.js
```

Example:

```text
repair.routes.js
repair.controller.js
repair.service.js
repair.schema.js
```

---

# 49. Git Workflow

Branches:

```text
main
develop
feature/auth
feature/repair
feature/technician
feature/admin
```

For a very small team:

```text
main
feature/*
```

Commit format:

```text
feat: add repair request API
feat: add technician matching
fix: repair status transition
fix: auth cookie issue
refactor: repair controller
```

---

# 50. Minimum Viable Database

If the hackathon deadline becomes very tight, reduce to:

```text
users
categories
repairs
technicianProfiles
reviews
```

Store address and appliance details directly inside `repairs`.

This is acceptable for an MVP if you need speed.

---

# 51. Minimum Viable API

If extremely short on time, implement only:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET  /api/categories

POST /api/repairs
GET  /api/repairs
GET  /api/repairs/:id

GET  /api/technicians/nearby
POST /api/repairs/:id/accept
PATCH /api/repairs/:id/status

POST /api/repairs/:id/estimate
POST /api/estimates/:id/approve

POST /api/repairs/:id/review
```

That is enough to demonstrate the complete product loop.

---

# 52. Definition of Done

## Customer

```text
[ ] Register/login
[ ] Create repair
[ ] Upload image
[ ] Select address
[ ] See technician
[ ] Track repair
[ ] Approve estimate
[ ] Review technician
```

## Technician

```text
[ ] Register/login
[ ] Complete profile
[ ] Set category
[ ] Set availability
[ ] Receive jobs
[ ] Accept job
[ ] Update status
[ ] Send estimate
[ ] Complete repair
```

## Admin

```text
[ ] Login
[ ] View dashboard
[ ] Verify technicians
[ ] View users
[ ] View repairs
[ ] Handle complaints
```

## Backend

```text
[ ] MongoDB connected
[ ] Authentication
[ ] Authorization
[ ] Validation
[ ] Error handling
[ ] Image upload
[ ] Geo search
[ ] Notifications
[ ] Socket.IO
```

---

# 53. Final Architecture

```text
                    LOCALREPAIR
                         |
        ┌────────────────┼────────────────┐
        |                |                |
     CUSTOMER         TECHNICIAN         ADMIN
        |                |                |
        └────────────────┼────────────────┘
                         |
                    React Client
                         |
                    Axios / Socket
                         |
                    Express API
                         |
        ┌────────────────┼────────────────┐
        |                |                |
     Auth API        Repair API       Admin API
        |                |                |
        └────────────────┼────────────────┘
                         |
                     Services
                         |
                    Mongoose ODM
                         |
                    MongoDB Atlas
                         |
             ┌───────────┼───────────┐
             |           |           |
          Images       Email      Realtime
        Cloudinary   Nodemailer   Socket.IO
```

---

# 54. Priority Rule

For the hackathon, follow this priority:

```text
WORKING FLOW
    >
GOOD UI
    >
REAL DATA
    >
REALTIME
    >
AI
    >
ADVANCED FEATURES
```

A complete working repair lifecycle is more valuable than ten unfinished features.

---

# 55. Recommended Final MVP

```text
Landing Page
      ↓
Auth
      ↓
Customer Dashboard
      ↓
Create Repair
      ↓
Nearby Technician Matching
      ↓
Technician Dashboard
      ↓
Accept Job
      ↓
Live Status
      ↓
Estimate
      ↓
Approval
      ↓
Completion
      ↓
Review
      ↓
Admin Dashboard
```

This is the core LocalRepair system to implement first.

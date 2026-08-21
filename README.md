# LocalRepair

LocalRepair is a MERN hackathon MVP connecting customers with verified local appliance-repair technicians.

## Project status

Phases 0–5 are complete.

### Completed

- Phase 0: React/Vite frontend, Express backend, health check, and environment configuration
- Phase 1: MongoDB/Mongoose models, indexes, validation, relationships, and repeatable demo seed
- Phase 2: bcrypt authentication, JWT bearer tokens, role authorization, protected routes, login/register/logout
- Phase 3: technician discovery, category filters, nearby search, and public technician profiles
- Phase 4: deterministic repair diagnosis for AC, refrigerator, washing machine, TV, RO, and microwave
- Phase 5: customer repair booking, date/time/address form, MongoDB persistence, confirmation page, and booking list

The documented booking contract uses the `repairs` collection and `SEARCHING` as the initial status. Technician acceptance, status transitions, estimates, and completion belong to Phase 6.

## Run locally

Requirements: Node.js, MongoDB, and npm.

```bash
cd backend
npm install
npm run seed
npm start
```

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
API: `http://localhost:3001`

Copy the environment examples before running:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Set a local MongoDB connection and JWT secret in `backend/.env`. Never commit `.env` files or real credentials.

## Main API routes

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/categories`
- `GET /api/technicians`
- `GET /api/technicians/:id`
- `GET /api/technicians/nearby`
- `POST /api/diagnosis`
- `POST /api/repairs`
- `GET /api/repairs`
- `GET /api/repairs/:id`

## Demo accounts

The seed script creates fictional development users. The password is printed by `npm run seed`; demo credentials must not be used in production.

- Customer: `customer.one@localrepair.test`
- Technician: `technician.ac@localrepair.test`

## Current demo flow

Diagnosis → technician discovery → technician profile → booking form → date/time/address → booking confirmation → customer booking list.

## Deferred work

Phase 6 will add technician job management, accept/reject actions, repair status transitions, estimates, and completion. Payments, chat, notifications, maps, admin tools, and real-time updates remain deferred.

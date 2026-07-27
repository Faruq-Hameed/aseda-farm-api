# ASEDA Farm API

ASEDA Farm API is a NestJS backend for managing agricultural operations, crop batches, task workflows, harvest tracking, expenses, members, notifications, and farm analytics. Supports multiple crops (Plantain, Maize, Sweet Potato, Cassava, Cocoyam), each with its own auto-generated task schedule.

---

## Live API

| | |
|---|---|
| **API base URL** | [https://aseda-farm-api.onrender.com/api](https://aseda-farm-api.onrender.com/api) — hosted on Render |
| **Web app** | [https://aseda-farm.vercel.app](https://aseda-farm.vercel.app), see [aseda-farm-web](https://github.com/Faruq-Hameed/aseda-farm-web) |
| **Database** | Postgres on Supabase, accessed via Supavisor connection pooling |

The Render free web service spins down after periods of inactivity and wakes on the next request (a short cold-start delay). The daily reminder job is triggered externally by the frontend's Vercel Cron rather than an in-process timer, so it still fires reliably even if the API was asleep — see [Scheduled Jobs](#scheduled-jobs) below.

---

## Overview

This API supports farm operators with:

- user authentication and role-based access control (Owner / Manager / Worker / Viewer)
- farm and member management, with a farm-wide change audit log
- multi-crop batch lifecycle tracking (Plantain, Maize, Sweet Potato, Cassava, Cocoyam), each with crop-specific varieties, spacing, and an auto-generated task schedule sized to that crop's real growth cycle
- plant-count adjustments with a full history/reason trail (e.g. losses from storms or pests), so nothing is silently overwritten
- task scheduling, reminders, and completion tracking
- activity logging for farm operations
- expense recording and reporting
- harvest and sucker harvest management (sucker harvest is plantain-specific)
- notification delivery via email and in-app alerts
- analytics and production insights

## Project setup

```bash
npm install
```

## Environment variables

Create a `.env` file in the repository root and configure:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"   # non-pooled connection, used for migrations/db push
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"                          # allowed CORS origin
CRON_SECRET="your-cron-secret"                                 # shared with the frontend's Vercel Cron, guards /scheduler/trigger-daily
RESEND_API_KEY="your_resend_api_key"                            # optional — email reminders are skipped if unset
EMAIL_FROM="ASEDA Farm <notifications@asedafarm.ng>"
OWNER_EMAIL="owner@example.com"
```

In production, `DATABASE_URL` points at Supabase's transaction-mode pooler (port 6543, `pgbouncer=true`) for app runtime connections, and `DIRECT_URL` at the session-mode pooler (port 5432) for schema pushes/migrations.

## Running the application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run build
npm run start:prod
```

## Testing

```bash
# unit tests
npm run test

# watch mode
npm run test:watch

# end-to-end tests
npm run test:e2e

# coverage report
npm run test:cov
```

## Database

This project uses Prisma ORM with PostgreSQL. The data model is defined in `prisma/schema.prisma`.

Push schema changes and generate the Prisma client with:

```bash
npx prisma generate
npx prisma db push
```

## Scheduled Jobs

The daily reminder/digest job (`SchedulerService.handleDailyNotifications`) is not run by an in-process `@nestjs/schedule` timer, since the Render host can spin down when idle and a timer would silently miss its schedule while asleep. Instead it's exposed as `POST /scheduler/trigger-daily`, guarded by a shared `CRON_SECRET` header (`x-cron-secret`), and called once a day by the frontend's Vercel Cron (`aseda-farm/app/api/cron/daily`). That request also serves as the wake-up call for the sleeping host.

## Core modules

- `src/modules/auth` - authentication, registration, login, and member onboarding
- `src/modules/batches` - crop batches, planting lifecycle, plant-count history, multi-crop task generation
- `src/modules/tasks` - task creation, filtering, completion, reminders, and per-crop task templates (`task-templates.ts`)
- `src/modules/activities` - activity logs for farm operations
- `src/modules/harvests` - harvest and sucker harvest reporting
- `src/modules/expenses` - expense tracking and vendor costing
- `src/modules/notifications` - notifications and alert delivery
- `src/modules/settings` - notification settings and preferences
- `src/modules/analytics` - reporting and farm analytics
- `src/modules/email` - email delivery via Resend
- `src/modules/scheduler` - daily job logic and its externally-triggered endpoint
- `src/modules/seed` - seed data utilities
- `src/modules/prisma` - database connectivity and Prisma service

## Deployment

Deployed on Render as a web service, connected to this repo's `main` branch for auto-deploy on push (`npm run build` → `npm run start:prod`). Set the environment variables listed above in the Render dashboard. The database is a Supabase Postgres project — run `npx prisma db push` against it (with `DATABASE_URL`/`DIRECT_URL` pointed at Supabase) whenever `prisma/schema.prisma` changes.

## Notes

- Registration creates a default farm for the new user.
- Users may be added as farm members with roles such as OWNER, MANAGER, WORKER, and VIEWER.
- Batches default to `cropType: "plantain"` if not specified, so existing data is unaffected by multi-crop support.
- Email reminders are sent only when `RESEND_API_KEY` is configured.

## License

This repository is private and unlicensed.

# ASEDA Farm API

ASEDA Farm API is a NestJS backend for managing agricultural operations, crop batches, task workflows, harvest tracking, expenses, members, notifications, and farm analytics.

## Overview

This API supports farm operators with:

- user authentication and role-based access control
- farm and member management
- batch lifecycle tracking
- task scheduling, reminders, and completion tracking
- activity logging for farm operations
- expense recording and reporting
- harvest and sucker harvest management
- notification delivery via email and in-app alerts
- analytics and production insights

## Project setup

```bash
npm install
```

## Environment variables

Create a `.env` file in the repository root and configure:

```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM="ASEDA Farm <notifications@asedafarm.ng>"
```

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

Generate the Prisma client and apply migrations with:

```bash
npx prisma generate
npx prisma migrate dev
```

## Core modules

- `src/modules/auth` - authentication, registration, login, and member onboarding
- `src/modules/batches` - crop batches and planting lifecycle
- `src/modules/tasks` - task creation, filtering, completion, and reminders
- `src/modules/activities` - activity logs for farm operations
- `src/modules/harvests` - harvest and sucker harvest reporting
- `src/modules/expenses` - expense tracking and vendor costing
- `src/modules/notifications` - notifications and alert delivery
- `src/modules/settings` - notification settings and preferences
- `src/modules/analytics` - reporting and farm analytics
- `src/modules/email` - email delivery via Resend
- `src/modules/scheduler` - scheduled jobs, reminders, and digests
- `src/modules/seed` - seed data utilities
- `src/modules/prisma` - database connectivity and Prisma service

## Notes

- Registration creates a default farm for the new user.
- Users may be added as farm members with roles such as OWNER, MANAGER, WORKER, and VIEWER.
- Email reminders are sent only when `RESEND_API_KEY` is configured.

## License

This repository is private and unlicensed.

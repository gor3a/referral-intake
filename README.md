# referral-intake

A referral intake form for a pain management clinic. Law firm staff submit patient referrals, and clinic admins review them through a simple dashboard.

Built with Next.js 14 App Router, tRPC, Drizzle ORM, and PostgreSQL. Bun for package management.

---

## Getting started

You'll need Node.js 20+, [Bun](https://bun.sh), and Docker.

```bash
git clone https://github.com/gor3a/referral-intake
cd referral-intake
cp .env.example .env
docker compose up -d
bun install
bun db:migrate
bun dev
```

Open [http://localhost:3000](http://localhost:3000) for the referral form and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

---

## What it does

**Referral form (`/`)** — attorneys fill in patient details, contact info, and appointment preferences. Validated on both client and server using the same Zod schema. On submit, the referral is stored and a confirmation card is shown with a reference ID.

**Admin dashboard (`/admin`)** — lists all submitted referrals, searchable by patient name or law firm. Click any row to open the detail view.

**Referral detail (`/admin/[id]`)** — full breakdown of a referral with an inline status selector (New → Contacted → Scheduled → Cancelled). Status saves on change.

---

## Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| API | tRPC v11 |
| Database | PostgreSQL 16 via Docker |
| ORM | Drizzle |
| Validation | Zod — shared between client and server |
| Forms | React Hook Form + zodResolver |
| UI | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |

---

## Project layout

```
src/
  app/                  Pages and API routes (Next.js App Router)
  components/           Form, success card, admin search, status update
  server/
    db/                 Drizzle client + schema
    routers/            tRPC procedures
  lib/
    trpc/               Server context and React client setup
    validations/        Shared Zod schema
```

---

## Database scripts

```bash
bun db:generate   # generate migrations after schema changes
bun db:migrate    # apply pending migrations
bun db:studio     # open Drizzle Studio
```

---

## A few notes

The Zod schema in `src/lib/validations/referral.ts` is the single source of truth for validation — the tRPC router and the form both import from it, nothing is duplicated.

Date of birth is stored as a plain `YYYY-MM-DD` string for simplicity. In a production setup this would be a proper `date` column with timezone handling.

The admin pages are unauthenticated — intentional for this scope.

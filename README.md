# N-LAMS — National Land Acquisition & Management System

N-LAMS is a functional, persistent MVP for a national land-acquisition coordination and monitoring layer. Existing departmental and state systems remain systems of record; N-LAMS provides the unified view for projects, simulated/demo parcels, cases, statutory workflow stages, documents, compensation, possession, R&R, notifications, dashboards, reports, and auditability.

Local development uses a persistent `.data/nlams.json` repository; the production path is the Supabase/PostGIS schema. Demo geometry and external responses are synthetic and clearly labelled.

## Repository structure

```text
sih-26/
├── server/        # Express API, adapters, storage, middleware, seed
├── client/        # React/Vite application
├── supabase/      # PostgreSQL/PostGIS/RLS migrations
├── ARCHITECTURE.md
└── openapi.yaml
```

## Run locally

Prerequisites: Node.js 20+, npm, and optionally a Supabase project. The default `STORAGE_DRIVER=local` keeps the UI and API runnable without AWS or Supabase credentials.

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

The web portal runs on `http://localhost:5173`; the API runs on `http://localhost:4000`. Open `/login` for the demo sign-in. Demo data is explicitly labelled and contains no real citizen information. `npm run seed` is repeatable for the local fixture.

Demo accounts: `project@nlams.demo / Project@123`, `district@nlams.demo / District@123`, `national@nlams.demo / National@123`, `superadmin@nlams.demo / Admin@123`, `department@nlams.demo / Department@123`, `field@nlams.demo / Field@123`, `reviewer@nlams.demo / Reviewer@123`, and `viewer@nlams.demo / Viewer@123`. These credentials are for the demo environment only.

Frontend code is under `client/src`. `client/src/App.tsx` is intentionally only the route orchestrator; layouts, pages, and reusable components are exported from their respective files.

## Supabase setup

1. Create a Supabase project and enable email/password authentication.
2. Run `supabase/migrations/001_initial_schema.sql` followed by `supabase/migrations/002_reconciliation.sql`. `001_n_lams.sql` is a historical competing draft and must not be applied alongside the canonical pair.
3. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and the frontend `VITE_` values only in environment secrets. Never expose a service-role key or AWS secret to Vite.
4. Seed departments, states, districts, roles, workflow templates, and demo records through a controlled idempotent seed job.

The migration enables PostGIS, keeps source parcel geometry immutable, models partial acquisition in `project_parcels.affected_geometry`, and includes RLS policies for project, case, document, and audit access.

## Storage

The API exposes a presigned-upload contract through `POST /api/documents/presigned-upload`. `LocalStorage` is the default development implementation. Add an AWS S3 implementation behind the same `ObjectStorage` interface using `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_S3_BUCKET`; the browser still only receives short-lived URLs.

## API

The API uses a consistent `{ data, meta }` or `{ error }` response shape and validates create/presign payloads with Zod. Key endpoints include:

- `GET /api/dashboard/summary`
- `GET|POST /api/projects`, `GET /api/projects/:id`
- `GET /api/cases`, `GET /api/cases/:id`
- `POST /api/cases/:id/workflow/start`
- `POST /api/tasks/:id/complete` and `/reject`
- `POST /api/documents/presigned-upload`
- `GET /api/integrations/:system/status`

All external adapters are isolated under `server/src/integrations` and are clearly marked DEMO / MOCK. Dashboard, project, case, GIS, report, audit, and login screens use the backend API; local mutations persist, advance configured workflow stages, create notifications, and append audit events.

Legal disclaimer: This N-LAMS demonstration uses configurable workflow templates. The National Highways Act, 1956 workflow shown is a software demonstration based on relevant statutory sections and must not be treated as legal advice or as a substitute for applicable government procedures, rules, notifications, or current amendments.

## Architecture and deployment

See [ARCHITECTURE.md](./ARCHITECTURE.md) for system, database, RLS, GIS, document, S3, workflow, integration, and Mermaid data-flow diagrams. For deployment, build the Vite app as a static artifact, deploy the Express API behind TLS and a reverse proxy, keep Supabase/S3 credentials in a secret manager, and set `CLIENT_URL` to the deployed web origin.

The initial REST contract is documented in `openapi.yaml`.

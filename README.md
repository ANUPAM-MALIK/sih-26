# N-LAMS — National Land Acquisition & Management System

Production-oriented MVP for a national monitoring and integration layer. Existing departmental and state systems remain systems of record; N-LAMS provides the unified view for cases, parcels, workflows, documents, compensation, R&R, dashboards, and auditability.

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
npm run dev
```

The web portal runs on `http://localhost:5173`; the API runs on `http://localhost:4000`. Open `/login` for the demo sign-in. Demo data is explicitly labelled and contains no real citizen information.

Frontend code is under `client/src`. `client/src/App.tsx` is intentionally only the route orchestrator; layouts, pages, and reusable components are exported from their respective files.

## Supabase setup

1. Create a Supabase project and enable email/password authentication.
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL editor or through the Supabase CLI.
3. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and the frontend `VITE_` values only in environment secrets. Never expose a service-role key or AWS secret to Vite.
4. Seed departments, states, districts, roles, workflow templates, and demo records through a separate controlled seed job. `npm run seed` prints the expected demo fixture shape for local development.

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

All external adapters are isolated under `server/src/integrations` and are clearly marked DEMO / MOCK. The browser app currently uses the same canonical demo fixtures to keep the experience usable even when cloud services are not configured; replacing that source with the API client is a contained service-layer change.

## Architecture and deployment

See [ARCHITECTURE.md](./ARCHITECTURE.md) for system, database, RLS, GIS, document, S3, workflow, integration, and Mermaid data-flow diagrams. For deployment, build the Vite app as a static artifact, deploy the Express API behind TLS and a reverse proxy, keep Supabase/S3 credentials in a secret manager, and set `CLIENT_URL` to the deployed web origin.

The initial REST contract is documented in `openapi.yaml`.

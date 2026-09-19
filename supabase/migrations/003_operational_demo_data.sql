-- Operational dashboard data, relationships, and an idempotent demo dataset.
-- Apply after 001_initial_schema.sql and 002_reconciliation.sql.

create table if not exists public.case_activity (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.acquisition_cases(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  message text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists case_activity_case_created_idx on public.case_activity(case_id, created_at desc);

-- Keep the aggregate R&R fields used by the operational dashboard alongside
-- the individual-family fields from the base schema.
alter table public.rr_records add column if not exists affected_families integer not null default 0;
alter table public.rr_records add column if not exists displaced_families integer not null default 0;
alter table public.rr_records add column if not exists eligible_families integer not null default 0;
alter table public.rr_records add column if not exists benefits_delivered integer not null default 0;
alter table public.rr_records add column if not exists source_system text not null default 'N-LAMS';
alter table public.compensation_records add column if not exists source_system text not null default 'N-LAMS';
alter table public.compensation_records add column if not exists external_reference text;

-- Views intentionally join through project_parcels, so records on both
-- financial screens always lead back to the same case and cadastral parcel.
create or replace view public.compensation_dashboard as
select
  cr.id, ac.case_id as case_reference, ac.id as case_uuid,
  p.name as project_name, pr.parcel_id, pr.village,
  cr.eligible_amount as assessed_amount, cr.award_amount as approved_amount,
  cr.paid_amount, cr.payment_status as status, cr.payment_reference,
  cr.last_synchronized_at
from public.compensation_records cr
join public.acquisition_cases ac on ac.id = cr.case_id
join public.projects p on p.id = ac.project_id
join public.project_parcels pp on pp.id = ac.project_parcel_id
join public.parcels pr on pr.id = pp.parcel_id;

create or replace view public.rr_dashboard as
select
  rr.id, ac.case_id as case_reference, ac.id as case_uuid,
  p.name as project_name, pr.parcel_id, pr.village,
  rr.affected_families, rr.displaced_families, rr.eligible_families,
  rr.benefits_delivered, rr.status
from public.rr_records rr
join public.acquisition_cases ac on ac.id = rr.case_id
join public.projects p on p.id = ac.project_id
join public.project_parcels pp on pp.id = ac.project_parcel_id
join public.parcels pr on pr.id = pp.parcel_id;

insert into public.departments (id, name, code)
values ('10000000-0000-0000-0000-000000000001', 'Ministry of Road Transport & Highways — Demo', 'MORTH-DEMO')
on conflict (code) do update set name = excluded.name;
insert into public.states (id, name, code)
values ('10000000-0000-0000-0000-000000000002', 'Haryana', 'HR')
on conflict (code) do update set name = excluded.name;
insert into public.districts (id, state_id, name)
select '10000000-0000-0000-0000-000000000003', s.id, 'Ambala'
from public.states s where s.code = 'HR'
on conflict do nothing;

insert into public.projects (id, project_id, name, department_id, project_type, state_id, district_id, description, status, target_completion_date, geometry)
select
  '20000000-0000-0000-0000-000000000001', 'NH-DEMO-PB-001',
  'NH-44 Corridor Expansion — Demo Section', d.id, 'National Highway', s.id, di.id,
  'Synthetic corridor record for the N-LAMS demonstration. No citizen data is included.',
  'IN_PROGRESS', date '2027-03-31',
  st_setsrid(st_makeline(array[st_makepoint(76.776, 30.362), st_makepoint(76.873, 30.407)]), 4326)
from public.departments d
join public.states s on s.code = 'HR'
join public.districts di on di.state_id = s.id and di.name = 'Ambala'
where d.code = 'MORTH-DEMO'
on conflict (project_id) do update set name = excluded.name, description = excluded.description, updated_at = now();

insert into public.parcels (id, parcel_id, state_id, district_id, tehsil, village, survey_number, total_area, geometry)
select
  ('30000000-0000-0000-0000-' || lpad(series::text, 12, '0'))::uuid,
  'PCL-' || lpad((127 + series)::text, 5, '0'), s.id, di.id, 'Ambala',
  case when series % 2 = 0 then 'Demo Village' else 'Corridor Kalan' end,
  (141 + series)::text || '/' || ((series % 4) + 1)::text,
  2.4 + (series * .31),
  st_makeenvelope(76.779 + (series * .009), 30.363 + (series * .004), 76.786 + (series * .009), 30.369 + (series * .004), 4326)
from generate_series(1, 10) as series
join public.states s on s.code = 'HR'
join public.districts di on di.state_id = s.id and di.name = 'Ambala'
on conflict (parcel_id) do nothing;

insert into public.project_parcels (id, project_id, parcel_id, required_area, affected_geometry)
select
  ('40000000-0000-0000-0000-' || lpad(series::text, 12, '0'))::uuid,
  p.id, pr.id, 1.1 + (series * .15), pr.geometry
from generate_series(1, 10) as series
join public.projects p on p.project_id = 'NH-DEMO-PB-001'
join public.parcels pr on pr.parcel_id = 'PCL-' || lpad((127 + series)::text, 5, '0')
on conflict (project_id, parcel_id) do nothing;

insert into public.acquisition_cases (id, case_id, project_id, project_parcel_id, land_owner_reference, status, priority, risk_level, current_stage, acquisition_purpose)
select
  ('50000000-0000-0000-0000-' || lpad(series::text, 12, '0'))::uuid,
  case when series = 1 then 'NLA-C-00231' else 'NLA-C-' || lpad((230 + series)::text, 5, '0') end,
  p.id, pp.id, 'DEMO-OWNER-' || series,
  'IN_PROGRESS', case when series in (3, 7) then 'HIGH' else 'MEDIUM' end,
  case when series = 3 then 'HIGH' else 'LOW' end,
  (array['Field verification', 'Field verification review', '3C Objection hearing', '3D Declaration of acquisition', '3G Compensation determination', '3H Deposit and payment', '3E Taking possession', 'R&R completion', '3A Preliminary notification', '3G Compensation determination'])[series],
  'NH-44 corridor expansion — demonstration'
from generate_series(1, 10) as series
join public.projects p on p.project_id = 'NH-DEMO-PB-001'
join public.project_parcels pp on pp.id = ('40000000-0000-0000-0000-' || lpad(series::text, 12, '0'))::uuid
on conflict (case_id) do nothing;

insert into public.compensation_records (id, case_id, eligible_amount, award_amount, paid_amount, payment_status, payment_reference, external_payment_system, source_system, external_reference, last_synchronized_at)
select
  ('60000000-0000-0000-0000-' || lpad(series::text, 12, '0'))::uuid,
  ac.id, 1000000 + (series * 125000),
  case when series >= 5 then 950000 + (series * 100000) else 0 end,
  case when series >= 6 then 950000 + (series * 100000) else 0 end,
  case when series >= 6 then 'PAID' when series >= 5 then 'APPROVED' else 'ASSESSED' end,
  case when series >= 6 then 'DEMO-PFMS-2026-0042' else null end,
  'PFMS (DEMO)', 'PFMS (DEMO)', case when series >= 6 then 'DEMO-PFMS-2026-0042' else null end, now()
from generate_series(1, 10) as series
join public.acquisition_cases ac on ac.id = ('50000000-0000-0000-0000-' || lpad(series::text, 12, '0'))::uuid
on conflict (case_id) do nothing;

insert into public.rr_records (id, case_id, affected_family_reference, eligible, entitlement_type, status, affected_families, displaced_families, eligible_families, benefits_delivered, source_system)
select
  ('70000000-0000-0000-0000-' || lpad(series::text, 12, '0'))::uuid,
  ac.id, 'DEMO-FAMILY-GROUP-' || series, true, 'Relocation and livelihood package',
  case when series > 6 then 'COMPLETED' else 'IN_PROGRESS' end,
  5 + series, series % 3, 4 + series, case when series > 6 then 4 + series else series end, 'N-LAMS DEMO'
from generate_series(1, 10) as series
join public.acquisition_cases ac on ac.id = ('50000000-0000-0000-0000-' || lpad(series::text, 12, '0'))::uuid
on conflict (case_id) do nothing;

insert into public.possession_records (id, case_id, status)
select
  ('80000000-0000-0000-0000-' || lpad(series::text, 12, '0'))::uuid,
  ac.id, case when series > 7 then 'POSSESSION_COMPLETED' when series > 5 then 'READY' else 'NOT_READY' end
from generate_series(1, 10) as series
join public.acquisition_cases ac on ac.id = ('50000000-0000-0000-0000-' || lpad(series::text, 12, '0'))::uuid
on conflict (case_id) do nothing;

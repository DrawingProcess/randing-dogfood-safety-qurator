-- 믿고멍냥 MVP schema

create extension if not exists pgcrypto;

create type public.pet_type as enum ('dog', 'cat');
create type public.product_category as enum ('food', 'snack');
create type public.size_type as enum ('small', 'medium', 'large', 'kitten', 'adult', 'senior', 'all');
create type public.product_status as enum ('active', 'inactive');

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  category public.product_category not null,
  pet_type public.pet_type not null,
  size_type public.size_type not null default 'all',
  price integer not null check (price >= 0),
  brand text not null default '',
  manufacturer text not null default '',
  country_of_origin text not null default '',
  is_handmade boolean not null default false,
  manufacturing_method text not null default '',
  main_protein text not null default '',
  image_url text not null default '',
  detail_description text not null default '',
  status public.product_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_badges (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  badge_type text not null check (
    badge_type in (
      'ingredient_checked',
      'manufacturing_checked',
      'korea_made',
      'single_protein',
      'handmade'
    )
  ),
  badge_label text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  alt_text text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  user_id uuid,
  event_name text not null,
  page text not null default '',
  product_id uuid,
  pet_type public.pet_type,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  response_id text unique,
  pet_type public.pet_type,
  age_group text,
  weight_group text,
  breed text,
  pet_count integer,
  current_food text,
  current_brand text,
  purchase_channel text,
  purchase_frequency text,
  monthly_spend text,
  snack_frequency text,
  main_concerns jsonb not null default '[]'::jsonb,
  ingredient_concern text,
  allergy_concern text,
  palatability_concern text,
  origin_concern text,
  manufacturing_concern text,
  service_interest text,
  desired_features jsonb not null default '[]'::jsonb,
  comparison_friction text,
  safety_mark_interest text,
  future_purchase_intent text,
  expected_purchase_frequency text,
  expected_spend text,
  interested_categories text,
  interview_interest text,
  other_opinion text,
  free_text jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists products_browse_idx
  on public.products (status, pet_type, category, size_type);
create index if not exists analytics_events_name_idx
  on public.analytics_events (event_name, created_at);
create index if not exists analytics_events_session_idx
  on public.analytics_events (session_id);
create index if not exists analytics_events_product_idx
  on public.analytics_events (product_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.product_badges enable row level security;
alter table public.product_images enable row level security;
alter table public.analytics_events enable row level security;
alter table public.survey_responses enable row level security;

drop policy if exists "public read active products" on public.products;
create policy "public read active products"
on public.products
for select
to anon, authenticated
using (status = 'active');

drop policy if exists "public read badges of active products" on public.product_badges;
create policy "public read badges of active products"
on public.product_badges
for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);

drop policy if exists "public read images of active products" on public.product_images;
create policy "public read images of active products"
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);

drop policy if exists "public insert analytics events" on public.analytics_events;
create policy "public insert analytics events"
on public.analytics_events
for insert
to anon, authenticated
with check (char_length(event_name) between 1 and 80);

revoke all on public.analytics_events from anon, authenticated;
grant insert on public.analytics_events to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.product_badges to anon, authenticated;
grant select on public.product_images to anon, authenticated;
revoke all on public.survey_responses from anon, authenticated;

create or replace view public.analytics_funnel as
select
  count(distinct session_id) filter (where event_name = 'page_view' and page = '/') as landing_visitors,
  count(distinct session_id) filter (where event_name = 'product_detail_viewed') as product_detail,
  count(distinct session_id) filter (where event_name = 'sample_cta_clicked') as sample_cta,
  count(distinct session_id) filter (where event_name = 'sample_page_viewed') as sample_page,
  count(distinct session_id) filter (where event_name = 'google_form_clicked') as google_form,
  count(distinct session_id) as total_visitors
from public.analytics_events;

create or replace view public.analytics_product_stats as
select
  p.id,
  p.name,
  p.pet_type,
  p.category,
  count(distinct e.session_id) filter (where e.event_name = 'product_card_clicked') as card_clicks,
  count(distinct e.session_id) filter (where e.event_name = 'product_detail_viewed') as detail_views,
  count(distinct e.session_id) filter (
    where e.event_name = 'product_detail_viewed'
      and exists (
        select 1
        from public.analytics_events s
        where s.session_id = e.session_id
          and s.event_name = 'sample_cta_clicked'
          and s.created_at >= e.created_at
      )
  ) as sample_cta_after
from public.products p
left join public.analytics_events e on e.product_id = p.id
group by p.id, p.name, p.pet_type, p.category;

create or replace view public.analytics_pet_type_stats as
select
  (select count(distinct session_id) from public.analytics_events where pet_type = 'dog') as dog_visitors,
  (select count(distinct session_id) from public.analytics_events where pet_type = 'cat') as cat_visitors,
  (select count(distinct session_id) from public.analytics_events where pet_type = 'dog' and event_name = 'sample_cta_clicked') as dog_sample_cta,
  (select count(distinct session_id) from public.analytics_events where pet_type = 'cat' and event_name = 'sample_cta_clicked') as cat_sample_cta;

create or replace view public.analytics_category_stats as
select
  c.category,
  (
    select count(distinct session_id)
    from public.analytics_events
    where event_name = 'category_view'
      and metadata->>'category' = c.category
  ) as category_views,
  (
    select count(distinct e.session_id)
    from public.analytics_events e
    join public.products p on p.id = e.product_id
    where e.event_name = 'product_card_clicked'
      and p.category::text = c.category
  ) as card_clicks,
  (
    select count(distinct e.session_id)
    from public.analytics_events e
    join public.products p on p.id = e.product_id
    where e.event_name = 'product_detail_viewed'
      and p.category::text = c.category
  ) as detail_views,
  (
    select count(distinct e.session_id)
    from public.analytics_events e
    join public.products p on p.id = e.product_id
    where e.event_name = 'product_detail_viewed'
      and p.category::text = c.category
      and exists (
        select 1
        from public.analytics_events s
        where s.session_id = e.session_id
          and s.event_name = 'sample_cta_clicked'
          and s.created_at >= e.created_at
      )
  ) as sample_cta_after
from (values ('food'), ('snack')) as c(category);

revoke all on public.analytics_funnel from anon, authenticated;
revoke all on public.analytics_product_stats from anon, authenticated;
revoke all on public.analytics_pet_type_stats from anon, authenticated;
revoke all on public.analytics_category_stats from anon, authenticated;
grant select on public.analytics_funnel to service_role;
grant select on public.analytics_product_stats to service_role;
grant select on public.analytics_pet_type_stats to service_role;
grant select on public.analytics_category_stats to service_role;

do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'storage') then
    insert into storage.buckets (id, name, public)
    values ('product-images', 'product-images', true)
    on conflict (id) do nothing;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'storage'
        and tablename = 'objects'
        and policyname = 'public read product images'
    ) then
      execute $policy$
        create policy "public read product images"
        on storage.objects
        for select
        to anon, authenticated
        using (bucket_id = 'product-images')
      $policy$;
    end if;
  end if;
end $$;

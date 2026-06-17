-- ============================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- Enable RLS on all tables
alter table public.projects        enable row level security;
alter table public.skills          enable row level security;
alter table public.experiences     enable row level security;
alter table public.education       enable row level security;
alter table public.certifications  enable row level security;
alter table public.messages        enable row level security;
alter table public.page_views      enable row level security;
alter table public.admin_users     enable row level security;

-- ============================================================
-- Helper: is_admin() — returns true if the authenticated user
-- exists in admin_users table.
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.admin_users
    where email = (select email from auth.users where id = auth.uid())
  );
$$;

-- ============================================================
-- PUBLIC READ POLICIES (anyone can read portfolio content)
-- ============================================================
create policy "Public can read projects"       on public.projects       for select using (true);
create policy "Public can read skills"         on public.skills         for select using (true);
create policy "Public can read experiences"    on public.experiences    for select using (true);
create policy "Public can read education"      on public.education      for select using (true);
create policy "Public can read certifications" on public.certifications for select using (true);

-- ============================================================
-- MESSAGES: anyone can INSERT (contact form)
-- Only admin can SELECT / UPDATE / DELETE
-- ============================================================
create policy "Anyone can send a message"      on public.messages for insert with check (true);
create policy "Admin can read messages"        on public.messages for select using (public.is_admin());
create policy "Admin can update messages"      on public.messages for update using (public.is_admin());
create policy "Admin can delete messages"      on public.messages for delete using (public.is_admin());

-- ============================================================
-- PAGE VIEWS: anyone can INSERT (analytics)
-- Only admin can SELECT / DELETE
-- ============================================================
create policy "Anyone can log a page view"     on public.page_views for insert with check (true);
create policy "Admin can read page views"      on public.page_views for select using (public.is_admin());
create policy "Admin can delete page views"    on public.page_views for delete using (public.is_admin());

-- ============================================================
-- PROJECT VIEW COUNTER: anyone can increment views
-- (Done via RPC function below to avoid exposing UPDATE policy)
-- ============================================================
create or replace function public.increment_project_views(project_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.projects set views = views + 1 where slug = project_slug;
$$;

-- ============================================================
-- ADMIN-ONLY WRITE POLICIES (projects, skills, experiences,
-- education, certifications, admin_users)
-- ============================================================
create policy "Admin can create projects"      on public.projects for insert with check (public.is_admin());
create policy "Admin can update projects"      on public.projects for update using (public.is_admin());
create policy "Admin can delete projects"      on public.projects for delete using (public.is_admin());

create policy "Admin can create skills"        on public.skills for insert with check (public.is_admin());
create policy "Admin can update skills"        on public.skills for update using (public.is_admin());
create policy "Admin can delete skills"        on public.skills for delete using (public.is_admin());

create policy "Admin can create experiences"   on public.experiences for insert with check (public.is_admin());
create policy "Admin can update experiences"   on public.experiences for update using (public.is_admin());
create policy "Admin can delete experiences"   on public.experiences for delete using (public.is_admin());

create policy "Admin can create education"     on public.education for insert with check (public.is_admin());
create policy "Admin can update education"     on public.education for update using (public.is_admin());
create policy "Admin can delete education"     on public.education for delete using (public.is_admin());

create policy "Admin can create certifications" on public.certifications for insert with check (public.is_admin());
create policy "Admin can update certifications" on public.certifications for update using (public.is_admin());
create policy "Admin can delete certifications" on public.certifications for delete using (public.is_admin());

-- ============================================================
-- AUTH TRIGGER: auto-insert into admin_users on first magic-link
-- login IF the email matches the portfolio owner env var.
-- Configure via Supabase Dashboard > Auth > Users or via the
-- email allow-list approach.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only add to admin_users if the email matches the portfolio owner
  if new.email = current_setting('app.portfolio_owner_email', true) then
    insert into public.admin_users (email, name, role)
    values (new.email, 'MAHOP Olivier Constantin', 'admin')
    on conflict (email) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Set the portfolio owner email (run once, replace with yours)
-- alter database postgres set app.portfolio_owner_email = 'Mahopolivierconstantin39@gmail.com';

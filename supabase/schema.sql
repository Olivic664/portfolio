-- ============================================================
-- SUPABASE SCHEMA — MAHOP Olivier Constantin Portfolio
-- Production schema for PostgreSQL on Supabase
-- Run this in: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.projects (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  title       text not null,
  summary     text not null,
  description text not null,
  tags        text[] not null default '{}',          -- ['ML','Data Engineering','GenAI','Web','IoT']
  metrics     jsonb,                                  -- {"precision":"98.2%","recall":"96.8%"}
  tech_stack  text[] not null default '{}',
  repo_url    text,
  demo_url    text,
  image_url   text,
  featured    boolean not null default false,
  "order"     integer not null default 0,
  views       integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_slug_idx on public.projects(slug);
create index if not exists projects_featured_idx on public.projects(featured);

create table if not exists public.skills (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  category   text not null,           -- 'Languages','ML/DL','Data Viz','Databases','DevOps','Tools'
  level      integer not null check (level between 0 and 100),
  "order"    integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists skills_category_idx on public.skills(category);

create table if not exists public.experiences (
  id          uuid primary key default uuid_generate_v4(),
  role        text not null,
  company     text not null,
  location    text,
  start_date  text not null,
  end_date    text,
  current     boolean not null default false,
  description text not null,
  situation   text,                   -- STAR: Situation
  task        text,                   -- STAR: Task
  actions     text[],                 -- STAR: Actions (array of bullets)
  results     text[],                 -- STAR: Results (array of bullets)
  "order"     integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.education (
  id          uuid primary key default uuid_generate_v4(),
  diploma     text not null,
  school      text not null,
  period      text not null,
  description text,
  "order"     integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.certifications (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  issuer     text not null,
  year       text not null,
  url        text,
  "order"    integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  read       boolean not null default false,
  replied    boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists messages_read_idx on public.messages(read);
create index if not exists messages_created_at_idx on public.messages(created_at desc);

create table if not exists public.page_views (
  id         uuid primary key default uuid_generate_v4(),
  path       text not null,
  referrer   text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_path_idx on public.page_views(path);
create index if not exists page_views_created_at_idx on public.page_views(created_at desc);

create table if not exists public.admin_users (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  name       text,
  role       text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  for t in select unnest(array[
    'projects','skills','experiences','education','certifications',
    'messages','admin_users'
  ])
  loop
    execute format($f$
      drop trigger if exists set_updated_at on public.%I;
      create trigger set_updated_at before update on public.%I
      for each row execute function public.handle_updated_at();
    $f$, t, t);
  end loop;
end$$;

-- ============================================================
-- SEED DATA (idempotent — uses ON CONFLICT)
-- ============================================================

insert into public.projects (slug, title, summary, description, tags, metrics, tech_stack, repo_url, demo_url, featured, "order") values
  ('spam-detector-ml',
   'Spam Detector ML',
   'Classifieur de spam haute précision avec TF-IDF + Naive Bayes',
   'Pipeline ML end-to-end pour la détection de spam: vectorisation TF-IDF, classification Naive Bayes, validation croisée et évaluation complète. Atteint une précision de 98.2% et un rappel de 96.8% sur le jeu de test.',
   array['ML'],
   '{"precision":"98.2%","recall":"96.8%","f1":"97.5%"}'::jsonb,
   array['Python','scikit-learn','TF-IDF','Naive Bayes','Pandas'],
   'https://github.com/Olivic664', null, true, 1)
  on conflict (slug) do nothing;

insert into public.projects (slug, title, summary, description, tags, metrics, tech_stack, repo_url, demo_url, featured, "order") values
  ('nexacommerce-cameroun',
   'NexaCommerce Cameroun',
   'Pipeline data engineering complet pour e-commerce',
   'Pipeline data engineering complet: ingestion, transformation ETL, analyse exploratoire (EDA) et tests unitaires. Gestion des dépendances avec Poetry, requêtes SQL analytiques, et qualité de code vérifiée par tests automatisés.',
   array['Data Engineering'],
   '{"etl_stages":"4","test_coverage":"85%"}'::jsonb,
   array['Python','Poetry','SQL','Pandas','pytest'],
   'https://github.com/Olivic664', null, true, 2)
  on conflict (slug) do nothing;

insert into public.projects (slug, title, summary, description, tags, metrics, tech_stack, repo_url, demo_url, featured, "order") values
  ('intellieval-agent',
   'IntelliEval',
   'Agent conversationnel académique pour l''évaluation pédagogique',
   'Agent conversationnel intelligent pour l''évaluation académique. Architecture Next.js + Nest.js, modélisation UML complète et processus 2TUP. Le prototype a permis d''augmenter le taux de réponse aux enquêtes de 35% grâce à l''anonymisation UX.',
   array['GenAI','Web'],
   '{"response_rate_boost":"+35%","architecture":"Next.js + Nest.js"}'::jsonb,
   array['Next.js','Nest.js','LangChain','UML','2TUP'],
   'https://github.com/Olivic664', null, true, 3)
  on conflict (slug) do nothing;

insert into public.projects (slug, title, summary, description, tags, metrics, tech_stack, repo_url, demo_url, featured, "order") values
  ('solarmboa-iot',
   'SolarMboa IoT',
   'Plateforme IoT pour données de capteurs solaires',
   'Plateforme IoT temps réel pour collecter, stocker et visualiser les données de capteurs solaires. Stack: MongoDB pour le stockage chaud, Redis pour le cache, FastAPI pour l''API REST.',
   array['IoT','Web'],
   '{"sensors":"50+","api_latency":"<200ms"}'::jsonb,
   array['MongoDB','Redis','FastAPI','Python','IoT'],
   'https://github.com/Olivic664', null, false, 4)
  on conflict (slug) do nothing;

insert into public.projects (slug, title, summary, description, tags, metrics, tech_stack, repo_url, demo_url, featured, "order") values
  ('cancer-diagnosis-prediction',
   'Cancer Diagnosis Prediction',
   'Pipeline ML complet pour le diagnostic du cancer',
   'Pipeline ML complet: exploration, prétraitement, comparaison de 5 algorithmes, hyperparameter tuning avec GridSearchCV et évaluation rigoureuse (ROC-AUC, précision, rappel). Modèle final déployable en production.',
   array['ML'],
   '{"algorithms_compared":"5","best_auc":"0.94"}'::jsonb,
   array['Python','scikit-learn','TensorFlow','Matplotlib','GridSearchCV'],
   'https://github.com/Olivic664', null, true, 5)
  on conflict (slug) do nothing;

-- SKILLS
insert into public.skills (name, category, level, "order") values
  ('Python', 'Languages', 95, 1),
  ('R', 'Languages', 80, 2),
  ('SQL', 'Languages', 90, 3),
  ('scikit-learn', 'ML/DL', 92, 1),
  ('TensorFlow', 'ML/DL', 82, 2),
  ('HuggingFace', 'ML/DL', 78, 3),
  ('LangChain', 'ML/DL', 80, 4),
  ('Power BI', 'Data Viz', 88, 1),
  ('Seaborn', 'Data Viz', 85, 2),
  ('Matplotlib', 'Data Viz', 90, 3),
  ('MySQL', 'Databases', 85, 1),
  ('PostgreSQL', 'Databases', 88, 2),
  ('Docker', 'DevOps', 75, 1),
  ('GitHub', 'DevOps', 90, 2),
  ('Next.js', 'Tools', 78, 1)
  on conflict do nothing;

-- EXPERIENCES (STAR format)
insert into public.experiences (role, company, location, start_date, end_date, current, description, situation, task, actions, results, "order") values
  ('Data Scientist (Stagiaire)',
   'Université de Douala',
   'Douala, Cameroun',
   '01/2025',
   '06/2025',
   false,
   'Application web intelligente pour l''évaluation pédagogique avec IA',
   'L''Université de Douala cherchait à moderniser son système d''évaluation pédagogique tout en garantissant l''anonymat des répondants pour augmenter le taux de participation.',
   'Concevoir et développer une application web intelligente pour l''évaluation pédagogique, incluant un agent conversationnel et des tableaux de bord interactifs.',
   array['Analyse du besoin métier avec les parties prenantes académiques',
         'Conception de l''architecture Next.js + Nest.js avec modélisation UML/2TUP',
         'Intégration d''un agent conversationnel académique (LangChain)',
         'Implémentation de l''anonymisation UX pour rassurer les répondants',
         'Développement de tableaux de bord interactifs et génération automatisée de rapports'],
   array['+35% de taux de réponse aux enquêtes grâce à l''anonymisation UX',
         'Prototype fonctionnel livré et validé par l''équipe pédagogique',
         'Tableaux de bord interactifs déployés et utilisés en production',
         'Génération automatisée de rapports PDF économisant plusieurs heures par semaine'],
   1)
  on conflict do nothing;

insert into public.experiences (role, company, location, start_date, end_date, current, description, situation, task, actions, results, "order") values
  ('Data Analyst (Stage)',
   'SYAR',
   'Douala, Cameroun',
   '12/2023',
   '12/2024',
   false,
   'Analyse de données patients SIDA, dashboards Power BI, modèle de scoring',
   'SYAR disposait d''un volume important de données patients liées au suivi du SIDA mais manquait d''outils analytiques pour transformer ces données en décisions médicales.',
   'Analyser les données patients, construire des dashboards Power BI décisionnels et développer un modèle de scoring pour prioriser les cas à risque.',
   array['Nettoyage et structuration des données patients (SQL + Python)',
         'Exploration statistique et identification des variables corrélées au risque',
         'Conception de dashboards Power BI adaptés aux équipes médicales',
         'Développement d''un modèle de scoring patient (classification)',
         'Présentation des résultats aux équipes médicales et itérations'],
   array['Impact direct sur la prise de décision médicale',
         'Dashboards Power BI adoptés en routine par les équipes soignantes',
         'Modèle de scoring permettant de prioriser les patients à risque élevé',
         'Réduction du temps d''analyse des données patients'],
   2)
  on conflict do nothing;

-- EDUCATION
insert into public.education (diploma, school, period, description, "order") values
  ('Data & AI Engineer',
   'DHI Academy (FNE)',
   '2025 – 2026',
   'Formation intensive orientée MLOps, Cloud, GenAI et LLMs. Projets pratiques sur la mise en production de modèles et l''orchestration de pipelines IA.',
   1),
  ('Master MIAGE – Systèmes Intelligents',
   'Université de Douala',
   '2023 – 2025',
   'Spécialisation en systèmes intelligents: apprentissage automatique, bases de données avancées, génie logiciel et conception de systèmes décisionnels.',
   2),
  ('Licence Génie Logiciel',
   'IUT de Douala',
   '2021 – 2022',
   'Fondamentaux du génie logiciel: programmation orientée objet, bases de données, conception UML et méthodes agiles.',
   3)
  on conflict do nothing;

-- CERTIFICATIONS
insert into public.certifications (name, issuer, year, url, "order") values
  ('Machine Learning & Deep Learning', 'Udemy', '2024', null, 1),
  ('LangChain Developer', 'LangChain', '2025', null, 2),
  ('TensorFlow / Keras Developer', 'TensorFlow', '2024', null, 3),
  ('Data Science Professional', 'DataCamp', '2024', null, 4)
  on conflict do nothing;

-- ============================================================
-- ADMIN USER (replace email with yours)
-- Connect via Supabase Auth magic link; first login auto-creates the row.
-- ============================================================
insert into public.admin_users (email, name, role) values
  ('Mahopolivierconstantin39@gmail.com', 'MAHOP Olivier Constantin', 'admin')
  on conflict (email) do nothing;

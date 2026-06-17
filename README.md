# Portfolio — MAHOP Olivier Constantin

> Portfolio professionnel complet pour Data Scientist & Data Engineer.
> Construit avec Next.js 14+ (App Router), Tailwind CSS, shadcn/ui, Prisma/Supabase et NextAuth.

## Aperçu

Portfolio personnel d'Olivier MAHOP, Data Scientist & Data Engineer en formation à Douala, Cameroun. Le site présente 5 projets clés (ML, Data Engineering, GenAI, IoT), un parcours professionnel au format STAR, des compétences techniques avec niveaux de maîtrise, et un formulaire de contact fonctionnel avec stockage en base de données. Un dashboard admin privé permet de gérer les projets (CRUD complet) et de consulter les messages reçus.

## Stack technique

| Domaine | Technologie |
|---------|-------------|
| Frontend + Backend | Next.js 14+ (App Router, Server Actions, API Routes) |
| Style | Tailwind CSS 4 + shadcn/ui (New York style) |
| Base de données (dev) | Prisma + SQLite |
| Base de données (prod) | Supabase (PostgreSQL) — schéma fourni dans `/supabase` |
| Authentification (dev) | NextAuth.js v4 (Credentials provider) |
| Authentification (prod) | Supabase Auth (magic link ou OAuth GitHub) |
| Animations | Framer Motion |
| Thème | next-themes (light/dark) |
| Déploiement | Vercel |
| Langue | TypeScript 5 strict |

## Fonctionnalités

### Public

- **Hero animé** : titre avec effet typewriter, badge "Open to remote opportunities", CTAs vers projets/contact/CV.
- **Section About** : bio, stats (projets, certifications, langues), formation et certifications.
- **Section Projects** : 5 cards filtrables par tag (ML, Data Engineering, GenAI, Web, IoT), avec métriques clés (précision, rappel, boost, etc.), tech stack, liens GitHub/demo, compteur de vues par projet (analytics léger).
- **Section Skills** : 15 compétences organisées en 6 catégories (Languages, ML/DL, Data Viz, Databases, DevOps, Tools) avec barres de progression animées.
- **Section Experience** : timeline au format **STAR** (Situation, Tâche, Actions, Résultats) avec accordions expandables.
- **Section Contact** : formulaire validé (Zod) qui stocke en base via Server Action. Retour utilisateur immédiat (succès/erreurs).
- **Footer** : navigation, contact, réseaux sociaux.
- **Dark mode** : toggle persistant via next-themes, responsive mobile-first.
- **SEO** : metadata par page, Open Graph tags, Twitter Cards, JSON-LD (Person + ItemList), sitemap-ready.
- **CV téléchargeable** : PDF servi depuis `/public/cv-mahop-olivier-constantin.pdf`.

### Admin (privé)

- **Login** : `/admin/login` — protégé par NextAuth (Credentials provider).
- **Dashboard** : `/admin` — statistiques (projets, messages, vues totales).
- **Gestion des projets** : CRUD complet via modal form (titre, résumé, description, tags, métriques clé/valeur, tech stack, repo/demo URLs, ordre, mise en avant).
- **Inbox des messages** : filtres (tous/non lus/répondus), marquer comme lu, marquer comme répondu, répondre par email (mailto:), supprimer.
- **Analytics** : compteur de vues par projet, journalisation des visites de pages.

## Structure de dossiers

```
.
├── prisma/
│   └── schema.prisma              # Schéma Prisma (modèles: Project, Skill, Experience, Education, Certification, Message, PageView, AdminUser)
├── public/
│   ├── cv-mahop-olivier-constantin.pdf   # Remplacez par votre vrai CV
│   ├── favicon.svg
│   └── og-image.png               # Image Open Graph (1200x630)
├── scripts/
│   ├── seed.ts                    # Seed initial de la base SQLite
│   ├── gen-assets.py              # Génère favicon + CV placeholder
│   └── gen-og-image.py            # Génère l'OG image
├── src/
│   ├── actions/
│   │   ├── projects.ts            # Server Actions: saveProject, deleteProject, incrementProjectViewsAction
│   │   ├── messages.ts            # Server Actions: sendMessage, markMessageRead, markMessageReplied, deleteMessage
│   │   └── views.ts               # Server Action: logPageViewAction
│   ├── app/
│   │   ├── layout.tsx             # Layout root: fonts, metadata SEO, JSON-LD, ThemeProvider
│   │   ├── page.tsx               # Page d'accueil (toutes les sections en single-page)
│   │   ├── globals.css            # Thème Tailwind (light/dark) + animations
│   │   ├── admin/
│   │   │   ├── page.tsx           # Dashboard admin (protégé)
│   │   │   └── login/
│   │   │       └── page.tsx       # Page de connexion
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts   # Endpoint NextAuth
│   ├── components/
│   │   ├── theme-provider.tsx     # Wrapper next-themes
│   │   ├── layout/
│   │   │   ├── navbar.tsx         # Navigation responsive + dark mode toggle + mobile menu
│   │   │   ├── footer.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── sections/
│   │   │   ├── hero.tsx           # Hero avec typewriter + badges + CTAs
│   │   │   ├── about.tsx          # Bio + stats + formation + certifications
│   │   │   ├── projects.tsx       # Cards filtrables par tag + métriques + view counter
│   │   │   ├── skills.tsx         # Compétences par catégorie avec barres animées
│   │   │   ├── experience.tsx     # Timeline STAR expandable
│   │   │   └── contact.tsx        # Formulaire -> Server Action -> DB
│   │   ├── admin/
│   │   │   ├── admin-dashboard.tsx # Layout admin (stats + tabs)
│   │   │   ├── projects-manager.tsx# CRUD projets (modal form)
│   │   │   ├── messages-inbox.tsx # Liste + actions sur messages
│   │   │   └── login-form.tsx
│   │   └── ui/                    # Composants shadcn/ui (déjà installés)
│   ├── hooks/                     # Hooks personnalisés
│   └── lib/
│       ├── constants.ts           # Profil, NAV_LINKS, PROJECT_TAGS, SKILL_CATEGORIES
│       ├── data.ts                # Couche d'accès aux données (Prisma; swappable pour Supabase)
│       ├── auth.ts                # NextAuth config (Credentials provider)
│       ├── db.ts                  # Client Prisma singleton
│       └── utils.ts               # Helpers (cn, etc.)
├── supabase/
│   ├── schema.sql                 # Schéma PostgreSQL complet pour Supabase
│   └── policies.sql               # RLS policies + trigger auto-admin
├── .env.local.example             # Variables d'environnement commentées
├── components.json                # Config shadcn/ui
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Démarrage rapide (développement local)

### 1. Prérequis

- Node.js 18+ (ou Bun)
- Un navigateur moderne

### 2. Installation

```bash
# Cloner le repo
git clone https://github.com/Olivic664/portfolio.git
cd portfolio

# Installer les dépendances
bun install   # ou: npm install / pnpm install
```

### 3. Variables d'environnement

```bash
cp .env.local.example .env.local
```

Éditez `.env.local` :

```bash
# Obligatoire: secret pour NextAuth
NEXTAUTH_SECRET="generer-avec-openssl-rand-base64-32"

# Identifiants admin (CHANGEZ-LES en production)
ADMIN_EMAIL="Mahopolivierconstantin39@gmail.com"
ADMIN_PASSWORD="votre-mot-de-passe-fort"

# URL publique (localhost en dev, votre domaine Vercel en prod)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Base de données

```bash
# Créer le schéma SQLite local
bun run db:push

# Seeder avec les données initiales (5 projets, 15 compétences, 2 expériences, etc.)
bun run scripts/seed.ts
```

### 5. Lancer le serveur de dev

```bash
bun run dev   # ou: npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### 6. Accéder au dashboard admin

1. Allez sur [http://localhost:3000/admin](http://localhost:3000/admin)
2. Vous serez redirigé vers `/admin/login`
3. Connectez-vous avec les identifiants définis dans `.env.local`
4. Gérez vos projets et messages

## Mise en production sur Vercel + Supabase

### Étape 1 — Créer le projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un nouveau projet.
2. Notez l'URL du projet (`https://xxxxx.supabase.co`) et la `anon key`.
3. Dans **SQL Editor**, exécutez successivement :
   - `supabase/schema.sql` (tables + seed data)
   - `supabase/policies.sql` (RLS + trigger auto-admin)
4. (Optionnel) Activez l'authentification magic link : **Authentication > Providers > Email > Enable**.
5. Ajoutez votre email dans la table `admin_users` (déjà fait par le seed si votre email correspond).

### Étape 2 — Connecter NextAuth à Supabase Auth (optionnel)

Par défaut, ce projet utilise NextAuth avec un Credentials provider. Pour basculer sur Supabase Auth :

1. Installez le SDK : `bun add @supabase/ssr @supabase/supabase-js`
2. Remplacez `src/lib/auth.ts` par une config basée sur `@supabase/ssr`
3. Remplacez `src/app/api/auth/[...nextauth]/route.ts` par les handlers Supabase (`createServerClient`)
4. Le reste du code (server actions, UI) reste identique

### Étape 3 — Migrer Prisma vers PostgreSQL Supabase

1. Dans `prisma/schema.prisma`, changez le provider :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("SUPABASE_DB_URL")
}
```

2. Ajoutez dans `.env.local` :

```bash
SUPABASE_DB_URL="postgresql://postgres:[MOT-DE-PASSE]@db.xxxxx.supabase.co:5432/postgres"
```

3. Poussez le schéma :

```bash
bun run db:push
bun run scripts/seed.ts
```

> ⚠️ Si vous avez déjà exécuté `schema.sql` dans Supabase, ne relancez pas `db:push` (les tables existent déjà). Le seed peut en revanche être ré-exécuté (idempotent grâce aux `upsert` / `on conflict`).

### Étape 4 — Déployer sur Vercel

1. Poussez le repo sur GitHub.
2. Allez sur [vercel.com](https://vercel.com) → **New Project** → importez le repo.
3. Ajoutez les variables d'environnement (Project Settings > Environment Variables) :

   | Variable | Valeur |
   |----------|--------|
   | `DATABASE_URL` | (Supabase DB URL ou Prisma Accelerate) |
   | `NEXTAUTH_SECRET` | généré via `openssl rand -base64 32` |
   | `ADMIN_EMAIL` | votre email |
   | `ADMIN_PASSWORD` | votre mot de passe fort |
   | `NEXT_PUBLIC_SITE_URL` | `https://votre-portfolio.vercel.app` |
   | `NEXT_PUBLIC_SUPABASE_URL` | (si Supabase) `https://xxxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (si Supabase) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (si Supabase, server-only) |

4. **Deploy**. Vercel détecte automatiquement Next.js.

### Étape 5 — Vérifier le déploiement

- Visitez votre URL Vercel.
- Testez le formulaire de contact (vérifiez que le message arrive dans `/admin`).
- Testez le login admin.
- Vérifiez les Open Graph tags avec [opengraph.xyz](https://www.opengraph.xyz/).
- Vérifiez le JSON-LD avec [validator.schema.org](https://validator.schema.org/).

## Personnalisation

### Modifier le contenu

- **Profil (nom, titre, email, liens)** : `src/lib/constants.ts` → objet `PROFILE`.
- **Liens de navigation** : `src/lib/constants.ts` → `NAV_LINKS`.
- **Tags de projets** : `src/lib/constants.ts` → `PROJECT_TAGS`.
- **Catégories de compétences** : `src/lib/constants.ts` → `SKILL_CATEGORIES`.
- **Données (projets, skills, expériences)** : via le dashboard admin OU en éditant `scripts/seed.ts`.

### Remplacer le CV

Placez votre vrai CV à `public/cv-mahop-olivier-constantin.pdf`. Si vous changez le nom du fichier, mettez à jour `PROFILE.cvPath` dans `src/lib/constants.ts`.

### Remplacer l'OG image

Remplacez `public/og-image.png` (1200×630 recommandé). Vous pouvez régénérer avec `python3 scripts/gen-og-image.py` (nécessite matplotlib).

### Changer les couleurs

Éditez `src/app/globals.css` :
- Les variables `--primary`, `--accent`, etc. existent en deux variantes (`:root` pour light, `.dark` pour dark).
- Le thème par défaut est emerald (vert). Pour le changer, remplacez les valeurs `oklch(0.55 0.13 160)` par vos propres couleurs.

## Scripts disponibles

```bash
bun run dev          # Serveur de dev (port 3000)
bun run build        # Build de production
bun run start        # Démarrer le serveur de prod
bun run lint         # ESLint
bun run db:push      # Pousser le schéma Prisma vers la DB
bun run db:generate  # Régénérer le client Prisma
bun run scripts/seed.ts  # Seeder la base de données
```

## Sécurité

- ✅ **RLS activée** sur toutes les tables Supabase (lecture publique pour le contenu, écriture admin uniquement).
- ✅ **Server Actions** vérifient systématiquement la session admin avant toute mutation.
- ✅ **Validation Zod** sur le formulaire de contact.
- ✅ **NEXTAUTH_SECRET** requis pour signer les JWTs.
- ✅ **Variables sensibles** (SUPABASE_SERVICE_ROLE_KEY) server-only.
- ⚠️ Pensez à utiliser un mot de passe **fort** pour `ADMIN_PASSWORD` en production.

## SEO

- Métadonnées complètes (title, description, keywords, robots) par page.
- Open Graph tags pour LinkedIn/Twitter/Facebook previews.
- Twitter Cards (`summary_large_image`).
- JSON-LD structuré : `Person` (profil) + `ItemList` (projets).
- Sitemap-friendly : URLs canoniques définies.
- `metadataBase` configuré pour les chemins d'images absolus.

## Performance

- Server Components pour les sections statiques (About, Projects, Skills, Experience).
- Client Components isolés pour les interactions (Hero animé, filtres projets, formulaire).
- `revalidate = 60` sur la page d'accueil (cache ISR).
- Fonts chargées via `next/font/google` (Inter + JetBrains Mono).
- Images optimisées via `next/image` (à utiliser pour vos futures images de projets).
- Animations Framer Motion avec `viewport={{ once: true }}` (pas de re-trigger au scroll).

## Licence

MIT — Libre d'utilisation et de modification.

## Contact

- **Email** : Mahopolivierconstantin39@gmail.com
- **LinkedIn** : http://bit.ly/4vFkelw
- **GitHub** : https://github.com/Olivic664
- **Localisation** : Douala, Cameroun (disponible remote)

---

Built with ❤️ by MAHOP Olivier Constantin.

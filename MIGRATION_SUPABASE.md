# Migration Supabase — Guide pas à pas

Ce document détaille comment migrer le portfolio de SQLite (dev) vers Supabase (production).

## ⚠️ Pourquoi migrer ?

En production sur Vercel, le filesystem est **éphémère et read-only**. SQLite ne peut pas fonctionner correctement :
- Les lectures peuvent échouer au cold start
- Les écritures (formulaire de contact, vues, admin CRUD) échoueront toujours
- → Provoque l'erreur "Application error: server-side exception" lors de la soumission du formulaire

**Supabase (PostgreSQL managé) résout ce problème** : la DB est persistante, accessible depuis n'importe quel environnement serverless.

---

## Étape 1 — Récupérer les clés Supabase

Tu m'as donné l'URL du projet : `https://cqptqxpxvgmoiyoelaqe.supabase.co`

Il faut maintenant récupérer les 2 clés API :

1. Va sur [supabase.com](https://supabase.com) → connecte-toi
2. Ouvre ton projet **cqptqxpxvgmoiyoelaqe**
3. Dans le menu de gauche, clique sur **Project Settings** (l'icône ⚙️ en bas)
4. Clique sur **API**
5. Tu vas voir 3 valeurs importantes :
   - **Project URL** : `https://cqptqxpxvgmoiyoelaqe.supabase.co` ✅ (déjà connu)
   - **anon public** : `eyJhbGciOiJIUzI1NiIsInR5cCI6...` ← **COPIE CELUI-CI**
   - **service_role** : `eyJhbGciOiJIUzI1NiIsInR5cCI6...` ← **COPIE CELUI-CI** (secret !)

> ⚠️ La clé `service_role` contourne la RLS — garde-la secrète, ne la mets JAMAIS dans du code client.

---

## Étape 2 — Créer les tables dans Supabase

1. Dans Supabase, va dans **SQL Editor** (icône 📝 dans le menu de gauche)
2. Clique sur **New query**
3. Copie-colle le contenu du fichier `supabase/schema.sql` du repo GitHub
4. Clique sur **Run** (▶️) en haut
5. Vérifie qu'aucune erreur n'apparaît dans l'onglet Output
6. Ouvre un nouveau query, copie-colle le contenu de `supabase/policies.sql`
7. Clique sur **Run**

Après ça, va dans **Table Editor** : tu dois voir les tables `projects`, `skills`, `experiences`, `education`, `certifications`, `messages`, `page_views`, `admin_users` avec leurs données seed.

---

## Étape 3 — Configurer les variables d'environnement

### En local (fichier `.env.local`)

```bash
# Garde la DB locale pour les tests offline
DATABASE_URL="file:./db/custom.db"

# NextAuth
NEXTAUTH_SECRET="generer-avec-openssl-rand-base64-32"
ADMIN_EMAIL="Mahopolivierconstantin39@gmail.com"
ADMIN_PASSWORD="un-vrai-mot-de-passe-fort"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# 👇 AJOUTE CECI pour activer Supabase
NEXT_PUBLIC_SUPABASE_URL="https://cqptqxpxvgmoiyoelaqe.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ...ta_cle_anon..."
SUPABASE_SERVICE_ROLE_KEY="eyJ...ta_cle_service_role..."
```

Dès que ces 3 variables sont présentes, le code bascule automatiquement de Prisma vers Supabase (voir `src/lib/data.ts`).

### Sur Vercel

1. Va sur [vercel.com](https://vercel.com) → ton projet portfolio
2. **Settings** → **Environment Variables**
3. Ajoute les mêmes variables :

| Key | Value |
|-----|-------|
| `NEXTAUTH_SECRET` | (génère avec `openssl rand -base64 32`) |
| `ADMIN_EMAIL` | `Mahopolivierconstantin39@gmail.com` |
| `ADMIN_PASSWORD` | (un vrai mot de passe fort) |
| `NEXT_PUBLIC_SITE_URL` | `https://portfolio-olivic664.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://cqptqxpxvgmoiyoelaqe.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | (service_role key) |

4. Clique **Save** pour chaque variable
5. Va dans **Deployments** → clique sur les **⋯** du dernier deploy → **Redeploy**

---

## Étape 4 — Vérifier que ça marche

1. Va sur ton URL Vercel (`https://portfolio-olivic664.vercel.app`)
2. Le site doit s'afficher normalement avec tous les projets/skills/expériences
3. Remplis le formulaire de contact → tu dois voir "Message envoyé !"
4. Va dans Supabase → **Table Editor** → **messages** : ton message doit apparaître
5. Connecte-toi à `/admin` avec tes identifiants → le message doit être visible dans l'onglet Messages

---

## En cas de problème

### "Application error: server-side exception" persiste

Vérifie les logs Vercel :
1. Vercel dashboard → ton projet → **Logs** (onglet en haut)
2. Regarde les erreurs récentes — le message exact te dira ce qui plante
3. Causes possibles :
   - `SUPABASE_SERVICE_ROLE_KEY` manquant ou incorrect
   - Tables non créées dans Supabase (retour à l'étape 2)
   - RLS policies non appliquées (retour à l'étape 2)

### Le formulaire dit "service indisponible"

C'est que ni Supabase ni Prisma n'a pu écrire. Vérifie :
1. Que `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont bien définis sur Vercel
2. Que la table `messages` existe dans Supabase
3. Que la RLS policy "Anyone can send a message" est bien appliquée

### L'admin dashboard est vide

Vérifie :
1. Que tu es connecté (page `/admin/login`)
2. Que les tables ont des données (Table Editor dans Supabase)
3. Les logs Vercel pour les erreurs de lecture

---

## Architecture finale

```
[Browser]
   ↓
[Vercel - Next.js]
   ↓ (via @supabase/supabase-js)
[Supabase PostgreSQL]
   - projects (publicly readable)
   - skills (publicly readable)
   - experiences (publicly readable)
   - education (publicly readable)
   - certifications (publicly readable)
   - messages (public INSERT, admin SELECT/UPDATE/DELETE)
   - page_views (public INSERT, admin SELECT)
   - admin_users (admin only)
```

La RLS garantit que :
- Tout le monde peut lire le portfolio
- Tout le monde peut envoyer un message
- Seul l'admin peut modifier le contenu ou lire les messages

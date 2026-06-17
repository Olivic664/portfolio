// src/lib/supabase.ts
// Supabase client (server-side).
//
// Used for both public reads (anon key) and admin writes (service_role key)
// on the portfolio tables. The Prisma/SQLite layer in `db.ts` is kept as a
// local-dev fallback; in production we prefer Supabase.
//
// Required env vars (production):
//   NEXT_PUBLIC_SUPABASE_URL        — e.g. https://cqptqxpxvgmoiyoelaqe.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY   — public anon key (safe to expose)
//   SUPABASE_SERVICE_ROLE_KEY       — server-only secret, bypasses RLS
//
// If env vars are missing, supabaseEnabled === false and the app falls back
// to the local SQLite database via Prisma. This makes local dev painless.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Public client — uses anon key. Respects RLS.
 * Safe to use from server components and server actions for reads.
 */
let publicClient: SupabaseClient | null = null;
export function getSupabasePublic(): SupabaseClient | null {
  if (!supabaseEnabled) return null;
  if (!publicClient) {
    publicClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return publicClient;
}

/**
 * Admin client — uses service_role key. BYPASSES RLS.
 * Server-only. NEVER import in client components.
 * Use for: writing messages (contact form), incrementing project views,
 * admin CRUD operations.
 */
let adminClient: SupabaseClient | null = null;
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  if (!adminClient) {
    adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return adminClient;
}

// src/lib/auth.ts
// NextAuth config (Credentials provider for the admin dashboard).
//
// In production, prefer Supabase Auth magic link:
//   - Configure env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   - Replace this file's logic with @supabase/ssr session handling
//   - Keep the same `isAdmin` check by querying the admin_users table.
//
// For local dev / Vercel preview we use a Credentials provider with
// a single admin account defined in .env.local.

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "Mahopolivierconstantin39@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me-in-env";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // Check credentials
        if (
          credentials.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
          credentials.password === ADMIN_PASSWORD
        ) {
          // Ensure user exists in admin_users table
          const admin = await db.adminUser.upsert({
            where: { email: ADMIN_EMAIL },
            create: {
              email: ADMIN_EMAIL,
              name: "MAHOP Olivier Constantin",
              role: "admin",
            },
            update: {},
          });
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          } as any;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = (user as any).email;
        token.name = (user as any).name;
        token.role = (user as any).role || "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// src/lib/data.ts
// Data access layer.
//
// Strategy:
//   1. If Supabase env vars are configured → use Supabase (production)
//   2. Otherwise → fall back to local Prisma/SQLite (dev)
//
// All read functions are wrapped in try/catch that return empty arrays on
// failure. This prevents a serverless DB issue from breaking the entire page
// render — the page will still render with empty sections.

import { db } from "@/lib/db";
import {
  getSupabasePublic,
  getSupabaseAdmin,
  supabaseEnabled,
} from "@/lib/supabase";

// ----- Types (shared between Supabase and Prisma code paths) -----

export type ProjectItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  tags: string | string[];
  metrics: string | Record<string, string> | null;
  techStack: string | string[];
  repoUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  order: number;
  views: number;
};

export type SkillItem = {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
};

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  situation: string | null;
  task: string | null;
  actions: string | string[] | null;
  results: string | string[] | null;
  order: number;
};

export type EducationItem = {
  id: string;
  diploma: string;
  school: string;
  period: string;
  description: string | null;
  order: number;
};

export type CertificationItem = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url: string | null;
  order: number;
};

export type MessageItem = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
};

// ----- Helpers -----

export function parseTags(tags: string | string[] | null | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export function parseMetrics(metrics: string | Record<string, string> | null | undefined): Record<string, string> {
  if (!metrics) return {};
  if (typeof metrics === "object") return metrics as Record<string, string>;
  try {
    return JSON.parse(metrics);
  } catch {
    return {};
  }
}

export function parseMultiline(s: string | string[] | null | undefined): string[] {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  return s.split("\n").map((l) => l.trim()).filter(Boolean);
}

// ----- Projects -----

export async function getProjects(): Promise<ProjectItem[]> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabasePublic();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false })
        .order("order", { ascending: true });
      if (error) throw error;
      return (data || []) as ProjectItem[];
    } catch (e) {
      console.error("[data] Supabase getProjects failed:", e);
      return [];
    }
  }
  // Fallback: Prisma/SQLite
  try {
    return await db.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });
  } catch (e) {
    console.error("[data] Prisma getProjects failed:", e);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<ProjectItem[]> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabasePublic();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .order("order", { ascending: true });
      if (error) throw error;
      return (data || []) as ProjectItem[];
    } catch (e) {
      console.error("[data] Supabase getFeaturedProjects failed:", e);
      return [];
    }
  }
  try {
    return await db.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
    });
  } catch (e) {
    console.error("[data] Prisma getFeaturedProjects failed:", e);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabasePublic();
      if (!supabase) return null;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as ProjectItem) || null;
    } catch (e) {
      console.error("[data] Supabase getProjectBySlug failed:", e);
      return null;
    }
  }
  try {
    return await db.project.findUnique({ where: { slug } });
  } catch (e) {
    console.error("[data] Prisma getProjectBySlug failed:", e);
    return null;
  }
}

export async function incrementProjectViews(slug: string): Promise<void> {
  if (supabaseEnabled) {
    try {
      // Use the RPC function defined in policies.sql
      const supabase = getSupabasePublic();
      if (!supabase) return;
      const { error } = await supabase.rpc("increment_project_views", {
        project_slug: slug,
      });
      if (error) throw error;
      return;
    } catch (e) {
      console.error("[data] Supabase incrementProjectViews failed:", e);
      // fall through to Prisma
    }
  }
  try {
    await db.project.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch (e) {
    console.error("[data] Prisma incrementProjectViews failed:", e);
  }
}

// ----- Skills -----

export async function getSkills(): Promise<SkillItem[]> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabasePublic();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("order", { ascending: true });
      if (error) throw error;
      return (data || []) as SkillItem[];
    } catch (e) {
      console.error("[data] Supabase getSkills failed:", e);
      return [];
    }
  }
  try {
    return await db.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  } catch (e) {
    console.error("[data] Prisma getSkills failed:", e);
    return [];
  }
}

// ----- Experiences -----

export async function getExperiences(): Promise<ExperienceItem[]> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabasePublic();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("order", { ascending: true });
      if (error) throw error;
      return (data || []) as ExperienceItem[];
    } catch (e) {
      console.error("[data] Supabase getExperiences failed:", e);
      return [];
    }
  }
  try {
    return (await db.experience.findMany({ orderBy: { order: "asc" } })) as ExperienceItem[];
  } catch (e) {
    console.error("[data] Prisma getExperiences failed:", e);
    return [];
  }
}

// ----- Education -----

export async function getEducation(): Promise<EducationItem[]> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabasePublic();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("order", { ascending: true });
      if (error) throw error;
      return (data || []) as EducationItem[];
    } catch (e) {
      console.error("[data] Supabase getEducation failed:", e);
      return [];
    }
  }
  try {
    return await db.education.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("[data] Prisma getEducation failed:", e);
    return [];
  }
}

// ----- Certifications -----

export async function getCertifications(): Promise<CertificationItem[]> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabasePublic();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("order", { ascending: true });
      if (error) throw error;
      return (data || []) as CertificationItem[];
    } catch (e) {
      console.error("[data] Supabase getCertifications failed:", e);
      return [];
    }
  }
  try {
    return await db.certification.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("[data] Prisma getCertifications failed:", e);
    return [];
  }
}

// ----- Messages -----

export async function getMessages(): Promise<MessageItem[]> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabaseAdmin() || getSupabasePublic();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      // Map snake_case -> camelCase for client compatibility
      return ((data || []) as any[]).map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        read: m.read,
        replied: m.replied,
        createdAt: m.created_at,
      }));
    } catch (e) {
      console.error("[data] Supabase getMessages failed:", e);
      return [];
    }
  }
  try {
    return await db.message.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e) {
    console.error("[data] Prisma getMessages failed:", e);
    return [];
  }
}

export async function getUnreadMessageCount(): Promise<number> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabaseAdmin() || getSupabasePublic();
      if (!supabase) return 0;
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("read", false);
      if (error) throw error;
      return count || 0;
    } catch (e) {
      console.error("[data] Supabase getUnreadMessageCount failed:", e);
      return 0;
    }
  }
  try {
    return await db.message.count({ where: { read: false } });
  } catch (e) {
    console.error("[data] Prisma getUnreadMessageCount failed:", e);
    return 0;
  }
}

// ----- Page views (analytics) -----

export async function logPageView(path: string, referrer?: string, userAgent?: string): Promise<void> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabasePublic();
      if (!supabase) return;
      const { error } = await supabase.from("page_views").insert({
        path,
        referrer: referrer || null,
        user_agent: userAgent || null,
      });
      if (error) throw error;
      return;
    } catch (e) {
      console.error("[data] Supabase logPageView failed:", e);
      // fall through to Prisma
    }
  }
  try {
    await db.pageView.create({ data: { path, referrer, userAgent } });
  } catch (e) {
    console.error("[data] Prisma logPageView failed:", e);
  }
}

export async function getPageViewsByPath(path: string): Promise<number> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabaseAdmin() || getSupabasePublic();
      if (!supabase) return 0;
      const { count, error } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .eq("path", path);
      if (error) throw error;
      return count || 0;
    } catch (e) {
      console.error("[data] Supabase getPageViewsByPath failed:", e);
      return 0;
    }
  }
  try {
    return await db.pageView.count({ where: { path } });
  } catch (e) {
    console.error("[data] Prisma getPageViewsByPath failed:", e);
    return 0;
  }
}

export async function getTotalPageViews(): Promise<number> {
  if (supabaseEnabled) {
    try {
      const supabase = getSupabaseAdmin() || getSupabasePublic();
      if (!supabase) return 0;
      const { count, error } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    } catch (e) {
      console.error("[data] Supabase getTotalPageViews failed:", e);
      return 0;
    }
  }
  try {
    return await db.pageView.count();
  } catch (e) {
    console.error("[data] Prisma getTotalPageViews failed:", e);
    return 0;
  }
}

// src/lib/data.ts
// Data access layer. In production, swap Prisma calls for Supabase queries.
// All functions return plain objects (no Prisma types leaking to client).
//
// IMPORTANT: All read functions are wrapped in try/catch that return empty arrays
// on failure. This prevents a serverless DB issue (e.g. cold SQLite, missing
// volume on Vercel) from breaking the entire page render — the page will still
// render with empty sections, which is much better than a 500 error.

import { db } from "@/lib/db";
import type { Project, Skill, Experience, Education, Certification, Message } from "@prisma/client";

export type ProjectItem = Pick<
  Project,
  | "id"
  | "slug"
  | "title"
  | "summary"
  | "description"
  | "tags"
  | "metrics"
  | "techStack"
  | "repoUrl"
  | "demoUrl"
  | "imageUrl"
  | "featured"
  | "order"
  | "views"
>;

export type SkillItem = Pick<Skill, "id" | "name" | "category" | "level" | "order">;

export type ExperienceItem = Omit<Experience, "createdAt" | "updatedAt">;

export type EducationItem = Pick<Education, "id" | "diploma" | "school" | "period" | "description" | "order">;

export type CertificationItem = Pick<Certification, "id" | "name" | "issuer" | "year" | "url" | "order">;

export type MessageItem = Pick<Message, "id" | "name" | "email" | "subject" | "message" | "read" | "replied" | "createdAt">;

// ----- Projects -----
export async function getProjects(): Promise<ProjectItem[]> {
  try {
    return await db.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });
  } catch (e) {
    console.error("[data] getProjects failed:", e);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<ProjectItem[]> {
  try {
    return await db.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
    });
  } catch (e) {
    console.error("[data] getFeaturedProjects failed:", e);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  try {
    return await db.project.findUnique({ where: { slug } });
  } catch (e) {
    console.error("[data] getProjectBySlug failed:", e);
    return null;
  }
}

export async function incrementProjectViews(slug: string): Promise<void> {
  try {
    await db.project.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch (e) {
    console.error("[data] incrementProjectViews failed:", e);
  }
}

// ----- Skills -----
export async function getSkills(): Promise<SkillItem[]> {
  try {
    return await db.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  } catch (e) {
    console.error("[data] getSkills failed:", e);
    return [];
  }
}

// ----- Experiences -----
export async function getExperiences(): Promise<ExperienceItem[]> {
  try {
    return (await db.experience.findMany({ orderBy: { order: "asc" } })) as ExperienceItem[];
  } catch (e) {
    console.error("[data] getExperiences failed:", e);
    return [];
  }
}

// ----- Education -----
export async function getEducation(): Promise<EducationItem[]> {
  try {
    return await db.education.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("[data] getEducation failed:", e);
    return [];
  }
}

// ----- Certifications -----
export async function getCertifications(): Promise<CertificationItem[]> {
  try {
    return await db.certification.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("[data] getCertifications failed:", e);
    return [];
  }
}

// ----- Messages -----
export async function getMessages(): Promise<MessageItem[]> {
  try {
    return await db.message.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e) {
    console.error("[data] getMessages failed:", e);
    return [];
  }
}

export async function getUnreadMessageCount(): Promise<number> {
  try {
    return await db.message.count({ where: { read: false } });
  } catch (e) {
    console.error("[data] getUnreadMessageCount failed:", e);
    return 0;
  }
}

// ----- Page views (analytics) -----
export async function logPageView(path: string, referrer?: string, userAgent?: string): Promise<void> {
  try {
    await db.pageView.create({ data: { path, referrer, userAgent } });
  } catch (e) {
    console.error("[data] logPageView failed:", e);
  }
}

export async function getPageViewsByPath(path: string): Promise<number> {
  try {
    return await db.pageView.count({ where: { path } });
  } catch (e) {
    console.error("[data] getPageViewsByPath failed:", e);
    return 0;
  }
}

export async function getTotalPageViews(): Promise<number> {
  try {
    return await db.pageView.count();
  } catch (e) {
    console.error("[data] getTotalPageViews failed:", e);
    return 0;
  }
}

// ----- Helpers for serialization -----
export function parseTags(tags: string | string[] | null | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export function parseMetrics(metrics: string | null | undefined): Record<string, string> {
  if (!metrics) return {};
  try {
    return JSON.parse(metrics);
  } catch {
    return {};
  }
}

export function parseMultiline(s: string | null | undefined): string[] {
  if (!s) return [];
  return s.split("\n").map((l) => l.trim()).filter(Boolean);
}

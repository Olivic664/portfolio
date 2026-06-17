// src/lib/data.ts
// Data access layer. In production, swap Prisma calls for Supabase queries.
// All functions return plain objects (no Prisma types leaking to client).

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
  const items = await db.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
  return items.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    description: p.description,
    tags: p.tags,
    metrics: p.metrics,
    techStack: p.techStack,
    repoUrl: p.repoUrl,
    demoUrl: p.demoUrl,
    imageUrl: p.imageUrl,
    featured: p.featured,
    order: p.order,
    views: p.views,
  }));
}

export async function getFeaturedProjects(): Promise<ProjectItem[]> {
  const items = await db.project.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
  });
  return items;
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  return db.project.findUnique({ where: { slug } });
}

export async function incrementProjectViews(slug: string): Promise<void> {
  await db.project.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });
}

// ----- Skills -----
export async function getSkills(): Promise<SkillItem[]> {
  return db.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
}

// ----- Experiences -----
export async function getExperiences(): Promise<ExperienceItem[]> {
  return db.experience.findMany({ orderBy: { order: "asc" } }) as Promise<ExperienceItem[]>;
}

// ----- Education -----
export async function getEducation(): Promise<EducationItem[]> {
  return db.education.findMany({ orderBy: { order: "asc" } });
}

// ----- Certifications -----
export async function getCertifications(): Promise<CertificationItem[]> {
  return db.certification.findMany({ orderBy: { order: "asc" } });
}

// ----- Messages -----
export async function getMessages(): Promise<MessageItem[]> {
  return db.message.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getUnreadMessageCount(): Promise<number> {
  return db.message.count({ where: { read: false } });
}

// ----- Page views (analytics) -----
export async function logPageView(path: string, referrer?: string, userAgent?: string): Promise<void> {
  await db.pageView.create({ data: { path, referrer, userAgent } });
}

export async function getPageViewsByPath(path: string): Promise<number> {
  return db.pageView.count({ where: { path } });
}

export async function getTotalPageViews(): Promise<number> {
  return db.pageView.count();
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

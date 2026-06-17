// src/actions/projects.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Non autorisé. Connectez-vous en tant qu'admin.");
  }
  const admin = await db.adminUser.findUnique({ where: { email: session.user.email } });
  if (!admin) {
    throw new Error("Accès refusé. Vous n'êtes pas administrateur.");
  }
  return admin;
}

export type ProjectInput = {
  id?: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  metrics: Record<string, string>;
  techStack: string[];
  repoUrl?: string | null;
  demoUrl?: string | null;
  imageUrl?: string | null;
  featured: boolean;
  order: number;
};

export async function saveProject(input: ProjectInput): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    await requireAdmin();
    const slug = slugify(input.title);
    const data = {
      slug,
      title: input.title,
      summary: input.summary,
      description: input.description,
      tags: input.tags.join(","),
      metrics: JSON.stringify(input.metrics),
      techStack: input.techStack.join(","),
      repoUrl: input.repoUrl || null,
      demoUrl: input.demoUrl || null,
      imageUrl: input.imageUrl || null,
      featured: input.featured,
      order: input.order,
    };

    if (input.id) {
      await db.project.update({ where: { id: input.id }, data });
    } else {
      await db.project.create({ data });
    }
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    await db.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function incrementProjectViewsAction(slug: string): Promise<void> {
  try {
    await db.project.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch {
    // silent fail — analytics should never break UX
  }
}

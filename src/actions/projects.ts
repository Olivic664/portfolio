// src/actions/projects.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSupabaseAdmin, supabaseEnabled } from "@/lib/supabase";
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
  if (supabaseEnabled) {
    return session.user;
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
    const payload = {
      slug,
      title: input.title,
      summary: input.summary,
      description: input.description,
      tags: input.tags,
      metrics: input.metrics,
      tech_stack: input.techStack,
      repo_url: input.repoUrl || null,
      demo_url: input.demoUrl || null,
      image_url: input.imageUrl || null,
      featured: input.featured,
      order: input.order,
    };

    if (supabaseEnabled) {
      const supabase = getSupabaseAdmin();
      if (!supabase) throw new Error("Supabase admin client not configured");
      if (input.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }
    } else {
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
    }
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) {
    console.error("[saveProject] failed:", e);
    return { success: false, error: e.message };
  }
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    if (supabaseEnabled) {
      const supabase = getSupabaseAdmin();
      if (!supabase) throw new Error("Supabase admin client not configured");
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    } else {
      await db.project.delete({ where: { id } });
    }
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) {
    console.error("[deleteProject] failed:", e);
    return { success: false, error: e.message };
  }
}

export async function incrementProjectViewsAction(slug: string): Promise<void> {
  try {
    if (supabaseEnabled) {
      const supabase = getSupabaseAdmin() || (await import("@/lib/supabase")).getSupabasePublic();
      if (!supabase) return;
      // Try RPC first (defined in policies.sql)
      const { error } = await supabase.rpc("increment_project_views", { project_slug: slug });
      if (error) {
        // Fallback: direct update (works if RLS allows)
        await supabase.from("projects").update({ views: (await supabase.from("projects").select("views").eq("slug", slug).maybeSingle()).data?.views + 1 }).eq("slug", slug);
      }
      return;
    }
    await db.project.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch (e) {
    // silent — analytics should never break UX
    console.error("[incrementProjectViewsAction] failed:", e);
  }
}

// src/actions/messages.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSupabaseAdmin, supabaseEnabled } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const MessageSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export type ContactFormState = {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
};

// Public action — anyone can send a message.
// CRITICAL: this must NEVER throw — always return a state object.
export async function sendMessage(prevState: any, formData: FormData): Promise<ContactFormState> {
  try {
    const raw = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      subject: formData.get("subject")?.toString() || "",
      message: formData.get("message")?.toString() || "",
    };

    const parsed = MessageSchema.safeParse(raw);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path[0] as string] = issue.message;
      }
      return { success: false, errors };
    }

    let saved = false;

    if (supabaseEnabled) {
      try {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          const { error } = await supabase.from("messages").insert({
            name: parsed.data.name,
            email: parsed.data.email,
            subject: parsed.data.subject || null,
            message: parsed.data.message,
          });
          if (!error) saved = true;
          else console.error("[sendMessage] Supabase insert error:", error.message);
        }
      } catch (e) {
        console.error("[sendMessage] Supabase exception:", e);
      }
    }

    if (!saved) {
      // Fallback: try local Prisma/SQLite
      try {
        await db.message.create({ data: parsed.data });
        saved = true;
      } catch (e) {
        console.error("[sendMessage] Prisma insert failed:", e);
        // In serverless (read-only FS), Prisma writes will fail.
        // We log the error but still return success to the user
        // so they don't see a broken form. The message is lost in this case
        // unless Supabase is configured.
        if (!supabaseEnabled) {
          return {
            success: false,
            error: "Le service de messagerie est temporairement indisponible. Réessayez plus tard ou écrivez directement à Mahopolivierconstantin39@gmail.com",
          };
        }
      }
    }

    if (saved) {
      try {
        revalidatePath("/admin");
      } catch (e) {
        // revalidation can fail in some edge cases; ignore
      }
    }

    return { success: saved };
  } catch (e: any) {
    // Last-resort catch — never throw from a Server Action
    console.error("[sendMessage] unhandled:", e);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite. Réessayez.",
    };
  }
}

// Admin-only actions
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Non autorisé");
  }
  if (supabaseEnabled) {
    return session.user;
  }
  const admin = await db.adminUser.findUnique({ where: { email: session.user.email } });
  if (!admin) throw new Error("Accès refusé");
  return admin;
}

export async function markMessageRead(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    if (supabaseEnabled) {
      const supabase = getSupabaseAdmin();
      if (!supabase) throw new Error("Supabase admin client not configured");
      const { error } = await supabase.from("messages").update({ read: true }).eq("id", id);
      if (error) throw error;
    } else {
      await db.message.update({ where: { id }, data: { read: true } });
    }
    try { revalidatePath("/admin"); } catch {}
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function markMessageReplied(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    if (supabaseEnabled) {
      const supabase = getSupabaseAdmin();
      if (!supabase) throw new Error("Supabase admin client not configured");
      const { error } = await supabase
        .from("messages")
        .update({ read: true, replied: true })
        .eq("id", id);
      if (error) throw error;
    } else {
      await db.message.update({ where: { id }, data: { replied: true, read: true } });
    }
    try { revalidatePath("/admin"); } catch {}
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    if (supabaseEnabled) {
      const supabase = getSupabaseAdmin();
      if (!supabase) throw new Error("Supabase admin client not configured");
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    } else {
      await db.message.delete({ where: { id } });
    }
    try { revalidatePath("/admin"); } catch {}
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

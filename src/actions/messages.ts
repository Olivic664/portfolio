// src/actions/messages.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
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

// Public action — anyone can send a message
export async function sendMessage(prevState: any, formData: FormData): Promise<ContactFormState> {
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

  try {
    await db.message.create({ data: parsed.data });

    // Optionally send an email notification via Resend / SendGrid.
    // Left as a stub — uncomment & configure RESEND_API_KEY in production.
    // await sendNotificationEmail(parsed.data);

    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: "Erreur lors de l'envoi du message. Réessayez." };
  }
}

// Admin-only actions
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Non autorisé");
  }
  const admin = await db.adminUser.findUnique({ where: { email: session.user.email } });
  if (!admin) throw new Error("Accès refusé");
  return admin;
}

export async function markMessageRead(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    await db.message.update({ where: { id }, data: { read: true } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function markMessageReplied(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    await db.message.update({ where: { id }, data: { replied: true, read: true } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    await db.message.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// src/actions/views.ts
"use server";

import { db } from "@/lib/db";
import { getSupabasePublic, supabaseEnabled } from "@/lib/supabase";
import { headers } from "next/headers";

// Public action — fire-and-forget page view logger
export async function logPageViewAction(path: string): Promise<void> {
  try {
    const h = await headers();
    const referrer = h.get("referer") || null;
    const userAgent = h.get("user-agent") || null;

    if (supabaseEnabled) {
      const supabase = getSupabasePublic();
      if (!supabase) return;
      const { error } = await supabase.from("page_views").insert({
        path,
        referrer,
        user_agent: userAgent,
      });
      if (error) throw error;
      return;
    }

    await db.pageView.create({ data: { path, referrer, userAgent } });
  } catch (e) {
    // silent — analytics should never break UX
    console.error("[logPageViewAction] failed:", e);
  }
}

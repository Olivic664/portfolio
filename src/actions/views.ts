// src/actions/views.ts
"use server";

import { db } from "@/lib/db";
import { headers } from "next/headers";

// Public action — fire-and-forget page view logger
export async function logPageViewAction(path: string): Promise<void> {
  try {
    const h = await headers();
    const referrer = h.get("referer") || null;
    const userAgent = h.get("user-agent") || null;
    await db.pageView.create({ data: { path, referrer, userAgent } });
  } catch {
    // silent
  }
}

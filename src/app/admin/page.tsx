// src/app/admin/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getProjects, getMessages, getTotalPageViews } from "@/lib/data";

export const metadata = {
  title: "Admin Dashboard",
  description: "Gestion privée des projets et messages",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const [projects, messages, totalViews] = await Promise.all([
    getProjects(),
    getMessages(),
    getTotalPageViews(),
  ]);

  const stats = {
    totalProjects: projects.length,
    totalMessages: messages.length,
    unreadMessages: messages.filter((m) => !m.read).length,
    totalViews,
  };

  return <AdminDashboard projects={projects} messages={messages} stats={stats} />;
}

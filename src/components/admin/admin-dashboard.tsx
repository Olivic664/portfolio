"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, ExternalLink, Plus, FolderKanban, Mail, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectsManager } from "./projects-manager";
import { MessagesInbox } from "./messages-inbox";
import type { ProjectItem, MessageItem } from "@/lib/data";

type Stats = {
  totalProjects: number;
  totalMessages: number;
  unreadMessages: number;
  totalViews: number;
};

export function AdminDashboard({
  projects,
  messages,
  stats,
}: {
  projects: ProjectItem[];
  messages: MessageItem[];
  stats: Stats;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span className="font-semibold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                Voir le site
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Projets</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalProjects}</p>
                </div>
                <FolderKanban className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Messages</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalMessages}</p>
                </div>
                <Mail className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Non lus</p>
                  <p className="text-2xl font-bold mt-1 text-amber-500">{stats.unreadMessages}</p>
                </div>
                <Mail className="h-8 w-8 text-amber-500/60" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Vues totales</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalViews}</p>
                </div>
                <LayoutDashboard className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects">
          <TabsList>
            <TabsTrigger value="projects" className="gap-2">
              <FolderKanban className="h-4 w-4" />
              Projets
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <Mail className="h-4 w-4" />
              Messages
              {stats.unreadMessages > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs text-destructive-foreground">
                  {stats.unreadMessages}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="mt-6">
            <ProjectsManager projects={projects} />
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <MessagesInbox messages={messages} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

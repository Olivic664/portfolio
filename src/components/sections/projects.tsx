"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Eye, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROJECT_TAGS } from "@/lib/constants";
import { parseTags, parseMetrics, type ProjectItem } from "@/lib/data";
import { incrementProjectViewsAction } from "@/actions/projects";

type Project = ProjectItem & { _tags: string[]; _metrics: Record<string, string> };

const TAG_COLORS: Record<string, string> = {
  ML: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "Data Engineering": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  GenAI: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  Web: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
  IoT: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
};

export function Projects({ projects }: { projects: ProjectItem[] }) {
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [viewCounts, setViewCounts] = React.useState<Record<string, number>>({});

  // Hydrate view counts from server-provided data
  React.useEffect(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => (counts[p.slug] = p.views));
    setViewCounts(counts);
  }, [projects]);

  const enriched: Project[] = React.useMemo(
    () => projects.map((p) => ({ ...p, _tags: parseTags(p.tags), _metrics: parseMetrics(p.metrics) })),
    [projects]
  );

  const filtered = activeTag
    ? enriched.filter((p) => p._tags.includes(activeTag))
    : enriched;

  const handleCardOpen = (slug: string) => {
    // Fire-and-forget increment; optimistic UI
    setViewCounts((prev) => ({ ...prev, [slug]: (prev[slug] || 0) + 1 }));
    incrementProjectViewsAction(slug);
  };

  return (
    <section id="projects" className="py-20 md:py-28 bg-card/20 border-y border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <p className="font-mono text-sm text-primary mb-2">{"// 02. projets"}</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Quelques réalisations
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sélection de projets ML, Data Engineering, GenAI et IoT. Cliquez sur un projet
            pour incrémenter son compteur de vues (analytics léger).
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              activeTag === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            Tous ({enriched.length})
          </button>
          {PROJECT_TAGS.map((tag) => {
            const count = enriched.filter((p) => p._tags.includes(tag)).length;
            if (count === 0) return null;
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {tag} ({count})
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card
                  className="group h-full border-border/60 bg-card/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all overflow-hidden"
                >
                  {/* Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {project.featured && (
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                          <h3 className="font-semibold text-base truncate">{project.title}</h3>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {project.summary}
                        </p>
                      </div>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project._tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 text-[10px] font-medium rounded border ${
                            TAG_COLORS[tag] || "border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardHeader>

                  {/* Body */}
                  <CardContent className="flex flex-col gap-4 pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Metrics */}
                    {Object.keys(project._metrics).length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(project._metrics).map(([k, v]) => (
                          <div
                            key={k}
                            className="rounded-md border border-border/60 bg-background/50 px-2.5 py-1.5"
                          >
                            <div className="text-[10px] uppercase text-muted-foreground font-mono truncate">
                              {k.replace(/_/g, " ")}
                            </div>
                            <div className="text-sm font-semibold text-primary mt-0.5 truncate">
                              {v}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {parseTags(project.techStack).slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted/50 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-border/40">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCardOpen(project.slug)}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                          title="Incrémenter le compteur de vues"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="font-mono">{viewCounts[project.slug] ?? project.views}</span>
                        </button>
                        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/60" />
                      </div>
                      <div className="flex items-center gap-1">
                        {project.repoUrl && (
                          <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Code source de ${project.title}`}
                            >
                              <Github className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        )}
                        {project.demoUrl && (
                          <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Démo de ${project.title}`}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* More on github */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <a href="https://github.com/Olivic664" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Voir tous mes projets sur GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

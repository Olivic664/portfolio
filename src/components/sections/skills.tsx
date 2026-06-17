"use client";

import { motion } from "framer-motion";
import { Code2, Brain, BarChart3, Database, Container, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SKILL_CATEGORIES } from "@/lib/constants";
import type { SkillItem } from "@/lib/data";

const CATEGORY_META: Record<
  string,
  { icon: React.ElementType; label: string; description: string }
> = {
  Languages: {
    icon: Code2,
    label: "Langages",
    description: "Langages de programmation principaux",
  },
  "ML/DL": {
    icon: Brain,
    label: "Machine & Deep Learning",
    description: "Frameworks ML/DL et libraries d'IA",
  },
  "Data Viz": {
    icon: BarChart3,
    label: "Data Visualisation",
    description: "Outils de visualisation et dashboards",
  },
  Databases: {
    icon: Database,
    label: "Bases de données",
    description: "Bases relationnelles et NoSQL",
  },
  DevOps: {
    icon: Container,
    label: "DevOps & Cloud",
    description: "Conteneurisation, versioning et CI/CD",
  },
  Tools: {
    icon: Wrench,
    label: "Outils & Frameworks",
    description: "Frameworks web et outils complémentaires",
  },
};

export function Skills({ skills }: { skills: SkillItem[] }) {
  const grouped = SKILL_CATEGORIES.map((cat) => ({
    category: cat,
    items: skills
      .filter((s) => s.category === cat)
      .sort((a, b) => a.order - b.order),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <p className="font-mono text-sm text-primary mb-2">{"// 03. compétences"}</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Stack technique
          </h2>
          <p className="mt-4 text-muted-foreground">
            Vue d'ensemble de mes compétences par catégorie, avec un indicateur de niveau
            de maîtrise.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {grouped.map((group, gIdx) => {
            const meta = CATEGORY_META[group.category];
            if (!meta) return null;
            const Icon = meta.icon;
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: gIdx * 0.1 }}
              >
                <Card className="h-full border-border/60 bg-card/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{meta.label}</h3>
                        <p className="text-xs text-muted-foreground">{meta.description}</p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-3">
                      {group.items.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-xs font-mono text-muted-foreground">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

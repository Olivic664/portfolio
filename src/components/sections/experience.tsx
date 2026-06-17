"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, ChevronDown, Target, ListChecks, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ExperienceItem } from "@/lib/data";
import { parseMultiline } from "@/lib/data";

export function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  const [openId, setOpenId] = React.useState<string | null>(
    experiences[0]?.id ?? null
  );

  return (
    <section id="experience" className="py-20 md:py-28 bg-card/20 border-y border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <p className="font-mono text-sm text-primary mb-2">{"// 04. expérience"}</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Parcours professionnel
          </h2>
          <p className="mt-4 text-muted-foreground">
            Chaque expérience est présentée au format <strong className="text-foreground">STAR</strong>{" "}
            (Situation, Tâche, Actions, Résultats) pour mettre en avant l'impact réel.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

          <div className="space-y-8">
            {experiences.map((exp, idx) => {
              const actions = parseMultiline(exp.actions);
              const results = parseMultiline(exp.results);
              const isOpen = openId === exp.id;
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative pl-12 md:pl-0 md:w-1/2 ${
                    idx % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
                  }`}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-4 md:left-auto top-6 h-3 w-3 rounded-full bg-primary ring-4 ring-background ${
                      idx % 2 === 0
                        ? "md:-right-1.5 md:translate-x-1/2"
                        : "md:-left-1.5 md:-translate-x-1/2"
                    }`}
                  />

                  <Card className="border-border/60 bg-card/50">
                    <Collapsible open={isOpen} onOpenChange={(o) => setOpenId(o ? exp.id : null)}>
                      <CollapsibleTrigger asChild>
                        <button className="w-full text-left">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <h3 className="font-semibold text-base">{exp.role}</h3>
                                <p className="text-sm text-primary font-medium">{exp.company}</p>
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 mt-1 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {exp.startDate} — {exp.current ? "présent" : exp.endDate}
                              </span>
                              {exp.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {exp.location}
                                </span>
                              )}
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                              {exp.description}
                            </p>
                          </CardContent>
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-5 pb-5 pt-0 space-y-4 border-t border-border/40 mt-1">
                          {/* Situation */}
                          {exp.situation && (
                            <div className="pt-4">
                              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                <Briefcase className="h-3.5 w-3.5" />
                                Situation
                              </h4>
                              <p className="text-sm leading-relaxed">{exp.situation}</p>
                            </div>
                          )}

                          {/* Task */}
                          {exp.task && (
                            <div>
                              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                <Target className="h-3.5 w-3.5" />
                                Tâche
                              </h4>
                              <p className="text-sm leading-relaxed">{exp.task}</p>
                            </div>
                          )}

                          {/* Actions */}
                          {actions.length > 0 && (
                            <div>
                              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                <ListChecks className="h-3.5 w-3.5" />
                                Actions
                              </h4>
                              <ul className="space-y-1.5">
                                {actions.map((action, i) => (
                                  <li key={i} className="text-sm flex gap-2 leading-relaxed">
                                    <span className="text-primary mt-0.5 shrink-0">▸</span>
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Results */}
                          {results.length > 0 && (
                            <div className="rounded-md bg-primary/5 border border-primary/20 p-3">
                              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                                <Trophy className="h-3.5 w-3.5" />
                                Résultats
                              </h4>
                              <ul className="space-y-1.5">
                                {results.map((result, i) => (
                                  <li key={i} className="text-sm flex gap-2 leading-relaxed">
                                    <span className="text-amber-500 mt-0.5 shrink-0">★</span>
                                    <span>{result}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

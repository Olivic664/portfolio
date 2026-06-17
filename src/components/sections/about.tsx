"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, Languages, MapPin, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROFILE } from "@/lib/constants";
import type { EducationItem, CertificationItem } from "@/lib/data";

export function About({
  education,
  certifications,
}: {
  education: EducationItem[];
  certifications: CertificationItem[];
}) {
  const stats = [
    { label: "Projets réalisés", value: "5+", icon: Briefcase },
    { label: "Ans d'expérience", value: "2+", icon: Briefcase },
    { label: "Certifications", value: `${certifications.length}`, icon: Award },
    { label: "Langues", value: "FR · EN", icon: Languages },
  ];

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <p className="font-mono text-sm text-primary mb-2">{"// 01. à propos"}</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Data Scientist passionné par l'IA appliquée
          </h2>
          <p className="mt-4 text-muted-foreground">
            Je construis des systèmes qui transforment la donnée en décisions actionnables.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-5 items-start">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 space-y-4 text-base text-muted-foreground leading-relaxed"
          >
            <p>
              Je m'appelle <span className="text-foreground font-medium">{PROFILE.name}</span>,
              je suis {PROFILE.title.toLowerCase()} basé à {PROFILE.location}. Mon parcours
              allie une formation solide en génie logiciel et en systèmes intelligents
              (Master MIAGE) à une spécialisation pratique en Data Science, Data Engineering
              et intelligence artificielle.
            </p>
            <p>
              Actuellement en formation <strong className="text-foreground">Data & AI Engineer</strong> à
              DHI Academy, j'approfondis mes compétences en MLOps, Cloud, GenAI et LLMs.
              J'ai déjà mis en pratique ces compétences sur des projets concrets : détection
              de spam avec 98.2 % de précision, agent conversationnel académique qui a boosté
              le taux de réponse de 35 %, et pipelines data engineering complets.
            </p>
            <p>
              Ce qui me motive, c'est construire des systèmes intelligents qui ont un
              impact réel — comme l'analyse de données patients SIDA pour SYAR, où mes
              dashboards Power BI et mon modèle de scoring ont directement influencé
              la prise de décision médicale.
            </p>

            {/* Languages & location quick info */}
            <div className="pt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <MapPin className="h-3 w-3" /> {PROFILE.location}
              </Badge>
              {PROFILE.languages.map((lang) => (
                <Badge key={lang.name} variant="secondary" className="gap-1.5">
                  <Languages className="h-3 w-3" /> {lang.name} · {lang.level}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 grid grid-cols-2 gap-4"
          >
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/60 bg-card/50">
                <CardContent className="p-5">
                  <stat.icon className="h-5 w-5 text-primary mb-2" />
                  <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>

        {/* Education & certifications */}
        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-5">
              <GraduationCap className="h-5 w-5 text-primary" />
              Formation
            </h3>
            <div className="space-y-4">
              {education.map((ed) => (
                <Card key={ed.id} className="border-border/60 bg-card/40">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold">{ed.diploma}</h4>
                        <p className="text-sm text-primary mt-0.5">{ed.school}</p>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs whitespace-nowrap">
                        {ed.period}
                      </Badge>
                    </div>
                    {ed.description && (
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {ed.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-5">
              <Award className="h-5 w-5 text-primary" />
              Certifications
            </h3>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <Card key={cert.id} className="border-border/60 bg-card/40">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-sm">{cert.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {cert.year}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

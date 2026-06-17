"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PROFILE } from "@/lib/constants";

const ROLES = [
  "Data Scientist",
  "Data Engineer",
  "ML Practitioner",
  "GenAI Builder",
];

function useTypewriter(words: string[], typeDelay = 100, deleteDelay = 50, hold = 1800) {
  const [text, setText] = React.useState("");
  const [wordIndex, setWordIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const current = words[wordIndex % words.length];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), hold);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((i) => i + 1);
    } else {
      timeout = setTimeout(
        () => {
          setText((prev) =>
            isDeleting
              ? current.substring(0, prev.length - 1)
              : current.substring(0, prev.length + 1)
          );
        },
        isDeleting ? deleteDelay : typeDelay
      );
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typeDelay, deleteDelay, hold]);

  return text;
}

export function Hero() {
  const typed = useTypewriter(ROLES);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid -z-10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Badge
              variant="outline"
              className="mb-6 gap-2 border-primary/30 bg-primary/5 py-1.5 pl-2.5 pr-3.5 text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Open to remote opportunities
            </Badge>
          </motion.div>

          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-sm font-mono text-muted-foreground"
          >
            <span className="text-primary">$</span> whoami
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            <span className="block text-foreground">MAHOP</span>
            <span className="block text-gradient">Olivier Constantin</span>
          </motion.h1>

          {/* Animated role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-mono text-muted-foreground min-h-[2em]">
              <span className="text-primary">&gt;</span>{" "}
              <span className="text-foreground font-medium">{typed}</span>
              <span className="typing-cursor text-primary">|</span>
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-center text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {PROFILE.tagline} Spécialisé en Machine Learning, Data Engineering et GenAI,
            je conçois des pipelines data et des produits intelligents — du prototype
            à la mise en production.
          </motion.p>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <MapPin className="h-4 w-4" />
            <span>{PROFILE.location}</span>
            <span className="text-border">•</span>
            <span>FR natif · EN B2</span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button asChild size="lg" className="w-full sm:w-auto group">
              <a href="#projects">
                Voir mes projets
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href="#contact">Me contacter</a>
            </Button>
            <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto">
              <a href={PROFILE.cvPath} download>
                <Download className="mr-2 h-4 w-4" />
                CV
              </a>
            </Button>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-10 flex items-center justify-center gap-3"
          >
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
          >
            <a
              href="#about"
              className="flex flex-col items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="font-mono">scroll</span>
              <ArrowDown className="h-3 w-3 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

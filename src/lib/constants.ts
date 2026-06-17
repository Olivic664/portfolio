// src/lib/constants.ts
// Single source of truth for personal/profile info.
// Update here once; reflected across the entire site (SEO, JSON-LD, UI).

export const PROFILE = {
  name: "MAHOP Olivier Constantin",
  firstName: "Olivier",
  lastName: "MAHOP",
  title: "Data Scientist & Data Engineer en formation",
  tagline: "Je transforme la donnée en décisions et en produits intelligents.",
  location: "Douala, Cameroun",
  availability: "Disponible en remote",
  email: "Mahopolivierconstantin39@gmail.com",
  linkedin: "http://bit.ly/4vFkelw",
  github: "https://github.com/Olivic664",
  languages: [
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "B2" },
  ],
  // Used for SEO / Open Graph
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://olivier-mahop.vercel.app",
  ogImage: "/og-image.png",
  cvPath: "/cv-mahop-olivier-constantin.pdf",
} as const;

export const NAV_LINKS = [
  { href: "#home", label: "Accueil" },
  { href: "#about", label: "À propos" },
  { href: "#projects", label: "Projets" },
  { href: "#skills", label: "Compétences" },
  { href: "#experience", label: "Expérience" },
  { href: "#contact", label: "Contact" },
] as const;

export const PROJECT_TAGS = ["ML", "Data Engineering", "GenAI", "Web", "IoT"] as const;

export const SKILL_CATEGORIES = [
  "Languages",
  "ML/DL",
  "Data Viz",
  "Databases",
  "DevOps",
  "Tools",
] as const;

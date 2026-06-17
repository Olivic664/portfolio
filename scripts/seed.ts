// scripts/seed.ts
// Seed the local SQLite database with portfolio content.
// Run with: bun run scripts/seed.ts
import { db } from "../src/lib/db";

async function main() {
  console.log("Seeding database...");

  // PROJECTS
  const projects = [
    {
      slug: "spam-detector-ml",
      title: "Spam Detector ML",
      summary: "Classifieur de spam haute précision avec TF-IDF + Naive Bayes",
      description:
        "Pipeline ML end-to-end pour la détection de spam: vectorisation TF-IDF, classification Naive Bayes, validation croisée et évaluation complète. Atteint une précision de 98.2% et un rappel de 96.8% sur le jeu de test.",
      tags: "ML",
      metrics: JSON.stringify({ precision: "98.2%", recall: "96.8%", f1: "97.5%" }),
      techStack: "Python,scikit-learn,TF-IDF,Naive Bayes,Pandas",
      repoUrl: "https://github.com/Olivic664",
      demoUrl: null,
      imageUrl: null,
      featured: true,
      order: 1,
    },
    {
      slug: "nexacommerce-cameroun",
      title: "NexaCommerce Cameroun",
      summary: "Pipeline data engineering complet pour e-commerce",
      description:
        "Pipeline data engineering complet: ingestion, transformation ETL, analyse exploratoire (EDA) et tests unitaires. Gestion des dépendances avec Poetry, requêtes SQL analytiques, et qualité de code vérifiée par tests automatisés.",
      tags: "Data Engineering",
      metrics: JSON.stringify({ etl_stages: "4", test_coverage: "85%" }),
      techStack: "Python,Poetry,SQL,Pandas,pytest",
      repoUrl: "https://github.com/Olivic664",
      demoUrl: null,
      imageUrl: null,
      featured: true,
      order: 2,
    },
    {
      slug: "intellieval-agent",
      title: "IntelliEval",
      summary: "Agent conversationnel académique pour l'évaluation pédagogique",
      description:
        "Agent conversationnel intelligent pour l'évaluation académique. Architecture Next.js + Nest.js, modélisation UML complète et processus 2TUP. Le prototype a permis d'augmenter le taux de réponse aux enquêtes de 35% grâce à l'anonymisation UX.",
      tags: "GenAI,Web",
      metrics: JSON.stringify({ response_rate_boost: "+35%", architecture: "Next.js + Nest.js" }),
      techStack: "Next.js,Nest.js,LangChain,UML,2TUP",
      repoUrl: "https://github.com/Olivic664",
      demoUrl: null,
      imageUrl: null,
      featured: true,
      order: 3,
    },
    {
      slug: "solarmboa-iot",
      title: "SolarMboa IoT",
      summary: "Plateforme IoT pour données de capteurs solaires",
      description:
        "Plateforme IoT temps réel pour collecter, stocker et visualiser les données de capteurs solaires. Stack: MongoDB pour le stockage chaud, Redis pour le cache, FastAPI pour l'API REST.",
      tags: "IoT,Web",
      metrics: JSON.stringify({ sensors: "50+", api_latency: "<200ms" }),
      techStack: "MongoDB,Redis,FastAPI,Python,IoT",
      repoUrl: "https://github.com/Olivic664",
      demoUrl: null,
      imageUrl: null,
      featured: false,
      order: 4,
    },
    {
      slug: "cancer-diagnosis-prediction",
      title: "Cancer Diagnosis Prediction",
      summary: "Pipeline ML complet pour le diagnostic du cancer",
      description:
        "Pipeline ML complet: exploration, prétraitement, comparaison de 5 algorithmes, hyperparameter tuning avec GridSearchCV et évaluation rigoureuse (ROC-AUC, précision, rappel). Modèle final déployable en production.",
      tags: "ML",
      metrics: JSON.stringify({ algorithms_compared: "5", best_auc: "0.94" }),
      techStack: "Python,scikit-learn,TensorFlow,Matplotlib,GridSearchCV",
      repoUrl: "https://github.com/Olivic664",
      demoUrl: null,
      imageUrl: null,
      featured: true,
      order: 5,
    },
  ];

  for (const p of projects) {
    await db.project.upsert({
      where: { slug: p.slug },
      create: p,
      update: p,
    });
  }
  console.log(`- ${projects.length} projects seeded`);

  // SKILLS
  const skills = [
    { name: "Python", category: "Languages", level: 95, order: 1 },
    { name: "R", category: "Languages", level: 80, order: 2 },
    { name: "SQL", category: "Languages", level: 90, order: 3 },
    { name: "scikit-learn", category: "ML/DL", level: 92, order: 1 },
    { name: "TensorFlow", category: "ML/DL", level: 82, order: 2 },
    { name: "HuggingFace", category: "ML/DL", level: 78, order: 3 },
    { name: "LangChain", category: "ML/DL", level: 80, order: 4 },
    { name: "Power BI", category: "Data Viz", level: 88, order: 1 },
    { name: "Seaborn", category: "Data Viz", level: 85, order: 2 },
    { name: "Matplotlib", category: "Data Viz", level: 90, order: 3 },
    { name: "MySQL", category: "Databases", level: 85, order: 1 },
    { name: "PostgreSQL", category: "Databases", level: 88, order: 2 },
    { name: "Docker", category: "DevOps", level: 75, order: 1 },
    { name: "GitHub", category: "DevOps", level: 90, order: 2 },
    { name: "Next.js", category: "Tools", level: 78, order: 1 },
  ];
  for (const s of skills) {
    const existing = await db.skill.findFirst({ where: { name: s.name } });
    if (existing) {
      await db.skill.update({ where: { id: existing.id }, data: s });
    } else {
      await db.skill.create({ data: s });
    }
  }
  console.log(`- ${skills.length} skills seeded`);

  // EXPERIENCES
  const experiences = [
    {
      role: "Data Scientist (Stagiaire)",
      company: "Université de Douala",
      location: "Douala, Cameroun",
      startDate: "01/2025",
      endDate: "06/2025",
      current: false,
      description:
        "Application web intelligente pour l'évaluation pédagogique avec IA",
      situation:
        "L'Université de Douala cherchait à moderniser son système d'évaluation pédagogique tout en garantissant l'anonymat des répondants pour augmenter le taux de participation.",
      task:
        "Concevoir et développer une application web intelligente pour l'évaluation pédagogique, incluant un agent conversationnel et des tableaux de bord interactifs.",
      actions: [
        "Analyse du besoin métier avec les parties prenantes académiques",
        "Conception de l'architecture Next.js + Nest.js avec modélisation UML/2TUP",
        "Intégration d'un agent conversationnel académique (LangChain)",
        "Implémentation de l'anonymisation UX pour rassurer les répondants",
        "Développement de tableaux de bord interactifs et génération automatisée de rapports",
      ].join("\n"),
      results: [
        "+35% de taux de réponse aux enquêtes grâce à l'anonymisation UX",
        "Prototype fonctionnel livré et validé par l'équipe pédagogique",
        "Tableaux de bord interactifs déployés et utilisés en production",
        "Génération automatisée de rapports PDF économisant plusieurs heures par semaine",
      ].join("\n"),
      order: 1,
    },
    {
      role: "Data Analyst (Stage)",
      company: "SYAR",
      location: "Douala, Cameroun",
      startDate: "12/2023",
      endDate: "12/2024",
      current: false,
      description:
        "Analyse de données patients SIDA, dashboards Power BI, modèle de scoring",
      situation:
        "SYAR disposait d'un volume important de données patients liées au suivi du SIDA mais manquait d'outils analytiques pour transformer ces données en décisions médicales.",
      task:
        "Analyser les données patients, construire des dashboards Power BI décisionnels et développer un modèle de scoring pour prioriser les cas à risque.",
      actions: [
        "Nettoyage et structuration des données patients (SQL + Python)",
        "Exploration statistique et identification des variables corrélées au risque",
        "Conception de dashboards Power BI adaptés aux équipes médicales",
        "Développement d'un modèle de scoring patient (classification)",
        "Présentation des résultats aux équipes médicales et itérations",
      ].join("\n"),
      results: [
        "Impact direct sur la prise de décision médicale",
        "Dashboards Power BI adoptés en routine par les équipes soignantes",
        "Modèle de scoring permettant de prioriser les patients à risque élevé",
        "Réduction du temps d'analyse des données patients",
      ].join("\n"),
      order: 2,
    },
  ];
  for (const e of experiences) {
    const existing = await db.experience.findFirst({ where: { company: e.company, role: e.role } });
    if (existing) {
      await db.experience.update({ where: { id: existing.id }, data: e });
    } else {
      await db.experience.create({ data: e });
    }
  }
  console.log(`- ${experiences.length} experiences seeded`);

  // EDUCATION
  const education = [
    {
      diploma: "Data & AI Engineer",
      school: "DHI Academy (FNE)",
      period: "2025 - 2026",
      description:
        "Formation intensive orientée MLOps, Cloud, GenAI et LLMs. Projets pratiques sur la mise en production de modèles et l'orchestration de pipelines IA.",
      order: 1,
    },
    {
      diploma: "Master MIAGE - Systemes Intelligents",
      school: "Universite de Douala",
      period: "2023 - 2025",
      description:
        "Specialisation en systemes intelligents: apprentissage automatique, bases de donnees avancees, genie logiciel et conception de systemes decisionnels.",
      order: 2,
    },
    {
      diploma: "Licence Genie Logiciel",
      school: "IUT de Douala",
      period: "2021 - 2022",
      description:
        "Fondamentaux du genie logiciel: programmation orientee objet, bases de donnees, conception UML et methodes agiles.",
      order: 3,
    },
  ];
  for (const ed of education) {
    const existing = await db.education.findFirst({ where: { diploma: ed.diploma } });
    if (existing) {
      await db.education.update({ where: { id: existing.id }, data: ed });
    } else {
      await db.education.create({ data: ed });
    }
  }
  console.log(`- ${education.length} education entries seeded`);

  // CERTIFICATIONS
  const certifications = [
    { name: "Machine Learning & Deep Learning", issuer: "Udemy", year: "2024", url: null, order: 1 },
    { name: "LangChain Developer", issuer: "LangChain", year: "2025", url: null, order: 2 },
    { name: "TensorFlow / Keras Developer", issuer: "TensorFlow", year: "2024", url: null, order: 3 },
    { name: "Data Science Professional", issuer: "DataCamp", year: "2024", url: null, order: 4 },
  ];
  for (const c of certifications) {
    const existing = await db.certification.findFirst({ where: { name: c.name } });
    if (existing) {
      await db.certification.update({ where: { id: existing.id }, data: c });
    } else {
      await db.certification.create({ data: c });
    }
  }
  console.log(`- ${certifications.length} certifications seeded`);

  // ADMIN USER (for local NextAuth)
  await db.adminUser.upsert({
    where: { email: "Mahopolivierconstantin39@gmail.com" },
    create: {
      email: "Mahopolivierconstantin39@gmail.com",
      name: "MAHOP Olivier Constantin",
      role: "admin",
    },
    update: {},
  });
  console.log("- admin user seeded");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

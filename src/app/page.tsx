import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import {
  getProjects,
  getSkills,
  getExperiences,
  getEducation,
  getCertifications,
} from "@/lib/data";
import { logPageViewAction } from "@/actions/views";

// Revalidate every 60s — projects/skills stay fresh after admin edits
export const revalidate = 60;

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fire-and-forget analytics — never block render, never crash
  try {
    logPageViewAction("/").catch(() => {});
  } catch {}

  // Each getter has its own try/catch — never throws, returns [] on failure
  const [projects, skills, experiences, education, certifications] = await Promise.all([
    getProjects(),
    getSkills(),
    getExperiences(),
    getEducation(),
    getCertifications(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About education={education} certifications={certifications} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Experience experiences={experiences} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

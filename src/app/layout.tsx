import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { PROFILE } from "@/lib/constants";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = PROFILE.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${PROFILE.name} — ${PROFILE.title}`,
    template: `%s — ${PROFILE.name}`,
  },
  description:
    "Portfolio de MAHOP Olivier Constantin, Data Scientist & Data Engineer en formation à Douala. Projets ML, data engineering, GenAI et IoT. Disponible en remote.",
  keywords: [
    "Data Scientist",
    "Data Engineer",
    "Machine Learning",
    "Python",
    "TensorFlow",
    "scikit-learn",
    "LangChain",
    "Power BI",
    "Portfolio",
    "Cameroun",
    "Douala",
    "MAHOP Olivier Constantin",
  ],
  authors: [{ name: PROFILE.name, url: siteUrl }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    title: `${PROFILE.name} — ${PROFILE.title}`,
    description:
      "Portfolio de MAHOP Olivier Constantin, Data Scientist & Data Engineer. Projets ML, data engineering, GenAI et IoT. Disponible en remote.",
    siteName: `${PROFILE.name} — Portfolio`,
    images: [
      {
        url: PROFILE.ogImage,
        width: 1200,
        height: 630,
        alt: `${PROFILE.name} — ${PROFILE.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.name} — ${PROFILE.title}`,
    description:
      "Data Scientist & Data Engineer — Projets ML, data engineering, GenAI et IoT. Disponible en remote.",
    images: [PROFILE.ogImage],
    creator: "@olivier_mahop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

// JSON-LD structured data — Person + ItemList (projects)
const jsonLdPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  url: siteUrl,
  image: `${siteUrl}${PROFILE.ogImage}`,
  jobTitle: PROFILE.title,
  email: `mailto:${PROFILE.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Douala",
    addressCountry: "CM",
  },
  sameAs: [PROFILE.linkedin, PROFILE.github],
  knowsAbout: [
    "Machine Learning",
    "Data Engineering",
    "Deep Learning",
    "Python",
    "TensorFlow",
    "scikit-learn",
    "LangChain",
    "Power BI",
    "SQL",
    "PostgreSQL",
    "Docker",
  ],
  knowsLanguage: [
    { "@type": "Language", name: "French", alternateName: "fr" },
    { "@type": "Language", name: "English", alternateName: "en" },
  ],
};

const jsonLdItemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Projets — MAHOP Olivier Constantin",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Spam Detector ML",
      url: `${siteUrl}#projects`,
      description: "TF-IDF + Naive Bayes, 98.2% précision",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "NexaCommerce Cameroun",
      url: `${siteUrl}#projects`,
      description: "Pipeline data engineering complet",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "IntelliEval",
      url: `${siteUrl}#projects`,
      description: "Agent conversationnel académique",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "SolarMboa IoT",
      url: `${siteUrl}#projects`,
      description: "Plateforme IoT pour capteurs solaires",
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Cancer Diagnosis Prediction",
      url: `${siteUrl}#projects`,
      description: "Pipeline ML complet, 5 algorithmes comparés",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

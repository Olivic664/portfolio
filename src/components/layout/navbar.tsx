"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { NAV_LINKS, PROFILE } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo / brand */}
        <Link
          href="#home"
          className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight hover:opacity-80 transition"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Terminal className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">
            <span className="text-primary">olivier</span>
            <span className="text-muted-foreground">.mahop</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <a href={PROFILE.cvPath} download>
              CV
            </a>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contact">Me contacter</a>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetTitle className="text-left">Navigation</SheetTitle>
              <div className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <SheetClose asChild>
                  <Button asChild variant="outline" className="w-full">
                    <a href={PROFILE.cvPath} download>
                      Télécharger le CV
                    </a>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <a href="#contact">Me contacter</a>
                  </Button>
                </SheetClose>
              </div>
              <div className="mt-8 text-xs text-muted-foreground">
                <p className="font-mono">{PROFILE.email}</p>
                <p className="mt-1">{PROFILE.location}</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

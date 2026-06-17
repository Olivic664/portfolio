"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Github, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PROFILE } from "@/lib/constants";
import { sendMessage, type ContactFormState } from "@/actions/messages";

const initialState: ContactFormState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Envoi en cours...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Envoyer le message
        </>
      )}
    </Button>
  );
}

export function Contact() {
  const [state, formAction] = useActionState(sendMessage, initialState);

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <p className="font-mono text-sm text-primary mb-2">{"// 05. contact"}</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Travaillons ensemble
          </h2>
          <p className="mt-4 text-muted-foreground">
            Une opportunité Data Science, Data Engineering ou GenAI à discuter ?
            Envoyez-moi un message, je réponds sous 24-48h.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-5">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border/60 bg-card/50">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="text-sm font-medium hover:text-primary transition-colors break-all"
                    >
                      {PROFILE.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Localisation</p>
                    <p className="text-sm font-medium">{PROFILE.location}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/40">
                  <p className="text-xs text-muted-foreground mb-2">Réseaux</p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-3.5 w-3.5" />
                        LinkedIn
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-3.5 w-3.5" />
                        GitHub
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="pt-3 border-t border-border/40">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Disponible immédiatement en remote
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card className="lg:col-span-3 border-border/60 bg-card/50">
            <CardContent className="p-6">
              {state.success ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold">Message envoyé !</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Merci pour votre message. Je vous répondrai sous 24-48h à l'adresse
                    indiquée.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-6"
                    onClick={() => window.location.reload()}
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">
                        Nom <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Votre nom"
                        required
                        aria-invalid={!!state.errors?.name}
                      />
                      {state.errors?.name && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {state.errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="vous@exemple.com"
                        required
                        aria-invalid={!!state.errors?.email}
                      />
                      {state.errors?.email && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {state.errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Objet de votre message"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Décrivez votre projet, votre opportunité ou votre question..."
                      rows={6}
                      required
                      aria-invalid={!!state.errors?.message}
                    />
                    {state.errors?.message && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {state.errors.message}
                      </p>
                    )}
                  </div>
                  {state.error && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {state.error}
                    </div>
                  )}
                  <SubmitButton />
                  <p className="text-xs text-muted-foreground text-center">
                    En envoyant ce formulaire, vous acceptez que vos informations soient
                    stockées afin de traiter votre demande.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

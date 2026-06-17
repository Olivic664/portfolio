"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { Pencil, Trash2, Plus, X, Star, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { ProjectItem } from "@/lib/data";
import { parseTags, parseMetrics } from "@/lib/data";
import { saveProject, deleteProject, type ProjectInput } from "@/actions/projects";

type Project = ProjectItem & { _tags: string[]; _metrics: Record<string, string>; _tech: string[] };

function enrich(p: ProjectItem): Project {
  return {
    ...p,
    _tags: parseTags(p.tags),
    _metrics: parseMetrics(p.metrics),
    _tech: parseTags(p.techStack),
  };
}

function ProjectForm({
  project,
  onClose,
}: {
  project?: Project;
  onClose: () => void;
}) {
  const isEdit = !!project;
  const [tags, setTags] = React.useState<string[]>(project?._tags || []);
  const [tech, setTech] = React.useState<string[]>(project?._tech || []);
  const [metrics, setMetrics] = React.useState<{ key: string; value: string }[]>(
    project
      ? Object.entries(project._metrics).map(([key, value]) => ({ key, value }))
      : []
  );
  const [tagInput, setTagInput] = React.useState("");
  const [techInput, setTechInput] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const input: ProjectInput = {
      id: project?.id,
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      tags,
      metrics: Object.fromEntries(metrics.map((m) => [m.key, m.value])),
      techStack: tech,
      repoUrl: (formData.get("repoUrl") as string) || null,
      demoUrl: (formData.get("demoUrl") as string) || null,
      imageUrl: (formData.get("imageUrl") as string) || null,
      featured: formData.get("featured") === "on",
      order: Number(formData.get("order") || 0),
    };
    const res = await saveProject(input);
    setSaving(false);
    if (res.success) {
      toast.success(isEdit ? "Projet mis à jour" : "Projet créé");
      onClose();
    } else {
      toast.error(res.error || "Erreur lors de la sauvegarde");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin pr-2">
      <div className="space-y-1.5">
        <Label htmlFor="title">Titre *</Label>
        <Input id="title" name="title" defaultValue={project?.title} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="summary">Résumé court *</Label>
        <Input id="summary" name="summary" defaultValue={project?.summary} required maxLength={200} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" defaultValue={project?.description} required rows={4} />
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            placeholder="ML, Data Engineering..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tagInput.trim()) {
                e.preventDefault();
                if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                setTagInput("");
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
                setTagInput("");
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Badge key={t} variant="secondary" className="gap-1">
                {t}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tech stack */}
      <div className="space-y-1.5">
        <Label>Tech stack</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Python, scikit-learn..."
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && techInput.trim()) {
                e.preventDefault();
                if (!tech.includes(techInput.trim())) setTech([...tech, techInput.trim()]);
                setTechInput("");
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (techInput.trim() && !tech.includes(techInput.trim())) {
                setTech([...tech, techInput.trim()]);
                setTechInput("");
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tech.map((t) => (
              <Badge key={t} variant="outline" className="font-mono text-xs gap-1">
                {t}
                <button
                  type="button"
                  onClick={() => setTech(tech.filter((x) => x !== t))}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="space-y-1.5">
        <Label>Métriques (clé / valeur)</Label>
        <div className="space-y-2">
          {metrics.map((m, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="precision"
                value={m.key}
                onChange={(e) => {
                  const next = [...metrics];
                  next[i] = { ...next[i], key: e.target.value };
                  setMetrics(next);
                }}
              />
              <Input
                placeholder="98.2%"
                value={m.value}
                onChange={(e) => {
                  const next = [...metrics];
                  next[i] = { ...next[i], value: e.target.value };
                  setMetrics(next);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setMetrics(metrics.filter((_, idx) => idx !== i))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMetrics([...metrics, { key: "", value: "" }])}
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Ajouter une métrique
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="repoUrl">Repo URL</Label>
          <Input id="repoUrl" name="repoUrl" defaultValue={project?.repoUrl || ""} placeholder="https://github.com/..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Input id="demoUrl" name="demoUrl" defaultValue={project?.demoUrl || ""} placeholder="https://..." />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="order">Ordre</Label>
          <Input id="order" name="order" type="number" defaultValue={project?.order ?? 0} />
        </div>
        <div className="flex items-end gap-2 pb-1">
          <Label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
            <Switch id="featured" name="featured" defaultChecked={project?.featured} />
            Mis en avant
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border/40 sticky bottom-0 bg-background">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Annuler
          </Button>
        </DialogClose>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : isEdit ? (
            "Mettre à jour"
          ) : (
            "Créer le projet"
          )}
        </Button>
      </div>
    </form>
  );
}

export function ProjectsManager({ projects: initial }: { projects: ProjectItem[] }) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);

  const projects = React.useMemo(() => initial.map(enrich), [initial]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) return;
    const res = await deleteProject(id);
    if (res.success) toast.success("Projet supprimé");
    else toast.error(res.error || "Erreur");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Projets ({projects.length})</h2>
          <p className="text-sm text-muted-foreground">Ajoutez, modifiez ou supprimez vos projets.</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau projet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
            </DialogHeader>
            <ProjectForm
              project={editing || undefined}
              onClose={() => {
                setOpen(false);
                setEditing(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {projects.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              Aucun projet. Cliquez sur "Nouveau projet" pour commencer.
            </CardContent>
          </Card>
        )}
        {projects.map((p) => (
          <Card key={p.id} className="border-border/60">
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {p.featured && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                  <h3 className="font-semibold truncate">{p.title}</h3>
                  <span className="text-xs font-mono text-muted-foreground">/{p.slug}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{p.summary}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {p._tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                    <Eye className="h-3 w-3" />
                    {p.views}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditing(p);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(p.id, p.title)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

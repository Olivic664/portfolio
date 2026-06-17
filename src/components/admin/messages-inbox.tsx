"use client";

import * as React from "react";
import { Mail, MailOpen, Trash2, Check, Reply, Loader2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import type { MessageItem } from "@/lib/data";
import { markMessageRead, markMessageReplied, deleteMessage } from "@/actions/messages";

export function MessagesInbox({ messages: initial }: { messages: MessageItem[] }) {
  const [messages, setMessages] = React.useState(initial);
  const [filter, setFilter] = React.useState<"all" | "unread" | "replied">("all");
  const [actionId, setActionId] = React.useState<string | null>(null);

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "replied") return m.replied;
    return true;
  });

  async function handleAction(
    id: string,
    action: "read" | "replied" | "delete"
  ) {
    setActionId(id);
    let res;
    if (action === "read") res = await markMessageRead(id);
    else if (action === "replied") res = await markMessageReplied(id);
    else res = await deleteMessage(id);

    setActionId(null);

    if (res?.success) {
      // Optimistic update
      if (action === "delete") {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        toast.success("Message supprimé");
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  read: true,
                  replied: action === "replied" ? true : m.replied,
                }
              : m
          )
        );
        toast.success(action === "read" ? "Marqué comme lu" : "Marqué comme répondu");
      }
    } else {
      toast.error(res?.error || "Erreur");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-semibold">Messages ({messages.length})</h2>
          <p className="text-sm text-muted-foreground">
            Messages reçus via le formulaire de contact.
          </p>
        </div>
        <div className="flex gap-1">
          {(["all", "unread", "replied"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Tous" : f === "unread" ? "Non lus" : "Répondus"}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center text-muted-foreground">
            <Inbox className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>Aucun message {filter !== "all" && `(${filter === "unread" ? "non lu" : "répondu"})`}.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => {
            const isActing = actionId === msg.id;
            return (
              <Card
                key={msg.id}
                className={`border-border/60 transition-colors ${
                  !msg.read ? "border-primary/40 bg-primary/5" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${
                          msg.read ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"
                        }`}
                      >
                        {msg.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{msg.name}</span>
                          <span className="text-xs text-muted-foreground break-all">
                            &lt;{msg.email}&gt;
                          </span>
                          {msg.replied && (
                            <Badge variant="outline" className="text-xs gap-1 text-emerald-600 border-emerald-500/30">
                              <Reply className="h-3 w-3" />
                              Répondu
                            </Badge>
                          )}
                        </div>
                        {msg.subject && (
                          <p className="text-sm font-medium mt-1">{msg.subject}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(msg.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      {!msg.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isActing}
                          onClick={() => handleAction(msg.id, "read")}
                          title="Marquer comme lu"
                        >
                          {isActing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Répondre par email"
                      >
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Votre message"}`}
                        >
                          <Reply className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      {!msg.replied && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isActing}
                          onClick={() => handleAction(msg.id, "replied")}
                          title="Marquer comme répondu"
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        disabled={isActing}
                        onClick={() => handleAction(msg.id, "delete")}
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

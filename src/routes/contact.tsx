import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle, Share2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteShell } from "@/components/site/SiteShell";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { site } from "@/lib/site";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(2000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FORMATION SPECIAL" },
      {
        name: "description",
        content:
          "Contactez Formation Special par WhatsApp, email ou via le formulaire pour toute question sur nos formations Trading.",
      },
      { property: "og:title", content: "Contact — FORMATION SPECIAL" },
      { property: "og:description", content: "WhatsApp, email et formulaire de contact." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const parsed = contactSchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message"),
    });
    if (!parsed.success) {
      toast.error(t("order.error"));
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error(t("order.error"));
      return;
    }
    toast.success(t("contact.sent"));
    formEl.reset();
  }

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold">{t("contact.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("contact.intro")}</p>

          <div className="mt-8 space-y-4">
            <a
              href={site.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="card-premium flex items-center gap-4 p-5 transition-colors hover:bg-secondary"
            >
              <MessageCircle className="size-5 text-accent" />
              <span>
                <span className="block text-sm text-muted-foreground">{t("contact.whatsapp")}</span>
                <span className="font-medium">{site.whatsapp}</span>
              </span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="card-premium flex items-center gap-4 p-5 transition-colors hover:bg-secondary"
            >
              <Mail className="size-5 text-primary" />
              <span>
                <span className="block text-sm text-muted-foreground">{t("contact.email")}</span>
                <span className="font-medium">{site.email}</span>
              </span>
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noreferrer"
              className="card-premium flex items-center gap-4 p-5 transition-colors hover:bg-secondary"
            >
              <Share2 className="size-5 text-primary" />
              <span>
                <span className="block text-sm text-muted-foreground">{t("contact.social")}</span>
                <span className="font-medium">Facebook</span>
              </span>
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-premium space-y-5 p-7">
          <div className="space-y-2">
            <Label htmlFor="name">{t("contact.name")}</Label>
            <Input id="name" name="name" required maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("contact.email")}</Label>
            <Input id="email" name="email" type="email" required maxLength={255} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{t("contact.message")}</Label>
            <Textarea id="message" name="message" required rows={6} maxLength={2000} />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("order.sending") : t("contact.send")}
          </Button>
        </form>
      </div>
    </SiteShell>
  );
}

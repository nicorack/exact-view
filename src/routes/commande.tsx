import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteShell } from "@/components/site/SiteShell";
import { useI18n, formatAmount } from "@/lib/i18n";
import { fetchActiveFormations, localized } from "@/lib/formations";
import { supabase } from "@/integrations/supabase/client";
import { site } from "@/lib/site";
import { toast } from "sonner";

const orderSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  country: z.string().trim().min(2).max(60),
  payment_method: z.string().trim().min(2).max(60),
});

export const Route = createFileRoute("/commande")({
  validateSearch: (search: Record<string, unknown>) => ({
    formation: typeof search.formation === "string" ? search.formation : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Commander ma formation — FORMATION SPECIAL" },
      {
        name: "description",
        content:
          "Remplissez le formulaire de commande : nous vérifions votre paiement Mobile Money ou virement, puis nous validons votre accès à la formation.",
      },
      { property: "og:title", content: "Commander ma formation — FORMATION SPECIAL" },
      {
        property: "og:description",
        content: "Formulaire de commande sécurisé avec validation manuelle du paiement.",
      },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { t, lang } = useI18n();
  const search = Route.useSearch();
  const { data: formations } = useQuery({ queryKey: ["formations", "active"], queryFn: fetchActiveFormations });

  const [formationId, setFormationId] = useState<string>("");
  const [payment, setPayment] = useState<string>(site.paymentMethods[0] ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!formations?.length || formationId) return;
    const preselected = search.formation
      ? formations.find((item) => item.slug === search.formation)
      : undefined;
    setFormationId((preselected ?? formations[0]!).id);
  }, [formations, search.formation, formationId]);

  const selected = formations?.find((item) => item.id === formationId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const parsed = orderSchema.safeParse({
      full_name: form.get("full_name"),
      email: form.get("email"),
      phone: form.get("phone"),
      country: form.get("country"),
      payment_method: payment,
    });

    if (!parsed.success) {
      toast.error(t("order.error"));
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      ...parsed.data,
      formation_id: selected.id,
      formation_name: localized(selected, "fr").name,
      amount: selected.price,
      currency: selected.currency,
    });
    setSubmitting(false);

    if (error) {
      toast.error(t("order.error"));
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <CheckCircle2 className="mx-auto size-14 text-accent" />
          <h1 className="mt-6 text-3xl font-bold">{t("order.success")}</h1>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/">{t("nav.home")}</Link>
            </Button>
            <Button onClick={() => setDone(false)}>{t("order.newOrder")}</Button>
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-4xl font-bold">{t("order.title")}</h1>
        <p className="mt-4 text-muted-foreground">{t("order.intro")}</p>

        <form onSubmit={handleSubmit} className="card-premium mt-10 space-y-5 p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">{t("order.name")}</Label>
              <Input id="full_name" name="full_name" required maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("order.email")}</Label>
              <Input id="email" name="email" type="email" required maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("order.phone")}</Label>
              <Input id="phone" name="phone" required maxLength={30} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">{t("order.country")}</Label>
              <Input id="country" name="country" required maxLength={60} defaultValue="Madagascar" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("order.payment")}</Label>
            <Select value={payment} onValueChange={setPayment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {site.paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("order.formation")}</Label>
            <Select value={formationId} onValueChange={setFormationId}>
              <SelectTrigger>
                <SelectValue placeholder={t("common.loading")} />
              </SelectTrigger>
              <SelectContent>
                {formations?.map((formation) => (
                  <SelectItem key={formation.id} value={formation.id}>
                    {localized(formation, lang).name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-5">
            <span className="text-sm text-muted-foreground">{t("order.amount")}</span>
            <span className="font-display text-xl font-bold text-primary">
              {selected ? formatAmount(selected.price, selected.currency) : "—"}
            </span>
          </div>

          <Button type="submit" size="lg" className="w-full shadow-gold" disabled={submitting || !selected}>
            {submitting ? t("order.sending") : t("order.submit")}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {site.whatsapp} · {site.email}
          </p>
        </form>
      </div>
    </SiteShell>
  );
}

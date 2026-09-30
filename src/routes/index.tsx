import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteShell";
import { useI18n, formatAmount } from "@/lib/i18n";
import { fetchActiveFormations, localized } from "@/lib/formations";
import heroImage from "@/assets/hero-trading.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FORMATION SPECIAL — Formations Trading en français et malagasy" },
      {
        name: "description",
        content:
          "Développez vos compétences en Trading avec Formation Special : formations pratiques, accompagnement personnalisé, disponibles en français et en malagasy.",
      },
      { property: "og:title", content: "FORMATION SPECIAL — Formations Trading" },
      {
        property: "og:description",
        content: "Apprenez le Trading pas à pas : analyse technique, gestion du risque, psychologie du trader.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, lang } = useI18n();
  const { data: formations } = useQuery({ queryKey: ["formations", "active"], queryFn: fetchActiveFormations });
  const featured = formations?.[0];

  const advantages = [
    { icon: BadgeCheck, key: "advantages.1" },
    { icon: LineChart, key: "advantages.2" },
    { icon: Sparkles, key: "advantages.3" },
    { icon: ShieldCheck, key: "advantages.4" },
  ];

  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt=""
          width={1600}
          height={1008}
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-night opacity-80" />
        <div className="relative mx-auto max-w-6xl px-4 py-28 sm:py-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-xs font-medium tracking-wide text-primary">
            {t("hero.badge")}
          </span>
          <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
            <span className="text-gold-gradient">FORMATION</span> SPECIAL
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t("hero.subtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="shadow-gold">
              <Link to="/formations">
                {t("hero.cta1")}
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/commande">{t("hero.cta2")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">{t("about.title")}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t("about.text")}</p>
            {featured ? (
              <div className="card-premium mt-8 p-6">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  {t("formations.title")}
                </p>
                <p className="mt-2 font-display text-xl font-semibold">
                  {localized(featured, lang).name}
                </p>
                <p className="mt-1 text-primary">{formatAmount(featured.price, featured.currency)}</p>
                <Button asChild className="mt-5" size="sm">
                  <Link to="/formations/$slug" params={{ slug: featured.slug }}>
                    {t("formations.detail")}
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
          <div className="grid gap-4">
            {advantages.map(({ icon: Icon, key }) => (
              <div key={key} className="card-premium flex gap-4 p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{t(key)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="card-premium bg-night p-8 text-center sm:p-14">
          <h2 className="text-3xl font-bold sm:text-4xl">{t("advantages.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("formations.intro")}</p>
          <Button asChild size="lg" className="mt-8 shadow-gold">
            <Link to="/commande">{t("nav.buy")}</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}

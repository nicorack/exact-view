import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteShell";
import { useI18n, formatAmount } from "@/lib/i18n";
import { fetchActiveFormations, localized } from "@/lib/formations";
import formationImage from "@/assets/formation-trading.jpg";

export const Route = createFileRoute("/formations/$slug")({
  head: () => ({
    meta: [
      { title: "Détail de la formation — FORMATION SPECIAL" },
      {
        name: "description",
        content:
          "Programme complet, objectifs, témoignages et prix de la formation Trading proposée par Formation Special.",
      },
      { property: "og:title", content: "Détail de la formation — FORMATION SPECIAL" },
      {
        property: "og:description",
        content: "Programme, objectifs, témoignages et prix de la formation Trading.",
      },
    ],
  }),
  component: FormationDetail,
});

function FormationDetail() {
  const { slug } = Route.useParams();
  const { t, lang } = useI18n();
  const { data, isLoading } = useQuery({ queryKey: ["formations", "active"], queryFn: fetchActiveFormations });
  const formation = data?.find((item) => item.slug === slug);

  if (isLoading) {
    return (
      <SiteShell>
        <p className="mx-auto max-w-6xl px-4 py-24 text-muted-foreground">{t("common.loading")}</p>
      </SiteShell>
    );
  }

  if (!formation) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-6xl px-4 py-24">
          <p className="text-muted-foreground">{t("formations.notFound")}</p>
          <Button asChild className="mt-6">
            <Link to="/formations">{t("common.back")}</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  const l = localized(formation, lang);
  const testimonials = ["testimonials.1", "testimonials.2", "testimonials.3"];

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold sm:text-5xl">{l.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{l.tagline}</p>

        <div className="card-premium mt-10 overflow-hidden">
          <h2 className="px-7 pt-7 font-display text-xl font-semibold">{t("formations.video")}</h2>
          {formation.video_url ? (
            <div className="aspect-video px-7 pb-7 pt-4">
              <iframe
                src={formation.video_url}
                title={l.name}
                allowFullScreen
                className="size-full rounded-xl border border-border"
              />
            </div>
          ) : (
            <div className="px-7 pb-7 pt-4">
              <img
                src={formation.image_url ?? formationImage}
                alt={l.name}
                loading="lazy"
                width={1200}
                height={800}
                className="aspect-video w-full rounded-xl object-cover"
              />
              <p className="mt-3 text-sm text-muted-foreground">{t("formations.videoSoon")}</p>
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <section className="card-premium p-7">
            <h2 className="font-display text-xl font-semibold">{t("formations.program")}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {l.program.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card-premium p-7">
            <h2 className="font-display text-xl font-semibold">{t("formations.learn")}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {l.objectives.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">{l.description}</p>
          </section>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">{t("testimonials.title")}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {testimonials.map((key) => (
              <blockquote key={key} className="card-premium p-6 text-sm">
                <Quote className="size-5 text-primary" />
                <p className="mt-3 text-muted-foreground">{t(key)}</p>
              </blockquote>
            ))}
          </div>
        </section>

        <div className="card-premium mt-12 flex flex-wrap items-center justify-between gap-6 bg-night p-8">
          <div>
            <p className="text-sm text-muted-foreground">{t("formations.price")}</p>
            <p className="font-display text-3xl font-bold text-primary">
              {formatAmount(formation.price, formation.currency)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("formations.duration")}: {l.duration} · {t("formations.level")}: {formation.level}
            </p>
          </div>
          <Button asChild size="lg" className="shadow-gold">
            <Link to="/commande" search={{ formation: formation.slug }}>
              {t("formations.order")}
            </Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}

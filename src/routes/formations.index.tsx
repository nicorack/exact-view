import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteShell";
import { useI18n, formatAmount } from "@/lib/i18n";
import { fetchActiveFormations, localized } from "@/lib/formations";
import formationImage from "@/assets/formation-trading.jpg";

export const Route = createFileRoute("/formations/")({
  head: () => ({
    meta: [
      { title: "Nos formations Trading — FORMATION SPECIAL" },
      {
        name: "description",
        content:
          "Formation Trading Premium : analyse technique, gestion du risque, stratégies d'entrée et sortie, psychologie du trader et gestion du capital.",
      },
      { property: "og:title", content: "Nos formations Trading — FORMATION SPECIAL" },
      {
        property: "og:description",
        content: "Découvrez le programme, la durée, le niveau et le prix de nos formations Trading.",
      },
    ],
  }),
  component: FormationsPage,
});

function FormationsPage() {
  const { t, lang } = useI18n();
  const { data, isLoading } = useQuery({ queryKey: ["formations", "active"], queryFn: fetchActiveFormations });

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-bold sm:text-5xl">{t("formations.title")}</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">{t("formations.intro")}</p>

        {isLoading ? <p className="mt-12 text-muted-foreground">{t("common.loading")}</p> : null}
        {!isLoading && (data?.length ?? 0) === 0 ? (
          <p className="mt-12 text-muted-foreground">{t("formations.empty")}</p>
        ) : null}

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {data?.map((formation) => {
            const l = localized(formation, lang);
            return (
              <article key={formation.id} className="card-premium overflow-hidden">
                <img
                  src={formation.image_url ?? formationImage}
                  alt={l.name}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-52 w-full object-cover"
                />
                <div className="p-7">
                  <h2 className="font-display text-2xl font-semibold">{l.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{l.tagline}</p>

                  <ul className="mt-6 space-y-2">
                    {l.program.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
                    <div>
                      <dt className="text-muted-foreground">{t("formations.duration")}</dt>
                      <dd className="font-medium">{l.duration}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t("formations.level")}</dt>
                      <dd className="font-medium">{formation.level}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t("formations.price")}</dt>
                      <dd className="font-semibold text-primary">
                        {formatAmount(formation.price, formation.currency)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t("formations.bonus")}</dt>
                      <dd className="font-medium">{l.bonus || "—"}</dd>
                    </div>
                  </dl>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button asChild className="shadow-gold">
                      <Link to="/commande" search={{ formation: formation.slug }}>
                        {t("formations.buy")}
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/formations/$slug" params={{ slug: formation.slug }}>
                        {t("formations.detail")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}

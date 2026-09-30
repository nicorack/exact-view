import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useI18n, type Lang } from "@/lib/i18n";
import { site } from "@/lib/site";

const navItems = [
  { to: "/", key: "nav.home" },
  { to: "/formations", key: "nav.formations" },
  { to: "/commande", key: "nav.order" },
  { to: "/contact", key: "nav.contact" },
] as const;

function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const options: { value: Lang; label: string }[] = [
    { value: "fr", label: "FR" },
    { value: "mg", label: "MG" },
  ];

  return (
    <div className="flex items-center rounded-full border border-border bg-secondary/60 p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLang(option.value)}
          aria-pressed={lang === option.value}
          className={
            lang === option.value
              ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
              : "rounded-full px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Header() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-display text-base font-bold tracking-tight sm:text-lg">
          <span className="text-gold-gradient">FORMATION</span>{" "}
          <span className="text-foreground">SPECIAL</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-primary" }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/commande">{t("nav.buy")}</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <nav className="mt-10 flex flex-col gap-5 px-5">
                {navItems.map((item) => (
                  <Link key={item.to} to={item.to} className="text-lg font-medium">
                    {t(item.key)}
                  </Link>
                ))}
                <Link to="/auth" className="text-sm text-muted-foreground">
                  {t("nav.admin")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-24 border-t border-border bg-night">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">
            <span className="text-gold-gradient">FORMATION</span> SPECIAL
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>
        <div className="space-y-2 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
          <Link to="/auth" className="block text-muted-foreground transition-colors hover:text-foreground">
            {t("nav.admin")}
          </Link>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>{site.whatsapp}</p>
          <p>{site.email}</p>
          <p className="pt-4 text-xs">
            © {new Date().getFullYear()} {site.name}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

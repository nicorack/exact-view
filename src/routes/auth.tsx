import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Espace administrateur — FORMATION SPECIAL" },
      {
        name: "description",
        content: "Connexion réservée à l'administration de Formation Special.",
      },
      { property: "og:title", content: "Espace administrateur — FORMATION SPECIAL" },
      { property: "og:description", content: "Connexion à l'espace de gestion des commandes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      if (!data.session) {
        toast.success(t("auth.checkEmail"));
        return;
      }
      navigate({ to: "/admin" });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-night px-4">
      <Link to="/" className="font-display text-lg font-bold">
        <span className="text-gold-gradient">FORMATION</span> SPECIAL
      </Link>

      <form onSubmit={handleSubmit} className="card-premium mt-8 w-full max-w-sm space-y-5 p-7">
        <h1 className="font-display text-xl font-semibold">{t("auth.title")}</h1>

        <div className="space-y-2">
          <Label htmlFor="email">{t("order.email")}</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t("common.loading") : mode === "signin" ? t("auth.signin") : t("auth.signup")}
        </Button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "signin" ? t("auth.toSignup") : t("auth.toSignin")}
        </button>
      </form>

      <Link to="/" className="mt-6 text-sm text-muted-foreground hover:text-foreground">
        {t("common.back")}
      </Link>
    </div>
  );
}

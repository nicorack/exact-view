import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/lib/i18n";

export type Formation = {
  id: string;
  slug: string;
  name_fr: string;
  name_mg: string;
  tagline_fr: string;
  tagline_mg: string;
  description_fr: string;
  description_mg: string;
  program_fr: string[];
  program_mg: string[];
  objectives_fr: string[];
  objectives_mg: string[];
  bonus_fr: string;
  bonus_mg: string;
  duration_fr: string;
  duration_mg: string;
  level: string;
  price: number;
  currency: string;
  image_url: string | null;
  video_url: string | null;
  is_active: boolean;
  created_at: string;
};

export async function fetchActiveFormations(): Promise<Formation[]> {
  const { data, error } = await supabase
    .from("formations")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Formation[];
}

export async function fetchAllFormations(): Promise<Formation[]> {
  const { data, error } = await supabase
    .from("formations")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Formation[];
}

export function localized(formation: Formation, lang: Lang) {
  return {
    name: lang === "fr" ? formation.name_fr : formation.name_mg,
    tagline: lang === "fr" ? formation.tagline_fr : formation.tagline_mg,
    description: lang === "fr" ? formation.description_fr : formation.description_mg,
    program: lang === "fr" ? formation.program_fr : formation.program_mg,
    objectives: lang === "fr" ? formation.objectives_fr : formation.objectives_mg,
    bonus: lang === "fr" ? formation.bonus_fr : formation.bonus_mg,
    duration: lang === "fr" ? formation.duration_fr : formation.duration_mg,
  };
}

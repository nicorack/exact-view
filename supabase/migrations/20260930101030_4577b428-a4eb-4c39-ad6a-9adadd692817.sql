CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing int;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT count(*) INTO existing FROM public.user_roles WHERE role = 'admin';
  IF existing > 0 THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
    ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

CREATE TABLE public.formations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_fr text NOT NULL,
  name_mg text NOT NULL,
  tagline_fr text NOT NULL DEFAULT '',
  tagline_mg text NOT NULL DEFAULT '',
  description_fr text NOT NULL DEFAULT '',
  description_mg text NOT NULL DEFAULT '',
  program_fr text[] NOT NULL DEFAULT '{}',
  program_mg text[] NOT NULL DEFAULT '{}',
  objectives_fr text[] NOT NULL DEFAULT '{}',
  objectives_mg text[] NOT NULL DEFAULT '{}',
  bonus_fr text NOT NULL DEFAULT '',
  bonus_mg text NOT NULL DEFAULT '',
  duration_fr text NOT NULL DEFAULT '',
  duration_mg text NOT NULL DEFAULT '',
  level text NOT NULL DEFAULT 'Débutant',
  price numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'Ar',
  image_url text,
  video_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.formations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.formations TO authenticated;
GRANT ALL ON public.formations TO service_role;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active formations" ON public.formations
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all formations" ON public.formations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert formations" ON public.formations
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update formations" ON public.formations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete formations" ON public.formations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id uuid REFERENCES public.formations(id) ON DELETE SET NULL,
  formation_name text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  country text NOT NULL,
  payment_method text NOT NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'Ar',
  status text NOT NULL DEFAULT 'pending',
  admin_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an order" ON public.orders
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view orders" ON public.orders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update messages" ON public.contact_messages
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER formations_touch BEFORE UPDATE ON public.formations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER orders_touch BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.formations (
  slug, name_fr, name_mg, tagline_fr, tagline_mg, description_fr, description_mg,
  program_fr, program_mg, objectives_fr, objectives_mg, bonus_fr, bonus_mg,
  duration_fr, duration_mg, level, price, currency
) VALUES (
  'formation-trading-premium',
  'Formation Trading Premium',
  'Fiofanana Trading Premium',
  'Maîtrisez les marchés financiers, étape par étape.',
  'Fehezo ny tsena ara-bola, dingana tsirairay.',
  'Une formation complète et pratique pour apprendre le Trading depuis les bases jusqu''aux stratégies avancées, avec un accompagnement personnalisé.',
  'Fiofanana feno sy azo ampiharina hianarana Trading manomboka amin''ny fototra ka hatramin''ny paikady mandroso, miaraka amin''ny fanaraha-maso manokana.',
  ARRAY['Introduction au Trading','Analyse technique','Gestion du risque','Stratégies d''entrée et sortie','Psychologie du trader','Gestion du capital'],
  ARRAY['Fampidirana amin''ny Trading','Famakafakana teknika','Fitantanana ny risika','Paikady fidirana sy fivoahana','Psikolojian''ny mpanao trading','Fitantanana ny renivola'],
  ARRAY['Comprendre le fonctionnement des marchés','Lire un graphique en chandeliers japonais','Construire un plan de trading solide','Protéger son capital durablement'],
  ARRAY['Mahazo ny fomba fiasan''ny tsena','Mahay mamaky grafika chandeliers japonais','Manorina drafitra trading matanjaka','Miaro ny renivola maharitra'],
  'Groupe privé de suivi + modèle de journal de trading',
  'Vondrona manokana fanaraha-maso + modely journal trading',
  '6 semaines',
  'Herinandro 6',
  'Débutant / Intermédiaire',
  250000,
  'Ar'
);

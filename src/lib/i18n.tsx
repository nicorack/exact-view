import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "fr" | "mg";

type Dict = Record<string, { fr: string; mg: string }>;

const dict: Dict = {
  "nav.home": { fr: "Accueil", mg: "Fandraisana" },
  "nav.formations": { fr: "Formations", mg: "Fiofanana" },
  "nav.order": { fr: "Commander", mg: "Hanafatra" },
  "nav.contact": { fr: "Contact", mg: "Fifandraisana" },
  "nav.admin": { fr: "Espace admin", mg: "Faritra admin" },
  "nav.buy": { fr: "Acheter maintenant", mg: "Hividy izao" },

  "hero.title": { fr: "FORMATION SPECIAL", mg: "FORMATION SPECIAL" },
  "hero.subtitle": {
    fr: "Développez vos compétences en Trading et maîtrisez les marchés financiers.",
    mg: "Ampitomboy ny fahaizanao amin'ny Trading ary fehezo ny tsena ara-bola.",
  },
  "hero.cta1": { fr: "Découvrir les formations", mg: "Hijery ny fiofanana" },
  "hero.cta2": { fr: "Acheter maintenant", mg: "Hividy izao" },
  "hero.badge": { fr: "Formations Trading · Madagascar", mg: "Fiofanana Trading · Madagasikara" },

  "about.title": { fr: "Qui sommes-nous", mg: "Iza izahay" },
  "about.text": {
    fr: "Formation Special accompagne les débutants et traders souhaitant améliorer leurs connaissances grâce à des formations pratiques et accessibles.",
    mg: "Formation Special manampy ireo vao manomboka sy ireo mpanao trading te hanatsara ny fahalalany amin'ny alalan'ny fiofanana azo ampiharina sy mora idirana.",
  },

  "advantages.title": { fr: "Pourquoi nous choisir", mg: "Fa maninona izahay" },
  "advantages.1": { fr: "Formation accessible à tous", mg: "Fiofanana azon'ny rehetra atrehina" },
  "advantages.1.desc": {
    fr: "Aucun prérequis : on part des bases, à votre rythme.",
    mg: "Tsy mila fahalalana mialoha : manomboka amin'ny fototra, araka ny hafainganao.",
  },
  "advantages.2": { fr: "Méthodes pratiques", mg: "Fomba azo ampiharina" },
  "advantages.2.desc": {
    fr: "Des exemples réels de graphiques et de prises de position.",
    mg: "Ohatra tena misy amin'ny grafika sy ny fanapahan-kevitra amin'ny tsena.",
  },
  "advantages.3": { fr: "Accompagnement personnalisé", mg: "Fanaraha-maso manokana" },
  "advantages.3.desc": {
    fr: "Un suivi direct pour répondre à vos questions.",
    mg: "Fanaraha-maso mivantana hamaliana ny fanontanianao.",
  },
  "advantages.4": { fr: "Apprentissage progressif", mg: "Fianarana miandalana" },
  "advantages.4.desc": {
    fr: "Des modules structurés, du débutant à l'avancé.",
    mg: "Modely voalamina, ho an'ny vao manomboka ka hatramin'ny mandroso.",
  },

  "formations.title": { fr: "Nos formations", mg: "Ny fiofanana atolotray" },
  "formations.intro": {
    fr: "Choisissez votre formation et commencez dès aujourd'hui.",
    mg: "Fidio ny fiofananao ary manomboha anio.",
  },
  "formations.empty": { fr: "Aucune formation disponible pour le moment.", mg: "Tsy misy fiofanana ankehitriny." },
  "formations.duration": { fr: "Durée", mg: "Faharetana" },
  "formations.level": { fr: "Niveau", mg: "Ambaratonga" },
  "formations.price": { fr: "Prix", mg: "Vidiny" },
  "formations.bonus": { fr: "Bonus", mg: "Bonus" },
  "formations.program": { fr: "Programme", mg: "Fandaharana" },
  "formations.objectives": { fr: "Objectifs", mg: "Tanjona" },
  "formations.learn": { fr: "Ce que vous allez apprendre", mg: "Izay hianaranao" },
  "formations.buy": { fr: "Acheter la formation", mg: "Hividy ny fiofanana" },
  "formations.detail": { fr: "Voir le détail", mg: "Hijery ny antsipiriany" },
  "formations.order": { fr: "Commander maintenant", mg: "Hanafatra izao" },
  "formations.video": { fr: "Vidéo de présentation", mg: "Horonan-tsary fampidirana" },
  "formations.videoSoon": {
    fr: "La vidéo de présentation sera disponible prochainement.",
    mg: "Ho azo jerena tsy ho ela ny horonan-tsary fampidirana.",
  },
  "formations.notFound": { fr: "Formation introuvable.", mg: "Tsy hita ny fiofanana." },

  "testimonials.title": { fr: "Témoignages clients", mg: "Tenin'ny mpianatra" },
  "testimonials.1": {
    fr: "J'ai enfin compris comment lire un graphique et gérer mon risque.",
    mg: "Azoko tamin'ny farany ny fomba famakiana grafika sy fitantanana ny risika.",
  },
  "testimonials.2": {
    fr: "Les explications sont claires et les exemples concrets.",
    mg: "Mazava ny fanazavana ary misy ohatra tena izy.",
  },
  "testimonials.3": {
    fr: "L'accompagnement fait toute la différence.",
    mg: "Ny fanaraha-maso no tena manova ny zavatra rehetra.",
  },

  "order.title": { fr: "Passer ma commande", mg: "Hanafatra" },
  "order.intro": {
    fr: "Remplissez le formulaire, nous validons votre paiement puis débloquons votre accès.",
    mg: "Fenoy ny taratasy, hamarinintsika ny fandoavana vola avy eo dia hosokafana ny fidiranao.",
  },
  "order.name": { fr: "Nom complet", mg: "Anarana feno" },
  "order.email": { fr: "Email", mg: "Mailaka" },
  "order.phone": { fr: "Téléphone", mg: "Telefona" },
  "order.country": { fr: "Pays", mg: "Firenena" },
  "order.payment": { fr: "Moyen de paiement", mg: "Fomba fandoavam-bola" },
  "order.formation": { fr: "Formation choisie", mg: "Fiofanana nofidina" },
  "order.amount": { fr: "Montant", mg: "Vola aloa" },
  "order.submit": { fr: "Envoyer ma commande", mg: "Alefa ny hafatro" },
  "order.sending": { fr: "Envoi...", mg: "Alefa..." },
  "order.success": {
    fr: "Merci pour votre commande. Votre demande est en cours de validation.",
    mg: "Misaotra tamin'ny fanafarana. Eo am-pamarinana ny fangatahanao.",
  },
  "order.error": {
    fr: "L'envoi a échoué. Merci de réessayer.",
    mg: "Tsy nahomby ny fandefasana. Andramo indray azafady.",
  },
  "order.newOrder": { fr: "Faire une autre commande", mg: "Hanafatra indray" },

  "contact.title": { fr: "Contactez-nous", mg: "Mifandraisa aminay" },
  "contact.intro": {
    fr: "Une question avant d'acheter ? Écrivez-nous.",
    mg: "Misy fanontaniana alohan'ny hividianana ? Manorata aminay." },
  "contact.whatsapp": { fr: "WhatsApp", mg: "WhatsApp" },
  "contact.email": { fr: "Email", mg: "Mailaka" },
  "contact.social": { fr: "Réseaux sociaux", mg: "Tambajotra sosialy" },
  "contact.name": { fr: "Nom", mg: "Anarana" },
  "contact.message": { fr: "Message", mg: "Hafatra" },
  "contact.send": { fr: "Envoyer", mg: "Alefa" },
  "contact.sent": { fr: "Message envoyé. Merci !", mg: "Lasa ny hafatra. Misaotra !" },

  "auth.title": { fr: "Espace administrateur", mg: "Faritra mpandrindra" },
  "auth.signin": { fr: "Se connecter", mg: "Hiditra" },
  "auth.signup": { fr: "Créer un compte", mg: "Hamorona kaonty" },
  "auth.password": { fr: "Mot de passe", mg: "Teny miafina" },
  "auth.toSignup": { fr: "Pas encore de compte ? Créer un compte", mg: "Mbola tsy manana kaonty ? Hamorona" },
  "auth.toSignin": { fr: "Déjà un compte ? Se connecter", mg: "Efa manana kaonty ? Hiditra" },
  "auth.checkEmail": {
    fr: "Compte créé. Vérifiez votre email pour confirmer votre adresse.",
    mg: "Voaforona ny kaonty. Jereo ny mailakao hanamarinana ny adiresinao.",
  },

  "admin.title": { fr: "Tableau de bord", mg: "Tabilao" },
  "admin.orders": { fr: "Commandes", mg: "Fanafarana" },
  "admin.clients": { fr: "Clients", mg: "Mpanjifa" },
  "admin.messages": { fr: "Messages", mg: "Hafatra" },
  "admin.formations": { fr: "Formations", mg: "Fiofanana" },
  "admin.signout": { fr: "Déconnexion", mg: "Hivoaka" },
  "admin.client": { fr: "Client", mg: "Mpanjifa" },
  "admin.date": { fr: "Date", mg: "Daty" },
  "admin.status": { fr: "Statut", mg: "Sata" },
  "admin.actions": { fr: "Actions", mg: "Hetsika" },
  "admin.pending": { fr: "En attente", mg: "Miandry" },
  "admin.validated": { fr: "Validée", mg: "Nekena" },
  "admin.refused": { fr: "Refusée", mg: "Nolavina" },
  "admin.validate": { fr: "Valider", mg: "Ankatoavina" },
  "admin.refuse": { fr: "Refuser", mg: "Lavina" },
  "admin.delete": { fr: "Supprimer", mg: "Fafana" },
  "admin.save": { fr: "Enregistrer", mg: "Tehirizina" },
  "admin.cancel": { fr: "Annuler", mg: "Aoka" },
  "admin.edit": { fr: "Modifier", mg: "Hanova" },
  "admin.totalOrders": { fr: "Commandes totales", mg: "Fanafarana rehetra" },
  "admin.pendingOrders": { fr: "En attente", mg: "Miandry" },
  "admin.validatedOrders": { fr: "Validées", mg: "Nekena" },
  "admin.uniqueClients": { fr: "Clients uniques", mg: "Mpanjifa samihafa" },
  "admin.noOrders": { fr: "Aucune commande pour le moment.", mg: "Tsy misy fanafarana ankehitriny." },
  "admin.noMessages": { fr: "Aucun message.", mg: "Tsy misy hafatra." },
  "admin.notAdmin": {
    fr: "Votre compte n'est pas encore administrateur.",
    mg: "Mbola tsy mpandrindra ny kaontinao.",
  },
  "admin.claim": { fr: "Devenir administrateur", mg: "Ho tonga mpandrindra" },
  "admin.claimFailed": {
    fr: "Un administrateur existe déjà. Demandez-lui de vous ajouter.",
    mg: "Efa misy mpandrindra. Angataho izy hanampy anao.",
  },
  "admin.active": { fr: "Visible sur le site", mg: "Miseho eo amin'ny tranonkala" },
  "admin.saved": { fr: "Modifications enregistrées.", mg: "Voatahiry ny fanovana." },
  "admin.confirmDelete": { fr: "Confirmer la suppression ?", mg: "Hamafa tokoa ?" },
  "admin.validatedNotice": {
    fr: "Votre formation est maintenant disponible. Merci pour votre confiance.",
    mg: "Efa azo jerena ny fiofananao. Misaotra amin'ny fitokisana.",
  },

  "common.loading": { fr: "Chargement...", mg: "Eo am-pandefasana..." },
  "common.required": { fr: "Ce champ est obligatoire.", mg: "Ilaina io toerana io." },
  "common.back": { fr: "Retour", mg: "Hiverina" },
  "footer.rights": { fr: "Tous droits réservés.", mg: "Zo rehetra voatokana." },
  "footer.tagline": {
    fr: "Formations Trading pratiques, en français et en malagasy.",
    mg: "Fiofanana Trading azo ampiharina, amin'ny teny frantsay sy malagasy.",
  },
};

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "fs-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "mg") setLangState(stored);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = dict[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export function formatAmount(amount: number, currency: string) {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} ${currency}`;
}

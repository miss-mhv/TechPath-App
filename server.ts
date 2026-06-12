/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Standardize Port
const PORT = 3000;

// Lazy initialization of the Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not configured. Falling back to high-quality offline rule-based evaluations.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Structured output schema matching OrientationResult in src/types.ts
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    profileTitle: {
      type: Type.STRING,
      description: "Intitulé accrocheur du profil d'orientation conseillé."
    },
    profileSummary: {
      type: Type.STRING,
      description: "Description globale personnalisée, chaleureuse et motivante."
    },
    aptitudeScores: {
      type: Type.OBJECT,
      properties: {
        technophile: { type: Type.INTEGER, description: "Intérêt pour le codage et les technos (0-100)" },
        logique: { type: Type.INTEGER, description: "Capacité logique, algorithmic et résolution de pannes (0-100)" },
        visuel: { type: Type.INTEGER, description: "Attrait pour l'expérience utilisateur, le design UI/UX (0-100)" },
        gestion: { type: Type.INTEGER, description: "Attrait pour la gestion de projet, l'e-commerce, l'aspect humain (0-100)" }
      },
      required: ["technophile", "logique", "visuel", "gestion"]
    },
    matchingCareers: {
      type: Type.ARRAY,
      description: "Liste de 2-3 métiers idéaux avec perspectives locales et globales.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          suitability: { type: Type.STRING, description: "Calcul en % de correspondance, ex '92%'" },
          why: { type: Type.STRING },
          localPerspective: { type: Type.STRING, description: "Réalités du marché de l'emploi en Afrique francophone pour ce rôle." },
          internationalPerspective: { type: Type.STRING, description: "Opportunités à l'international (remote, freelance, outsourcers)." },
          averageSalaryLocal: { type: Type.STRING, description: "Estimation de salaire mensuel en FCFA ou équivalent local." },
          averageSalaryGlobal: { type: Type.STRING, description: "Estimation en Euros ou Dollars pour du remote" }
        },
        required: ["title", "suitability", "why", "localPerspective", "internationalPerspective", "averageSalaryLocal", "averageSalaryGlobal"]
      }
    },
    learningRoadmap: {
      type: Type.ARRAY,
      description: "Parcours guidé étape par étape en 3-4 phases.",
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING, description: "E.g. 'Phase 1: Les bases du Web'" },
          duration: { type: Type.STRING, description: "E.g. '1 à 2 mois'" },
          topics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Concepts clés à maîtriser."
          },
          freeResources: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Ressources gratuites conseillées (ex. OpenClassrooms, FreeCodeCamp, Grafikart)."
          },
          actionableProject: { type: Type.STRING, description: "Un projet concret et adapté aux réalités locales à réaliser pour son portfolio." }
        },
        required: ["phase", "duration", "topics", "freeResources", "actionableProject"]
      }
    },
    localEcosystemAdvice: {
      type: Type.STRING,
      description: "Conseils pratiques locaux : gestion de la connexion internet, accès au matériel reconditionné, espaces de coworking, centres de formation gratuits en Afrique francophone (Orange Digital Center, Simplon, GOMYCODE)."
    },
    successStory: {
      type: Type.STRING,
      description: "Une courte histoire vécue fictive mais réaliste d'un(e) Africain(e) ayant percé dans ce métier avec persévérance."
    }
  },
  required: ["profileTitle", "profileSummary", "aptitudeScores", "matchingCareers", "learningRoadmap", "localEcosystemAdvice", "successStory"]
};

// Mock fallback responses for high-quality orientation advice (if API Key is missing or quota exceeded)
function getOfflineMockResult(userType: string, extraData: any): any {
  let title = "Développeur Mobile & Solutions Hybrides";
  let summary = "Vous brillez par votre esprit entrepreneurial et votre envie de créer des applications pragmatiques. Compte tenu des spécificités techniques (réseau mobile variable, forte pénétration du Mobile Money), le développement d'applications mobiles performantes est un choix d'excellence.";
  let scores = { technophile: 85, logique: 75, visuel: 8, gestion: 10 };

  if (userType === "ELEVE") {
    title = `Filière Informatique & Technologies Web (Niveau L1 - Spécialité ${extraData?.country || "Afrique"})`;
    summary = `POTENTIEL DE CARRIÈRE : Votre profil indique un énorme potentiel de réussite et d'adaptation aux métiers du numérique. Grâce à vos intérêts pour l'informatique pratique et créative, vous disposez des meilleurs atouts pour faire une formidable carrière numérique.

PROGRAMMES ET PARCOURS ADAPTÉS : Au regard de votre profil, nous vous recommandons d'intégrer une Licence d'Informatique universitaire progressive (L1 à L3 classique, par exemple en Génie Logiciel ou MIAGE) pour asseoir vos bases théoriques et pratiques, ou de cibler des parcours d'insertion rapide en 2 ans comme un BTS Informatique/Génie Logiciel ou un DUT Informatique de Gestion.

ÉCOLES DE RÉFÉRENCE EN ${extraData?.country || "Afrique Francophone"} : 
1. L'École Supérieure Polytechnique (ESP) : Déployant d'excellents parcours de Licence L1-L3 et DUT en Génie Logiciel.
2. L'Université Virtuelle d'Afrique (comme l'UVCI ou l'UNVS) : Parfaite pour se former de manière flexible de la L1 à la L3.
3. Les instituts phares (ISI ou ESMT) : Offrant des filières BTS de 2 ans et des Licences professionnelles très recherchées localement.`;
    scores = { technophile: 82, logique: 75, visuel: 78, gestion: 65 };
  } else if (userType === "ETUDIANT") {
    const isHardwareInterested = extraData?.hardwareIotAspect && !extraData.hardwareIotAspect.includes("Surtout Logiciel");
    if (isHardwareInterested) {
      title = "Expert Réseaux, Hardware & Solutions IoT/Embarqué";
      summary = `Passionné d'électronique et d'infrastructure physique. Vos préférences pour les heures libres (${extraData.freeTimeActivities || "bricolage"}) montrent une fibre de bâtisseur hardware. Idéal pour la maintenance industrielle ou la régulation solaire en ${extraData.country || "Afrique"}.`;
      scores = { technophile: 95, logique: 85, visuel: 5, gestion: 15 };
    } else {
      title = "Architecte Cloud et Développeur Backend";
      summary = "En tant qu'étudiant déjà engagé en informatique, vous privilégiez le code robuste, l'ingénierie logicielle ou le Cloud Computing. Le backend moderne offre les meilleures garanties de stabilité locale.";
      scores = { technophile: 88, logique: 82, visuel: 7, gestion: 10 };
    }
  } else if (userType === "RECONVERSION") {
    const isTech = extraData?.isTech;
    const knowsTarget = extraData?.knowsTargetCareer;
    if (isTech) {
      if (knowsTarget) {
        title = `Expert en transition : ${extraData.targetCareer || "Ingénieur DevOps/Cloud"}`;
        summary = `Spécialiste issu d'un passif technique (${extraData.currentOccupation || "Support-IT"}). Vous disposez d'atouts logiques majeurs qui vont accélérer votre apprentissage.`;
        if (extraData.specificConcerns) {
          summary += ` Concernant vos préoccupations spécifiques ("${extraData.specificConcerns}") : Le marché local en ${extraData.country || "Afrique"} recrute activement ces passerelles. Vos acquis de support vous dispensent de 50% de la courbe de formation sur l'infrastructure physique et de surveillance.`;
        }
        scores = { technophile: 90, logique: 85, visuel: 10, gestion: 45 };
      } else {
        title = "Consultant DevOps & Sécurité Cloud";
        summary = `Grâce à vos acquis informatiques (${extraData.currentOccupation || "Général"}), vous vous travaillez idéalement sur l'administration système, le diagnostic et la sécurité distribuée.`;
        scores = { technophile: 92, logique: 88, visuel: 8, gestion: 35 };
      }
    } else {
      const fav = extraData?.nonTechFavoriteJob && extraData.nonTechFavoriteJob !== "Inconnu (Demande de suggestion)" 
        ? extraData.nonTechFavoriteJob 
        : "Spécialiste SEO, No-Code & Chargé de Produit Web";
      title = `${fav} (Filière Reconversion Active)`;
      summary = `Issu d'un parcours d'origine hors-tech (${extraData.currentOccupation || "Commerce/Comptabilité"}). Votre cible se concentre sur des métiers de coordination, No-Code et marketing digital de pointe. S'insérer rapidement en ${extraData.country || "Afrique"} est possible sans codage pur complexe en misant sur l'agilité et le business digital.`;
      scores = { technophile: 70, logique: 15, visuel: 82, gestion: 85 };
    }
  }

  return {
    profileTitle: title,
    profileSummary: summary,
    aptitudeScores: scores,
    matchingCareers: [
      {
        title: userType === "ELEVE" ? "Développeur Backend (Node.js/Python)" : "Développeur Flutter (Mobile)",
        suitability: "94%",
        why: "Vous privilégiez l'efficacité logique et les technologies modernes requises par l'écosystème numérique africain en pleine mutation fintech.",
        localPerspective: "Forte recherche à Dakar, Douala, Kinshasa et Abidjan. Les startups et banques locales recrutent activement des profils polyvalents capables d'intégrer des APIs de paiement mobile.",
        internationalPerspective: "Flutter est extrêmement prisé par les agences occidentales pour son coût de développement optimisé. Très propice au travail en remote depuis l'Afrique.",
        averageSalaryLocal: "350 000 FCFA à 850 000 FCFA/mois (débutant à intermédiaire)",
        averageSalaryGlobal: "1 500 € à 3 200 €/mois (remote / freelance international)"
      },
      {
        title: "Product Owner / Manager de Projet Numérique",
        suitability: "82%",
        why: "Vos aptitudes de synthèse et de compréhension du besoin utilisateur en font un parfait pont entre clients et développeurs.",
        localPerspective: "Les cabinets de conseil technique et les grandes agences de communication digitale locales valorisent grandement les profils organisés en méthodologies agiles.",
        internationalPerspective: "Nécessite une excellente communication orale et écrite en français, idéale pour le marché externalisé Ouest-européen.",
        averageSalaryLocal: "400 000 FCFA à 950 000 FCFA/mois",
        averageSalaryGlobal: "2 000 € à 4 000 €/mois"
      }
    ],
    learningRoadmap: [
      {
        phase: "Phase 1 : Acquisition de la pensée logique et Git",
        duration: "1 mois",
        topics: ["Logique algorithmique", "Gestion de version avec Git & GitHub", "Structures de données"],
        freeResources: ["Chaîne YouTube 'Grafikart' (Algorithmique et Git)", "FreeCodeCamp en Français (Bases)"],
        actionableProject: "Créer un portfolio en ligne hébergé gratuitement sur GitHub Pages retraçant vos motivations."
      },
      {
        phase: "Phase 2 : Maîtrise des standards du Web & APIs",
        duration: "2 mois",
        topics: ["HTML5", "CSS3 / Tailwind CSS", "JavaScript ES6+", "Consommation d'APIs REST"],
        freeResources: ["OpenClassrooms : Apprenez à créer votre site web", "MDN Web Docs"],
        actionableProject: "Développer une application d'affichage météo ou de tarification de transport de marchandises local en consommant une API."
      },
      {
        phase: "Phase 3 : Spécialisation Mobile Mobile-Money",
        duration: "2 mois",
        topics: ["Framework Flutter", "Langage Dart", "Gestion d'état (Provider)", "Intégration Flutter + Mobile Money APIs (CinetPay, Fedapay, etc.)"],
        freeResources: ["Tutoriel officiel Flutter", "Playlists YouTube spécialisées Flutter francophones"],
        actionableProject: "Bâtir un prototype d'application de tontine numérique sécurisée intégrant des simulations de dépôts/retraits."
      }
    ],
    localEcosystemAdvice: "Inscrivez-vous dès maintenant dans les espaces comme l'Orange Digital Center de votre pays, ils disposent de salles équipées, d'internet haut débit gratuit et de mentors certifiés. Pour vos soucis de bande passante, mémorisez les ressources hors-ligne avec DevDocs.io ou téléchargez les vidéos d'apprentissage en résolution basse aux heures creuses.",
    successStory: "Moussa, 23 ans, originaire de Bamako. Issu d'un parcours classique non technologique, il a suivi ce cursus de façon autodidacte dans un cybercafé puis au fablab local. Aujourd'hui, il travaille à distance pour une fintech basée à Paris tout en vivant auprès de sa famille au Mali."
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Endpoints
  
  // 1. Evaluate Grades (Élève / Nouveau Bachelier)
  app.post("/api/orientation/evaluate-grades", async (req: Request, res: Response) => {
    try {
      const { 
        country,
        customExperience,
        technologyInterest,
        logicalPuzzlesInterest
      } = req.body;
      
      const ai = getGeminiClient();
      if (!ai) {
        // Fallback to rules-based offline engine
        return res.json(getOfflineMockResult("ELEVE", req.body));
      }

      const prompt = `Voici les détails d'un élève africain francophone (lycéen ou tout nouveau bachelier) souhaitant s'orienter dans le secteur informatique :
      - Pays actuel de résidence et d'études ciblé : ${country || "Afrique Francophone"}
      - Curiosité déclarée pour la Technologie : ${technologyInterest || "high"}
      - Attrait déclaré pour la Logique/Casse-têtes : ${logicalPuzzlesInterest || "high"}
      - Profil complet de ses passions, réflexions, projet idéal et récits recueillis :
        ${customExperience || "Démarrage et premier contact avec l'informatique."}

      Analyse ces critères avec soin pour concevoir un plan d'orientation post-bac d'excellence :
      1. ÉVALUATION DU POTENTIEL : Dis explicitement et avec beaucoup de bienveillance si cet élève semble avoir du potentiel pour faire carrière plus tard dans l'informatique sur la base de ses intérêts (qu'ils soient axés code, design, robotique, e-commerce, ou création de contenu). Rédige une réponse d'encouragement solide dans le bloc de synthèse global ("profileSummary").
      2. FILIÈRES POST-BAC À L'UNIVERSITÉ : Propose une orientation avec un accent fort sur une filière informatique à l'université au niveau 1 (L1 ou première année universitaire post-bac). Indique les options de diplômes disponibles (Licence 1 à 3 générale, BTS court professionnalisant en 2 ans, DUT technologique pratique, etc.).
      3. PROPOSITIONS PRÉCISES D'ÉCOLES ET PARCOURS : Suggère précisément 2 à 3 universités ou collèges réels, célèbres et réputés de son pays (${country || "Afrique Francophone"}) proposant ce type de parcours (par ex : au Sénégal, suggère l'ESP, l'ESMT, l'ISI, l'EPITA Sénégal ou l'UCAD ; en Côte d'Ivoire, l'INP-HB, l'ESATIC ou l'UVCI ; au Cameroun, l'ENSP, l'IAI, etc.) ET spécifie pour chacune de ces écoles les parcours exacts proposés (ex: L1 à L3 classique, BTS, DUT, etc.).
      4. PRÉSENTATION DE MÉTIERS D'AVENIR : Présente 2 à 3 métiers d'avenir du numérique pertinents par rapport à ses passions (No-Code, Intelligence Artificielle locale, Cybersécurité, Graphisme UX/UI, Robotique) et explique comment la tech évolue dans la sphère internationale (secteur du remote, agilité globale).
      5. PARCOURS D'INITIATION : Détaille une feuille de route progressive et gratuite de niveau Licence 1 pour l'aider à asseoir ses bases sereinement. Calcule les scores d'aptitude de manière extrêmement réaliste et ciblée.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Tu es le Mentor d'Elite de l'Enseignement Supérieur en Afrique (nommé 'Coach Premier Post-Bac'). Tu accompagnes les lycéens et nouveaux bacheliers avec un ton grand-frère, chaleureux, ultra-pédagogique et bienveillant. Évalue explicitement leur potentiel de carrière futur avec enthousiasme. Explique de manière rassurante et exhaustive les parcours universitaires (L1 à L3, BTS, DUT) offerts par les écoles régionales. Calcule les scores d'aptitude (technophile, logique, visuel, gestion) sur 100 de façon contrastée.",
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA
        }
      });

      const text = response.text || "";
      const resultObj = JSON.parse(text.trim());
      return res.json(resultObj);

    } catch (err: any) {
      console.error("Error evaluating grades via Gemini:", err);
      // Fallback
      return res.json(getOfflineMockResult("ELEVE", req.body));
    }
  });

  // 2. Evaluate Aptitude & Preferences Quiz (Transition, Autodidact, or Pupil taking test)
  app.post("/api/orientation/evaluate-quiz", async (req: Request, res: Response) => {
    try {
      const { userType, country, answers, previousBackground } = req.body;
      // answers is an array of { questionId: string, answerValue: string }
      
      const ai = getGeminiClient();
      if (!ai) {
        return res.json(getOfflineMockResult(userType || "RECONVERSION", req.body));
      }

      const formattedAnswers = answers.map((ans: any) => `Question ID: ${ans.questionId} => Choix: ${ans.answerValue}`).join("\n");

      const prompt = `Évalue le questionnaire d'orientation informatique pour un profil : ${userType} localisé au/en ${country || "Afrique Francophone"}.
      Profil d'origine/Background: ${previousBackground || "Non précisé"}.
      
      Voici les réponses choisies par l'utilisateur aux questions d'aptitudes et d'intérêts :
      ${formattedAnswers}

      Règles de décodage des styles d'options :
      - Option A : Dominance logique, mathématique, architecture interne, administration système, backend ou science des données.
      - Option B : Dominance design visuel, ergonomie, UI/UX, développement frontend, interactivité.
      - Option C : Dominance business, gestion de projet, product ownership, e-commerce, intégration de solutions et paiement mobile (Fintech d'Afrique de l'Ouest/Centrale).
      - Option D : Dominance infrastructure, réseau, cybersécurité, systèmes distribués, Cloud et DevOps.

      Conçois un rapport d'orientation exceptionnel pour lui. Ce rapport doit être hyper-contextualisé pour le pays indiqué (${country || "Afrique Francophone"}), en combinant le marché d'emploi local (les startups du pays, les banques régionales, les agences de communication) et le marché de l'externalisation (remote, freelancing pour des clients francophones européens ou canadiens). Propose un parcours d'apprentissage réaliste et gratuit.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Tu es le Conseiller d'Orientation Virtuel en Informatique en Afrique. Tu parles français chaleureusement, t'adaptes aux réalités de connectivité locale, et donnes des parcours d'apprentissage rigoureux et gratuits. Attention : sois réaliste et sévère sur les scores d'aptitudes (technophile, logique, visuel, gestion) sur 100. Si l'utilisateur n'indique aucune attirance pour un style, n'hésite pas à baisser son score dans cette catégorie jusqu'à 5% ou 10% afin d'obtenir un profil hautement discriminant.",
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA
        }
      });

      const text = response.text || "";
      const resultObj = JSON.parse(text.trim());
      return res.json(resultObj);

    } catch (err: any) {
      console.error("Error evaluating quiz via Gemini:", err);
      return res.json(getOfflineMockResult(req.body.userType || "RECONVERSION", req.body));
    }
  });

  // 2.5 Evaluate Career Reconversion (Professionnels en reconversion)
  app.post("/api/orientation/evaluate-reconversion", async (req: Request, res: Response) => {
    try {
      const {
        isTech,
        knowsTargetCareer,
        targetCareer,
        reconversionObjective,
        currentOccupation,
        knownTechLanguages,
        preferredActivities,
        chosenInterests,
        hardwareIotAspect,
        freeTimeActivities,
        country,
        continentFocus,
        specificConcerns,
        nonTechHasFavorite,
        nonTechFavoriteJob
      } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.json(getOfflineMockResult("RECONVERSION", req.body));
      }

      const prompt = `Voici les détails d'un professionnel en reconversion vers les métiers du numérique d'avenir :
      - Pays actuel de résidence : ${country || "Afrique Francophone"}
      - Statut initial : ${isTech ? "Déjà un profil technique / informatique" : "Profil d'origine non-technique (pas d'expérience en code)"}
      - Métier ou domaine de départ : ${currentOccupation || "Non précisé"}
      - Focus de marché visé : ${continentFocus === "local" ? "Entreprises et startups du marché local uniquement" : continentFocus === "international" ? "Opportunités de télétravail international (remote / freelance)" : "Les deux aspects (marché d'emploi Local et International)"}
      
      ${isTech ? `
      - Connaît déjà sa profession cible : ${knowsTargetCareer ? "Oui" : "Non"}
      ${knowsTargetCareer ? `
        - Métier numérique ciblé : ${targetCareer}
        ${specificConcerns ? `- Ses préoccupations doutes ou interrogations spécifiques : "${specificConcerns}"` : ""}
      ` : `
        - Langages informatiques abordés (et aisance sur 5) : ${knownTechLanguages ? knownTechLanguages.join(", ") : "aucun"}
        - Activités ou projets préférés jusqu'ici : "${preferredActivities}"
        - Domaines d'intérêts sélectionnés : ${chosenInterests ? chosenInterests.join(", ") : "aucun"}
        - Affinité avec le matériel/IoT : ${hardwareIotAspect}
        - Hobbys et loisirs tech free-time : ${freeTimeActivities}
      `}
      ` : `
      - A déjà un métier coup de cœur en tête : ${nonTechHasFavorite ? "Oui" : "Non"}
      - Métier d'intérêt choisi : ${nonTechFavoriteJob}
      - Activités / dynamiques stimulantes choisies : ${chosenInterests ? chosenInterests.join(", ") : "aucun"}
      - Attrait pour la réparation physique, le hardware ou l'IoT : ${hardwareIotAspect}
      - Loisirs / Hobbys durant son temps libre : ${freeTimeActivities}
      `}

      Analyse méticuleusement ces indices pour concevoir une recommandation d'orientation de reconversion d'critique.
      RECOMMANDATION DE L'UTILISATEUR (Faire preuve d'esprit critique) :
      - Évalue avec réalisme si le projet de reconversion est viable ou s'il y a des transitions intermédiaires plus habiles.
      - Si l'utilisateur est déjà dans la tech et connaît sa cible, utilise l'attribut "profileSummary" pour dissiper directement ses doutes ou répondre de manière ultra-détaillée et rassurante à ses préoccupations spécifiques ("${specificConcerns || ""}").
      - Ne crains pas d'introduire des scores d'aptitude contrastés : si un profil est non-technique et s'épanouit dans l'ergonomie, attribue un score de 5% à 15% sur la logique algorithmique brute pour des recommandations hyper ciblées. Les scores ne doivent pas dépasser 45% s'il n'y a pas de fibre logique solide.
      - Propose une feuille de route gratuite d'apprentissage d'excellence pour combler le fossé de compétences.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Tu es le Conseiller d'Orientation d'Élite pour la reconversion vers les métiers du numérique en Afrique Francophone (nommé 'Coach Reconversion'). Tu parles avec clarté, rigueur et bienveillance, en t'adaptant aux contraintes locales (coût internet, équipement reconditionné). Tu as l'interdiction de donner des notes moyennes partout. Si l'un des volets (logique ou design) est inexistant dans les données utilisateur, mets-lui une de note de 5% ou 10% pour forcer un rapport contrasté et authentique (sévère d'aptitude, n'aie pas peur d'attribuer un score de 5% à un domaine où il ne semble pas doué ou à l'aise).",
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA
        }
      });

      const text = response.text || "";
      const resultObj = JSON.parse(text.trim());
      return res.json(resultObj);

    } catch (err: any) {
      console.error("Error evaluating reconversion via Gemini:", err);
      return res.json(getOfflineMockResult("RECONVERSION", req.body));
    }
  });

  // 3. Evaluate IT Specialization (Student already in computer science)
  app.post("/api/orientation/evaluate-student-specialization", async (req: Request, res: Response) => {
    try {
      const { level, knownLanguages, favorites, preferredCareers, continentFocus, country, hardwareIotAspect, freeTimeActivities } = req.body;
      
      const ai = getGeminiClient();
      if (!ai) {
        return res.json(getOfflineMockResult("ETUDIANT", req.body));
      }

      const prompt = `Voici les détails d'un étudiant déjà inscrit dans un parcours informatique :
      - Pays: ${country || "Afrique Francophone"}
      - Niveau d'étude actuel: ${level}
      - Langages / technologies déjà appris: ${knownLanguages ? knownLanguages.join(", ") : "aucun"}
      - Matières préférées: ${favorites || "non spécifié"}
      - Domaines qui l'attirent en priorité: ${preferredCareers ? preferredCareers.join(", ") : "non spécifié"}
      - Intérêt pour le matériel (hardware), la maintenance physique et l'IoT : ${hardwareIotAspect || "non spécifié"}
      - Activités favorites durant ses heures libres (indice clef d'orientation) : ${freeTimeActivities || "non spécifiées"}
      - Objectif professionnel principal: ${continentFocus === "local" ? "Travailler localement en entreprise" : continentFocus === "international" ? "Décrocher un emploi à l'international (remote ou expatriation)" : "Les deux aspects (Local et International)"}

      Formule une recommandation stratégique de spécialisation de haut niveau. Elle doit considérer à la fois les réalités de son pays (${country}), ses loisirs durant son temps libre, son intérêt pour le hardware/IoT, et l'évolution globale du secteur (Intelligence Artificielle, Cloud hybride, cybersécurité, IoT, maintenance pratique, No-Code productivité). Fournis un parcours d'approfondissement avancé gratuit et très structuré.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Tu es un conseiller académique d'élite pour les facultés d'informatique d'Afrique francophone. Tu guides l'étudiant vers une spécialisation rentable et durable localement et à l'international. CRITIQUE : tu dois durcir rigoureusement l'attribution des scores d'aptitude (technophile, logique, visuel, gestion) sur 100. Ne crains pas de mettre des scores de 5% à 15% sur les critères où l'étudiant n'a aucune fibre (ex. 5% de 'visuel' si l'étudiant adore le hardware/système sans design, ou 5% de 'logique' s'il s'oriente vers la gestion de projet pur). Il faut que le profil final soit extrêmement discriminant et réaliste, pas d'accumulation de scores intermédiaires élevés !",
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA
        }
      });

      const text = response.text || "";
      const resultObj = JSON.parse(text.trim());
      return res.json(resultObj);

    } catch (err: any) {
      console.error("Error evaluating student specialization via Gemini:", err);
      return res.json(getOfflineMockResult("ETUDIANT", req.body));
    }
  });

  // 4. Interactive Chatbot Advisor (Conseiller Virtuel IA)
  app.post("/api/orientation/chat", async (req: Request, res: Response) => {
    try {
      const { messages, userProfile } = req.body;
      // messages is an array of { role: 'user'|'model', text: string }
      
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          text: "Bonjour ! Je suis ravi d'échanger avec vous. (Mode hors-ligne : veuillez configurer votre clé API Gemini sous Secrets pour un échange interactif ultra-personnalisé). Que souhaitez-vous savoir sur les études d'informatique, les salaires en informatique en Afrique, ou les opportunités à l'international ?”"
        });
      }

      const conversationHistory = messages.map((m: any) => {
        return {
          role: m.role || "user",
          parts: [{ text: m.text }]
        };
      });

      // Insert system instructions and context
      const systemInstruction = `Tu es le grand Conseiller Virtuel d'Élite en Informatique pour l'Afrique Francophone (nommé 'TechPath coach'). Ton but est d'accompagner l'utilisateur par des questions éclairantes, chaleureuses et des réponses bienveillantes.
      Profil actuel de l'utilisateur : ${JSON.stringify(userProfile || {})}

      CONSIGNE DE FORMAT DE TEXTE CRITIQUE : N'utilise JAMAIS d'astérisques (*) ou de doubles astérisques (**) dans tes réponses pour faire des mises en gras ou en italique. Remplis tes réponses par du texte brut propre doté de listes à puces avec des tirets standards (-) si nécessaire.

      CONSIGNE CRITIQUE : Tu dois STRICTEMENT rester dans le cadre pédagogique (comment apprendre, quoi réviser), d'orientation académique (Licence L1-L3, BTS, DUT, classes préparatoires, choix d'école) et d'orientation professionnelle (débouchés, carrières, salaires, réalités locales de la tech, remote) dans le domaine de la tech.
      Si l'utilisateur pose une question totalement hors-sujet (ex: cuisine, sport, divertissement, politique, ou te demande de coder un projet n'ayant aucun lien avec l'apprentissage d'un concept), refuse poliment de répondre en lui expliquant ton rôle de Mentor d'orientation académique et professionnelle, puis ramène-le chaleureusement vers son avenir dans la tech.

      Sois synthétique (maximum 200 mots par message), professionnel, pragmatique (parle de persévérance, d'internet gratuit, des Orange Digital Centers, matériel d'occasion ou cybercafés) et extrêmement motivant. Réponds en français.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: conversationHistory,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8
        }
      });

      return res.json({ text: response.text || "Pardon, je n'ai pas pu formuler de réponse. Pouvez-vous reformuler ?" });

    } catch (err: any) {
      console.error("Error in AI Chat:", err);
      return res.status(500).json({ error: "Une erreur est survenue lors de l'appel au conseiller virtuel." });
    }
  });

  // Serve static assets in production OR mount Vite dev server in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

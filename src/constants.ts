/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  id: string;
  text: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
    subtext: string;
  }[];
}

export const AFRICAN_COUNTRIES = [
  "Bénin",
  "Burkina Faso",
  "Cameroun",
  "Congo (Kinshasa)",
  "Congo (Brazzaville)",
  "Côte d'Ivoire",
  "Gabon",
  "Guinée",
  "Madagascar",
  "Mali",
  "Niger",
  "République Centrafricaine",
  "Sénégal",
  "Tchad",
  "Togo"
];

export const IT_STUDENT_LEVELS = [
  "Licence 1 (L1) / Première Année",
  "Licence 2 (L2) / Deuxième Année",
  "Licence 3 (L3) / Troisième Année",
  "BTS / DUT / Parcours Court",
  "Master 1",
  "Master 2 / Diplôme d'Ingénieur"
];

export const PROGRAMMING_LANGUAGES = [
  "Python",
  "JavaScript / TypeScript",
  "HTML & CSS (Bases)",
  "C / C++",
  "Java",
  "PHP",
  "Dart (Flutter)",
  "SQL (Bases de données)",
  "Kotlin / Swift (Mobile)",
  "Aucun pour le moment"
];

export const CAREER_DOMAINS = [
  { id: "Web", name: "Développement Web (Frontend/Backend)" },
  { id: "Mobile", name: "Développement d'Applications Mobiles" },
  { id: "Data", name: "Analyse de Données et Intelligence Artificielle (AI)" },
  { id: "Security", name: "Cybersécurité et Réseaux Informatiques" },
  { id: "Systems", name: "Administration Système, Cloud & DevOps" },
  { id: "HardwareIoT", name: "Maintenance, Matériel (Hardware) & IoT" },
  { id: "Mgmt", name: "Gestion de Projet Tech (Product Owner, Agile)" },
  { id: "NoCode", name: "Création No-Code / Tech-Entrepreneuriat" }
];

export const APTITUDE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    text: "Face à un problème informatique complexe ou une panne, quelle est ta première réaction ?",
    options: [
      {
        key: 'A',
        text: "J'analyse le problème méthodiquement.",
        subtext: "Je cherche les causes fondamentales, j'aime décomposer les choses de manière purement logique et algorithmique."
      },
      {
        key: 'B',
        text: "Je m'intéresse au rendu visuel et à la fluidité.",
        subtext: "Je me pose la question : comment rendre l'expérience lisible, moderne et esthétique pour l'utilisateur final ?"
      },
      {
        key: 'C',
        text: "Je pense d'abord à l'impact concret et humain.",
        subtext: "Qui va l'utiliser ? Est-ce que cela règle un problème de l'économie locale ou facilite la vie de ma communauté ?"
      },
      {
        key: 'D',
        text: "Je veux examiner l'arrière-plan ou 'sous le capot'.",
        subtext: "Où se fait l'hébergement ? Comment sécuriser les données et s'assurer que le réseau résiste aux coupures ?"
      }
    ]
  },
  {
    id: "q2",
    text: "Si tu devais concevoir et lancer un projet de tes propres mains ce week-end, ce serait quoi ?",
    options: [
      {
        key: 'A',
        text: "Un algorithme intelligent.",
        subtext: "Par exemple, un outil de recommandation automatique des meilleurs prix de transport ou une intelligence artificielle locale."
      },
      {
        key: 'B',
        text: "Un site web ou un portfolio sublime.",
        subtext: "Une vitrine en ligne magnifique, contenant de belles animations interactives, des polices soignées et un style moderne."
      },
      {
        key: 'C',
        text: "Un service d'annonces locales ou d'e-commerce.",
        subtext: "Un prototype qui connecte les coopératives agricoles aux acheteurs des villes, intégrant le paiement par Mobile Money."
      },
      {
        key: 'D',
        text: "Un système de protection ou d'automatisation.",
        subtext: "Un serveur de fichiers privé et verrouillé, un système de de sauvegarde automatique ou un pare-feu réseau."
      }
    ]
  },
  {
    id: "q3",
    text: "Pendant ton temps libre sur ton ordinateur ou ton smartphone, qu'est-ce qui t'attire instinctivement ?",
    options: [
      {
        key: 'A',
        text: "Résoudre des énigmes, écrire de petits scripts ou coder.",
        subtext: "Apprendre comment fonctionnent les structures logiques internes des logiciels."
      },
      {
        key: 'B',
        text: "Naviguer sur des sites au design impressionnant.",
        subtext: "Découvrir de nouvelles interfaces, de la modélisation 3D ou organiser les visuels de mes projets."
      },
      {
        key: 'C',
        text: "Suivre des actualités de startups d'Afrique et du monde.",
        subtext: "Comprendre les modèles financiers, l'entrepreneuriat et les stratégies marketing du digital."
      },
      {
        key: 'D',
        text: "Explorer les réglages profonds de mes appareils.",
        subtext: "Bidouiller des configurations réseau, installer des distributions Linux de test ou tester la sécurité du Wi-Fi."
      }
    ]
  },
  {
    id: "q4",
    text: "Que fais-tu lorsque ton code (ou ton travail) présente une erreur difficile et persistante depuis des heures ?",
    options: [
      {
        key: 'A',
        text: "Je fouille la documentation technique.",
        subtext: "Je teste chaque instruction pas à pas sur ma machine locale. J'adore relever ce type de défi d'ingénierie."
      },
      {
        key: 'B',
        text: "Je prends du recul sur l'ergonomie générale.",
        subtext: "Je regarde si je ne peux pas simplifier l'interaction visuelle ou utiliser de meilleurs modules de base."
      },
      {
        key: 'C',
        text: "Je cherche des solutions collaboratives.",
        subtext: "J'en parle avec la communauté en ligne ou mes paires pour trouver un moyen pragmatique de contourner le point bloquant."
      },
      {
        key: 'D',
        text: "J'inspecte l'outil de diagnostic en détail.",
        subtext: "Je vérifie les connexions au serveur, l'état de la mémoire système et les permissions de sécurité de la machine."
      }
    ]
  },
  {
    id: "q5",
    text: "Quelle matière scolaire ou d'apprentissage vous a le plus passionné(e) par le passé ?",
    options: [
      {
        key: 'A',
        text: "Les sciences exactes.",
        subtext: "Mathématiques, logique pure, algorithmique de base, physique théorique."
      },
      {
        key: 'B',
        text: "L'art, la création ou l'expression.",
        subtext: "Dessin, infographie, philosophie, communication médiatique, rédaction littéraire."
      },
      {
        key: 'C',
        text: "L'économie ou la géographie humaine.",
        subtext: "Fonctionnement du commerce, entrepreneuriat, marketing, gestion organisationnelle."
      },
      {
        key: 'D',
        text: "La physique pratique ou la maintenance.",
        subtext: "Technologie appliquée, électricité, maintenance électronique, réseaux de communication."
      }
    ]
  },
  {
    id: "q6",
    text: "Quelle contrainte d'infrastructure en Afrique aimerais-tu le plus résoudre ou optimiser par ton travail ?",
    options: [
      {
        key: 'A',
        text: "La vitesse des flux de données et la lourdeur des scripts.",
        subtext: "Développer des architectures d'applications légères qui tournent vite même avec un processeur basique."
      },
      {
        key: 'B',
        text: "La consommation exorbitante de forfait internet par les sites lourds.",
        subtext: "Designer des pages Web d'une sobriété magnifique, fluides sur les téléphones de seconde main."
      },
      {
        key: 'C',
        text: "L'accessibilité pour les populations non-connectées à internet.",
        subtext: "Bâtir des passerelles par SMS, interfaces USSD ou solutions de paiement faciles sans carte bancaire."
      },
      {
        key: 'D',
        text: "L'instabilité énergétique et les pannes de serveurs physiques.",
        subtext: "Concevoir des configurations robustes qui redémarrent seules ou exploitent le stockage cloud de secours."
      }
    ]
  },
  {
    id: "q7",
    text: "À la fin d'une longue journée de travail sur ordinateur, quand t'estimes-tu fier(e) de toi ?",
    options: [
      {
        key: 'A',
        text: "Quand mon algorithme complexe s'exécute en quelques millisecondes.",
        subtext: "Le sentiment d'avoir écrit un code d'une propreté absolue et parfaitement optimisé."
      },
      {
        key: 'B',
        text: "Quand l'interface est superbe, moderne et agréable au toucher.",
        subtext: "Savoir que l'utilisateur aura un sentiment de simplicité visuelle totale en naviguant dessus."
      },
      {
        key: 'C',
        text: "Quand une transaction d'achat-vente a pu se faire avec succès.",
        subtext: "Avoir créé un pont d'e-commerce ou de service utile qui a facilité des revenus réels pour un commerçant local."
      },
      {
        key: 'D',
        text: "Quand mon serveur et mes règles d'accès sont devenus invulnérables.",
        subtext: "La fierté de savoir que le système informatique de l'organisation est sécurisé contre les attaques externes."
      }
    ]
  }
];

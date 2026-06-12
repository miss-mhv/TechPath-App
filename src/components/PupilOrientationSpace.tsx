/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import GehmitLogo from './GehmitLogo';
import { 
  GraduationCap, 
  MapPin, 
  ChevronRight, 
  Briefcase, 
  Sparkles, 
  Send, 
  User, 
  Loader2, 
  BookOpen, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  Clock,
  Terminal,
  Cpu,
  BookmarkCheck,
  Award
} from 'lucide-react';

interface PupilOrientationSpaceProps {
  onBack: () => void;
}

// Full database of flagship schools & corresponding academic cycles with direct professional outcomes
const COUNTRIES_DATA: Record<string, {
  capital: string;
  flag: string;
  description: string;
  schools: {
    id: string;
    name: string;
    fullName: string;
    logoShort: string;
    type: "Publique" | "Privée" | "Internationale";
    location: string;
    description: string;
    website: string;
    courses: {
      cycleName: string; // e.g. "Licence Génie Logiciel"
      type: "Licence (L1 à L3)" | "BTS" | "DUT / DTS" | "Cycle Ingénieur";
      duration: string;
      requirements: string;
      debouches: string[];
      description: string;
    }[];
  }[];
}> = {
  "Sénégal": {
    capital: "Dakar",
    flag: "🇸🇳",
    description: "Hub numérique majeur d'Afrique de l'Ouest, doté d'universités historiques et d'écoles polytechniques réputées pour leurs parcours axés sur l'innovation.",
    schools: [
      {
        id: "sen-esp",
        name: "ESP Dakar",
        fullName: "École Supérieure Polytechnique (UCAD)",
        logoShort: "ESP",
        type: "Publique",
        location: "Dakar Fann",
        description: "L'institution de référence en ingénierie et technologies du Sénégal, rattachée à l'Université Cheikh Anta Diop.",
        website: "esp.sn",
        courses: [
          {
            cycleName: "DUT Informatique (Diplôme Universitaire de Technologie)",
            type: "DUT / DTS",
            duration: "2 ans (4 semestres)",
            requirements: "Bac S, T ou L avec excellent dossier",
            debouches: [
              "Développeur Web & Mobile Junior",
              "Technicien de maintenance informatique",
              "Gestionnaire de systèmes et réseaux locaux",
              "Technicien d'exploitation de données"
            ],
            description: "Un enseignement intensif à vocation pratique alliant algorithmique, réseaux d'entreprise, bases de données et développement d'applications web/mobiles."
          },
          {
            cycleName: "Licence de Technologie en Génie Logiciel",
            type: "Licence (L1 à L3)",
            duration: "3 ans (ou L3 après DUT/BTS)",
            requirements: "Bac scientifique ou admis après le DUT d'informatique",
            debouches: [
              "Concepteur & Développeur Full-Stack",
              "Analyste d'applications d'entreprise",
              "Intégrateur de solutions Cloud",
              "Consultant d'études techniques"
            ],
            description: "Spécialisation poussée sur la conception architecturale, le développement distribué (Java, Python, C#) et l'intégration de bases de données relationnelles."
          },
          {
            cycleName: "Cycle Ingénieur d'État en Informatique (DIC)",
            type: "Cycle Ingénieur",
            duration: "3 ans après les classes prépas ou Bac+2",
            requirements: "Concours national d'entrée ou réussite majeure L2/DUT",
            debouches: [
              "Architecte Logiciel principal",
              "Ingénieur en Intelligence Artificielle & Data Science",
              "Responsable Cybersécurité de Systèmes d'Information",
              "Directeur de projet technique / DevOps"
            ],
            description: "Le parcours le plus prestigieux formant les futurs cadres techniques, concepteurs d'infrastructures d'IA de pointe et managers de la transition numérique internationale."
          }
        ]
      },
      {
        id: "sen-esmt",
        name: "ESMT",
        fullName: "École Supérieure Multinationale des Télécommunications",
        logoShort: "ESMT",
        type: "Internationale",
        location: "Dakar",
        description: "Créée par plusieurs États d'Afrique, institution d'excellence spécialisée dans les Télécoms et l'économie numérique.",
        website: "esmt.sn",
        courses: [
          {
            cycleName: "Licence Professionnelle en Télécommunications et Informatique (L1-L3)",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac scientifique, technique ou général",
            debouches: [
              "Administrateur systèmes et réseaux télécoms",
              "Technicien support clients de télécommunication",
              "Conseiller technique en réseaux locaux de données"
            ],
            description: "Une formation polyvalente permettant de maîtriser à la fois l'installation physique des réseaux de communication et le développement de logiciels réseau."
          },
          {
            cycleName: "DUT en Réseaux et Télécommunications",
            type: "DUT / DTS",
            duration: "2 ans",
            requirements: "Bac S ou technique",
            debouches: [
              "Technicien Réseau et Sécurité",
              "Installateur d'équipements de communication bilingue",
              "Superviseur d'infrastructures de données virtuelles"
            ],
            description: "Idéal pour les élèves attirés par la manipulation pratique d'équipements et l'administration réseau."
          }
        ]
      },
      {
        id: "sen-isi",
        name: "ISI",
        fullName: "Institut Supérieur d'Informatique",
        logoShort: "ISI",
        type: "Privée",
        location: "Dakar & campus régionaux",
        description: "L'un des pionniers de la formation numérique privée accréditée CAMES au Sénégal avec une approche professionnalisante.",
        website: "groupeisi.com",
        courses: [
          {
            cycleName: "BTS Informatique de Gestion (Brevet de Technicien Supérieur)",
            type: "BTS",
            duration: "2 ans",
            requirements: "Tous Bacs (Scientifique, Littéraire, Gestion)",
            debouches: [
              "Développeur d'applications de gestion d'entreprise",
              "Intégrateur d'outils de e-commerce basiques",
              "Assistant au responsable informatique"
            ],
            description: "Rassurant et accessible, ce parcours se focalise sur l'utilisation concrète des bases de données et du codage nécessaire aux PME locales."
          },
          {
            cycleName: "Licence Professionnelle en Génie Logiciel (L1 à L3)",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bacheliers de toutes filières motivés",
            debouches: [
              "Développeur Web & Mobile Full-Stack",
              "Analyste d'applications web",
              "Intégrateur No-Code d'entreprise"
            ],
            description: "Une formation qui démarre de zéro pour enseigner pas à pas la création de sites internet, le design d'applications et les bases des systèmes de données."
          }
        ]
      },
      {
        id: "sen-ugb",
        name: "UGB Saint-Louis",
        fullName: "Université Gaston Berger - UFR des Sciences Appliquées et Technologie",
        logoShort: "UGB",
        type: "Publique",
        location: "Saint-Louis",
        description: "Deuxième pôle universitaire du Sénégal, réputé internationalement pour la rigueur sélective de ses enseignements en mathématiques appliquées et informatique.",
        website: "ugb.sn",
        courses: [
          {
            cycleName: "Licence en Informatique Fondamentale et Appliquée",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac S1, S2, T ou niveau d'excellence en calculs",
            debouches: [
              "Développeur d'applications scientifiques",
              "Analyste de bases de données distribuées",
              "Concepteur d'algorithmes et de systèmes embarqués",
              "Consultant BI junior"
            ],
            description: "Cursus haut de gamme abordant en profondeur l'algorithmique avancée, le génie logiciel moderne, l'administration système Unix, ainsi que l'initiation aux théories de l'IA."
          }
        ]
      },
      {
        id: "sen-supinfo",
        name: "Sup'Info Dakar",
        fullName: "Institut Supérieur d'Informatique & Gestion - SUP'INFO",
        logoShort: "SUP",
        type: "Privée",
        location: "Dakar",
        description: "Grande école privée renommée d'Afrique Francophone, proposant des filières pragmatiques certifiées par de grands acteurs (Cisco, Oracle, Microsoft).",
        website: "supinfo.sn",
        courses: [
          {
            cycleName: "BTS Administration Réseaux & Systèmes d'Information",
            type: "BTS",
            duration: "2 ans",
            requirements: "Tous Bacs (Scientifique ou Littéraire)",
            debouches: [
              "Technicien Supérieur de Support Utilisateur",
              "Administrateur systèmes junior",
              "Intégrateur de parc informatique d'entreprise"
            ],
            description: "Un cursus très axé sur le câblage pratique, la configuration de routeurs Cisco, les bases de Linux et la maintenance d'immeubles de bureaux."
          }
        ]
      }
    ]
  },
  "Côte d'Ivoire": {
    capital: "Abidjan / Yamoussoukro",
    flag: "🇨🇮",
    description: "Une économie numérique florissante incarnée par d'immenses infrastructures technologiques et des cursus rigoureux au service de la transformation digitale ouest-africaine.",
    schools: [
      {
        id: "civ-inphb",
        name: "INP-HB Yamoussoukro",
        fullName: "Institut National Polytechnique Félix Houphouët-Boigny",
        logoShort: "INP",
        type: "Publique",
        location: "Yamoussoukro",
        description: "L'un des fleurons académiques africains d'ingénieurs et techniciens supérieurs de haut calibre.",
        website: "inphb.ci",
        courses: [
          {
            cycleName: "DUT Informatique (ESCAE / ESTP)",
            type: "DUT / DTS",
            duration: "2 ans",
            requirements: "Bac S, E ou technique de l'année",
            debouches: [
              "Analyste Programmeur",
              "Technicien Supérieur en réseaux locaux",
              "Chargé de support technique informatique",
              "Développeur d'applications Web"
            ],
            description: "Formation d'élite très rythmée préparant l'élève à s'insérer immédiatement en entreprise ou à poursuivre en cycle ingénieur."
          },
          {
            cycleName: "Diplôme d'Ingénieur des TIC",
            type: "Cycle Ingénieur",
            duration: "3 ans après les classes prépas",
            requirements: "Concours scientifique rigoureux",
            debouches: [
              "Chef de projet informatique",
              "Ingénieur sécurité et cybersécurité",
              "Concepteur d'architectures d'IA",
              "Consultant Big Data en cabinet international"
            ],
            description: "Un parcours approfondi en architecture logicielle, télécoms avancées et IA, pour diriger des projets informatiques structurants complexes."
          }
        ]
      },
      {
        id: "civ-esatic",
        name: "ESATIC Abidjan",
        fullName: "École Supérieure Africaine des Technologies de l'Information et de la Communication",
        logoShort: "ESA",
        type: "Publique",
        location: "Abidjan Treichville",
        description: "Établissement étatique d'enseignement supérieur d'excellence dédié exclusivement aux métiers de l'économie numérique.",
        website: "esatic.ci",
        courses: [
          {
            cycleName: "Licence Professionnelle en Systèmes d'Information (L1 à L3)",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac scientifique ou technique",
            debouches: [
              "Développeur logiciel / Web",
              "Administrateur de bases de données",
              "Analyste d'applications informatiques"
            ],
            description: "Idéal pour s'initier aux systèmes d'exploitation, à la programmation d'application et à la conception de bases de données dès la première année universitaire."
          },
          {
            cycleName: "Licence en Sécurité de l'Information et des Réseaux",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac C, D, E ou S",
            debouches: [
              "Analyste en Cybersécurité Junior",
              "Technicien Réseau et Pare-feu",
              "Auditeur systèmes d'information junior"
            ],
            description: "Parcours centré sur la protection des données, le chiffrement, les vulnérabilités réseaux et les méthodes de cyber-défense d'entreprise."
          }
        ]
      },
      {
        id: "civ-uvci",
        name: "UVCI",
        fullName: "Université Virtuelle de Côte d'Ivoire",
        logoShort: "UVC",
        type: "Publique",
        location: "En ligne / Abidjan (Cocody)",
        description: "Pionnière de l'enseignement à distance de masse en Côte d'Ivoire, parfaite pour démarrer à son rythme avec peu d'infrastructures physiques.",
        website: "uvci.ci",
        courses: [
          {
            cycleName: "Licence en Développement d'Applications et Services (L1 à L3)",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Tous Bacs",
            debouches: [
              "Intégrateur Web multi-écrans",
              "Créateur d'applications mobiles d'économie collaborative",
              "Freelancer autonome en technologie Web",
              "Webmaster et intégrateur CMS"
            ],
            description: "Un parcours 100% en ligne accompagné de tuteurs, enseignant le développement web moderne, l'e-commerce et le design des interfaces."
          },
          {
            cycleName: "Licence en Réseau, Sécurité et Cloud Computing",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac scientifique ou équivalent",
            debouches: [
              "Déployeur d'infrastructures Cloud",
              "Technicien de support réseau",
              "Opérateur de serveurs d'hébergement web"
            ],
            description: "Axée sur la virtualisation de serveurs informatiques et la sécurisation élémentaire d'architectures d'accès à distance."
          }
        ]
      },
      {
        id: "civ-ufhb",
        name: "UFHB Abidjan",
        fullName: "Université Félix Houphouët-Boigny - UFR d'Informatique et Mathématiques",
        logoShort: "UFB",
        type: "Publique",
        location: "Abidjan Cocody",
        description: "L'université historique publique principale de Côte d'Ivoire, réputée pour ses parcours de mathématiques-informatique et son pôle d'excellence d'insertion MIAGE.",
        website: "univ-fhb.edu.ci",
        courses: [
          {
            cycleName: "Licence Professionnelle en Méthodes Informatiques Appliquées à la Gestion (MIAGE)",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac C, D, E, S ou dossier analysé très rigoureusement",
            debouches: [
              "Analyste d'applications de gestion d'entreprise / ERP",
              "Développeur d'applications de données d'affaires (Java, SQL, Oracle)",
              "Technicien d'assistance fonctionnelle",
              "Auditeur junior des Systèmes d'Information"
            ],
            description: "Une formation bivalente combinant informatique technologique de haut niveau, base de données complexes et gestion/finance d'entreprise solide."
          }
        ]
      },
      {
        id: "civ-iit",
        name: "IIT Abidjan",
        fullName: "Institut Ivoirien de Technologie",
        logoShort: "IIT",
        type: "Privée",
        location: "Abidjan (Cocody / Grand-Bassam)",
        description: "Une institution privée haut de gamme s'inspirant des standards des universités américaines, axée sur les compétences concrètes et l'entrepreneuriat.",
        website: "iit.ci",
        courses: [
          {
            cycleName: "Licence en Génie Logiciel & Technologies Web",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Tous Bacs (Scientifique de préférence) avec forte motivation",
            debouches: [
              "Développeur d'applications Web & Cloud (JS/Node/React/Python)",
              "Intégrateur DevOps junior",
              "Créateur de startup numérique / Consultant technologique autonome"
            ],
            description: "Apprentissage des approches agiles, de l'infogérance des clouds publics (AWS, Azure), de l'automatisation de test et du JavaScript full-stack."
          }
        ]
      }
    ]
  },
  "Cameroun": {
    capital: "Yaoundé / Douala",
    flag: "🇨🇲",
    description: "Une formidable vivacité technologique incarnée par la 'Silicon Mountain' et des cursus universitaires d'ingénieurs rigoureux portés sur l'autofonctionnement et l'ingéniosité.",
    schools: [
      {
        id: "cmr-enspy",
        name: "ENSPY Yaoundé",
        fullName: "École Nationale Supérieure Polytechnique de Yaoundé",
        logoShort: "Poly",
        type: "Publique",
        location: "Yaoundé Melen",
        description: "Le temple historique de la formation d'ingénieurs civils et informatiques de haute technicité au Cameroun.",
        website: "polytechnique.cm",
        courses: [
          {
            cycleName: "Cycle Ingénieur de Conception en Informatique",
            type: "Cycle Ingénieur",
            duration: "3 ans (après L2 ou Classe Préparatoire)",
            requirements: "Concours d'entrée exigeant",
            debouches: [
              "Architecte Système et Logiciel complexe",
              "Scientifique en Intelligence Artificielle (Deep Learning)",
              "Expert en sécurité cryptographique d'entreprise",
              "Directeur technique (CTO) de startup numérique"
            ],
            description: "Enseignement théorique et pratique de très haut niveau : cryptographie, robotique, mécatronique, compilation logicielle et algorithmie avancée."
          }
        ]
      },
      {
        id: "cmr-iai",
        name: "IAI-Cameroun",
        fullName: "Institut Africain d'Informatique",
        logoShort: "IAI",
        type: "Internationale",
        location: "Yaoundé",
        description: "Une antenne de l'institut inter-États d'informatique, formant d'excellents ingénieurs système et génie logiciel opérationnels.",
        website: "iaicameroun.com",
        courses: [
          {
            cycleName: "Licence Professionnelle en Génie Logiciel (L1-L3)",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac scientifique ou technique, sélection de dossier",
            debouches: [
              "Développeur logiciel / Programmeur certifié",
              "Intégrateur système",
              "Administrateur Web",
              "Spécialiste support d'application"
            ],
            description: "Un cursus progressif partant pas à pas de l'analyse logique d'algorithmes et d'algorithmique fondamentale jusqu'à la programmation orientée objet d'entreprise."
          },
          {
            cycleName: "Licence Pro en Réseaux et Systèmes d'Information",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bacheliers scientifiques",
            debouches: [
              "Gestionnaire de systèmes informatiques locaux",
              "Administrateur système linux d'entreprise",
              "Technicien de parc bureautique"
            ],
            description: "Approche rigoureuse liant câblage physique, administration d'équipements réseaux et supervision d'architectures d'accès."
          }
        ]
      },
      {
        id: "cmr-iut",
        name: "IUT de Douala",
        fullName: "Institut Universitaire de Technologie - Université de Douala",
        logoShort: "IUT",
        type: "Publique",
        location: "Douala Bassa",
        description: "L'un des plus prestigieux instituts technologiques publics du Cameroun, formant d'excellents cadres moyens et techniciens immédiatement courtisés.",
        website: "iut-douala.com",
        courses: [
          {
            cycleName: "DUT en Génie Logiciel",
            type: "DUT / DTS",
            duration: "2 ans",
            requirements: "Bac S, C, D ou TI de l'année, admission sur épreuves de concours",
            debouches: [
              "Technicien Supérieur en Développement Web/Java/Python",
              "Analyste Programmeur de gestion d'entreprise",
              "Gestionnaire d'exploitation Linux junior"
            ],
            description: "Apprentissage express et rigoureux des fondamentaux algorithmiques, de l'analyse Merise, des bases SQL et de la programmation objet."
          }
        ]
      },
      {
        id: "cmr-iuc",
        name: "IUC Douala",
        fullName: "Institut Universitaire de la Côte",
        logoShort: "IUC",
        type: "Privée",
        location: "Douala Logbessou",
        description: "Grande école privée d'excellence technologique au Cameroun, disposant de laboratoires informatiques modernes de pointe et d'une pédagogie d'insertion réputée.",
        website: "myiuc.com",
        courses: [
          {
            cycleName: "BTS Administrateur de Réseaux et de Services",
            type: "BTS",
            duration: "2 ans",
            requirements: "Tous Bacs admissibles sur examen du dossier de motivation",
            debouches: [
              "Administrateur systèmes et réseaux junior",
              "Installateur de câblage et d'équipements de routage Cisco",
              "Technicien d'assistance Cloud d'entreprise"
            ],
            description: "Enseignement 100% pratique alliant la maintenance matérielle de serveurs d'entreprise, la sécurité des commutateurs et l'administration réseau basique."
          }
        ]
      }
    ]
  },
  "Bénin": {
    capital: "Porto-Novo / Cotonou",
    flag: "🇧🇯",
    description: "Le quartier général ouest-africain de la révolution numérique des nouveaux bacheliers, marquée par d'universités spécialisées hyper-dynamiques.",
    schools: [
      {
        id: "ben-ifri",
        name: "IFRI Abomey-Calavi",
        fullName: "Institut de Formation et de Recherche en Informatique (UAC)",
        logoShort: "IFR",
        type: "Publique",
        location: "Cotonou / Campus Abomey-Calavi",
        description: "Espace universitaire d'élite pour l'apprentissage du génie logiciel, de la sécurité et des systèmes de données au Bénin.",
        website: "ifri.uac.bj",
        courses: [
          {
            cycleName: "Licence Professionnelle en Génie Logiciel (L1-L3)",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac S ou technique de l'année",
            debouches: [
              "Développeur d'applications Web et Android/iOS",
              "Expert d'analyse fonctionnelle informatique",
              "Analyste d'architectures logicielles junior"
            ],
            description: "Maîtrise de l'ensemble du cycle de vie des applications : spécification de besoins, codage, tests unitaires et intégration Cloud."
          },
          {
            cycleName: "Licence Professionnelle en Internet des Objets & Cyber-Sécurité",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac scientifique, motivé par le hardware et la sécurité",
            debouches: [
              "Technicien en objets connectés programmables",
              "Administrateur Cyber-Défense d'entreprise publique",
              "Technicien réseau et commutateurs de sécurité"
            ],
            description: "Un parcours unique alliant programmation électronique (Arduino/Raspberry Pi) et protocoles de sécurisation informatique."
          }
        ]
      },
      {
        id: "ben-unstim",
        name: "INSTI Lokossa (UNSTIM)",
        fullName: "Institut National Supérieur de Technologie Industrielle - UNSTIM Abomey",
        logoShort: "INS",
        type: "Publique",
        location: "Lokossa / Abomey",
        description: "Une des plus grandes institutions technologiques et industrielles du Bénin, reconnue pour la forte rigueur pratique de ses diplômés.",
        website: "unstim.bj",
        courses: [
          {
            cycleName: "Licence Professionnelle en Génie Logiciel",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac scientifique C, D, E ou technologique, sur classement ministériel",
            debouches: [
              "Développeur d'applications logicielles",
              "Technicien supérieur en intégration de systèmes",
              "Administrateur de bases de données relationnelles"
            ],
            description: "Une formation rigoureuse de 3 ans combinant l'algorithmique fondamentale, le codage Java/Python, l'analyse Merise/UML et le développement Web."
          }
        ]
      },
      {
        id: "ben-pigier",
        name: "PIGIER Bénin",
        fullName: "Pigier Bénin Cotonou",
        logoShort: "PIG",
        type: "Privée",
        location: "Cotonou Cadjehoun",
        description: "L'école privée historique d'élite de Cotonou, reconnue pour son insertion accélérée et son réseau d'entreprises partenaires d'envergure nationale.",
        website: "pigier-benin.com",
        courses: [
          {
            cycleName: "Licence Professionnelle en Réseaux et Génie Logiciel",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Tous Bacs sur entretien et concours d'admissibilité de motivation",
            debouches: [
              "Développeur d'applications d'entreprise (Java / C# / PHP)",
              "Administrateur systèmes et support informatique",
              "Chef de projet web junior"
            ],
            description: "Apprentissage des techniques de codage web moderne, des architectures de bases de données, doublé d'une forte formation en développement de soft skills et management de projet."
          }
        ]
      }
    ]
  },
  "Togo": {
    capital: "Lomé",
    flag: "🇹🇬",
    description: "Un renouveau technologique important avec des universités publiques modernes et des facultés professionnalisantes proposant des filières courtes de grande utilité pour le marché.",
    schools: [
      {
        id: "tg-cic",
        name: "CIC Université de Lomé",
        fullName: "Centre Informatique de Calcul (Faculté des Sciences)",
        logoShort: "CIC",
        type: "Publique",
        location: "Lomé",
        description: "L'institut de calcul historique au cœur du campus de Lomé, formant les bacheliers togolais aux métiers du web et de la data.",
        website: "univ-lome.tg",
        courses: [
          {
            cycleName: "Licence en Informatique / Génie Logiciel (L1-L3)",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac C, D, E ou F",
            debouches: [
              "Développeur Web et applications interactives",
              "Intégrateur d'applications dans les ERP d'entreprise",
              "Analyste d'exploitation de bases de données"
            ],
            description: "Parcours progressif combinant modélisation orientée objet, gestion de serveurs de bases de données (SQL) et structures algorithmiques complexes."
          }
        ]
      },
      {
        id: "tg-esgis",
        name: "ESGIS Lomé",
        fullName: "École Supérieure d'Informatique et de Gestion",
        logoShort: "ESG",
        type: "Privée",
        location: "Lomé",
        description: "Établissement privé réputé pour son insertion accélérée grâce à ses parcours courts en BTS et ses licences professionnelles.",
        website: "esgis.org",
        courses: [
          {
            cycleName: "BTS Administrateur Réseaux et Télécoms",
            type: "BTS",
            duration: "2 ans",
            requirements: "Tous Bacs",
            debouches: [
              "Technicien support réseaux",
              "Installateur d'équipements informatiques d'accès",
              "Administrateur de serveurs physiques"
            ],
            description: "Une formation de terrain de 2 ans pour apprendre le câblage, la mise en réseau d'ordinateurs, la maintenance matérielle et logicielle."
          },
          {
            cycleName: "Licence Pro en Management & Informatique de Gestion (MIAGE)",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac scientifique, de gestion ou technologique",
            debouches: [
              "Analyste fonctionnel de système d'information",
              "Assistant Chef de Projet Informatique",
              "Gestionnaire d'infrastructures de données d'affaires"
            ],
            description: "Ce parcours est à mi-chemin entre le management de projet, la programmation de base (Excel avancé, VBA, SQL) et l'animation des équipes."
          }
        ]
      },
      {
        id: "tg-uk",
        name: "Université de Kara",
        fullName: "Université de Kara - Faculté des Sciences et Techniques",
        logoShort: "UNK",
        type: "Publique",
        location: "Kara",
        description: "Deuxième pôle académique public clé du Togo, offrant d'excellents cursus structurants en sciences et génie informatique.",
        website: "univ-kara.tg",
        courses: [
          {
            cycleName: "Licence de Technologie en Informatique",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Bac scientifique (C, D, E) ou F, admission sélective",
            debouches: [
              "Analyste Programmeur",
              "Technicien Supérieur de Support & Maintenance",
              "Administrateur Web régional"
            ],
            description: "Une formation rigoureuse de 3 ans alliant l'algorithmique de base, la modélisation conceptuelle, le développement d'applications de données et la sécurité réseau."
          }
        ]
      },
      {
        id: "tg-ucao",
        name: "UCAO-UUT Lomé",
        fullName: "Université Catholique de l'Afrique de l'Ouest - Unité Universitaire du Togo",
        logoShort: "UCA",
        type: "Privée",
        location: "Lomé Sanguéra",
        description: "Une unité universitaire d'élite dotée d'un superbe campus vert, reconnue internationalement pour son éthique managériale et ses excellents laboratoires de codage.",
        website: "ucao-uut.tg",
        courses: [
          {
            cycleName: "Licence Professionnelle en Génie Logiciel",
            type: "Licence (L1 à L3)",
            duration: "3 ans",
            requirements: "Tous Bacs sur test de motivation et admission de dossier",
            debouches: [
              "Développeur d'applications Web & Mobiles d'entreprise",
              "Analyste d'implémentation logicielle",
              "Chef d'équipe agile junior"
            ],
            description: "Enseignement de haut niveau du cycle complet de développement logiciel, du Merise/UML programmatique aux frameworks agiles web et mobiles actuels."
          }
        ]
      }
    ]
  }
};

export default function PupilOrientationSpace({ onBack }: PupilOrientationSpaceProps) {
  const [activeTab, setActiveTab] = useState<'explorer' | 'coach'>('explorer');
  const [selectedCountry, setSelectedCountry] = useState<string>('Sénégal');
  const [activeSchoolId, setActiveSchoolId] = useState<string>('');
  
  // Potential Evaluation logic - simple but inspiring
  const [pupilAptitudeProfile, setPupilAptitudeProfile] = useState<{
    curiosity: number;
    visualArt: number;
    logics: number;
    pragmatic: number;
  }>({ curiosity: 80, visualArt: 75, logics: 70, pragmatic: 65 });

  const [hasCalculatedPotential, setHasCalculatedPotential] = useState<boolean>(false);
  const [quickAnswers, setQuickAnswers] = useState({
    passion: "creation-visuelle",
    logicLove: "filiere-courte",
    studyAccess: "pc-portable-connexion"
  });

  // State for AI Coach Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Bonjour futur(e) bachelier(e) ! 👋 Je suis votre Coach d'Orientation Post-Bac en informatique.\n\nQuelle que soit votre expérience préalable (que vous partiez de zéro absolu ou que vous connaissiez déjà des bases de code), je suis là pour répondre à toutes vos préoccupations académiques et professionnelles.\n\nPosez-moi vos questions ou dites-moi ce que vous aimez faire de votre temps libre (Canva, CapCut, informatique théorique), et je vous guiderai vers le bon parcours en Licence (L1 à L3), BTS ou DUT !",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Set default active school when country shifts
  useEffect(() => {
    const list = COUNTRIES_DATA[selectedCountry]?.schools || [];
    if (list.length > 0) {
      setActiveSchoolId(list[0].id);
    }
  }, [selectedCountry]);

  // Dynamic calculations for potential
  const calculatePotentialResult = () => {
    let baseLogics = 65;
    let baseVisual = 60;
    let basePragmatic = 60;
    let baseCuriosity = 75;

    if (quickAnswers.passion === 'creation-visuelle') {
      baseVisual += 25;
      baseCuriosity += 10;
    } else if (quickAnswers.passion === 'programation-bricolage') {
      baseLogics += 25;
      basePragmatic += 15;
    } else if (quickAnswers.passion === 'montage-video') {
      baseVisual += 20;
      baseCuriosity += 15;
    } else if (quickAnswers.passion === 'jeux-video') {
      baseLogics += 15;
      baseVisual += 15;
    } else if (quickAnswers.passion === 'reparation-aide') {
      basePragmatic += 30;
      baseCuriosity += 10;
    }

    if (quickAnswers.logicLove === 'filiere-longue') {
      baseLogics += 15;
    } else if (quickAnswers.logicLove === 'filiere-courte') {
      basePragmatic += 15;
    }

    setPupilAptitudeProfile({
      curiosity: Math.min(baseCuriosity, 99),
      visualArt: Math.min(baseVisual, 99),
      logics: Math.min(baseLogics, 99),
      pragmatic: Math.min(basePragmatic, 99)
    });
    setHasCalculatedPotential(true);
  };

  const activeCountryData = COUNTRIES_DATA[selectedCountry] || COUNTRIES_DATA['Sénégal'];
  const activeSchool = activeCountryData.schools.find(s => s.id === activeSchoolId) || activeCountryData.schools[0];

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');

    const newMsg: ChatMessage = {
      role: 'user',
      text: userMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/orientation/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, newMsg].map(m => ({ role: m.role, text: m.text })),
          userProfile: {
            userType: "ELEVE_LYCEEN",
            selectedCountry: selectedCountry,
            details: `L'élève utilise l'onglet d'orientation. Passion: ${quickAnswers.passion}, Parcours visé: ${quickAnswers.logicLove}, Equipement: ${quickAnswers.studyAccess}`
          }
        })
      });

      if (!response.ok) throw new Error("Chat error");
      const data = await response.json();
      
      setChatMessages(prev => [...prev, {
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        role: 'model',
        text: "Pardon, j'ai rencontré un petit problème de réseau. Reposez-moi votre question d'orientation académique, je suis là pour vous aider !",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handlePredefinedQuestion = (qText: string) => {
    setChatInput(qText);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="pupil-space-root">
      
      {/* Friendly, inspiring intro banner */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gehmit-green rounded-full filter blur-[100px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-gehmit-green/20 text-gehmit-green-vibrant px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Espace Réussite Lycéen & Nouveau Bachelier
            </div>
            <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight font-sans">
              Votre Passerelle Post-Bac vers la Tech d'Avenir
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
              Pas de questionnaire complexe ou de barrières mathématiques : découvrez immédiatement de réelles filières d'excellence adaptées à votre profil, de la Licence générale aux parcours d'insertion courts (BTS, DUT).
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-slate-100 rounded-xl text-xs font-bold transition-all border border-white/10 shrink-0 self-start md:self-center"
            id="back-profile-btn"
          >
            ← Changer de Profil
          </button>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto" id="pupil-nav-tabs">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-gehmit-green text-white shadow-sm'
                : 'text-slate-650 hover:bg-slate-50'
            }`}
            id="tab-explorer"
          >
            <BookOpen className="w-4 h-4" />
            🏫 Filières & Écoles
          </button>
          
          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'coach'
                ? 'bg-gehmit-green text-white shadow-sm'
                : 'text-slate-650 hover:bg-slate-50'
            }`}
            id="tab-coach"
          >
            <Sparkles className="w-4 h-4" />
            💬 Mon Coach IA
          </button>
        </div>

        {/* Dynamic country filter badge selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono hidden md:inline ml-2">
            Territoire :
          </span>
          <div className="flex gap-1">
            {Object.keys(COUNTRIES_DATA).map(ct => (
              <button
                key={ct}
                onClick={() => setSelectedCountry(ct)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold select-none cursor-pointer border transition-all ${
                  selectedCountry === ct
                    ? 'bg-gehmit-green-light border-gehmit-green-light text-gehmit-green-dark font-extrabold scale-102'
                    : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span>{COUNTRIES_DATA[ct].flag}</span> <span className="ml-0.5">{ct}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content 1: School and Cycle Explorer */}
      {activeTab === 'explorer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="explorer-panel">
          
          {/* Left Block (Grid 4/12) - List of Schools in chosen Country */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold text-gehmit-green uppercase tracking-wider">
                  Universités & Écoles • {COUNTRIES_DATA[selectedCountry]?.flag || ''} {selectedCountry}
                </h3>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {activeCountryData.description}
                </p>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {activeCountryData.schools.map((school) => {
                  const isActive = school.id === activeSchoolId;
                  return (
                    <button
                      key={school.id}
                      onClick={() => setActiveSchoolId(school.id)}
                      className={`w-full p-4 rounded-xl text-left border cursor-pointer transition-all flex items-start gap-3 group relative ${
                        isActive 
                          ? 'border-gehmit-green bg-gehmit-green-light/40 shadow-sm' 
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 font-bold text-xs ${
                        isActive ? 'bg-gehmit-green text-white' : 'bg-slate-200/60 text-slate-600'
                      }`}>
                        {school.logoShort}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-900 leading-tight">
                            {school.name}
                          </h4>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                            school.type === "Publique" 
                              ? 'bg-blue-50 text-blue-700' 
                              : school.type === "Internationale"
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-green-50 text-green-700'
                          }`}>
                            {school.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {school.location}
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 ml-auto shrink-0 self-center transition-transform ${
                        isActive ? 'text-gehmit-green translate-x-1' : 'text-slate-300 group-hover:text-slate-400'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Micro Potentiel profiling widget */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-sm space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-extrabold text-gehmit-green-vibrant uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4 h-4 shrink-0" />
                  Auto-Calculateur de Potentiel
                </h4>
                <p className="text-[11px] text-slate-350 font-sans">
                  Découvrez vos dominances naturelles et si vous disposez d'aptitudes pour faire une carrière remarquable !
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Passion Picker */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase">votre passion préférée :</label>
                  <select
                    value={quickAnswers.passion}
                    onChange={(e) => {
                      setQuickAnswers({ ...quickAnswers, passion: e.target.value });
                      setHasCalculatedPotential(false);
                    }}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 p-2 text-xs text-white"
                  >
                    <option value="creation-visuelle">🎨 Créer des designs et logos (Canva, Figma)</option>
                    <option value="montage-video">🎬 Faire du montage vidéo (CapCut, YouTube, TikTok)</option>
                    <option value="programation-bricolage">💻 Bidouiller des petits codes ou programmation</option>
                    <option value="jeux-video">🎮 Jouer ou s'intéresser aux jeux vidéo</option>
                    <option value="reparation-aide">🔌 Dépanner des smartphones ou box internet</option>
                  </select>
                </div>

                {/* Duration choice */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase">durée d'études souhaitée :</label>
                  <select
                    value={quickAnswers.logicLove}
                    onChange={(e) => {
                      setQuickAnswers({ ...quickAnswers, logicLove: e.target.value });
                      setHasCalculatedPotential(false);
                    }}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 p-2 text-xs text-white"
                  >
                    <option value="filiere-courte">⏱️ Parcours court, pratique et rapide (BTS, DUT en 2 ans)</option>
                    <option value="filiere-longue">🎓 Parcours universitaire long et structuré (Licence L1-L3 à Master)</option>
                  </select>
                </div>

                <button
                  onClick={calculatePotentialResult}
                  className="w-full py-2.5 bg-gehmit-green hover:bg-gehmit-green-hover text-white font-bold rounded-xl transition-all font-sans text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyser mon potentiel tech
                </button>

                {hasCalculatedPotential && (
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3.5 animate-fade-in text-[11px] backdrop-blur-xs" id="potential-result-box">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gehmit-green-vibrant flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-gehmit-green-vibrant" />
                        Profil Détecté : {
                          quickAnswers.passion === 'creation-visuelle' ? "Créatif & UI/UX" :
                          quickAnswers.passion === 'montage-video' ? "Créateur de Contenu Tech" :
                          quickAnswers.passion === 'programation-bricolage' ? "Développeur Logiciel" :
                          quickAnswers.passion === 'jeux-video' ? "Concepteur Interactif" :
                          "Expert Infrastructures & Systèmes"
                        }
                      </p>
                      <span className="text-[10px] bg-gehmit-green/20 text-gehmit-green-vibrant px-2 py-0.5 rounded-full font-mono font-bold">
                        Potentiel : Très Élevé
                      </span>
                    </div>
                    
                    <p className="text-slate-300 leading-relaxed">
                      {quickAnswers.passion === 'creation-visuelle' && (
                        <span>Votre sensibilité pour le graphisme et la mise en page constitue une passerelle d'excellence vers l'<strong>UI/UX Design</strong>, le design d'interactions et le développement d'applications <strong>Front-End</strong>.</span>
                      )}
                      {quickAnswers.passion === 'montage-video' && (
                        <span>Votre maîtrise naturelle des formats multimédias et de la narration numérique est extrêmement recherchée pour concevoir les interfaces interactives et les applications web à <strong>forte expérience utilisateur</strong> d'aujourd'hui.</span>
                      )}
                      {quickAnswers.passion === 'programation-bricolage' && (
                        <span>Vos prédispositions pour l'ingénierie logique et la bidouille logicielle s'alignent parfaitement avec les exigences de l'<strong>algorithmique fondamentale</strong> et du <strong>Génie Logiciel</strong>.</span>
                      )}
                      {quickAnswers.passion === 'jeux-video' && (
                        <span>Votre compréhension instinctive des mécaniques interactives et d'immersion se traduit par de grandes capacités d'<strong>abstraction et de logique</strong>, parfaites pour le développement de logiciels modernes.</span>
                      )}
                      {quickAnswers.passion === 'reparation-aide' && (
                        <span>Votre enthousiasme à dépanner des systèmes physiques et configurer des équipements est la fondation idéale pour d'excellentes études en <strong>Réseaux, Cloud Computing ou Cybersécurité</strong>.</span>
                      )}
                    </p>

                    <div className="border-t border-slate-800 my-1 pt-3">
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-2.5 font-bold">Indices d'aptitudes numériques :</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-[10px] font-mono text-slate-400">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-slate-300">
                            <span>Curiosité :</span>
                            <strong className="text-white font-bold">{pupilAptitudeProfile.curiosity}%</strong>
                          </div>
                          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gehmit-green rounded-full" style={{ width: `${pupilAptitudeProfile.curiosity}%` }}></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-slate-300">
                            <span>Logique :</span>
                            <strong className="text-white font-bold">{pupilAptitudeProfile.logics}%</strong>
                          </div>
                          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gehmit-green rounded-full" style={{ width: `${pupilAptitudeProfile.logics}%` }}></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-slate-300 font-sans">
                            <span>Sens Visuel :</span>
                            <strong className="text-white font-bold">{pupilAptitudeProfile.visualArt}%</strong>
                          </div>
                          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gehmit-green rounded-full" style={{ width: `${pupilAptitudeProfile.visualArt}%` }}></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-slate-300">
                            <span>Esprit Pratique :</span>
                            <strong className="text-white font-bold">{pupilAptitudeProfile.pragmatic}%</strong>
                          </div>
                          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gehmit-green rounded-full" style={{ width: `${pupilAptitudeProfile.pragmatic}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Block (Grid 8/12) - Deep Details of Cycles & Debouches */}
          <div className="lg:col-span-8 space-y-6">
            
            {activeSchool ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                
                {/* School title & Description */}
                <div className="border-b border-slate-100 pb-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="font-black text-xl md:text-2xl text-slate-900 tracking-tight font-sans">
                        {activeSchool.fullName}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 font-sans">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        Campus de {activeSchool.location} • {COUNTRIES_DATA[selectedCountry]?.flag || ''} {selectedCountry}
                      </p>
                    </div>
                    <a
                      href={activeSchool.website.startsWith('http') ? activeSchool.website : `https://${activeSchool.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono bg-slate-900 text-white hover:bg-gehmit-green hover:text-white px-3 py-1.5 rounded-xl font-bold self-start sm:self-center transition-all inline-flex items-center gap-1 shadow-sm hover:scale-105"
                      id={`school-link-${activeSchool.website}`}
                    >
                      Site : {activeSchool.website} ↗
                    </a>
                  </div>
                  <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-sans">
                    {activeSchool.description}
                  </p>
                </div>

                {/* Subtitle list */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Cycles de Formation Disponibles (L1-L3, BTS, DUT) & Débouchés
                  </h4>

                  <div className="space-y-5">
                    {activeSchool.courses.map((course, idx) => (
                      <div 
                        key={idx} 
                        className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30 hover:border-gehmit-green hover:bg-white transition-all space-y-4 group relative"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <h5 className="font-extrabold text-sm md:text-base text-slate-900 flex items-center gap-2 font-sans group-hover:text-gehmit-green-dark transition-colors">
                            <span className="w-2.5 h-2.5 bg-gehmit-green rounded-full shrink-0" />
                            {course.cycleName}
                          </h5>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold font-mono">
                              ⏱️ {course.duration}
                            </span>
                            <span className="text-[10px] bg-gehmit-green-light text-gehmit-green-dark px-2.5 py-1 rounded-full font-bold font-mono">
                              🎓 {course.type}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed font-sans">
                          {course.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-100">
                          <div>
                            <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-1.5">
                              📋 Condition d'Accès Conseillée
                            </span>
                            <p className="text-[11px] font-sans text-slate-700 leading-relaxed">
                              {course.requirements}
                            </p>
                          </div>

                          <div>
                            <span className="block text-[10px] text-gehmit-green font-mono font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5" />
                              Débouchés Professionnels (Métiers Visés)
                            </span>
                            <ul className="space-y-1.5">
                              {course.debouches.map((deb, dIdx) => (
                                <li key={dIdx} className="text-[11px] text-slate-800 flex items-start gap-1.5 font-sans leading-tight">
                                  <ArrowRight className="w-3 h-3 text-gehmit-green shrink-0 mt-0.5" />
                                  <span>{deb}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Friendly advise note */}
                <div className="p-4 bg-gehmit-green-light/40 rounded-xl border border-gehmit-green-light text-xs text-slate-750 font-sans leading-relaxed">
                  <strong>💡 Conseil d'Orientation :</strong> Même si vous n'avez jamais fait de programmation auparavant au lycée, tous ces diplômes démarrent systématiquement à un niveau débutant complet (par l'algorithmique théorique pas à pas). Ne laissez pas la peur du code vous freiner !
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 text-sm font-sans shrink-0">
                Aucune école définie pour ce pays. Veuillez en choisir un autre ci-dessus.
              </div>
            )}

          </div>

        </div>
      )}

      {/* Tab Content 2: Career / Orientation Assistant Special AI Coach Chat */}
      {activeTab === 'coach' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in" id="coach-panel">
          
          {/* Left instructions block (Grid 4/12) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gehmit-green-light text-gehmit-green rounded-lg shadow-xs">
                <GehmitLogo className="w-5 h-5 shrink-0" color="currentColor" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 font-sans">Le Rôle de Votre Coach</h3>
            </div>
            
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              Ce conseiller virtuel est un <strong>expert pédagogique d'élite</strong>. Sa mission est de vous aider à comprendre comment débuter, quel type d'école est adapté, et comment lever vos doutes scolaires.
            </p>

            <div className="border-t border-slate-100 pt-3.5 space-y-3">
              <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase">
                Garanties de l'assistant :
              </span>
              
              <div className="space-y-2 text-xs">
                <div className="flex gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-gehmit-green shrink-0 mt-0.5" />
                  <span><strong>Garantie Pédagogique :</strong> Des conseils 100% axés sur les parcours d'études, universités et d'insertion.</span>
                </div>
                <div className="flex gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-gehmit-green shrink-0 mt-0.5" />
                  <span><strong>Zéro jargon technique superflu :</strong> Pas de codes Python ou d'architectures compliquées.</span>
                </div>
                <div className="flex gap-2 text-slate-705">
                  <CheckCircle2 className="w-4 h-4 text-gehmit-green shrink-0 mt-0.5" />
                  <span><strong>Accompagnement d'avenir :</strong> Réponses claires sur les questions de matériel, de tarifs, et d'opportunités en Afrique.</span>
                </div>
              </div>
            </div>

            {/* Quick questions suggestions trigger */}
            <div className="bg-gehmit-green-light/30 p-4 rounded-xl border border-gehmit-green-light/60 space-y-2">
              <span className="text-[10px] font-mono font-extrabold text-gehmit-green-dark flex items-center gap-1 uppercase">
                <HelpCircle className="w-3.5 h-3.5 shrink-0 text-gehmit-green" />
                Sujets à poser en un clic :
              </span>
              <div className="flex flex-col gap-1.5">
                {[
                  "Est-ce dur si on n'a jamais fait de code avant d'entrer en L1 ?",
                  "Comment choisir entre un DUT de 2 ans et une Licence 3 ans ?",
                  "Puis-je apprendre le codage informatique sans ordinateur ?",
                  "Quels sont les métiers d'avenir les plus créatifs et visuels ?"
                ].map((qText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePredefinedQuestion(qText)}
                    className="w-full text-left p-2 rounded-lg bg-white/70 hover:bg-white text-[11px] text-slate-700 border border-slate-100 hover:border-gehmit-green-light font-medium transition-all"
                  >
                    💡 {qText}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live Chat Block (Grid 8/12) */}
          <div className="lg:col-span-8">
            
            <div className="bg-slate-900 rounded-2xl flex flex-col h-[520px] shadow-lg border border-slate-800 overflow-hidden" id="pupil-ai-coach-chatbox">
              {/* Header */}
              <div className="px-5 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-white p-0.5 rounded-xl flex items-center justify-center select-none border border-slate-700">
                    <GehmitLogo className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-100 font-sans">
                      TechPath Coach Post-Bac
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Mentor d'Orientation & Pédagogie de Gehmit • En Ligne
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setChatMessages([
                      {
                        role: 'model',
                        text: "Discussion réinitialisée ! Sur quel aspect pédagogique, académique ou d'orientation dans le domaine de la tech souhaitez-vous échanger ?",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                  }}
                  className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                  title="Réinitialiser l'échange"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chat flow with messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {chatMessages.map((msg, idx) => {
                  const isModel = msg.role === 'model';
                  return (
                    <div 
                      key={idx}
                      className={`flex items-start gap-2.5 ${isModel ? 'justify-start' : 'justify-end'}`}
                    >
                      {isModel && (
                        <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 border border-slate-700 select-none">
                          <GehmitLogo className="w-6 h-6" />
                        </div>
                      )}
                      
                      <div className="flex flex-col max-w-[80%]">
                        <div className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                          isModel 
                            ? 'bg-slate-800/80 text-slate-50 border border-slate-755 rounded-tl-none font-sans' 
                            : 'bg-gehmit-green text-white rounded-tr-none font-sans font-medium'
                        }`}>
                          {msg.text}
                        </div>
                        <span className={`text-[9px] text-slate-500 mt-1 block ${isModel ? 'text-left' : 'text-right'} font-mono`}>
                          {msg.timestamp}
                        </span>
                      </div>

                      {!isModel && (
                        <div className="w-7 h-7 rounded-lg bg-slate-750 flex items-center justify-center shrink-0 text-slate-350 text-xs">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isChatLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 border border-slate-700 select-none">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    </div>
                    <div className="p-3 bg-slate-800/80 text-xs text-slate-300 rounded-2xl rounded-tl-none border border-slate-75" id="chat-loading-indicator">
                      Le Coach analyse votre situation académique...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat submission area */}
              <form onSubmit={handleSendChatMessage} className="p-3 bg-slate-850 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Posez votre question académique ou d'orientation..."
                  className="flex-1 rounded-xl bg-slate-900 border border-slate-750 p-3 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gehmit-green transition-all font-sans"
                  id="pupil-chat-textbox"
                  disabled={isChatLoading}
                  required
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="p-3 bg-gehmit-green text-white rounded-xl hover:bg-gehmit-green-hover transition-all disabled:opacity-30 disabled:hover:bg-gehmit-green active:scale-95 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

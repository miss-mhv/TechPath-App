/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserType = 'ELEVE' | 'ETUDIANT' | 'RECONVERSION';

export interface GradeInput {
  math: number;
  physics: number;
  english: number;
  french: number;
  technologyInterest: 'high' | 'medium' | 'low';
  logicalPuzzlesInterest: 'high' | 'medium' | 'low';
  gradesAreCredible: boolean;
  country: string;
  customExperience: string;
}

export interface StudentInput {
  level: string; // e.g., "Licence 1", "Licence 3", "BTS", "Master 1"
  knownLanguages: string[]; // e.g., ["Python", "JavaScript", "C++"]
  favorites: string; // subjects or modules they liked
  preferredCareers: string[]; // e.g., ["Web", "Mobile", "Security", "AI"]
  continentFocus: 'local' | 'international' | 'both';
  country: string; // West/Central African French-speaking countries: "Sénégal", "Côte d'Ivoire", "Cameroun", etc.
  hardwareIotAspect: string; // interest in hardware/maintenance/IoT
  freeTimeActivities: string; // hobbies/activities in free time
}

export interface CareerMatch {
  title: string;
  suitability: string; // e.g., "95%"
  why: string;
  localPerspective: string;
  internationalPerspective: string;
  averageSalaryLocal: string; // e.g. "350 000 - 900 000 FCFA/mois"
  averageSalaryGlobal: string; // e.g. "2000 - 4500 €/mois (remote)"
}

export interface RoadmapStep {
  phase: string;
  duration: string;
  topics: string[];
  freeResources: string[];
  actionableProject: string;
}

export interface OrientationResult {
  profileTitle: string;
  profileSummary: string;
  aptitudeScores: {
    technophile: number; // 0-100
    logique: number;     // 0-100
    visuel: number;      // 0-100
    gestion: number;     // 0-100
  };
  matchingCareers: CareerMatch[];
  learningRoadmap: RoadmapStep[];
  localEcosystemAdvice: string;
  successStory: string;
}

export interface QuizAnswer {
  questionId: string;
  answerValue: string; // the option key chosen (e.g. 'A', 'B', 'C', 'D')
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

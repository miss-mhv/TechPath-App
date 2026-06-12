/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AFRICAN_COUNTRIES, CAREER_DOMAINS, PROGRAMMING_LANGUAGES } from '../constants';
import { Briefcase, ArrowRight, ShieldCheck, Terminal, Hammer, Globe, Building2, HelpCircle } from 'lucide-react';

interface ProfessionalReconversionProps {
  onSubmit: (input: any) => void;
  isLoading: boolean;
}

export default function ProfessionalReconversion({ onSubmit, isLoading }: ProfessionalReconversionProps) {
  // Common
  const [country, setCountry] = useState('Sénégal');
  const [isTech, setIsTech] = useState<boolean>(false);
  const [continentFocus, setContinentFocus] = useState<'local' | 'international' | 'both'>('both');

  // Path A: Tech Professional
  const [knowsTargetCareer, setKnowsTargetCareer] = useState<boolean>(true);
  
  // A1: Knows target
  const [techCurrentRole, setTechCurrentRole] = useState('');
  const [techTargetRole, setTechTargetRole] = useState('');
  const [techReconversionObjective, setTechReconversionObjective] = useState<'roadmap' | 'discuss'>('roadmap');
  const [techSpecificConcerns, setTechSpecificConcerns] = useState('');

  // A2: Doesn't know target (Aptitude path similar to students)
  const [techKnownLanguages, setTechKnownLanguages] = useState<string[]>([]);
  const [techLanguageLevels, setTechLanguageLevels] = useState<Record<string, number>>({});
  const [techPreferredProjects, setTechPreferredProjects] = useState('');
  const [techSelectedCareers, setTechSelectedCareers] = useState<string[]>([]);
  const [techHardwareIotAspect, setTechHardwareIotAspect] = useState("Surtout Logiciel (Aucun intérêt particulier pour le physique)");
  const [techSelectedFreeTimeTags, setTechSelectedFreeTimeTags] = useState<string[]>([]);
  const [techCustomFreeTime, setTechCustomFreeTime] = useState('');

  // Path B: Non-Tech Professional
  const [nonTechBackground, setNonTechBackground] = useState('');
  const [nonTechHasFavorite, setNonTechHasFavorite] = useState<boolean>(false);
  const [nonTechFavoriteJob, setNonTechFavoriteJob] = useState('');
  const [nonTechSelectedInterests, setNonTechSelectedInterests] = useState<string[]>([]);
  const [nonTechHardwareIotAspect, setNonTechHardwareIotAspect] = useState("Surtout Logiciel (Aucun intérêt particulier pour le physique)");
  const [nonTechSelectedFreeTimeTags, setNonTechSelectedFreeTimeTags] = useState<string[]>([]);
  const [nonTechCustomFreeTime, setNonTechCustomFreeTime] = useState('');

  // Handlers
  const handleToggleTechLanguage = (lang: string) => {
    if (techKnownLanguages.includes(lang)) {
      setTechKnownLanguages(techKnownLanguages.filter(l => l !== lang));
    } else {
      setTechKnownLanguages([...techKnownLanguages, lang]);
      if (!techLanguageLevels[lang]) {
        setTechLanguageLevels(prev => ({ ...prev, [lang]: 3 }));
      }
    }
  };

  const handleToggleTechCareer = (careerId: string) => {
    if (techSelectedCareers.includes(careerId)) {
      setTechSelectedCareers(techSelectedCareers.filter(c => c !== careerId));
    } else {
      setTechSelectedCareers([...techSelectedCareers, careerId]);
    }
  };

  const handleToggleNonTechInterest = (interest: string) => {
    if (nonTechSelectedInterests.includes(interest)) {
      setNonTechSelectedInterests(nonTechSelectedInterests.filter(i => i !== interest));
    } else {
      setNonTechSelectedInterests([...nonTechSelectedInterests, interest]);
    }
  };

  // Validation Logic
  let isValid = false;
  const missingFields: string[] = [];

  if (isTech) {
    if (knowsTargetCareer) {
      const roleOk = techCurrentRole.trim().length > 0;
      const targetOk = techTargetRole.trim().length > 0;
      const targetSpecificOk = techReconversionObjective === 'roadmap' ? true : techSpecificConcerns.trim().length > 0;
      isValid = roleOk && targetOk && targetSpecificOk;
      
      if (!roleOk) missingFields.push("Votre poste / compétences techniques actuelles (*)");
      if (!targetOk) missingFields.push("Votre nouveau métier d'informatique visé (*)");
      if (!targetSpecificOk) missingFields.push("Saisissez vos préoccupations spécifiques pour discussion (*)");
    } else {
      const currentOk = techCurrentRole.trim().length > 0;
      const langsOk = techKnownLanguages.length > 0;
      const prefOk = techPreferredProjects.trim().length > 0;
      const careersOk = techSelectedCareers.length > 0;
      isValid = currentOk && langsOk && prefOk && careersOk;

      if (!currentOk) missingFields.push("Votre métier ou rôle actuel de départ (*)");
      if (!langsOk) missingFields.push("Sélectionnez au moins une technologie ou langue déjà abordée (*)");
      if (!prefOk) missingFields.push("Préciser vos projets et cours favoris (*)");
      if (!careersOk) missingFields.push("Cochez au moins un domaine d'attrait intuitif (*)");
    }
  } else {
    const bgOk = nonTechBackground.trim().length > 0;
    const favJobOk = nonTechHasFavorite ? nonTechFavoriteJob.trim().length > 0 : true;
    const interestsOk = nonTechSelectedInterests.length > 0;
    isValid = bgOk && favJobOk && interestsOk;

    if (!bgOk) missingFields.push("Votre parcours ou métier actuel hors-tech de départ (*)");
    if (nonTechHasFavorite && !favJobOk) missingFields.push("Précisez votre métier coup de cœur ou d'intérêt en tête (*)");
    if (!interestsOk) missingFields.push("Sélectionnez au moins un type d'activité qui vous motive le plus (*)");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Prep dynamic input to send to endpoint
    let payload: any = {
      isTech,
      country,
      continentFocus,
    };

    if (isTech) {
      payload.knowsTargetCareer = knowsTargetCareer;
      payload.currentOccupation = techCurrentRole;
      if (knowsTargetCareer) {
        payload.targetCareer = techTargetRole;
        payload.reconversionObjective = techReconversionObjective;
        payload.specificConcerns = techSpecificConcerns;
      } else {
        // Known languages structured with rating
        payload.knownTechLanguages = techKnownLanguages.map(lang => {
          const lvl = techLanguageLevels[lang] || 3;
          return `${lang} (Niveau: ${lvl}/5)`;
        });
        payload.preferredActivities = techPreferredProjects;
        payload.chosenInterests = techSelectedCareers;
        payload.hardwareIotAspect = techHardwareIotAspect;
        
        let finalFree = techSelectedFreeTimeTags.join(", ");
        if (techCustomFreeTime.trim()) {
          finalFree = finalFree ? `${finalFree}. Plus : ${techCustomFreeTime}` : techCustomFreeTime;
        }
        payload.freeTimeActivities = finalFree || "Pas d'activités précises mentionnées.";
      }
    } else {
      payload.currentOccupation = nonTechBackground;
      payload.nonTechHasFavorite = nonTechHasFavorite;
      payload.nonTechFavoriteJob = nonTechHasFavorite ? nonTechFavoriteJob : "Inconnu (Demande de suggestion)";
      payload.chosenInterests = nonTechSelectedInterests;
      payload.hardwareIotAspect = nonTechHardwareIotAspect;
      
      let finalFree = nonTechSelectedFreeTimeTags.join(", ");
      if (nonTechCustomFreeTime.trim()) {
        finalFree = finalFree ? `${finalFree}. Plus : ${nonTechCustomFreeTime}` : nonTechCustomFreeTime;
      }
      payload.freeTimeActivities = finalFree || "Pas de loisirs précisés.";
    }

    onSubmit(payload);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 max-w-2xl mx-auto" id="reconversion-form-wrapper">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gehmit-green-light text-gehmit-green-dark rounded-xl">
          <Briefcase className="w-6 h-6 text-gehmit-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">Espace Reconversion Professionnelle</h2>
          <p className="text-xs text-gehmit-green font-mono tracking-wider uppercase font-bold">Migration de Carrière • Gehmit TechPath</p>
        </div>
      </div>

      <p className="text-sm text-slate-650 mb-6 leading-relaxed">
        Vous changez de parcours professionnel vers le numérique d'avenir ? Nous vous aidons à valoriser vos acquis passés et dessiner le pont idéal vers de réels débouchés africains ou en remote mondial.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Country Choice */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
            Votre Pays actuel de travail / étude *
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
            id="reconversion-country"
          >
            {AFRICAN_COUNTRIES.map((cnt) => (
              <option key={cnt} value={cnt}>
                {cnt}
              </option>
            ))}
          </select>
        </div>

        {/* PRÉMISSE: Is the professional in tech or not? */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-sans">
            Quel est votre statut d'origine par rapport au secteur technologique ? *
          </label>
          <div className="grid grid-cols-2 gap-3" id="tech-or-nontech-toggle">
            <button
              type="button"
              onClick={() => setIsTech(true)}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 cursor-pointer transition-all ${
                isTech 
                  ? 'border-gehmit-green bg-gehmit-green-light text-gehmit-green-dark font-bold shadow-xs' 
                  : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
              }`}
              id="reconversion-tech-btn"
            >
              <Terminal className="w-5 h-5 text-slate-700" />
              <span className="text-xs">Profil Déjà Tech</span>
              <span className="text-[9px] text-slate-400 font-medium">J'ai déjà codé ou géré du support informatique</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTech(false)}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 cursor-pointer transition-all ${
                !isTech 
                  ? 'border-gehmit-green bg-gehmit-green-light text-gehmit-green-dark font-bold shadow-xs' 
                  : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
              }`}
              id="reconversion-nontech-btn"
            >
              <Building2 className="w-5 h-5 text-slate-700" />
              <span className="text-xs">Profil Non-Tech</span>
              <span className="text-[9px] text-slate-400 font-medium">Pas ou peu d'expérience de programmation</span>
            </button>
          </div>
        </div>

        {/* ==================== PATH A: ALREADY IN TECH ==================== */}
        {isTech && (
          <div className="space-y-6 pt-2 border-t border-slate-100 animate-fade-in" id="path-tech-wrapper">
            
            {/* Knows Target Career indicator */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-sans">
                Connaissez-vous déjà le métier informatique cible où vous souhaitez vous réorienter ? *
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setKnowsTargetCareer(true)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    knowsTargetCareer 
                      ? 'bg-gehmit-green border-gehmit-green text-white shadow-xs' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-150'
                  }`}
                >
                  Oui, j'ai une idée bien précise
                </button>
                <button
                  type="button"
                  onClick={() => setKnowsTargetCareer(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    !knowsTargetCareer 
                      ? 'bg-gehmit-green border-gehmit-green text-white shadow-xs' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-150'
                  }`}
                >
                  Non, j'aimerais qu'on l'évalue
                </button>
              </div>
            </div>

            {/* If YES: knows target career */}
            {knowsTargetCareer ? (
              <div className="space-y-5 animate-fade-in" id="tech-yes-knows">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                    Quel est votre poste technique ou vos compétences actuelles ? *
                  </label>
                  <input
                    type="text"
                    value={techCurrentRole}
                    onChange={(e) => setTechCurrentRole(e.target.value)}
                    placeholder="Ex: Technicien helpdesk réseau, QA manuel, developpeur PHP junior, etc."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
                    id="tech-current-role-yes"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                    Quel nouveau métier de l'informatique visez-vous pour votre reconversion ? *
                  </label>
                  <input
                    type="text"
                    value={techTargetRole}
                    onChange={(e) => setTechTargetRole(e.target.value)}
                    placeholder="Ex: Ingénieur de données, Consultant Cloud AWS, Expert Cybersécurité, etc."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
                    id="tech-target-role"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-sans">
                    Quel est votre besoin prioritaire pour cette orientation ? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="tech-objective-grid">
                    <button
                      type="button"
                      onClick={() => setTechReconversionObjective('roadmap')}
                      className={`p-3 text-left rounded-xl border flex flex-col gap-1 transition-all cursor-pointer ${
                        techReconversionObjective === 'roadmap'
                          ? 'border-gehmit-green bg-gehmit-green-light/40 font-semibold text-slate-900'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900">Rapport & Feuille de Route</span>
                      <span className="text-[10px] text-slate-400">Pour structurer mes compétences et augmenter mes chances de recrutement.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTechReconversionObjective('discuss')}
                      className={`p-3 text-left rounded-xl border flex flex-col gap-1 transition-all cursor-pointer ${
                        techReconversionObjective === 'discuss'
                          ? 'border-gehmit-green bg-gehmit-green-light/40 font-semibold text-slate-900'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900">Préoccupations Spécifiques</span>
                      <span className="text-[10px] text-slate-400">Pour échanger en direct sur des questions délicates (salaires, marché local...).</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                    {techReconversionObjective === 'discuss' 
                      ? "Rédigez vos préoccupations spécifiques détaillées pour le Coach virtuel (Obligatoire) *"
                      : "Détaillez vos objectifs particuliers ou doutes éventuels (Facultatif)"}
                  </label>
                  <textarea
                    value={techSpecificConcerns}
                    onChange={(e) => setTechSpecificConcerns(e.target.value)}
                    placeholder={
                      techReconversionObjective === 'discuss'
                        ? "Ex: C'est difficile de trouver un poste DevOps à Abidjan après avoir fait du QA. Quelle transition est la plus rapide ? Quel TJM puis-je facturer ?"
                        : "Ex: J'aimerais surtout savoir si mon passif en sysadmin m'aidera à percer plus vite en Cloud, et si l'anglais est vital."
                    }
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light resize-none font-sans font-medium"
                    id="tech-specific-concerns"
                  />
                </div>
              </div>
            ) : (
              /* If NO: tech professional wants orientation questionnaire */
              <div className="space-y-5 animate-fade-in" id="tech-no-assessment">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                    Quel est votre métier ou rôle informatique actuel de départ ? *
                  </label>
                  <input
                    type="text"
                    value={techCurrentRole}
                    onChange={(e) => setTechCurrentRole(e.target.value)}
                    placeholder="Ex: SupportDesk, Intégrateur Web de base, Maintenance PC, etc."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
                    id="tech-current-role-no"
                  />
                </div>

                {/* known technologies & scale */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                    Sélectionnez les Technologies ou Langages déjà maîtrisés / abordés *
                  </label>
                  <span className="text-[10px] text-slate-400 block mb-3 font-mono">Indiquez la note d'aisance de 1 à 5</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" id="tech-langs-grid">
                    {PROGRAMMING_LANGUAGES.map((lang) => {
                      const checked = techKnownLanguages.includes(lang);
                      const lvl = techLanguageLevels[lang] || 3;
                      return (
                        <div
                          key={lang}
                          className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                            checked 
                              ? 'border-gehmit-green bg-gehmit-green-light/20 ring-1 ring-gehmit-green/10 shadow-xs' 
                              : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleTechLanguage(lang)}
                            className="flex items-center gap-2.5 text-xs font-sans font-bold text-slate-850 text-left grow cursor-pointer select-none"
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              checked ? 'bg-gehmit-green border-gehmit-green text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {checked && (
                                <svg className="w-2.5 h-2.5 stroke-current stroke-3 fill-none" viewBox="0 0 24 24">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <span className="text-slate-900">{lang}</span>
                          </button>

                          {checked && (
                            <div className="mt-3 pt-2 w-full border-t border-gehmit-green-light flex flex-col gap-2">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-semibold text-slate-550 uppercase font-mono tracking-wider">Aisance :</span>
                                <span className="font-extrabold text-gehmit-green bg-gehmit-green-light px-1.5 py-0.5 rounded-md font-mono">
                                  {lvl}/5
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={lvl}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setTechLanguageLevels(prev => ({ ...prev, [lang]: val }));
                                }}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gehmit-green"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                    Quels types de projets ou aspects de l'informatique avez-vous préférés jusqu'ici ? *
                  </label>
                  <input
                    type="text"
                    value={techPreferredProjects}
                    onChange={(e) => setTechPreferredProjects(e.target.value)}
                    placeholder="Ex: Résoudre des blocages de code, designer l'interface d'un site, automatiser un backup..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
                    id="tech-preferred-projects"
                  />
                </div>

                {/* Domains of interest */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-sans">
                    Quels domaines vous intriguent ou vous attirent le plus ? *
                  </label>
                  <span className="text-[10px] text-slate-400 block mb-2 font-mono">Cochez au moins une thématique</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="tech-careers-grid">
                    {CAREER_DOMAINS.map((domain) => {
                      const checked = techSelectedCareers.includes(domain.id);
                      return (
                        <button
                          key={domain.id}
                          type="button"
                          onClick={() => handleToggleTechCareer(domain.id)}
                          className={`p-3 text-xs text-left rounded-xl border flex items-center justify-between transition-all duration-150 cursor-pointer ${
                            checked 
                              ? 'border-gehmit-green bg-gehmit-green-light text-slate-900 font-semibold' 
                              : 'border-slate-100 bg-slate-50 text-slate-750 hover:border-slate-200'
                          }`}
                        >
                          <span>{domain.name}</span>
                          {checked && <ShieldCheck className="w-4 h-4 text-gehmit-green shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hardware aspects */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-sans">
                    Gout prononcé pour la maintenance physique des réseaux ou objets IoT / Électronique ?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="tech-hardware-iot-options">
                    {[
                      { id: "soft", label: "Surtout Logiciel (Aucun intérêt particulier pour le physique)" },
                      { id: "maint", label: "Maintenance & Réseaux Physiques" },
                      { id: "iot", label: "IoT, Domotique & Électronique (Arduino/Raspberry)" },
                      { id: "both", label: "Hardware global (Maintenance + IoT)" }
                    ].map((opt) => {
                      const active = techHardwareIotAspect === opt.label;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setTechHardwareIotAspect(opt.label)}
                          className={`p-3 text-left rounded-xl border flex flex-col transition-all duration-150 cursor-pointer ${
                            active 
                              ? 'border-gehmit-green bg-gehmit-green-light text-slate-900 font-semibold shadow-xs' 
                              : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200'
                          }`}
                        >
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                            {opt.id !== "soft" ? <Hammer className="w-3.5 h-3.5 text-gehmit-green" /> : <Terminal className="w-3.5 h-3.5 text-slate-500" />}
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Free time tags */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-sans">
                    Loisirs et activités favorites en rapport avec la technologie
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {[
                      { label: "🧠 Puzzles logiques", val: "Faire des énigmes ou casse-tête" },
                      { label: "💻 Coder / Tester des scripts", val: "Écrire ou modifier du code" },
                      { label: "🔧 Réparer des téléphones/PC", val: "Bricoler des appareils physiques" },
                      { label: "📺 Veille technologique", val: "Suivre des chaînes tech fr ou tutos" },
                      { label: "💼 Startups & Commerce", val: "S'intéresser aux opportunités d'affaires / e-commerce" }
                    ].map((pill) => {
                      const selected = techSelectedFreeTimeTags.includes(pill.val);
                      return (
                        <button
                          key={pill.label}
                          type="button"
                          onClick={() => {
                            setTechSelectedFreeTimeTags(prev => 
                              prev.includes(pill.val) 
                                ? prev.filter(t => t !== pill.val) 
                                : [...prev, pill.val]
                            );
                          }}
                          className={`px-2.5 py-1.5 rounded-full text-[11px] transition-all border cursor-pointer ${
                            selected 
                              ? 'bg-gehmit-green border-gehmit-green text-white font-semibold' 
                              : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pill.label}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={techCustomFreeTime}
                    onChange={(e) => setTechCustomFreeTime(e.target.value)}
                    placeholder="Autre loisir particulier (Ex: modérer des serveurs Discord, e-sport...)"
                    className="w-full rounded-xl border border-slate-205 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
                    id="tech-custom-freetime"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PATH B: FROM NON-TECH BACKGROUND ==================== */}
        {!isTech && (
          <div className="space-y-6 pt-2 border-t border-slate-100 animate-fade-in" id="path-nontech-wrapper">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1.5 font-sans">
                Quel est votre parcours ou métier actuel (hors-tech) ? *
              </label>
              <input
                type="text"
                value={nonTechBackground}
                onChange={(e) => setNonTechBackground(e.target.value)}
                placeholder="Ex: Comptable, Enseignant d'Anglais, Vendeur en boutique, Électricien, etc."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
                id="nontech-background"
              />
            </div>

            {/* Has favorite job/profession in head */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-2 font-sans">
                Avez-vous déjà un métier coup de cœur ou d'intérêt en tête dans le numérique ? *
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNonTechHasFavorite(true)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    nonTechHasFavorite 
                      ? 'bg-gehmit-green border-gehmit-green text-white' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-150'
                  }`}
                  id="nontech-has-fav-yes"
                >
                  Oui, j'en ai un
                </button>
                <button
                  type="button"
                  onClick={() => setNonTechHasFavorite(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    !nonTechHasFavorite 
                      ? 'bg-gehmit-green border-gehmit-green text-white' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-150'
                  }`}
                  id="nontech-has-fav-no"
                >
                  Non, proposez-moi
                </button>
              </div>
            </div>

            {/* If has favorite */}
            {nonTechHasFavorite && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1.5 font-sans">
                  Quel est ce métier ou domaine digital favori ? *
                </label>
                <input
                  type="text"
                  value={nonTechFavoriteJob}
                  onChange={(e) => setNonTechFavoriteJob(e.target.value)}
                  placeholder="Ex: Rédacteur SEO/Web, Graphiste UI, Gestionnaire de communauté, Intégrateur No-code..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
                  id="nontech-favorite-job"
                />
              </div>
            )}

            {/* Interests & Motivations (Very high weight for selection) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-1 font-sans">
                Quelles activités ou types de tâches vous motivent le plus dans la vie / le numérique ? *
              </label>
              <span className="text-[10px] text-slate-400 block mb-2 font-mono">Sélectionnez au moins une activité de prédilection</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="nontech-interests-grid">
                {[
                  { id: "visuel", label: "Créer des designs, des maquettes et du visuel (UI/UX / Graphisme)" },
                  { id: "redac", label: "Écrire des textes de blog, des revues SEO ou des publications de réseaux" },
                  { id: "gestion", label: "Organiser, coordonner des personnes, gérer le planning d'un projet" },
                  { id: "logique", label: "Résoudre des équations, des casse-têtes logiques solides" },
                  { id: "data", label: "Travailler sur Excel, analyser des données ou des statistiques chiffrées" },
                  { id: "humain", label: "Résoudre les blocages des clients, discuter, faire du support" },
                  { id: "materiel", label: "Manipuler du matériel, configurer des équipements, réparer des appareils physiques (Hardware)" }
                ].map((interest) => {
                  const checked = nonTechSelectedInterests.includes(interest.label);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => handleToggleNonTechInterest(interest.label)}
                      className={`p-3 text-xs text-left rounded-xl border flex items-center justify-between transition-all duration-150 cursor-pointer ${
                        checked 
                          ? 'border-gehmit-green bg-gehmit-green-light/30 text-slate-900 font-semibold shadow-xs' 
                          : 'border-slate-100 bg-slate-50 text-slate-755 hover:border-slate-200'
                      }`}
                    >
                      <span className="leading-snug">{interest.label}</span>
                      {checked && <ShieldCheck className="w-4 h-4 text-gehmit-green shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Non-tech Free time tags */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-sans">
                Quelles activités ou hobbys meublent votre temps libre hors boulot ?
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {[
                  { label: "🤝 Volontariat / Association", val: "Coordonner ou aider des projets sociaux" },
                  { label: "🎨 Dessiner / Retouches", val: "Faire de la création graphique" },
                  { label: "📈 Suivre les business en ligne", val: "S'intéresser à l'e-commerce / import-export" },
                  { label: "📱 Animer les réseaux", val: "Faire des posts TikTok, modérer Facebook/WhatsApp" },
                  { label: "💡 Bricoler à la maison", val: "Réparer des appareils ménagers ou ampoules" }
                ].map((pill) => {
                  const selected = nonTechSelectedFreeTimeTags.includes(pill.val);
                  return (
                    <button
                      key={pill.label}
                      type="button"
                      onClick={() => {
                        setNonTechSelectedFreeTimeTags(prev => 
                          prev.includes(pill.val) 
                            ? prev.filter(t => t !== pill.val) 
                            : [...prev, pill.val]
                        );
                      }}
                      className={`px-2.5 py-1.5 rounded-full text-[11px] transition-all border cursor-pointer ${
                        selected 
                          ? 'bg-gehmit-green border-gehmit-green text-white font-semibold' 
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={nonTechCustomFreeTime}
                onChange={(e) => setNonTechCustomFreeTime(e.target.value)}
                placeholder="Rédigez d'autres centres d'intérêt libres..."
                className="w-full rounded-xl border border-slate-205 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
                id="nontech-custom-freetime"
              />
            </div>
          </div>
        )}

        {/* Cible géographique */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 font-sans">
            Cible géographique de votre future carrière numérique
          </label>
          <div className="grid grid-cols-3 gap-3" id="reconversion-focus-grid">
            <button
              type="button"
              onClick={() => setContinentFocus('local')}
              className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all text-xs cursor-pointer ${
                continentFocus === 'local'
                  ? 'border-gehmit-green bg-gehmit-green-light/40 text-slate-900 font-semibold'
                  : 'border-slate-100 bg-slate-50 text-slate-605 hover:border-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Marché Local
            </button>

            <button
              type="button"
              onClick={() => setContinentFocus('international')}
              className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all text-xs cursor-pointer ${
                continentFocus === 'international'
                  ? 'border-gehmit-green bg-gehmit-green-light/40 text-slate-900 font-semibold'
                  : 'border-slate-100 bg-slate-50 text-slate-605 hover:border-slate-200'
              }`}
            >
              <Globe className="w-4 h-4" />
              Remote / Global
            </button>

            <button
              type="button"
              onClick={() => setContinentFocus('both')}
              className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all text-xs cursor-pointer ${
                continentFocus === 'both'
                  ? 'border-gehmit-green bg-gehmit-green-light/40 text-slate-900 font-semibold'
                  : 'border-slate-100 bg-slate-50 text-slate-605 hover:border-slate-200'
              }`}
            >
              <div className="flex gap-0.5">
                <Building2 className="w-3.5 h-3.5" />
                <Globe className="w-3.5 h-3.5" />
              </div>
              Les Deux
            </button>
          </div>
        </div>

        {/* Submission Panel */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          {!isValid && (
            <div className="bg-gehmit-green-light/30 border border-gehmit-green-light rounded-xl p-4 text-xs text-gehmit-green-dark font-sans leading-relaxed shadow-xs">
              <div className="font-extrabold flex items-center gap-1.5 text-gehmit-green mb-1.5 uppercase tracking-wider text-[11px] font-mono">
                ⚠️ Remplissage Obligatoire (*) Requis
              </div>
              <p className="mb-2 font-medium font-sans">Veuillez compléter les rubriques obligatoires de votre profil de reconversion :</p>
              <ul className="list-disc pl-5 space-y-1 font-bold text-gehmit-green-dark text-[11px]">
                {missingFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className={`flex items-center gap-2 px-6 py-3 font-extrabold rounded-xl transition-all text-sm shadow-md active:scale-95 duration-150 ${
                isValid && !isLoading
                  ? 'bg-gehmit-green text-white cursor-pointer hover:bg-gehmit-green-hover' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
              }`}
              id="reconversion-submit-btn"
            >
              {isLoading ? "Consultation IA en cours..." : "Recommander ma Spécialisation Reconversion"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

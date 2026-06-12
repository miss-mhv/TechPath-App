/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentInput } from '../types';
import { IT_STUDENT_LEVELS, PROGRAMMING_LANGUAGES, CAREER_DOMAINS, AFRICAN_COUNTRIES } from '../constants';
import { GraduationCap, ArrowRight, ShieldCheck, Globe, Building2, Terminal, Hammer } from 'lucide-react';

interface StudentSpecializationProps {
  onSubmit: (input: StudentInput) => void;
  isLoading: boolean;
}

export default function StudentSpecialization({ onSubmit, isLoading }: StudentSpecializationProps) {
  const [level, setLevel] = useState<string>(IT_STUDENT_LEVELS[0]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languageLevels, setLanguageLevels] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string>('');
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [continentFocus, setContinentFocus] = useState<'local' | 'international' | 'both'>('both');
  const [country, setCountry] = useState<string>('Côte d\'Ivoire');

  // New fields
  const [hardwareIotAspect, setHardwareIotAspect] = useState<string>("Surtout Logiciel (Aucun intérêt particulier pour le physique)");
  const [selectedFreeTimeTags, setSelectedFreeTimeTags] = useState<string[]>([]);
  const [customFreeTimeActivities, setCustomFreeTimeActivities] = useState<string>('');

  const handleToggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
      if (!languageLevels[lang]) {
        setLanguageLevels(prev => ({ ...prev, [lang]: 3 }));
      }
    }
  };

  const handleToggleCareer = (careerId: string) => {
    if (selectedCareers.includes(careerId)) {
      setSelectedCareers(selectedCareers.filter(c => c !== careerId));
    } else {
      setSelectedCareers([...selectedCareers, careerId]);
    }
  };

  // Requirement: Disable button if any of these are not filled:
  // 1. Technologies or Languages (selectedLanguages.length > 0)
  // 2. Favorite courses (favorites.trim().length > 0)
  // 3. Domains of interest (selectedCareers.length > 0)
  const isValid = selectedLanguages.length > 0 && favorites.trim().length > 0 && selectedCareers.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Aggregate languages with mastery levels
    const languagesWithLevels = selectedLanguages.map(lang => {
      const lvl = languageLevels[lang] || 3;
      return `${lang} (Niveau: ${lvl}/5)`;
    });

    // Aggregate free time activities (joined tags + custom text)
    const joinedTags = selectedFreeTimeTags.join(", ");
    let finalFreeTime = joinedTags;
    if (customFreeTimeActivities.trim().length > 0) {
      finalFreeTime = finalFreeTime 
        ? `${finalFreeTime}. De plus : ${customFreeTimeActivities.trim()}` 
        : customFreeTimeActivities.trim();
    }
    if (!finalFreeTime) {
      finalFreeTime = "Aucune activité spécifiée particulièrement lors des heures libres.";
    }

    onSubmit({
      level,
      knownLanguages: languagesWithLevels,
      favorites,
      preferredCareers: selectedCareers,
      continentFocus,
      country,
      hardwareIotAspect,
      freeTimeActivities: finalFreeTime
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 max-w-2xl mx-auto" id="student-specialization-form">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gehmit-green-light text-gehmit-green-dark rounded-xl">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">Spécialisation d'Études Supérieures</h2>
          <p className="text-xs text-gehmit-green font-mono tracking-wider uppercase font-bold">Profil Universitaire / Technicien • Gehmit TechPath</p>
        </div>
      </div>

      <p className="text-sm text-slate-650 mb-6 leading-relaxed">
        Vous étudiez déjà l'informatique ? Définissons ensemble votre spécialisation stratégique en conciliant vos passions logiques ou matérielles, les besoins des recruteurs locaux de votre pays et le marché du remote.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Country & Academic Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
              Votre Pays d'Étude *
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
              id="student-country"
            >
              {AFRICAN_COUNTRIES.map((cnt) => (
                <option key={cnt} value={cnt}>
                  {cnt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
              Niveau Académique Actuel *
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
              id="student-level"
            >
              {IT_STUDENT_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Programming languages known */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
            Technologies ou Langages déjà abordés *
          </label>
          <span className="text-[10px] text-slate-400 block mb-3 font-mono">Sélectionnez les technologies apprises et indiquez votre degré de maîtrise de 1 (Débutant) à 5 (Expert) :</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" id="languages-grid">
            {PROGRAMMING_LANGUAGES.map((lang) => {
              const checked = selectedLanguages.includes(lang);
              const lvl = languageLevels[lang] || 3;
              return (
                <div
                  key={lang}
                  className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                    checked 
                      ? 'border-gehmit-green bg-gehmit-green-light/20 ring-1 ring-gehmit-green/10 shadow-xs' 
                      : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200'
                  }`}
                  id={`lang-box-${lang.replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleLanguage(lang)}
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
                  </div>

                  {checked && (
                    <div className="mt-3 pt-2 w-full border-t border-gehmit-green-light/50 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-slate-550 uppercase font-mono tracking-wider">Maîtrise :</span>
                        <span className="font-extrabold text-gehmit-green-dark bg-gehmit-green-light/70 px-1.5 py-0.5 rounded-md font-mono">
                          {lvl}/5 ({
                            lvl === 1 ? "Débutant" :
                            lvl === 2 ? "Basse" :
                            lvl === 3 ? "Intermédiaire" :
                            lvl === 4 ? "Avancée" : "Expert"
                          })
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">1</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={lvl}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setLanguageLevels(prev => ({ ...prev, [lang]: val }));
                          }}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gehmit-green"
                        />
                        <span className="text-[10px] font-bold text-slate-400 font-mono">5</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Favorite subjects */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
            Quels cours ou projets avez-vous préférés jusqu'à présent ? *
          </label>
          <input
            type="text"
            value={favorites}
            onChange={(e) => setFavorites(e.target.value)}
            placeholder="Ex: Le cours d'algorithmique, concevoir le MCD de BD, coder une petite calculette..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light font-medium"
            id="student-favorites"
          />
        </div>

        {/* Career Interests */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-sans">
            Quels domaines vous attirent intuitivement ? (Sélectionnez plusieurs si besoin) *
          </label>
          <span className="text-[10px] text-slate-400 block mb-2 font-mono">Cochez au moins une thématique de prédilection</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="careers-grid">
            {CAREER_DOMAINS.map((domain) => {
              const checked = selectedCareers.includes(domain.id);
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => handleToggleCareer(domain.id)}
                  className={`p-3 text-xs text-left rounded-xl border flex items-center justify-between transition-all duration-150 cursor-pointer ${
                    checked 
                      ? 'border-gehmit-green bg-gehmit-green-light text-gehmit-green-dark font-semibold' 
                      : 'border-slate-100 bg-slate-50 text-slate-750 hover:border-slate-200'
                  }`}
                  id={`career-btn-${domain.id}`}
                >
                  <span>{domain.name}</span>
                  {checked && <ShieldCheck className="w-4 h-4 text-gehmit-green shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* PRENDRE EN COMPTE L'ASPECT MAINTENANCE, HARDWARE, IOT */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-sans">
            Intérêt pour le Matériel (Hardware), la Maintenance et l'IoT / Systèmes Embarqués
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="hardware-iot-options">
            {[
              { id: "soft", label: "Surtout Logiciel (Aucun intérêt particulier pour le physique)", sub: "Je préfère coder du virtuel pur" },
              { id: "maint", label: "Maintenance & Réseaux Physiques", sub: "Assemblage de PC, réparation, diagnostic de pannes électroniques" },
              { id: "iot", label: "IoT, Domotique & Électronique", sub: "Cartes Arduino, Raspberry Pi, capteurs intelligents, automatisation" },
              { id: "both", label: "Hardware & IoT global (Maintenance + IoT)", sub: "Réparer ET créer / programmer des systèmes physiques" }
            ].map((opt) => {
              const active = hardwareIotAspect === opt.label;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setHardwareIotAspect(opt.label)}
                  className={`p-3 text-left rounded-xl border flex flex-col transition-all duration-150 cursor-pointer ${
                    active 
                      ? 'border-gehmit-green bg-gehmit-green-light text-slate-900 font-semibold shadow-xs' 
                      : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200'
                  }`}
                  id={`hw-option-${opt.id}`}
                >
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    {opt.id !== "soft" ? <Hammer className="w-3.5 h-3.5 text-gehmit-green" /> : <Terminal className="w-3.5 h-3.5 text-slate-500" />}
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 leading-tight font-medium">{opt.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* COLLECTE DES HEURES LIBRES (INFLUENCE CONSTRUCTIVE SUR L'ORIENTATION) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-sans">
            Que préférez-vous faire en général pendant vos heures libres ?
          </label>
          <p className="text-[10px] text-slate-400 mb-2">Pills interactives pour peaufiner automatiquement l'orientation (Sélectionnez plusieurs) :</p>
          <div className="flex flex-wrap gap-1.5 mb-2.5" id="free-time-pills">
            {[
              { label: "🧠 Résoudre des énigmes logiques", val: "Résoudre des énigmes ou faire de l'algorithmique" },
              { label: "💻 Coder / Tester des scripts", val: "Écrire ou modifier du code / bidouiller des scripts" },
              { label: "🔧 Démonter des appareils", val: "Démonter, bricoler ou réparer des objets physiques" },
              { label: "📺 Regarder des tutos YouTube", val: "Regarder des documentaires technologiques ou tutoriels" },
              { label: "🎮 Jeux Vidéo / Gaming", val: "Jouer ou s'intéresser au game design et e-sport" },
              { label: "📈 Suivre les startups tech", val: "M'intéresser aux opportunités d'affaires / e-commerce" },
              { label: "🎨 Design / Retouches", val: "Faire de la création visuelle ou dessiner" }
            ].map((pill) => {
              const selected = selectedFreeTimeTags.includes(pill.val);
              return (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => {
                    setSelectedFreeTimeTags(prev => 
                      prev.includes(pill.val) 
                        ? prev.filter(t => t !== pill.val) 
                        : [...prev, pill.val]
                    );
                  }}
                  className={`px-2.5 py-1.5 rounded-full text-[11px] transition-all border shrink-0 cursor-pointer ${
                    selected 
                      ? 'bg-gehmit-green border-gehmit-green text-white font-semibold shadow-xs' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
          <textarea
            value={customFreeTimeActivities}
            onChange={(e) => setCustomFreeTimeActivities(e.target.value)}
            placeholder="Détaillez d'autres passions de vos temps libres (ex: animation de communauté, volontariat, blog, commerce de produits physiques, etc.)..."
            rows={2}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-gehmit-green focus:bg-white outline-gehmit-green-light resize-none font-sans font-medium"
            id="student-freetime-text"
          />
        </div>

        {/* Target Market Focus */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 font-sans">
            Cible géographique de votre future carrière
          </label>
          <div className="grid grid-cols-3 gap-3" id="continent-focus-grid">
            <button
              type="button"
              onClick={() => setContinentFocus('local')}
              className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all text-xs cursor-pointer ${
                continentFocus === 'local'
                  ? 'border-gehmit-green bg-gehmit-green-light text-gehmit-green-dark font-semibold'
                  : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
              }`}
              id="focus-local-button"
            >
              <Building2 className="w-4 h-4" />
              Marché Local
            </button>

            <button
              type="button"
              onClick={() => setContinentFocus('international')}
              className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all text-xs cursor-pointer ${
                continentFocus === 'international'
                  ? 'border-gehmit-green bg-gehmit-green-light text-gehmit-green-dark font-semibold'
                  : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
              }`}
              id="focus-international-button"
            >
              <Globe className="w-4 h-4" />
              Remote / Global
            </button>

            <button
              type="button"
              onClick={() => setContinentFocus('both')}
              className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all text-xs cursor-pointer ${
                continentFocus === 'both'
                  ? 'border-gehmit-green bg-gehmit-green-light text-gehmit-green-dark font-semibold'
                  : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
              }`}
              id="focus-both-button"
            >
              <div className="flex gap-0.5">
                <Building2 className="w-3.5 h-3.5" />
                <Globe className="w-3.5 h-3.5" />
              </div>
              Les Deux Marchés
            </button>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block leading-snug font-medium">
            {continentFocus === 'local' && "Idéal pour rejoindre les agences, banques, ministères ou startups de votre pays."}
            {continentFocus === 'international' && "Recherche d'opportunités en télétravail (remote freelancing) pour des agences francophones ou mondiales."}
            {continentFocus === 'both' && "Double vision stratégique : s'insérer en local tout en se préparant au télétravail international."}
          </span>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          {!isValid && (
            <div className="bg-gehmit-green-light/30 border border-gehmit-green-light rounded-xl p-4 text-xs text-gehmit-green-dark font-sans leading-relaxed shadow-xs">
              <div className="font-extrabold flex items-center gap-1.5 text-gehmit-green mb-1.5 uppercase tracking-wider text-[11px] font-mono">
                ⚠️ Remplissage Obligatoire (*) Requis
              </div>
              <p className="mb-2 font-medium">Pour pouvoir activer le diagnostic intelligent de spécialisation, veuillez compléter les rubriques obligatoires suivantes :</p>
              <ul className="list-disc pl-5 space-y-1 font-bold text-gehmit-green-dark text-[11px]">
                {selectedLanguages.length === 0 && (
                  <li>Sélectionnez au moins une technologie ou langue déjà abordée (indiquez son niveau) (*)</li>
                )}
                {favorites.trim().length === 0 && (
                  <li>Saisissez les cours ou projets informatiques que vous avez préférés (*)</li>
                )}
                {selectedCareers.length === 0 && (
                  <li>Sélectionnez au moins une thématique de prédilection/domaine d'attraction (*)</li>
                )}
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
              id="student-submit-btn"
            >
              {isLoading ? "Consultation IA en cours..." : "Recommander mes Spécialisations"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

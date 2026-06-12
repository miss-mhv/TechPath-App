/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserType, GradeInput, StudentInput, QuizAnswer, OrientationResult } from './types';
import PupilOrientationSpace from './components/PupilOrientationSpace';
import StudentSpecialization from './components/StudentSpecialization';
import ProfessionalReconversion from './components/ProfessionalReconversion';
import AptitudeQuiz from './components/AptitudeQuiz';
import OrientationDashboard from './components/OrientationDashboard';
import GehmitLogo from './components/GehmitLogo';
import GehmitFullLogo from './components/GehmitFullLogo';
import VirtualCoach from './components/VirtualCoach';
import { 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  BookOpen, 
  FileText, 
  Globe2, 
  Wifi, 
  Lightbulb, 
  Award,
  BookMarked,
  Brain,
  HelpCircle,
  Code2,
  Facebook,
  Linkedin
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [step, setStep] = useState<'welcome' | 'form' | 'quiz' | 'dashboard'>('welcome');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<OrientationResult | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("Afrique Francophone");
  const [showGlobalCoach, setShowGlobalCoach] = useState<boolean>(false);

  // Dynamic rounding for favicon tab icon
  React.useEffect(() => {
    const img = new Image();
    img.src = '/logo_techpath_white_bg';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 128; // High quality favicon dimensions
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Safe standard clip path to create an ultra-smooth iOS-style squircle (25% corner radius)
        const radius = 32; 
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(size - radius, 0);
        ctx.quadraticCurveTo(size, 0, size, radius);
        ctx.lineTo(size, size - radius);
        ctx.quadraticCurveTo(size, size, size - radius, size);
        ctx.lineTo(radius, size);
        ctx.quadraticCurveTo(0, size, 0, size - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.clip();

        // Draw image over the clipped rounded canvas
        ctx.drawImage(img, 0, 0, size, size);

        // Update link favicon rel
        const roundedDataUrl = canvas.toDataURL('image/png');
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = roundedDataUrl;
        link.type = 'image/png';
      }
    };
  }, []);

  // Custom detailed loaders to make waiting interactive
  const [loadingStepText, setLoadingStepText] = useState<string>("Analyse du profil en cours...");

  const handleSelectProfile = (selected: UserType) => {
    setProfile(selected);
    setStep('form'); // All profiles now use highly-detailed dynamic forms to collect custom traits
  };

  const handleEvaluateGrades = async (input: GradeInput) => {
    setIsLoading(true);
    setSelectedCountry(input.country);
    setLoadingStepText("Analyse de la cohérence de vos bulletins scolaires...");
    
    // Simulate interactive analysis phase
    setTimeout(() => {
      setLoadingStepText("Évaluation des coefficients en fonction des filières technologiques régionales...");
    }, 2000);

    setTimeout(() => {
      setLoadingStepText("Détermination de votre roadmap d'apprentissage gratuite...");
    }, 4000);

    try {
      const response = await fetch('/api/orientation/evaluate-grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!response.ok) throw new Error("Erreur serveur d'orientation");
      const data = await response.json();
      setDiagnosticResult(data);
      setStep('dashboard');
    } catch (err) {
      console.error(err);
      alert("Une déconnexion temporaire a été détectée. Veuillez réessayer !");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateStudentSpecialization = async (input: StudentInput) => {
    setIsLoading(true);
    setSelectedCountry(input.country);
    setLoadingStepText("Analyse de vos connaissances technologiques actuelles...");
    
    setTimeout(() => {
      setLoadingStepText(`Recherche des opportunités d'emploi spécifiques en ${input.country}...`);
    }, 1500);

    setTimeout(() => {
      setLoadingStepText("Analyse des correspondances de remote (télétravail international)...");
    }, 3000);

    try {
      const response = await fetch('/api/orientation/evaluate-student-specialization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!response.ok) throw new Error("Erreur de spécialisation");
      const data = await response.json();
      setDiagnosticResult(data);
      setStep('dashboard');
    } catch (err) {
      console.error(err);
      alert("La session a expiré ou le serveur est momentanément indisponible.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateReconversion = async (input: any) => {
    setIsLoading(true);
    setSelectedCountry(input.country);
    setLoadingStepText("Analyse de votre parcours d'origine et stratégie de transition...");
    
    setTimeout(() => {
      setLoadingStepText(`Recherche des passerelles innovantes et niches en ${input.country}...`);
    }, 1500);

    setTimeout(() => {
      setLoadingStepText("Conception d'un plan d'apprentissage gratuit et hyper ciblé...");
    }, 3000);

    try {
      const response = await fetch('/api/orientation/evaluate-reconversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!response.ok) throw new Error("Erreur de calcul de reconversion");
      const data = await response.json();
      setDiagnosticResult(data);
      setStep('dashboard');
    } catch (err) {
      console.error(err);
      alert("La session a expiré ou le serveur de recommandation est momentanément inaccessible.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateQuiz = async (answers: QuizAnswer[], country: string, previousBackground: string) => {
    setIsLoading(true);
    setSelectedCountry(country);
    setLoadingStepText("Décryptage de vos dominances (Logique vs Design vs Management vs DevOps)...");
    
    setTimeout(() => {
      setLoadingStepText(`Mise en corrélation avec l'écosystème startup de/du ${country}...`);
    }, 2000);

    setTimeout(() => {
      setLoadingStepText("Rédaction personnalisée d'une success story de persévérance...");
    }, 4000);

    try {
      const response = await fetch('/api/orientation/evaluate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType: profile,
          country,
          answers,
          previousBackground
        })
      });
      if (!response.ok) throw new Error("Erreur d'analyse du quiz");
      const data = await response.json();
      setDiagnosticResult(data);
      setStep('dashboard');
    } catch (err) {
      console.error(err);
      alert("Connexion ralentie. Veuillez vérifier votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setProfile(null);
    setDiagnosticResult(null);
    setStep('welcome');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="app-root">

      {/* Shared Navigation Header */}
      <header className="bg-white border-b border-rose-50/10 py-4 px-6 sticky top-0 z-40 shadow-xs" id="main-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={handleReset} 
            className="flex items-center gap-3 text-left focus:outline-none group"
            id="brand-logo"
          >
            <div className="p-1.5 bg-gehmit-green-light text-gehmit-green rounded-xl transition-all shadow-xs group-hover:bg-gehmit-green-light/80 group-hover:scale-105">
              <GehmitLogo className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-md font-extrabold text-slate-900 leading-none font-sans">
                Gehmit TechPath
              </h1>
              <span className="text-[10px] text-gehmit-green font-bold font-mono tracking-widest uppercase mt-0.5 block">
                ENSEMBLE VERS L'EXCELLENCE NUMÉRIQUE
              </span>
            </div>
          </button>

          <div className="flex items-center gap-4">
            {step === 'welcome' && (
              <button
                onClick={() => setShowGlobalCoach(prev => !prev)}
                className={`flex items-center gap-2 text-xs border px-3 py-1.5 rounded-full font-bold font-mono shadow-xs transition-all ${
                  showGlobalCoach 
                    ? 'bg-gehmit-green text-white border-gehmit-green hover:bg-gehmit-green-hover' 
                    : 'bg-gehmit-green-light text-gehmit-green-dark border-gehmit-green-light hover:bg-gehmit-green-light/80'
                }`}
                id="header-advisor-btn"
              >
                <span className={`w-2 h-2 rounded-full inline-block ${showGlobalCoach ? 'bg-white' : 'bg-gehmit-green animate-ping'}`} />
                CONSEILLER GEHMIT EN LIGNE
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-10 px-4 md:px-8 max-w-7xl mx-auto w-full">
        
        {/* State 1: Welcome Screen / Profile Selection */}
        {step === 'welcome' && (
          <div className="flex flex-col xl:flex-row gap-8 items-start max-w-7xl mx-auto" id="welcome-wrapper-container">
            <div className="flex-1 space-y-12" id="welcome-screen">
              
              {/* Minimal High-Contrast Hero Layout */}
              <div className="text-center space-y-4 max-w-2xl mx-auto pt-4">
                <div className="inline-flex items-center gap-1.5 bg-gehmit-green-light px-3 py-1 rounded-full text-gehmit-green-dark text-xs font-mono font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-gehmit-green" />
                  INITIATIVE DE L'ORGANISATION GEHMIT
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight font-sans">
                  Trouvez votre chemin dans les TIC & le Numérique
                </h2>
                <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto font-sans leading-relaxed">
                  Vous êtes élève, étudiant, ou professionnel en quête de reconversion ? Notre outil d'orientation intelligent analyse vos aptitudes et trace votre feuille de route pour une carrière tech réussie.
                </p>
              </div>

              {/* Profile Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="profile-selection-grid">
                
                {/* Profile: ELEVE */}
                <button
                  onClick={() => handleSelectProfile('ELEVE')}
                  className="bg-white rounded-2xl border border-slate-200/50 p-6 text-left hover:border-gehmit-green hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between h-64 shadow-xs relative overflow-hidden"
                  id="profile-btn-eleve"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gehmit-green/20 rounded-full filter blur-[40px] opacity-15" />
                  <div className="space-y-4 relative z-10">
                    <div className="p-3 bg-gehmit-green-light text-gehmit-green rounded-xl w-fit group-hover:bg-gehmit-green-light/80 transition-colors">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-gehmit-green font-sans">
                      Élève ou Nouveau Bachelier
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Découvrez immédiatement les meilleures filières (L1-L3, BTS, DUT) proposées dans votre pays et accédez à notre Coach d'orientation IA.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gehmit-green flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    S'orienter directement
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                {/* Profile: ETUDIANT */}
                <button
                  onClick={() => handleSelectProfile('ETUDIANT')}
                  className="bg-white rounded-2xl border border-slate-200/50 p-6 text-left hover:border-gehmit-green hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between h-64 shadow-xs relative overflow-hidden"
                  id="profile-btn-etudiant"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gehmit-green/20 rounded-full filter blur-[40px] opacity-15" />
                  <div className="space-y-4 relative z-10">
                    <div className="p-3 bg-gehmit-green-light text-gehmit-green rounded-xl w-fit group-hover:bg-gehmit-green-light/80 transition-colors">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-gehmit-green font-sans">
                      Étudiant en Informatique
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Cherchez votre spécialisation technique (IA, Web, Mobile, Réseaux) en liant réalités locales ou remote.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gehmit-green flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Trouver sa spécialité
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                {/* Profile: RECONVERSION */}
                <button
                  onClick={() => handleSelectProfile('RECONVERSION')}
                  className="bg-white rounded-2xl border border-slate-200/50 p-6 text-left hover:border-gehmit-green hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between h-64 shadow-xs relative overflow-hidden"
                  id="profile-btn-reconversion"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gehmit-green/20 rounded-full filter blur-[40px] opacity-15" />
                  <div className="space-y-4 relative z-10">
                    <div className="p-3 bg-gehmit-green-light text-gehmit-green rounded-xl w-fit group-hover:bg-gehmit-green-light/80 transition-colors">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-gehmit-green font-sans">
                      Professionnel en Reconversion
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Quitter un domaine classique vers la tech d'avenir. Test d'aptitude et guide transitoire sur-mesure.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gehmit-green flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Initier sa migration
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>

              </div>

              {/* Explanatory visual boxes - Anti-AI slop (Real advice, no fluff) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 text-slate-100 p-8 rounded-2xl border border-slate-850">
                <div className="space-y-2">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-gehmit-green-vibrant font-mono">
                    Pourquoi utiliser notre plateforme ?
                  </h4>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    Bien que le secteur de l'informatique regorge d'opportunités, s'y orienter reste un défi. De nombreux talents manquent de repères sur les débouchés, doutent de leurs capacités ou tournent en rond sans avancer. Notre rôle est de clarifier votre projet professionnel et de vous propulser vers un domaine précis avec confiance.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-gehmit-green-vibrant font-mono">
                    Écoles partenaires & Communautés
                  </h4>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    Gehmit ne fait pas que conseiller : nous formons activement et collaborons main dans la main avec un réseau d'écoles qualifiantes, de tiers-lieux et de hubs locaux de formation. Nous vous guidons vers ces structures physiques de confiance pour un accompagnement optimal et de proximité.
                  </p>
                </div>
              </div>

            </div>

            {/* Persistent Global Coach Side Panel */}
            <div className={`${showGlobalCoach ? 'block animate-in fade-in slide-in-from-right duration-300' : 'hidden'} w-full xl:w-96 shrink-0 xl:sticky xl:top-24 shadow-2xl rounded-2xl h-fit`}>
              <VirtualCoach />
            </div>

          </div>
        )}

        {/* State 2: Forms Renders depending on Selected Profile */}
        {step === 'form' && (
          <div className="space-y-6 animate-fade-in" id="evaluation-view-wrapper">
            {profile === 'ELEVE' ? (
              <PupilOrientationSpace onBack={handleReset} />
            ) : (
              <>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-805 font-semibold mb-4 inline-flex items-center gap-1.5"
                >
                  ← Retour aux choix de profils
                </button>

                {profile === 'ETUDIANT' && (
                  <StudentSpecialization
                    onSubmit={handleEvaluateStudentSpecialization}
                    isLoading={isLoading}
                  />
                )}

                {profile === 'RECONVERSION' && (
                  <ProfessionalReconversion
                    onSubmit={handleEvaluateReconversion}
                    isLoading={isLoading}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* State 3: Quiz Render */}
        {step === 'quiz' && (
          <div className="space-y-6 animate-fade-in" id="quiz-view-wrapper">
            <button
              onClick={profile === 'ELEVE' ? () => setStep('form') : handleReset}
              className="text-xs text-slate-500 hover:text-slate-805 font-semibold mb-4 inline-flex items-center gap-1.5"
            >
              ← Retour en arrière
            </button>

            <AptitudeQuiz 
              userType={profile || 'RECONVERSION'}
              onComplete={handleEvaluateQuiz}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* State 4: Interactive Dashboard Display of Results */}
        {step === 'dashboard' && diagnosticResult && (
          <div className="space-y-6 animate-fade-in" id="dashboard-view-wrapper">
            <OrientationDashboard 
              result={diagnosticResult}
              userType={profile || 'RECONVERSION'}
              onReset={handleReset}
              selectedCountry={selectedCountry}
            />
          </div>
        )}

        {/* Global Loading Interactive Screen Overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center select-none" id="full-loading-overlay">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-gehmit-green/30 border-t-gehmit-green rounded-full animate-spin" />
              <GehmitLogo className="w-8 h-8 absolute inset-0 m-auto animate-pulse" color="#0E6441" />
            </div>
            
            <div className="max-w-md space-y-3">
              <h3 className="text-lg font-bold text-white font-sans animate-pulse">
                Analyse d'Orientation Stratégique...
              </h3>
              <p className="text-xs text-gehmit-green font-mono tracking-wide">
                {loadingStepText}
              </p>
              <div className="w-52 h-1 bg-slate-850 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gehmit-green animate-loading-bar" />
              </div>
              <p className="text-[10px] text-slate-400 pt-3">
                Nous comparons vos données à l'écosystème africain francophone (Abidjan, Dakar, Douala, Lomé, Cotonou) et à l'embauche globale de l'Union Européenne en remote.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Elegant Footer with Credits & Community Links */}
      <footer className="bg-slate-50/50 border-t border-slate-100 py-12 px-6 mt-20" id="main-footer">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200/60 inline-flex items-center justify-center max-w-[210px] transition-transform hover:scale-102 duration-300">
              <GehmitFullLogo height={72} color="#0E6441" />
            </div>
            
            <div className="space-y-1.5 max-w-md">
              <h4 className="font-bold text-slate-800 text-sm tracking-wide font-sans">
                Gehmit TechPath
              </h4>
              <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans">
                Une initiative de l'organisation{' '}
                <a 
                  href="https://gehmit.org" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gehmit-green hover:text-gehmit-green-hover font-semibold underline underline-offset-2 transition-colors"
                >
                  Gehmit
                </a>{' '}
                pour l'accompagnement et l'orientation des élèves, étudiants et professionnels.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-1.5 text-center lg:text-right self-center lg:self-start">
            <span className="text-[10px] text-gehmit-green font-bold font-mono tracking-widest uppercase bg-gehmit-green-light/80 px-2 py-1 rounded-md">
              Ensemble vers l'excellence numérique
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              © 2026 Gehmit. Tous droits réservés.
            </span>
            
            <div className="flex items-center gap-2 mt-1">
              <a 
                href="https://www.linkedin.com/company/79881019" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 text-slate-400 hover:text-gehmit-green hover:bg-gehmit-green-light/50 rounded-full transition-all duration-300 hover:scale-110"
                title="LinkedIn Gehmit"
                id="footer-linkedin-link"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/gehmit.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 text-slate-400 hover:text-gehmit-green hover:bg-gehmit-green-light/50 rounded-full transition-all duration-300 hover:scale-110"
                title="Facebook Gehmit"
                id="footer-facebook-link"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://x.com/Gehmit_IT" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 text-slate-400 hover:text-gehmit-green hover:bg-gehmit-green-light/50 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center"
                title="X Gehmit"
                id="footer-x-link"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

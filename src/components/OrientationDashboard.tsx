/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OrientationResult, UserType } from '../types';
import VirtualCoach from './VirtualCoach';
import GehmitLogo from './GehmitLogo';
import { jsPDF } from 'jspdf';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Heart, 
  Info, 
  Clock, 
  RotateCcw, 
  MessageSquare,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Building2,
  Globe,
  HelpCircle,
  Lightbulb,
  Download
} from 'lucide-react';

interface OrientationDashboardProps {
  result: OrientationResult;
  userType: UserType;
  onReset: () => void;
  selectedCountry?: string;
}

export default function OrientationDashboard({ result, userType, onReset, selectedCountry = "Afrique Francophone" }: OrientationDashboardProps) {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'advice' | 'coach'>('roadmap');
  const [expandedCareer, setExpandedCareer] = useState<number>(0);

  const getProfileBadgeColor = () => {
    switch(userType) {
      case 'ELEVE': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'ETUDIANT': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'RECONVERSION': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getUserTypeLabel = () => {
    switch(userType) {
      case 'ELEVE': return 'Scolaire / Bachelier';
      case 'ETUDIANT': return 'Parcours Académique Supérieur';
      case 'RECONVERSION': return 'Reconversion Professionnelle';
      default: return 'Apprentissage Autodidacte';
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let currentY = 20;

    const checkPageBreak = (heightNeeded: number) => {
      if (currentY + heightNeeded > 275) {
        doc.addPage();
        currentY = 20;
        // Gehmit Green top bar on subsequent pages to keep style
        doc.setFillColor(14, 100, 65);
        doc.rect(0, 0, 210, 5, 'F');
      }
    };

    const writeWrapped = (text: string, x: number, maxWidth: number, lineHeight: number = 4.5): void => {
      if (!text) return;
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        doc.text(line, x, currentY);
        currentY += lineHeight;
      });
    };

    // PAGE 1 HEADER BRANDING
    doc.setFillColor(14, 100, 65); // Gehmit Green
    doc.rect(0, 0, 210, 8, 'F');

    // Title / Metadata header
    doc.setTextColor(14, 100, 65); // Gehmit Green
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text("GEHMIT TECHPATH • gehmit.org", 20, currentY);
    currentY += 6;

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.text("BROCHURE STRATÉGIQUE D'ORIENTATION INFORMATIQUE", 20, currentY);
    currentY += 7;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Générée par le conseiller IA intelligent adapté à l'écosystème numérique africain", 20, currentY);
    currentY += 9;

    // Gray line divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(20, currentY, 190, currentY);
    currentY += 8;

    // User details box
    doc.setFillColor(248, 250, 252);
    doc.rect(20, currentY, 170, 22, 'F');

    doc.setTextColor(51, 65, 85);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text("Bilan Technologique Synthétique", 24, currentY + 5.5);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Profil évalué : ${getUserTypeLabel()}`, 24, currentY + 11);
    doc.text(`Pays d'étude cible : ${selectedCountry}`, 24, currentY + 16.5);

    doc.text(`Date d'export : ${new Date().toLocaleDateString('fr-FR')}`, 115, currentY + 11);
    doc.text("Hébergement : Gehmit TechPath Network", 115, currentY + 16.5);
    currentY += 28;

    // Recommendation Titling
    doc.setTextColor(14, 100, 65); // Gehmit Green
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text("1. AXE DE SPÉCIALISATION RECOMMANDÉ", 20, currentY);
    currentY += 6.5;

    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    writeWrapped(result.profileTitle, 20, 170, 5.5);
    currentY += 2;

    doc.setTextColor(71, 85, 105);
    doc.setFont('Helvetica', 'oblique');
    doc.setFontSize(9);
    writeWrapped(result.profileSummary, 20, 170, 4.5);
    currentY += 8;

    // Cartographie scores
    checkPageBreak(30);
    doc.setTextColor(14, 100, 65); // Gehmit Green
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text("2. CARTOGRAPHIE D'APTITUDES ÉVALUÉES (SCORES)", 20, currentY);
    currentY += 7;

    const colW = 78;
    const drawScore = (label: string, score: number, x: number, y: number) => {
      doc.setFillColor(241, 245, 249);
      doc.rect(x, y, colW, 11, 'F');
      
      doc.setTextColor(30, 41, 59);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(label, x + 3, y + 4.5);

      doc.setTextColor(14, 100, 65); // Gehmit Green
      doc.setFontSize(9.5);
      doc.text(`${score}%`, x + colW - 11, y + 4.5);

      doc.setFillColor(226, 232, 240);
      doc.rect(x + 3, y + 7.5, colW - 6, 1.5, 'F');
      doc.setFillColor(14, 100, 65); // Gehmit Green
      doc.rect(x + 3, y + 7.5, (colW - 6) * (score / 100), 1.5, 'F');
    };

    drawScore("Technophile / Pratique", result.aptitudeScores.technophile, 20, currentY);
    drawScore("Logique & Algorithmique", result.aptitudeScores.logique, 112, currentY);
    currentY += 13;
    checkPageBreak(15);
    drawScore("Visuel, Design & UI/UX", result.aptitudeScores.visuel, 20, currentY);
    drawScore("Humain & Gestion Agile", result.aptitudeScores.gestion, 112, currentY);
    currentY += 17;

    // Sector & Jobs Recommandation
    checkPageBreak(20);
    doc.setTextColor(14, 100, 65); // Gehmit Green
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text("3. FICHES METIERS ET DÉBOUCHÉS FINANCIERS", 20, currentY);
    currentY += 7;

    result.matchingCareers.forEach((career, idx) => {
      checkPageBreak(55);
      // Job title bounding block
      doc.setFillColor(248, 250, 252);
      doc.rect(20, currentY, 170, 7.5, 'F');
      
      doc.setTextColor(15, 23, 42);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`Métier ${idx + 1} : ${career.title} (Index d'Affinité : ${career.suitability})`, 24, currentY + 5);
      currentY += 11;

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text("Alignement logique :", 20, currentY);
      doc.setFont('Helvetica', 'normal');
      currentY += 4;
      writeWrapped(career.why, 20, 170, 4);
      currentY += 2;

      checkPageBreak(35);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Marché local ciblé (${selectedCountry}) :`, 20, currentY);
      doc.setFont('Helvetica', 'normal');
      currentY += 4;
      writeWrapped(career.localPerspective, 20, 170, 4);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Grille de Salaire local estimée : ${career.averageSalaryLocal}`, 20, currentY);
      currentY += 5.5;

      checkPageBreak(35);
      doc.setFont('Helvetica', 'bold');
      doc.text("Perspectives d'externalisation à l'International (Remote & Freelance) :", 20, currentY);
      doc.setFont('Helvetica', 'normal');
      currentY += 4;
      writeWrapped(career.internationalPerspective, 20, 170, 4);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Taux de rémunération visé (TJM / Mensuel) : ${career.averageSalaryGlobal}`, 20, currentY);
      currentY += 7.5;
    });

    // Roadmap Phases
    checkPageBreak(25);
    doc.setTextColor(14, 100, 65); // Gehmit Green
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text("4. SYLLABUS D'AUTOFORMATION STRUCTURÉ (SANS FRAIS)", 20, currentY);
    currentY += 7;

    result.learningRoadmap.forEach((step, idx) => {
      checkPageBreak(50);
      doc.setFillColor(254, 243, 199); // Light Amber
      doc.rect(20, currentY, 170, 8, 'F');

      doc.setTextColor(146, 64, 14); // Dark Amber
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`${step.phase} - Estimée : ${step.duration}`, 24, currentY + 5.5);
      currentY += 11;

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text("Savoir-faire et modules clefs :", 20, currentY);
      doc.setFont('Helvetica', 'normal');
      currentY += 4.5;
      writeWrapped(step.topics.join(" • "), 20, 170, 4);
      currentY += 2;

      checkPageBreak(25);
      doc.setFont('Helvetica', 'bold');
      doc.text("Supports d'apprentissages gratuits recommandés :", 20, currentY);
      doc.setFont('Helvetica', 'normal');
      currentY += 4.5;
      writeWrapped(step.freeResources.join(", "), 20, 170, 4);
      currentY += 2.5;

      // Calculate actionableProject lines and container box height
      const projLines = doc.splitTextToSize(step.actionableProject, 162);
      const projHeight = 7.5 + (projLines.length * 3.5) + 3.5; // Top space + text height + bottom margin
      checkPageBreak(projHeight);

      // Now draw the rect with the dynamic projHeight
      doc.setFillColor(230, 244, 236); // Gehmit Light Green (#e6f4ec)
      doc.rect(20, currentY, 170, projHeight, 'F');

      // Draw title
      doc.setTextColor(14, 100, 65); // Gehmit Green
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text("Projet concret à ajouter à votre portfolio de candidature :", 24, currentY + 5.5);
      
      // Advance currentY past the title and spacing inside the green box
      currentY += 9;

      // Draw actionableProject content
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59); // Soft slate for readable description text
      writeWrapped(step.actionableProject, 24, 162, 3.5);

      // Clear the background rectangle's bottom edge spacing
      currentY += 4.5;
    });

    // Local advice & Story
    if (userType !== 'ETUDIANT' && userType !== 'RECONVERSION') {
      checkPageBreak(30);
      doc.setTextColor(14, 100, 65); // Gehmit Green
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.text("5. LE CONSEIL DE L'ÉCOSYSTEME ET INSPIRATION", 20, currentY);
      currentY += 7;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      writeWrapped(result.localEcosystemAdvice, 20, 170, 4);
      currentY += 6;

      checkPageBreak(30);
      // Success Story Box
      doc.setFillColor(248, 250, 252);
      doc.rect(20, currentY, 170, 20, 'F');
      doc.setTextColor(120, 53, 4);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text("ÉTAPE DE RESILIENCE - HISTOIRE LOCALE :", 24, currentY + 4.5);
      doc.setFont('Helvetica', 'oblique');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      writeWrapped(`"${result.successStory}"`, 24, 162, 3.5);
    }

    // Save final trigger
    const nameSanitized = result.profileTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    doc.save(`Brochure_Orientation_Gehmit_${nameSanitized}.pdf`);
  };

  return (
    <div className="space-y-8" id="orientation-dashboard">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 rounded-2xl p-6 md:p-10 text-white relative overflow-hidden shadow-lg border border-gehmit-green/20">
        <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-gehmit-green rounded-full filter blur-[120px] opacity-25" />
        <div className="absolute bottom-0 left-10 p-4 w-40 h-40 bg-emerald-500 rounded-full filter blur-[90px] opacity-15" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold px-3 py-1 rounded-full border ${getProfileBadgeColor()}`}>
              {getUserTypeLabel()}
            </span>
            <span className="text-[11px] font-mono text-gehmit-green-vibrant bg-white/5 px-2.5 py-1 rounded-full">
              Pays sélectionné : {selectedCountry}
            </span>
          </div>

          <p className="text-xs md:text-sm text-gehmit-green-vibrant font-medium font-mono uppercase tracking-widest">
            Diagnostic & Orientation Personnalisés
          </p>
          <h1 className="text-3xl md:text-4xl font-black font-sans tracking-tight text-white leading-tight">
            Cible conseillée : <span className="text-emerald-400">{result.profileTitle}</span>
          </h1>
          <p className="text-sm md:text-base text-slate-200 max-w-4xl leading-relaxed">
            {result.profileSummary}
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={onReset}
              className="px-4.5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 active:scale-95 cursor-pointer"
              id="retake-assessment-btn"
            >
              <RotateCcw className="w-4 h-4" />
              Changer de Profil / Recommencer
            </button>

            <button
              onClick={downloadPDF}
              className="px-4.5 py-2.5 bg-gehmit-green hover:bg-gehmit-green-hover text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2.5 active:scale-95 shadow-md border border-gehmit-green hover:scale-[1.01] cursor-pointer"
              id="download-pdf-btn"
            >
              <Download className="w-4 h-4" />
              Télécharger ma Brochure d'Orientation (PDF)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Scores, Careers, and Tabs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Aptitude Scores Section */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <GehmitLogo className="w-5 h-5 shrink-0" color="#008037" />
              <h3 className="text-lg font-bold text-slate-900 font-sans">
                Cartographie de vos Forces (Aptitudes IA)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Score 1 */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 uppercase tracking-wider">Technophile / Pratique</span>
                  <span className="font-bold text-gehmit-green text-sm">{result.aptitudeScores.technophile}%</span>
                </div>
                <div className="bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gehmit-green h-full rounded-full" style={{ width: `${result.aptitudeScores.technophile}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Intérêt pour l'écriture de scripts, le codage, la technique et l'usage d'outils digitaux.</p>
              </div>

              {/* Score 2 */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 uppercase tracking-wider">Logique & Algorithmique</span>
                  <span className="font-bold text-sky-650 text-sm">{result.aptitudeScores.logique}%</span>
                </div>
                <div className="bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${result.aptitudeScores.logique}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Capacité d'analyse, résolution de bugs, mathématiques appliquées et architecture rigoureuse.</p>
              </div>

              {/* Score 3 */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 uppercase tracking-wider">Visuel, Design & UI/UX</span>
                  <span className="font-bold text-pink-650 text-sm">{result.aptitudeScores.visuel}%</span>
                </div>
                <div className="bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-pink-550 h-full rounded-full" style={{ width: `${result.aptitudeScores.visuel}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Intérêt pour l'esthétique, le frontend graphique, l'accessibilité écran et l'expérience utilisateur.</p>
              </div>

              {/* Score 4 */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 uppercase tracking-wider">Humain & Gestion Agile</span>
                  <span className="font-bold text-emerald-650 text-sm">{result.aptitudeScores.gestion}%</span>
                </div>
                <div className="bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${result.aptitudeScores.gestion}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Intérêt pour le e-commerce, l'organisation d'équipe, le contact client et la conduite du changement.</p>
              </div>
            </div>
          </div>

          {/* Careers Matching */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gehmit-green" />
                <h3 className="text-lg font-bold text-slate-900 font-sans">
                  Fiches Métiers Idéales Pour Vous
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Cliquez pour voir les détails financiers</span>
            </div>

            <div className="space-y-4" id="matching-careers-list">
              {result.matchingCareers.map((career, i) => {
                const isOpen = expandedCareer === i;
                return (
                  <div 
                    key={i} 
                    className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? 'border-gehmit-green shadow-md ring-1 ring-gehmit-green/20' 
                        : 'border-slate-100 shadow-sm hover:border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedCareer(isOpen ? -1 : i)}
                      className="w-full text-left p-5 flex items-start justify-between gap-4 focus:outline-none"
                      id={`career-toggle-${i}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-base text-slate-900 font-sans">{career.title}</h4>
                          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold font-mono">
                            {career.suitability} Affinité
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans mt-1">
                          {career.why}
                        </p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gehmit-green font-bold' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="bg-slate-50/70 border-t border-slate-100 p-5 space-y-4 animate-fade-in text-xs md:text-sm">
                        
                        {/* Two column perspectives */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100">
                            <h5 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                              <Building2 className="w-4 h-4 text-slate-500" />
                              Réalité du Marché en Local ({selectedCountry})
                            </h5>
                            <p className="text-slate-600 leading-relaxed text-xs">
                              {career.localPerspective}
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1">
                              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-semibold">Salaire local :</span>
                              <span className="font-bold text-slate-800 text-xs font-mono">{career.averageSalaryLocal}</span>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-100">
                            <h5 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                              <Globe className="w-4 h-4 text-gehmit-green" />
                              Perspectives à l'International (Remote / Freelance)
                            </h5>
                            <p className="text-slate-600 leading-relaxed text-xs">
                              {career.internationalPerspective}
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1">
                              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-semibold">Salaire remote :</span>
                              <span className="font-bold text-gehmit-green text-xs font-mono">{career.averageSalaryGlobal}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secondary content tabs (Roadmap vs Local Resources vs Story) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="dashboard-tabs-container">
            <div className="bg-slate-50 border-b border-slate-100 flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`px-5 py-4 font-bold text-xs md:text-sm border-b-2 transition-all shrink-0 font-sans flex items-center gap-2 ${
                  activeTab === 'roadmap' 
                    ? 'border-gehmit-green text-gehmit-green bg-white' 
                    : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'
                }`}
                id="tab-roadmap"
              >
                <BookOpen className="w-4 h-4" />
                Plan de Formation Personnalisé
              </button>
              
              {userType !== 'ETUDIANT' && userType !== 'RECONVERSION' && (
                <button
                  onClick={() => setActiveTab('advice')}
                  className={`px-5 py-4 font-bold text-xs md:text-sm border-b-2 transition-all shrink-0 font-sans flex items-center gap-2 ${
                    activeTab === 'advice' 
                      ? 'border-gehmit-green text-gehmit-green bg-white' 
                      : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'
                  }`}
                  id="tab-advice"
                >
                  <Lightbulb className="w-4 h-4" />
                  Conseils Pratiques locaux & Infrastructures
                </button>
              )}

              <button
                onClick={() => setActiveTab('coach')}
                className={`lg:hidden px-5 py-4 font-bold text-xs md:text-sm border-b-2 transition-all shrink-0 font-sans flex items-center gap-2 ${
                  activeTab === 'coach' 
                    ? 'border-gehmit-green text-gehmit-green bg-white' 
                    : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'
                }`}
                id="tab-coach"
              >
                <MessageSquare className="w-4 h-4" />
                TechPath coach
              </button>
            </div>

            <div className="p-6 md:p-8">
              
              {/* Content 1: Roadmap */}
              {activeTab === 'roadmap' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h4 className="text-md font-bold text-slate-900 font-sans">Le Syllabus d'Autoformation Étape par Étape</h4>
                    <span className="text-[11px] text-slate-400 font-medium">Recommandations gratuites</span>
                  </div>

                  <div className="relative border-l border-slate-100 pl-6 ml-3 space-y-8" id="roadmap-timeline">
                    {result.learningRoadmap.map((step, idx) => (
                      <div key={idx} className="relative">
                        
                        {/* Number box absolute overlay */}
                        <div className="absolute -left-[37px] top-1 w-6 h-6 bg-gehmit-green-light text-gehmit-green border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold font-mono">
                          {idx + 1}
                        </div>

                        <div className="space-y-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h5 className="font-bold text-sm md:text-base text-slate-800 font-sans">{step.phase}</h5>
                            <span className="text-xs bg-gehmit-green-light text-gehmit-green px-2.5 py-1 rounded-md font-mono font-medium flex items-center gap-1.5 self-start sm:self-auto">
                              <Clock className="w-3.5 h-3.5" />
                              {step.duration}
                            </span>
                          </div>

                          {/* Topics List */}
                          <div>
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1">Thèmes de compétences :</span>
                            <div className="flex flex-wrap gap-1.5">
                              {step.topics.map((topic, tIdx) => (
                                <span key={tIdx} className="bg-slate-50 text-slate-700 border border-slate-100 px-2 py-1 rounded text-xs font-semibold">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Free Resources List */}
                          <div className="bg-gehmit-green-light/20 p-3 rounded-xl border border-gehmit-green-light/40">
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1">Ressources en libre accès conseillées :</span>
                            <ul className="list-disc pl-4 space-y-1">
                              {step.freeResources.map((res, rIdx) => (
                                <li key={rIdx} className="text-xs text-gehmit-green-dark font-semibold font-sans">
                                  {res}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Local Portfolio Project */}
                          <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl">
                            <span className="text-[10px] font-mono font-semibold text-emerald-600 uppercase tracking-widest block mb-1">🎯 Projet clé à intégrer dans son portfolio :</span>
                            <p className="text-xs font-semibold text-emerald-900 leading-relaxed font-sans">
                              {step.actionableProject}
                            </p>
                            <span className="text-[10px] text-emerald-600 font-mono mt-1 w-full block">Projet conçu spécifiquement pour le marché pour impressionner vos recruteurs.</span>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content 2: Advice & Success Story */}
              {activeTab === 'advice' && userType !== 'ETUDIANT' && userType !== 'RECONVERSION' && (
                <div className="space-y-6">
                  <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100">
                    <h4 className="font-bold text-amber-900 mb-2 font-sans flex items-center gap-2">
                       <HelpCircle className="w-5 h-5" />
                      Conseils d'Infrastructure d'Experts locaux
                    </h4>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                      {result.localEcosystemAdvice}
                    </p>
                  </div>

                  {/* Motivational Story */}
                  <div className="bg-gradient-to-br from-gehmit-green-light/40 to-gehmit-green-light/20 rounded-xl p-6 border border-gehmit-green-light/30">
                    <span className="text-[10px] font-mono font-bold text-gehmit-green uppercase tracking-wider block mb-2 font-semibold">Histoire inspirante locale de réussite</span>
                    <h4 className="font-bold text-slate-900 mb-2 font-sans">
                      Ils ont d'abord douté, puis ont réussi !
                    </h4>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed italic animate-pulse">
                      "{result.successStory}"
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs font-semibold text-gehmit-green">Postulez vous aussi à la réussite, restez résilient !</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Content 3: Mobile assistant ONLY */}
              {activeTab === 'coach' && (
                <div className="lg:hidden space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Posez vos questions sur la formation, les PC reconditionnés pas chers ou de seconde main, ou comment négocier votre salaire.
                  </p>
                  <VirtualCoach orientationResult={result} userType={userType} />
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right 1 Column (Desktop only): Virtual Coach Panel */}
        <div className="hidden lg:block space-y-6 lg:col-span-1">
          <div className="sticky top-6">
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-sm font-sans flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-gehmit-green" />
                Des questions sur vos résultats ?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Notre intelligence artificielle spécialiste de l'écosystème africain francophone vous répond en direct ci-dessous.
              </p>
            </div>
            <VirtualCoach orientationResult={result} userType={userType} />
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { APTITUDE_QUIZ_QUESTIONS, AFRICAN_COUNTRIES } from '../constants';
import { QuizAnswer, UserType } from '../types';
import { ArrowLeft, ArrowRight, BookOpen, Compass, Award, Loader2 } from 'lucide-react';

interface AptitudeQuizProps {
  userType: UserType;
  onComplete: (answers: QuizAnswer[], country: string, previousBackground: string) => void;
  isLoading: boolean;
}

export default function AptitudeQuiz({ userType, onComplete, isLoading }: AptitudeQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [country, setCountry] = useState('Sénégal');
  const [background, setBackground] = useState('');
  const [step, setStep] = useState<'info' | 'quiz'>('info'); // Gather location & background first, then quiz

  const currentQuestion = APTITUDE_QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    const updatedAnswers = [...answers];
    const index = updatedAnswers.findIndex(ans => ans.questionId === currentQuestion.id);
    if (index !== -1) {
      updatedAnswers[index].answerValue = key;
    } else {
      updatedAnswers.push({ questionId: currentQuestion.id, answerValue: key });
    }
    setAnswers(updatedAnswers);

    // Auto-advance with a slight delay for better UX
    if (currentIdx < APTITUDE_QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < APTITUDE_QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const selectedAnswer = answers.find(ans => ans.questionId === currentQuestion?.id)?.answerValue;

  const handleSubmit = () => {
    if (answers.length < APTITUDE_QUIZ_QUESTIONS.length) {
      // Pick first unanswered index
      const unansweredIdx = APTITUDE_QUIZ_QUESTIONS.findIndex(q => !answers.some(ans => ans.questionId === q.id));
      if (unansweredIdx !== -1) {
        setCurrentIdx(unansweredIdx);
        return;
      }
    }
    onComplete(answers, country, background);
  };

  const progressPercent = Math.round((answers.length / APTITUDE_QUIZ_QUESTIONS.length) * 100);

  if (step === 'info') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 max-w-2xl mx-auto" id="quiz-info-container">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">Configuration de votre Profil</h2>
            <p className="text-xs text-slate-500 font-mono">Étape pré-requis • Orientation Afrique</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Pour vous proposer des perspectives professionnelles qui correspondent parfaitement à vos réalités, dites-nous d'où vous écrivez et quel est votre parcours actuel.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 font-sans">
              Votre Pays de Résidence
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white outline-indigo-200"
              id="country-selector"
            >
              {AFRICAN_COUNTRIES.map((cnt) => (
                <option key={cnt} value={cnt}>
                  {cnt}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Sert à calculer les opportunités d'emploi à Abidjan, Dakar, Douala, Lomé, etc.
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 font-sans">
              {userType === 'RECONVERSION' 
                ? "Quel est votre métier ou domaine professionnel actuel ?" 
                : "Quel est votre parcours d'études ou dernière classe suivie ?"}
            </label>
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder={userType === 'RECONVERSION' ? "Ex: Comptable, Enseignant, Agriculteur, Électricien" : "Ex: Terminale D, BAC Littéraire, Licence d'Histoire, Autodidacte"}
              className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white outline-indigo-200"
              id="background-input"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setStep('quiz')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-md shadow-indigo-100"
            id="start-quiz-button"
          >
            Commencer le Test d'Aptitude
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 max-w-3xl mx-auto" id="aptitude-quiz-container">
      {/* Header with progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-medium">
            Question {currentIdx + 1} sur {APTITUDE_QUIZ_QUESTIONS.length}
          </span>
          <h2 className="text-md font-semibold text-slate-800 mt-2 font-sans">
            Découverte de vos Résonances Tech ({country})
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-500 font-semibold">{progressPercent}% Complété</span>
        </div>
      </div>

      {/* Question main area */}
      <div className="mb-8">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug mb-6 font-sans">
          {currentQuestion.text}
        </h3>

        <div className="grid grid-cols-1 gap-4" id="quiz-options-grid">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option.key;
            return (
              <button
                key={option.key}
                onClick={() => handleSelectOption(option.key)}
                className={`flex items-start text-left p-4 rounded-xl border transition-all duration-200 group relative ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500' 
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }`}
                id={`option-btn-${option.key}`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold mr-4 shrink-0 mt-0.5 border ${
                  isSelected 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-slate-50 text-slate-500 border-slate-200 group-hover:bg-slate-200'
                }`}>
                  {option.key}
                </div>
                <div>
                  <h4 className={`text-sm md:text-base font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {option.text}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-500 mt-1 lines-clamp-2 md:line-clamp-none">
                    {option.subtext}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent font-medium text-sm transition-all"
          id="prev-question-button"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        {currentIdx === APTITUDE_QUIZ_QUESTIONS.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading || answers.length < APTITUDE_QUIZ_QUESTIONS.length}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-sm shadow-md shadow-emerald-100"
            id="submit-quiz-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyse IA en cours...
              </>
            ) : (
              <>
                Calculer mon orientation
                <Award className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium text-sm transition-all"
            id="next-question-button"
          >
            Suivant
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {answers.length < APTITUDE_QUIZ_QUESTIONS.length && (
        <p className="text-center text-[11px] text-amber-500 mt-4">
          * Veuillez répondre à toutes les questions pour pouvoir générer la recommandation d'orientation. ({answers.length} répondues sur {APTITUDE_QUIZ_QUESTIONS.length})
        </p>
      )}
    </div>
  );
}

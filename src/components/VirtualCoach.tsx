/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, OrientationResult } from '../types';
import { Send, Sparkles, User, RefreshCw, Loader2, HelpCircle } from 'lucide-react';
import GehmitLogo from './GehmitLogo';

interface VirtualCoachProps {
  orientationResult?: OrientationResult;
  userType?: string;
}

export default function VirtualCoach({ orientationResult, userType }: VirtualCoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const greeting = orientationResult
      ? `Bonjour ! Je suis votre Coach Spécialiste de l'écosystème Tech d'Afrique Francophone. Sur la base de votre profil de "${orientationResult.profileTitle}", je peux répondre à toutes vos interrogations :\n\n• Comment débuter sans PC puissant ?\n• Quels sont les salaires réels à Douala ou Dakar ?\n• Quelle plateforme de free-lance utiliser ?\n\nPosez-moi votre question ci-dessous !`
      : `Bonjour ! Je suis votre Coach Spécialiste de l'écosystème Tech d'Afrique Francophone (TechPath coach). Je suis là pour vous conseiller sur votre orientation et votre avenir dans le numérique :\n\n• Comment s'orienter ou se reconvertir ?\n• Quelles sont les compétences et les métiers les plus recherchés ?\n• Comment débuter sans PC puissant ?\n\nPosez-moi votre question ci-dessous !`;
    return [
      {
        role: 'model',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');

    const newMsg: ChatMessage = {
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/orientation/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newMsg].map(m => ({ role: m.role, text: m.text })),
          userProfile: {
            userType: userType || 'global',
            orientationTitle: orientationResult?.profileTitle || 'Orientation globale',
            careers: orientationResult?.matchingCareers.map(c => c.title) || []
          }
        })
      });

      if (!response.ok) {
        throw new Error("Chat server error");
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'model',
        text: data.text ? data.text.replace(/\*/g, '') : '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err) {
      console.error("Error during chatbot turn:", err);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Pardon, la connexion avec le serveur a été ralentie. Essayons de nouveau ! Pouvez-vous reposer votre question ?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden border border-slate-850" id="virtual-coach-section">
      {/* Top bar */}
      <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="p-1 bg-gehmit-green-light rounded-xl w-10 h-10 flex items-center justify-center">
              <GehmitLogo className="w-8 h-8" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 font-sans leading-none">TechPath coach</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Expert Afrique & International • En Ligne</p>
          </div>
        </div>
        <button
          onClick={() => {
            const resetText = orientationResult
              ? `Discussion réinitialisée ! Sur quel point concernant le plan de formation ou les métiers de "${orientationResult.profileTitle}" voulez-vous échanger ?`
              : `Discussion réinitialisée ! Sur quel point concernant votre orientation ou les métiers du numérique voulez-vous échanger ?`;
            setMessages([
              {
                role: 'model',
                text: resetText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-all"
          title="Réinitialiser la discussion"
          id="reset-chat-btn"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Message history */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-scroller">
        {messages.map((msg, idx) => {
          const isModel = msg.role === 'model';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
            >
              {isModel && (
                <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center border border-slate-700 shrink-0 select-none">
                  <GehmitLogo className="w-7 h-7" />
                </div>
              )}
              <div className="flex flex-col max-w-[85%]">
                <div className={`p-3 rounded-xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                  isModel 
                    ? 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-slate-750' 
                    : 'bg-indigo-600 text-white rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
                <span className={`text-[9px] text-slate-400 mt-1 block ${
                  isModel ? 'text-left' : 'text-right'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
              {!isModel && (
                <div className="w-8 h-8 rounded-lg bg-slate-755 text-slate-300 flex items-center justify-center border border-slate-700 shrink-0 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center border border-slate-750 shrink-0 select-none">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
            </div>
            <div className="p-3 bg-slate-800/80 text-xs text-slate-300 rounded-xl rounded-tl-none border border-slate-750 font-sans">
              TechPath coach réfléchit à votre situation...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggest Quick questions */}
      <div className="px-4 py-2 bg-slate-850/55 border-t border-slate-800">
        <p className="text-[10px] text-slate-400 mb-1.5 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-indigo-400" />
          Suggestion de questions pratiques :
        </p>
        <div className="flex flex-wrap gap-1.5" id="suggested-questions-list">
          <button
            onClick={() => suggestQuestion("Est-ce obligatoire d'aller à l'université pour réussir ?")}
            className="text-[10.5px] bg-slate-850 hover:bg-slate-750 text-slate-300 px-2 py-1 rounded-md border border-slate-700/40 text-left transition-all"
          >
            Diplôme obligatoire ?
          </button>
          <button
            onClick={() => suggestQuestion("Quels espaces de coworking ou fablabs gratuits me conseillez-vous ?")}
            className="text-[10.5px] bg-slate-850 hover:bg-slate-750 text-slate-300 px-2 py-1 rounded-md border border-slate-700/40 text-left transition-all"
          >
            Espaces gratuits ?
          </button>
          <button
            onClick={() => suggestQuestion("Quel type d'ordinateur d'occasion dois-je acheter pour débuter ?")}
            className="text-[10.5px] bg-slate-850 hover:bg-slate-750 text-slate-300 px-2 py-1 rounded-md border border-slate-700/40 text-left transition-all"
          >
            Choix d'ordinateur
          </button>
        </div>
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-3 bg-slate-850 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Écrivez votre question ici..."
          className="flex-1 rounded-xl bg-slate-900 border border-slate-750 p-3 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-sans"
          id="chat-input-text"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-30 disabled:hover:bg-indigo-600 active:scale-95"
          id="chat-submit-btn"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

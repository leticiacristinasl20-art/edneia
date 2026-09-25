import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { RECOMMENDED_PROMPT } from '../data/tributes';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(RECOMMENDED_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 text-red-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                Prompt de Engenharia para o Biosite
              </h3>
              <p className="text-xs text-slate-500">
                O prompt completo estruturado para inteligências artificiais do Google.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt content */}
        <div className="my-4 overflow-y-auto flex-1 pr-1 space-y-3">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <span>
              Copie este prompt detalhado para recriar, personalizar ou enviar em qualquer IA construtora de aplicações.
            </span>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs leading-relaxed font-mono whitespace-pre-wrap select-all">
            {RECOMMENDED_PROMPT}
          </pre>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-rose-100 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {copied ? 'Copiado para sua área de transferência!' : 'Pronto para copiar e usar'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:bg-rose-50"
            >
              Fechar
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-700 hover:bg-red-800 text-white font-medium text-xs shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Prompt Completo</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

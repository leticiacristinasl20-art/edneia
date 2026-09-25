import React from 'react';
import { Heart, ArrowUp, Sparkles } from 'lucide-react';

interface FooterSectionProps {
  onScrollToTop: () => void;
  onTriggerConfetti: () => void;
  onOpenPromptModal: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onScrollToTop,
  onTriggerConfetti,
  onOpenPromptModal,
}) => {
  return (
    <footer className="bg-gradient-to-b from-[#FFF5F5] to-[#FFEBEF] border-t border-rose-200/80 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8">
        
        {/* Heart Emblem */}
        <div className="flex justify-center">
          <button
            onClick={onTriggerConfetti}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-red-700 flex items-center justify-center text-white shadow-xl shadow-rose-600/30 hover:scale-110 active:scale-95 transition-all"
            title="Clique para celebrar!"
          >
            <Heart className="w-8 h-8 fill-white animate-pulse" />
          </button>
        </div>

        {/* Big emotional quote */}
        <div className="max-w-2xl mx-auto space-y-3">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-red-950">
            "Mulher virtuosa, quem a achará? O seu valor muito excede o de rubis."
          </h3>
          <p className="font-serif italic text-sm sm:text-base text-rose-800">
            Provérbios 31:10 · Homenagem com todo amor e gratidão de seus filhos Igor Henrique, Leandro, Leticia e Ivo, seus agregados Thayna e Igor Tiago, seu neto Kaique e sua irmã Renata.
          </p>
        </div>

        {/* Family Signature Tags (unboxed metadata style with typographic dots) */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-slate-700">
          <span>Igor Henrique (Marrom Bombom)</span>
          <span aria-hidden="true" className="text-rose-400">·</span>
          <span>Leandro (Amor de Filho)</span>
          <span aria-hidden="true" className="text-rose-400">·</span>
          <span>Leticia (Filha Orgulhosa)</span>
          <span aria-hidden="true" className="text-rose-400">·</span>
          <span>Ivo (Coração de Filho)</span>
          <span aria-hidden="true" className="text-rose-400">·</span>
          <span>Thayna (Norinha Preferida)</span>
          <span aria-hidden="true" className="text-rose-400">·</span>
          <span>Igor Tiago (Melhor Genro)</span>
          <span aria-hidden="true" className="text-rose-400">·</span>
          <span>Kaique (Neto Amado)</span>
          <span aria-hidden="true" className="text-rose-400">·</span>
          <span>Renata (Irmã em Cristo)</span>
        </div>

        {/* Action bar */}
        <div className="pt-6 border-t border-rose-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>Biosite comemorativo personalizado · Cores Vermelho, Branco e Rosas</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPromptModal}
              className="text-red-700 hover:text-red-900 font-semibold hover:underline"
            >
              Ver Prompt de IA
            </button>
            <button
              onClick={onScrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-200 text-slate-700 hover:text-red-700 hover:bg-rose-50 transition-colors"
            >
              <span>Voltar ao Início</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Quote, Sparkles, Check, Copy } from 'lucide-react';
import { TRIBUTES, TributeMessage } from '../data/tributes';

interface TributesCarouselProps {
  onTriggerConfetti: () => void;
}

export const TributesCarousel: React.FC<TributesCarouselProps> = ({ onTriggerConfetti }) => {
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [selectedMessage, setSelectedMessage] = useState<TributeMessage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const filterTabs = [
    { id: 'todos', label: 'Todos os Recados' },
    { id: 'filhos', label: 'Filhos (4)' },
    { id: 'nora_genro', label: 'Genro & Nora (2)' },
    { id: 'neto', label: 'Neto Kaique (1)' },
    { id: 'amiga', label: 'Amiga Renata (1)' },
  ];

  const filteredTributes = TRIBUTES.filter((item) => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'filhos') return item.tag === 'filho' || item.tag === 'filha';
    if (activeFilter === 'nora_genro') return item.tag === 'nora' || item.tag === 'genro';
    if (activeFilter === 'neto') return item.tag === 'neto';
    if (activeFilter === 'amiga') return item.tag === 'amiga';
    return true;
  });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const handleCopyMessage = (msg: TributeMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`"${msg.message}" — ${msg.author} (${msg.relation})`);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="mensagens" className="py-16 md:py-24 bg-white/70 border-b border-rose-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-700 mb-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>Carrossel de Homenagens</span>
              <span aria-hidden="true" className="text-rose-300">·</span>
              <span className="text-rose-600">Palavras do Coração</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              O Amor da Sua Família & Amigos
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              Role horizontalmente para ler os votos de cada filho, filha, genro, nora, neto e amigas queridas.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={scrollLeft}
              className="p-3 rounded-full bg-white border border-rose-200 text-rose-900 hover:bg-rose-50 shadow-sm active:scale-95 transition-all"
              aria-label="Rolar recados para a esquerda"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-3 rounded-full bg-red-700 hover:bg-red-800 text-white shadow-md shadow-red-700/20 active:scale-95 transition-all"
              aria-label="Rolar recados para a direita"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs (Interactive Segmented Control) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'bg-rose-50 text-slate-700 hover:bg-rose-100 hover:text-red-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Horizontal Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory no-scrollbar scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {filteredTributes.map((tribute) => (
            <div
              key={tribute.id}
              onClick={() => setSelectedMessage(tribute)}
              className="w-[310px] sm:w-[360px] shrink-0 snap-start bg-gradient-to-b from-[#FFFDFD] to-white rounded-3xl p-6 border border-rose-100/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative"
            >
              {/* Top Card Bar */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white shadow-sm"
                      style={{ backgroundColor: tribute.color }}
                    >
                      {tribute.avatarInitials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-red-700 transition-colors text-base">
                        {tribute.author}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-medium text-rose-700">{tribute.relation}</span>
                        <span aria-hidden="true">·</span>
                        <span>Mensagem Oficial</span>
                      </div>
                    </div>
                  </div>

                  <Quote className="w-6 h-6 text-rose-200 group-hover:text-rose-400 transition-colors shrink-0" />
                </div>

                {/* Highlight Quote */}
                {tribute.highlightPhrase && (
                  <div className="bg-rose-50/70 border-l-2 border-red-500 px-3 py-2 rounded-r-lg mb-3 text-xs font-medium text-red-900 italic">
                    "{tribute.highlightPhrase}"
                  </div>
                )}

                {/* Message Body */}
                <p className="text-sm text-slate-700 leading-relaxed line-clamp-5">
                  "{tribute.message}"
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between text-xs">
                <span className="text-rose-600 font-medium italic truncate max-w-[200px]">
                  {tribute.signOff || 'Com todo amor'}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleCopyMessage(tribute, e)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-rose-50 transition-colors"
                    title="Copiar mensagem"
                  >
                    {copiedId === tribute.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-red-700 font-semibold group-hover:underline flex items-center gap-1">
                    Ler mais
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Carousel Hint */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
          <span>Dica: Arraste para o lado ou clique nos botões para navegar entre todos os recados</span>
        </div>

      </div>

      {/* Full Message Reader Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="relative w-full max-w-lg bg-gradient-to-b from-[#FFF7F7] to-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-rose-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-base shadow-sm"
                  style={{ backgroundColor: selectedMessage.color }}
                >
                  {selectedMessage.avatarInitials}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {selectedMessage.author}
                  </h3>
                  <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">
                    {selectedMessage.relation}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-900 text-xs font-semibold hover:bg-rose-200 transition-colors"
              >
                Fechar
              </button>
            </div>

            {/* Message Full Text */}
            <div className="space-y-4 text-slate-800 text-base sm:text-lg leading-relaxed font-serif italic py-2">
              "{selectedMessage.message}"
            </div>

            {/* Sign off */}
            {selectedMessage.signOff && (
              <div className="mt-4 pt-3 text-right">
                <span className="font-script text-2xl sm:text-3xl text-red-600 block">
                  {selectedMessage.signOff}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onTriggerConfetti();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Mandar Amor ❤️</span>
              </button>

              <button
                onClick={(e) => handleCopyMessage(selectedMessage, e)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-rose-200 text-slate-700 hover:bg-rose-50 text-xs font-medium transition-colors"
              >
                {copiedId === selectedMessage.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-rose-500" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

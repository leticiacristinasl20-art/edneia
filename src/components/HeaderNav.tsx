import React from 'react';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';

interface HeaderNavProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onLaunchBalloons: () => void;
  onOpenPromptModal: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isMusicPlaying,
  onToggleMusic,
  onLaunchBalloons,
  onOpenPromptModal,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#FFF8F8]/90 backdrop-blur-md border-b border-rose-100 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-red-950 hover:text-red-700 transition-colors shrink-0"
        >
          Rainha Neia
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <a href="#mensagens" className="hover:text-red-700 transition-colors">
            Mensagens
          </a>
          <a href="#galeria" className="hover:text-red-700 transition-colors">
            Galeria & Memórias
          </a>
          <a href="#viagens" className="hover:text-red-700 transition-colors">
            Viagens & Sonhos
          </a>
          <a href="#vela" className="hover:text-red-700 transition-colors">
            Vela de Aniversário
          </a>
          <a href="#mural" className="hover:text-red-700 transition-colors">
            Mural de Recados
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Music Toggle */}
          <button
            onClick={onToggleMusic}
            title={isMusicPlaying ? 'Pausar melodia' : 'Tocar melodia suave'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isMusicPlaying
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-rose-100 text-red-900 hover:bg-rose-200'
            }`}
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Tocando</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Música</span>
              </>
            )}
          </button>

          {/* Balloons Trigger */}
          <button
            onClick={onLaunchBalloons}
            title="Soltar mais balões de festa!"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-200 text-red-800 hover:bg-rose-50 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Balões</span>
          </button>

          {/* Prompt info */}
          <button
            onClick={onOpenPromptModal}
            title="Ver o prompt do biosite para IA do Google"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-800 text-white hover:bg-red-900 text-xs font-medium transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
            <span className="whitespace-nowrap">Ver Prompt IA</span>
          </button>
        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Volume2, X } from 'lucide-react';
import { celebrationAudio } from '../utils/audio';

interface BalloonItem {
  id: number;
  left: number; // percentage
  size: number; // px
  color: string;
  delay: number; // seconds
  duration: number; // seconds
  swayOffset: number;
}

interface BalloonsOverlayProps {
  onTriggerConfetti: () => void;
  onStartMusic: () => void;
  isMusicPlaying: boolean;
}

export const BalloonsOverlay: React.FC<BalloonsOverlayProps> = ({
  onTriggerConfetti,
  onStartMusic,
  isMusicPlaying,
}) => {
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [poppedBalloons, setPoppedBalloons] = useState<Set<number>>(new Set());

  // Palette: Red, White, Pink with gold highlights
  const balloonColors = [
    'linear-gradient(135deg, #e11d48, #991b1b)', // Crimson to deep ruby
    'linear-gradient(135deg, #fb7185, #e11d48)', // Rose pink
    'linear-gradient(135deg, #fda4af, #f43f5e)', // Soft peach-pink
    'linear-gradient(135deg, #ffffff, #ffe4e6)', // Pearlescent white
    'linear-gradient(135deg, #f43f5e, #be123c)', // Vibrant ruby
    'linear-gradient(135deg, #fef08a, #f59e0b)', // Champagne gold
  ];

  const generateBalloons = () => {
    const list: BalloonItem[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      list.push({
        id: i + Date.now(),
        left: 4 + (i * 92) / count + (Math.random() * 6 - 3),
        size: Math.floor(Math.random() * 26) + 48, // 48px to 74px
        color: balloonColors[i % balloonColors.length],
        delay: Math.random() * 2.5,
        duration: Math.random() * 4 + 7, // 7s to 11s float
        swayOffset: (Math.random() - 0.5) * 40
      });
    }
    setBalloons(list);
    setPoppedBalloons(new Set());
  };

  useEffect(() => {
    generateBalloons();
    // Auto chime on load
    const timer = setTimeout(() => {
      celebrationAudio.playChime();
      onTriggerConfetti();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handlePopBalloon = (id: number) => {
    celebrationAudio.playChime();
    setPoppedBalloons((prev) => new Set(prev).add(id));
  };

  const handleOpenGiftWithMusic = () => {
    setShowWelcomeModal(false);
    onTriggerConfetti();
    onStartMusic();
  };

  const handleJustOpen = () => {
    setShowWelcomeModal(false);
    onTriggerConfetti();
    celebrationAudio.playChime();
  };

  return (
    <>
      {/* Floating balloons container */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {balloons.map((b) => {
          if (poppedBalloons.has(b.id)) return null;
          return (
            <div
              key={b.id}
              onClick={() => handlePopBalloon(b.id)}
              className="absolute pointer-events-auto cursor-pointer select-none group transition-transform hover:scale-110 active:scale-95"
              style={{
                left: `${b.left}%`,
                bottom: '-120px',
                animation: `balloonFloat ${b.duration}s ease-in infinite`,
                animationDelay: `${b.delay}s`,
              }}
              title="Toque no balão para estourar!"
            >
              {/* Balloon Body */}
              <div
                className="relative rounded-full shadow-lg group-hover:shadow-rose-400/50 transition-shadow"
                style={{
                  width: `${b.size}px`,
                  height: `${b.size * 1.25}px`,
                  background: b.color,
                  borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                  boxShadow: 'inset -6px -6px 12px rgba(0,0,0,0.18), inset 6px 6px 12px rgba(255,255,255,0.4)',
                }}
              >
                {/* Shiny highlight */}
                <div className="absolute top-2 left-2.5 w-3 h-5 bg-white/60 rounded-full blur-[1px] transform -rotate-25" />

                {/* Knot */}
                <div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 rounded-sm"
                  style={{ background: 'inherit' }}
                />
              </div>

              {/* String */}
              <div
                className="w-[1.5px] h-20 bg-stone-400/50 mx-auto origin-top"
                style={{
                  transform: `rotate(${b.swayOffset / 4}deg)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Welcome Birthday Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#FFF5F5] to-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 text-center overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-300/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-red-400/20 rounded-full blur-2xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleJustOpen}
              className="absolute top-4 right-4 p-2 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
              aria-label="Fechar mensagem inicial"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Uma Homenagem Muito Especial</span>
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-rose-950 mb-2 leading-tight">
              Feliz Aniversário, Nossa Rainha!
            </h2>
            <p className="font-script text-2xl sm:text-3xl text-red-600 mb-4">
              Vó Neia · Mãe, Sogra & Vovó Amada
            </p>

            {/* Body */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-normal">
              Hoje o dia é todo seu! Criamos este cantinho especial repleto de amor, lembranças, carinho dos seus 4 filhos, genro, nora, neto e amigos que tanto te admiram.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleOpenGiftWithMusic}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-medium text-sm shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:brightness-110 active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Abrir com Música & Balões</span>
              </button>
              <button
                onClick={handleJustOpen}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-rose-900 border border-rose-200 font-medium text-sm hover:bg-rose-50 transition-colors"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>Ver Mensagens da Família</span>
              </button>
            </div>

            {/* Footer tip */}
            <div className="mt-5 text-xs text-rose-400">
              Toque nos balões na tela para estourá-los ou role para baixo para navegar pelo carrossel!
            </div>
          </div>
        </div>
      )}
    </>
  );
};

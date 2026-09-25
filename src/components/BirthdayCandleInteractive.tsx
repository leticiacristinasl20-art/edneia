import React, { useState } from 'react';
import { Flame, Sparkles, Heart, RotateCcw } from 'lucide-react';
import { celebrationAudio } from '../utils/audio';

interface BirthdayCandleInteractiveProps {
  onTriggerConfetti: () => void;
}

export const BirthdayCandleInteractive: React.FC<BirthdayCandleInteractiveProps> = ({
  onTriggerConfetti,
}) => {
  const [isLit, setIsLit] = useState<boolean>(true);
  const [wishesCount, setWishesCount] = useState<number>(0);
  const [showBlessing, setShowBlessing] = useState<boolean>(false);

  const handleBlowCandle = () => {
    if (!isLit) return;
    setIsLit(false);
    setShowBlessing(true);
    setWishesCount((prev) => prev + 1);
    celebrationAudio.playChime();
    onTriggerConfetti();
  };

  const handleRelightCandle = () => {
    setIsLit(true);
    setShowBlessing(false);
    celebrationAudio.playChime();
  };

  return (
    <section id="vela" className="py-16 md:py-24 bg-gradient-to-b from-[#FFFDFD] to-[#FFF5F5] border-b border-rose-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-700 mb-2">
          <Flame className="w-4 h-4 text-red-600" />
          <span>Momento Interativo</span>
          <span aria-hidden="true" className="text-rose-300">·</span>
          <span className="text-rose-600">Tradição & Desejo</span>
        </div>

        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Faça um Pedido de Aniversário!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto mb-10">
          Feche os olhos, pense no seu maior sonho para este novo ano e sopre a vela para receber bênçãos sem medida!
        </p>

        {/* Cake & Candle Visual Container */}
        <div className="relative max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl border border-rose-100">
          
          {/* Candle Flame Assembly */}
          <div className="relative flex flex-col items-center mb-6">
            
            {/* The Flame */}
            <div
              onClick={handleBlowCandle}
              className={`cursor-pointer transition-all duration-500 relative flex flex-col items-center group ${
                isLit ? 'scale-100' : 'scale-50 opacity-0'
              }`}
              title="Clique para soprar a vela!"
            >
              {/* Glow backdrop */}
              <div className="absolute -inset-4 bg-amber-400/40 rounded-full blur-md animate-pulse" />
              
              {/* Flame Tear shape */}
              <div className="relative w-7 h-11 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] shadow-lg shadow-amber-400/50 transform origin-bottom animate-bounce">
                {/* Inner blue base */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full blur-[1px] opacity-80" />
              </div>
            </div>

            {/* Candle Wick */}
            <div className="w-1 h-3 bg-stone-700 rounded-t" />

            {/* Candle Body (Festive Red & White Striped) */}
            <div className="w-6 h-20 rounded-md shadow-inner relative overflow-hidden"
              style={{
                background: 'repeating-linear-gradient(45deg, #b91c1c, #b91c1c 8px, #ffffff 8px, #ffffff 16px)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
            </div>

            {/* Cake Top Base (White frosting & strawberries) */}
            <div className="w-48 sm:w-56 h-12 bg-gradient-to-r from-rose-50 via-white to-rose-50 rounded-t-2xl border-t-2 border-x-2 border-rose-200 shadow-sm mt-0 relative flex items-center justify-around px-4">
              <span className="w-3.5 h-3.5 bg-red-600 rounded-full shadow-xs" title="Morango" />
              <span className="w-3.5 h-3.5 bg-red-600 rounded-full shadow-xs" title="Morango" />
              <span className="w-3.5 h-3.5 bg-red-600 rounded-full shadow-xs" title="Morango" />
              <span className="w-3.5 h-3.5 bg-red-600 rounded-full shadow-xs" title="Morango" />
            </div>

            {/* Cake Main Body */}
            <div className="w-56 sm:w-64 h-16 bg-gradient-to-r from-red-800 via-red-700 to-red-900 rounded-b-2xl shadow-md border border-red-900 flex items-center justify-center">
              <span className="font-script text-white text-xl sm:text-2xl tracking-wide">
                Parabéns Dona Neia
              </span>
            </div>

            {/* Cake Stand Plate */}
            <div className="w-64 sm:w-72 h-3 bg-rose-200 rounded-full shadow-md mt-1 border-t border-rose-300" />
          </div>

          {/* Controls */}
          {isLit ? (
            <button
              onClick={handleBlowCandle}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-medium text-sm shadow-md shadow-rose-600/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Soprar a Vela & Fazer Pedido</span>
            </button>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950">
                <Heart className="w-6 h-6 text-red-600 fill-red-600 mx-auto mb-2 animate-bounce" />
                <h4 className="font-display text-lg font-bold text-slate-900 mb-1">
                  Pedido Enviado aos Céus! ✨
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic">
                  "Que Deus realize todos os sonhos e desejos do seu coração, conceda muita saúde, paz e que cada novo dia seja repleto do carinho dos seus 4 filhos, neto, genro, nora e amigos!"
                </p>
              </div>

              <button
                onClick={handleRelightCandle}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-300 text-slate-700 hover:bg-rose-50 text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                <span>Acender a vela novamente para outro pedido</span>
              </button>
            </div>
          )}

          {/* Total Wishes Counter */}
          {wishesCount > 0 && (
            <p className="text-xs text-slate-400 mt-4">
              {wishesCount} {wishesCount === 1 ? 'desejo feito' : 'desejos feitos'} com muito amor hoje!
            </p>
          )}

        </div>

      </div>
    </section>
  );
};

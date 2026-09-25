import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles, ChevronDown, Calendar, ShieldCheck, Camera, RefreshCw } from 'lucide-react';
import { CELEBRATION_STATS } from '../data/tributes';
import { CelebrationCountdown } from './CelebrationCountdown';

interface HeroSectionProps {
  onScrollToMessages: () => void;
  onTriggerConfetti: () => void;
}

const DEFAULT_HERO_IMAGE = '/images/hero_dona_neia_real_1790294715156.jpg';

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToMessages,
  onTriggerConfetti,
}) => {
  const [heroImage, setHeroImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('voneia_hero_photo_custom');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return DEFAULT_HERO_IMAGE;
  });

  const [isCustom, setIsCustom] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('voneia_hero_photo_custom'));
    } catch {
      return false;
    }
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleHeroPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setHeroImage(dataUrl);
          setIsCustom(true);
          try {
            localStorage.setItem('voneia_hero_photo_custom', dataUrl);
          } catch {
            // ignore
          }
          onTriggerConfetti();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetHeroPhoto = () => {
    setHeroImage(DEFAULT_HERO_IMAGE);
    setIsCustom(false);
    try {
      localStorage.removeItem('voneia_hero_photo_custom');
    } catch {
      // ignore
    }
    onTriggerConfetti();
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-rose-100/70">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial & Emotion */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Editorial Metadata / Kicker without pills */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-red-700">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>Celebração Especial de Vida</span>
              <span aria-hidden="true" className="text-rose-300">·</span>
              <span className="text-rose-600">Com Todo Amor da Família</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Parabéns, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-rose-600 to-red-800">
                  Nossa Rainha Neia!
                </span>
              </h1>
              <p className="font-script text-2xl sm:text-3xl text-rose-600">
                Uma mãe admirável, sogra querida & vovó do coração
              </p>
            </div>

            {/* Descriptive Body */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl font-normal">
              Hoje celebramos a mulher guerreira, cheia de fé, elegância e perseverança que sustenta nossa família com oração, sorrisos e abraços inesquecíveis. O seu legado de amor se reflete em cada um de nós!
            </p>

            {/* Countdown / Celebration Timer */}
            <CelebrationCountdown onTriggerConfetti={onTriggerConfetti} />

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-y border-rose-100">
              {CELEBRATION_STATS.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-display text-2xl font-bold text-red-700 tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {stat.label}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    {stat.subtext}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onScrollToMessages}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-red-700 hover:bg-red-800 text-white font-medium text-sm shadow-md shadow-red-700/20 active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Explorar Mensagens dos Filhos & Família</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <button
                onClick={onTriggerConfetti}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-red-900 font-medium text-sm transition-colors"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Jogar Chuva de Confetes</span>
              </button>
            </div>

            {/* Sweet quote tribute pill replacement */}
            <div className="flex items-center gap-3 text-xs text-slate-600 italic border-l-2 border-red-600 pl-3 py-1">
              <span>"Que vc continue sendo essa boneca preta linda... mulher guerreira, de fé e um verdadeiro testemunho."</span>
            </div>
          </div>

          {/* Right Column: Hero Portrait in Fine Frame */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Hidden file input for uploading the exact photo */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleHeroPhotoUpload}
              className="hidden"
            />

            {/* Decorative background border glow */}
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-2 bg-gradient-to-tr from-red-600 via-rose-400 to-amber-200 rounded-3xl blur-md opacity-40 animate-pulse" />

              {/* Main Photo Card */}
              <div className="relative bg-white p-3 sm:p-4 rounded-3xl shadow-xl border border-rose-100">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-rose-50 group">
                  <img
                    src={heroImage}
                    alt="Retrato da nossa homenageada Dona Neia"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle contrast gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/75 via-transparent to-transparent pointer-events-none" />

                  {/* Scrim Overlay Title */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-rose-200">
                      Nossa Homenageada
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold">
                      Dona Neia
                    </h3>
                    <p className="text-xs text-rose-100 flex items-center gap-1.5 mt-0.5">
                      <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
                      Amada por 4 filhos, genro, nora, neto e amigos
                    </p>
                  </div>

                  {/* Quick photo change button overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {isCustom && (
                      <button
                        onClick={handleResetHeroPhoto}
                        className="p-2 rounded-full bg-black/60 hover:bg-black text-white text-xs backdrop-blur-sm transition-colors"
                        title="Restaurar foto comemorativa"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-red-950 font-semibold text-xs shadow-md backdrop-blur-sm transition-all"
                      title="Escolher outra foto do celular/computador"
                    >
                      <Camera className="w-3.5 h-3.5 text-red-600" />
                      <span>{isCustom ? 'Trocar' : 'Subir Foto'}</span>
                    </button>
                  </div>
                </div>

                {/* Floating Tag 1 */}
                <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-sm border border-rose-200 shadow-md rounded-2xl px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-red-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Mulher de Oração & Fé</span>
                </div>

                {/* Floating Tag 2 */}
                <div className="absolute -bottom-3 -left-3 bg-red-700 shadow-lg shadow-red-700/30 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-xs font-medium text-white">
                  <Calendar className="w-4 h-4 text-rose-200" />
                  <span>Novo Ciclo Abençoado</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};


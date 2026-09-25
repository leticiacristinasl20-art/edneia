import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, PartyPopper, Check, Clock, Edit2 } from 'lucide-react';
import { celebrationAudio } from '../utils/audio';

interface CelebrationCountdownProps {
  onTriggerConfetti: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  hasPassed: boolean;
  totalSeconds: number;
}

export const CelebrationCountdown: React.FC<CelebrationCountdownProps> = ({ onTriggerConfetti }) => {
  // Target birthday date defaults to today or next celebration (saved in localStorage)
  const [targetDateStr, setTargetDateStr] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('voneia_birthday_target_date');
      if (saved) return saved;
    } catch {
      // ignore
    }
    // Default to current year celebration (e.g. today or next immediate family party date)
    const now = new Date();
    // Default to today at 23:59:59 or tomorrow
    const defaultDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return defaultDate.toISOString().slice(0, 16);
  });

  const [isEditingDate, setIsEditingDate] = useState<boolean>(false);
  const [customDateInput, setCustomDateInput] = useState<string>(targetDateStr);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isToday: true,
    hasPassed: false,
    totalSeconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateStr).getTime();
      const diff = target - now;

      // Check if target is today (within the same calendar day)
      const nowDate = new Date();
      const targetDateObj = new Date(targetDateStr);
      const isSameDay =
        nowDate.getFullYear() === targetDateObj.getFullYear() &&
        nowDate.getMonth() === targetDateObj.getMonth() &&
        nowDate.getDate() === targetDateObj.getDate();

      if (diff <= 0) {
        // Event has arrived or passed today
        const elapsed = Math.abs(diff);
        const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

        setTimeRemaining({
          days,
          hours,
          minutes,
          seconds,
          isToday: isSameDay,
          hasPassed: !isSameDay,
          totalSeconds: Math.floor(elapsed / 1000),
        });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining({
          days,
          hours,
          minutes,
          seconds,
          isToday: isSameDay,
          hasPassed: false,
          totalSeconds: Math.floor(diff / 1000),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDateInput) return;
    setTargetDateStr(customDateInput);
    try {
      localStorage.setItem('voneia_birthday_target_date', customDateInput);
    } catch {
      // ignore
    }
    setIsEditingDate(false);
    onTriggerConfetti();
    celebrationAudio.playChime();
  };

  const handleCelebrateClick = () => {
    onTriggerConfetti();
    celebrationAudio.playChime();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFEBEF] p-4 sm:p-5 border border-rose-200/90 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Decorative ambient glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-300/30 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar of the counter */}
      <div className="flex items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-rose-100/90">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-red-100 text-red-700">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-900 block leading-tight">
              {timeRemaining.isToday
                ? 'Hoje é o Grande Dia!'
                : timeRemaining.hasPassed
                ? 'Novo Ciclo em Festa'
                : 'Contagem Regressiva'}
            </span>
            <span className="text-[11px] text-slate-500 block">
              {timeRemaining.isToday
                ? 'Celebrando o aniversário da Vó Neia a cada segundo'
                : timeRemaining.hasPassed
                ? `Em comemoração com a família há ${timeRemaining.days} dias`
                : 'Faltam poucos instantes para a grande celebração!'}
            </span>
          </div>
        </div>

        {/* Date configuration action */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEditingDate(!isEditingDate)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-rose-100/70 transition-colors"
            title="Ajustar data ou horário do aniversário"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCelebrateClick}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-700 hover:bg-red-800 text-white text-[11px] font-semibold shadow-xs active:scale-95 transition-all"
            title="Comemorar com confetes!"
          >
            <PartyPopper className="w-3 h-3 text-amber-200" />
            <span className="hidden sm:inline">Brindar</span>
          </button>
        </div>
      </div>

      {/* Date edit form popup */}
      {isEditingDate && (
        <form
          onSubmit={handleSaveDate}
          className="mb-4 p-3 rounded-2xl bg-white border border-rose-200 shadow-xs animate-in fade-in duration-200"
        >
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="w-full">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Data e Horário do Aniversário / Festa:
              </label>
              <input
                type="datetime-local"
                value={customDateInput}
                onChange={(e) => setCustomDateInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 bg-rose-50/40"
              />
            </div>
            <div className="flex items-center gap-1.5 w-full sm:w-auto sm:self-end mt-1 sm:mt-0">
              <button
                type="submit"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-red-700 text-white text-xs font-medium hover:bg-red-800 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingDate(false)}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:bg-rose-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Numerical Digits Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        
        {/* Days */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 text-center border border-rose-100 shadow-xs">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-red-950 tabular-nums block leading-tight">
            {String(timeRemaining.days).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-rose-700 mt-0.5 block">
            {timeRemaining.days === 1 ? 'Dia' : 'Dias'}
          </span>
        </div>

        {/* Hours */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 text-center border border-rose-100 shadow-xs">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-red-950 tabular-nums block leading-tight">
            {String(timeRemaining.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-rose-700 mt-0.5 block">
            Horas
          </span>
        </div>

        {/* Minutes */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 text-center border border-rose-100 shadow-xs">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-red-950 tabular-nums block leading-tight">
            {String(timeRemaining.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-rose-700 mt-0.5 block">
            Minutos
          </span>
        </div>

        {/* Seconds */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 text-center border border-rose-100 shadow-xs relative overflow-hidden">
          {/* Subtle pulse border on seconds */}
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-red-600 tabular-nums block leading-tight">
            {String(timeRemaining.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-rose-700 mt-0.5 block">
            Segundos
          </span>
        </div>

      </div>

      {/* Bottom celebratory note */}
      <div className="mt-3 pt-2.5 border-t border-rose-100/70 flex items-center justify-between text-[11px] text-slate-600">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>
            {timeRemaining.isToday
              ? 'Data oficial comemorada com amor e bênçãos!'
              : timeRemaining.hasPassed
              ? `Celebrando este ciclo com saúde, alegria e fé!`
              : 'Prepare o coração e as homenagens!'}
          </span>
        </span>

        <span className="font-semibold text-rose-800">
          {new Date(targetDateStr).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
          })}
        </span>
      </div>
    </div>
  );
};

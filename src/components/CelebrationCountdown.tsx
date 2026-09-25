import React, { useState, useEffect } from 'react';
import { Sparkles, PartyPopper, Check, Clock, Edit2, X, CalendarCheck } from 'lucide-react';
import { celebrationAudio } from '../utils/audio';
import { getSettingFromDB, saveSettingToDB } from '../utils/idbStorage';

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

function formatLocalDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatLocalTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseLocalDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = (timeStr || '00:00').split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export const CelebrationCountdown: React.FC<CelebrationCountdownProps> = ({ onTriggerConfetti }) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('voneia_target_date_only');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return formatLocalDate(new Date());
  });

  const [selectedTime, setSelectedTime] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('voneia_target_time_only');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '20:00';
  });

  const [isEditingDate, setIsEditingDate] = useState<boolean>(false);
  const [inputDate, setInputDate] = useState<string>(selectedDate);
  const [inputTime, setInputTime] = useState<string>(selectedTime);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<boolean>(false);

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isToday: true,
    hasPassed: false,
    totalSeconds: 0,
  });

  // Load from IndexedDB if localStorage was wiped or empty
  useEffect(() => {
    (async () => {
      const savedDate = await getSettingFromDB('voneia_target_date_only');
      const savedTime = await getSettingFromDB('voneia_target_time_only');
      if (savedDate) {
        setSelectedDate(savedDate);
        setInputDate(savedDate);
      }
      if (savedTime) {
        setSelectedTime(savedTime);
        setInputTime(savedTime);
      }
    })();
  }, []);

  // Recalculate countdown every second
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const target = parseLocalDateTime(selectedDate, selectedTime);
      const diff = target.getTime() - now.getTime();

      const isSameDay =
        now.getFullYear() === target.getFullYear() &&
        now.getMonth() === target.getMonth() &&
        now.getDate() === target.getDate();

      if (diff <= 0) {
        // Event has arrived or is ongoing
        const elapsed = Math.abs(diff);
        const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60)) / (1000 * 60));
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
  }, [selectedDate, selectedTime]);

  const handleOpenEdit = () => {
    setInputDate(selectedDate);
    setInputTime(selectedTime);
    setIsEditingDate(true);
    setSaveSuccessMessage(false);
  };

  const handleSaveDate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputDate) return;

    setSelectedDate(inputDate);
    setSelectedTime(inputTime || '00:00');

    // Save to localStorage
    try {
      localStorage.setItem('voneia_target_date_only', inputDate);
      localStorage.setItem('voneia_target_time_only', inputTime || '00:00');
    } catch {
      // ignore
    }

    // Save to IndexedDB reliably
    saveSettingToDB('voneia_target_date_only', inputDate);
    saveSettingToDB('voneia_target_time_only', inputTime || '00:00');

    setSaveSuccessMessage(true);
    onTriggerConfetti();
    celebrationAudio.playChime();

    setTimeout(() => {
      setIsEditingDate(false);
      setSaveSuccessMessage(false);
    }, 1200);
  };

  const setPresetToday = () => {
    const today = formatLocalDate(new Date());
    setInputDate(today);
    setInputTime('20:00');
  };

  const setPresetTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setInputDate(formatLocalDate(tomorrow));
    setInputTime('19:00');
  };

  const targetDateObj = parseLocalDateTime(selectedDate, selectedTime);

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
                ? `Horário marcado: ${selectedTime} · Celebrando a cada segundo`
                : timeRemaining.hasPassed
                ? `Em comemoração com a família há ${timeRemaining.days} dias`
                : 'Faltam poucos instantes para a grande celebração!'}
            </span>
          </div>
        </div>

        {/* Date configuration action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-rose-200 text-slate-700 hover:text-red-700 hover:bg-rose-50 text-xs font-semibold shadow-2xs transition-colors"
            title="Ajustar data ou horário do aniversário"
          >
            <Edit2 className="w-3.5 h-3.5 text-red-600" />
            <span>Ajustar Horário</span>
          </button>

          <button
            onClick={() => {
              onTriggerConfetti();
              celebrationAudio.playChime();
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-700 hover:bg-red-800 text-white text-[11px] font-semibold shadow-xs active:scale-95 transition-all"
            title="Comemorar com confetes!"
          >
            <PartyPopper className="w-3 h-3 text-amber-200" />
            <span className="hidden sm:inline">Brindar</span>
          </button>
        </div>
      </div>

      {/* Date edit form popup / inline panel */}
      {isEditingDate && (
        <form
          onSubmit={handleSaveDate}
          className="mb-4 p-4 rounded-2xl bg-white border-2 border-red-200 shadow-md animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-red-600" />
              Configurar Data e Horário do Aniversário:
            </span>
            <button
              type="button"
              onClick={() => setIsEditingDate(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Data da Comemoração:
              </label>
              <input
                type="date"
                required
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 bg-rose-50/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Horário da Festa / Parabéns:
              </label>
              <input
                type="time"
                required
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 bg-rose-50/40"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="text-[10px] text-slate-400">Atalhos rápidos:</span>
            <button
              type="button"
              onClick={setPresetToday}
              className="px-2 py-0.5 rounded-md bg-rose-100/70 hover:bg-rose-200 text-red-900 text-[10px] font-medium transition-colors"
            >
              Hoje às 20h
            </button>
            <button
              type="button"
              onClick={setPresetTomorrow}
              className="px-2 py-0.5 rounded-md bg-rose-100/70 hover:bg-rose-200 text-red-900 text-[10px] font-medium transition-colors"
            >
              Amanhã às 19h
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Data & Horário</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditingDate(false)}
              className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-rose-50 transition-colors"
            >
              Cancelar
            </button>

            {saveSuccessMessage && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Salvo com sucesso!
              </span>
            )}
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
              ? `Grande dia comemorado com muito carinho!`
              : timeRemaining.hasPassed
              ? `Celebrando este ciclo com saúde, alegria e fé!`
              : 'Prepare o coração e as homenagens!'}
          </span>
        </span>

        <span className="font-semibold text-rose-800">
          {targetDateObj.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
          })} às {selectedTime}
        </span>
      </div>
    </div>
  );
};

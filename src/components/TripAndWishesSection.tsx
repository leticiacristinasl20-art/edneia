import React, { useRef } from 'react';
import { Plane, Compass, MapPin, Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface TripAndWishesSectionProps {
  onTriggerConfetti: () => void;
}

export const TripAndWishesSection: React.FC<TripAndWishesSectionProps> = ({ onTriggerConfetti }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const travelCards = [
    {
      id: 'viagem-kaique',
      title: 'Viagem Especial com o Neto Kaique',
      destination: 'Destino dos Sonhos',
      quote: '"Desejo que ame essa viagem que faremos juntos. Bjo, te amo"',
      author: 'Kaique (Neto)',
      color: 'from-red-600 to-rose-700',
      badge: 'Próxima Parada'
    },
    {
      id: 'viagem-thayna',
      title: 'Aventuras com a Norinha Preferida',
      destination: 'Colecionando Memórias',
      quote: '"Que venham mais e mais viagens para vivermos juntas. Bjos da sua norinha preferida kkk"',
      author: 'Thayna (Nora)',
      color: 'from-rose-600 to-pink-700',
      badge: 'Mais Risadas Juntas'
    },
    {
      id: 'viagem-familia',
      title: 'A Grande Reunião dos 4 Filhos',
      destination: 'Onde o Amor Habita',
      quote: '"Que sua família venha ser cada dia mais uma família abençoada"',
      author: 'Igor H., Leandro, Leticia & Ivo',
      color: 'from-amber-600 to-red-700',
      badge: 'União Eterna'
    },
    {
      id: 'fe-esperanca',
      title: 'Caminho de Oração & Fé',
      destination: 'Graça Divina & Paz',
      quote: '"Que Deus continue sustentando seus passos e realizando os desejos do seu coração"',
      author: 'Renata (Irmã em Cristo)',
      color: 'from-rose-700 to-red-900',
      badge: 'Bênçãos Diárias'
    }
  ];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section id="viagens" className="py-16 md:py-24 bg-white border-b border-rose-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-700 mb-2">
              <Compass className="w-4 h-4 text-red-600" />
              <span>Sonhos, Destinos & Novos Horizontes</span>
              <span aria-hidden="true" className="text-rose-300">·</span>
              <span className="text-rose-600">Viagens Especiais</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Mala Pronta para a Felicidade!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              Entre os votos mais carinhosos, a viagem com o neto Kaique e as aventuras com a nora Thayna prometem marcar este novo ciclo!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="p-3 rounded-full bg-rose-50 text-red-900 hover:bg-rose-100 transition-colors"
              aria-label="Rolar cartões para a esquerda"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-3 rounded-full bg-red-700 text-white hover:bg-red-800 shadow-md shadow-red-700/20 transition-colors"
              aria-label="Rolar cartões para a direita"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Travel Cards Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {travelCards.map((card) => (
            <div
              key={card.id}
              className="w-[300px] sm:w-[340px] shrink-0 snap-start rounded-3xl p-6 bg-gradient-to-br text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden group cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(135deg, ${card.id === 'viagem-kaique' ? '#b91c1c, #e11d48' : card.id === 'viagem-thayna' ? '#db2777, #be123c' : card.id === 'viagem-familia' ? '#991b1b, #f59e0b' : '#881337, #e11d48'})`
              }}
              onClick={() => onTriggerConfetti()}
            >
              {/* Background flight waterlines */}
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Plane className="w-24 h-24 transform -rotate-12" />
              </div>

              {/* Top Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider mb-5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{card.badge}</span>
              </div>

              <h3 className="font-display text-xl font-bold mb-1 leading-snug">
                {card.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-rose-100 font-medium mb-4">
                <span>{card.destination}</span>
              </div>

              {/* Quote box */}
              <div className="p-3.5 rounded-2xl bg-black/15 backdrop-blur-sm border border-white/15 mb-4">
                <p className="text-xs sm:text-sm font-serif italic text-white/95 leading-relaxed">
                  {card.quote}
                </p>
                <span className="text-[11px] text-rose-200 block text-right mt-1.5 font-sans font-semibold">
                  — {card.author}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-white/90 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Pronta para embarcar!
                </span>
                <Heart className="w-4 h-4 fill-white text-white group-hover:scale-125 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { Send, Heart, MessageSquareHeart, Sparkles } from 'lucide-react';

interface GuestNote {
  id: string;
  name: string;
  relation: string;
  message: string;
  timestamp: string;
  hearts: number;
}

interface GoldenGuestbookProps {
  onTriggerConfetti: () => void;
}

export const GoldenGuestbook: React.FC<GoldenGuestbookProps> = ({ onTriggerConfetti }) => {
  const [notes, setNotes] = useState<GuestNote[]>(() => {
    try {
      const saved = localStorage.getItem('voneia_guestbook_notes');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'note-1',
        name: 'Família Reunida',
        relation: 'Seus Filhos & Netos',
        message: 'Você é a coluna da nossa casa! Te amamos infinito, Dona Neia!',
        timestamp: 'Hoje',
        hearts: 14,
      },
      {
        id: 'note-2',
        name: 'Irmãos da Fé',
        relation: 'Comunidade de Oração',
        message: 'Mulher virtuosa que inspira gerações com seu louvor e perseverança.',
        timestamp: 'Hoje',
        hearts: 9,
      }
    ];
  });

  const [authorName, setAuthorName] = useState('');
  const [relationText, setRelationText] = useState('');
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('voneia_guestbook_notes', JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !messageText.trim()) return;

    const newNote: GuestNote = {
      id: `note-${Date.now()}`,
      name: authorName.trim(),
      relation: relationText.trim() || 'Familiar / Amigo',
      message: messageText.trim(),
      timestamp: 'Agora mesmo',
      hearts: 1,
    };

    setNotes((prev) => [newNote, ...prev]);
    setAuthorName('');
    setRelationText('');
    setMessageText('');
    onTriggerConfetti();
  };

  const handleLike = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, hearts: n.hearts + 1 } : n))
    );
  };

  return (
    <section id="mural" className="py-16 md:py-24 bg-white border-b border-rose-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-700 mb-2">
            <MessageSquareHeart className="w-4 h-4 text-red-600" />
            <span>Livro de Ouro & Mural de Recados</span>
            <span aria-hidden="true" className="text-rose-300">·</span>
            <span className="text-rose-600">Amor em Dobro</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Deixe Sua Bênção para Ela
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Tem mais alguma lembrança, oração ou carinho para compartilhar? Deixe sua mensagem registrada aqui para a Vó Neia ler sempre que quiser!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#FFF5F5] to-white p-6 rounded-3xl border border-rose-200 shadow-sm">
            <h3 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Escrever Nova Mensagem</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ex: Seu nome"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parentesco ou Ligação
                </label>
                <input
                  type="text"
                  value={relationText}
                  onChange={(e) => setRelationText(e.target.value)}
                  placeholder="Ex: Filho, Sobrinha, Amigo de infância..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sua Mensagem de Parabéns
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escreva seus votos com todo o coração..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-red-700 hover:bg-red-800 text-white font-medium text-xs shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Registrar Mensagem no Mural</span>
              </button>
            </form>
          </div>

          {/* Notes List / Wall */}
          <div className="lg:col-span-7 space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-2xl bg-white border border-rose-100 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">
                      {note.name}
                    </h4>
                    <span className="text-[11px] font-medium text-rose-700">
                      {note.relation}
                    </span>
                  </div>

                  <button
                    onClick={() => handleLike(note.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-red-600 text-xs font-medium transition-colors"
                  >
                    <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                    <span>{note.hearts}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic">
                  "{note.message}"
                </p>

                <div className="mt-2 text-[10px] text-slate-400 text-right">
                  {note.timestamp}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

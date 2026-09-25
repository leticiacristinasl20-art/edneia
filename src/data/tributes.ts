export interface TributeMessage {
  id: string;
  author: string;
  relation: string;
  tag: 'filho' | 'filha' | 'nora' | 'genro' | 'neto' | 'amiga';
  avatarInitials: string;
  color: string;
  message: string;
  highlightPhrase?: string;
  signOff?: string;
}

export interface PhotoMemory {
  id: string;
  url: string;
  title: string;
  caption: string;
  tag: string;
  aspect?: 'portrait' | 'landscape' | 'square';
}

export const TRIBUTES: TributeMessage[] = [
  {
    id: 'igor-henrique',
    author: 'Igor Henrique',
    relation: 'Filho',
    tag: 'filho',
    avatarInitials: 'IH',
    color: '#b91c1c', // Ruby Red
    message:
      'Feliz aniversário mãe, meu desejo é que Deus te conceda mtos anos de vida, que Ele realize todos seus sonhos e desejos do coração, que sua família venha ser cada dia mais uma família abençoada, e que a senhora venha cada vez mais ser esse exemplo de força, esperança e mta fé, que vc continue sendo essa boneca preta linda. Bjo, do seu marrom bombom.',
    highlightPhrase: 'Exemplo de força, esperança e mta fé... boneca preta linda.',
    signOff: 'Bjo, do seu marrom bombom'
  },
  {
    id: 'leticia',
    author: 'Leticia',
    relation: 'Filha',
    tag: 'filha',
    avatarInitials: 'LE',
    color: '#e11d48', // Rose Red
    message:
      'Mãe, desejo que esse novo ciclo seja repleto de bençãos e realizações. Sou muito feliz e grata por ser sua filha, me orgulho da mulher maravilhosa e forte que é. Te desejo toda felicidade do mundo e o que eu puder fazer para realizar me esforçarei, te amo ❤️',
    highlightPhrase: 'Me orgulho da mulher maravilhosa e forte que é.',
    signOff: 'Te amo ❤️'
  },
  {
    id: 'leandro',
    author: 'Leandro',
    relation: 'Filho',
    tag: 'filho',
    avatarInitials: 'LE',
    color: '#991b1b', // Deep Crimson
    message:
      'Mãe, parabéns pelo seu dia, te desejo muita saúde e bênçãos de Deus, vc é a melhor mãe do mundo. Te amo! Beijos',
    highlightPhrase: 'Vc é a melhor mãe do mundo. Te amo!',
    signOff: 'Beijos com todo amor'
  },
  {
    id: 'ivo',
    author: 'Ivo',
    relation: 'Filho',
    tag: 'filho',
    avatarInitials: 'IV',
    color: '#c026d3', // Magenta Pink
    message:
      'Feliz aniversário mãe que Deus continue te abençoando e que Deus continua realizando todos seus sonhos, Te amo muito 🥳🥳❤️❤️',
    highlightPhrase: 'Que Deus continue realizando todos seus sonhos!',
    signOff: 'Te amo muito 🥳🥳❤️❤️'
  },
  {
    id: 'thayna',
    author: 'Thayna',
    relation: 'Nora',
    tag: 'nora',
    avatarInitials: 'TH',
    color: '#db2777', // Vibrant Pink
    message:
      'Sogra, Que esse novo ciclo seja repleto de bençãos, felicidades e mta saúde. Deus sempre cuidou da senhora em detalhes, e esse é o meu maior desejo, que Ele continue cuidando mais e mais, de todas as áreas da sua vida. Sou mto grata e feliz por fazer parte da sua família e te ter como uma mãe. Te admiro mto, obrigada por me inspirar a ser alguém melhor, e por me permitir viver tantos momentos ao seu lado, inclusive essa data tão especial. Vc é uma mulher incrível, guerreira, e uma avó maravilhosa. Amo vc, quem venham mais e mais viagens para vivermos juntas. Bjos da sua norinha preferida kkk.',
    highlightPhrase: 'Mulher incrível, guerreira, e uma avó maravilhosa. Que venham mais viagens juntas!',
    signOff: 'Bjos da sua norinha preferida kkk'
  },
  {
    id: 'igor-tiago',
    author: 'Igor Tiago',
    relation: 'Genro',
    tag: 'genro',
    avatarInitials: 'IT',
    color: '#be123c', // Wine red
    message:
      'Feliz aniversário Sogra, muitos anos de vida, sucesso, saúde, paz, alegria, dinheiro e que Deus possa conceder os seus desejos e conquistar os seus objetivos. Obrigado por me tratar tão bem e por me presentear com um dos seus melhores presentes de Deus, sua filha ❤️ Que possa aproveitar cada momento do seu dia e que possamos comemorar esta data muitas vezes. Felicidades!!🥳',
    highlightPhrase: 'Obrigado por me presentear com um dos seus melhores presentes de Deus: sua filha ❤️',
    signOff: 'Assinado: Do melhor genro que poderia ter, Igor Tiago 😂❤️'
  },
  {
    id: 'kaique',
    author: 'Kaique',
    relation: 'Neto',
    tag: 'neto',
    avatarInitials: 'KQ',
    color: '#0284c7', // Sky Blue contrast
    message:
      'Vó Neia, esse dia é mto importante para vc e para mim, feliz aniversário, Deus te abençoe. Desejo que ame essa viagem que faremos juntos. Bjo, te amo',
    highlightPhrase: 'Esse dia é mto importante para vc e para mim... Desejo que ame essa viagem que faremos juntos!',
    signOff: 'Bjo, te amo da sua vida'
  },
  {
    id: 'renata',
    author: 'Renata',
    relation: 'Amiga e Irmã em Cristo',
    tag: 'amiga',
    avatarInitials: 'RN',
    color: '#e11d48',
    message:
      'Feliz aniversário, minha amiga do ❤️ e irmã em Cristo! ❤️🙏 Você é uma mulher guerreira, de fé e um verdadeiro testemunho de força e perseverança. Que Deus continue sustentando seus passos, renovando suas forças e realizando os desejos do seu coração. Que nunca faltem motivos para sorrir e agradecer. Você é muito especial para mim! 💕🌷 Parabéns! Que Deus te abençoe hoje e sempre! 🙏🎂❤️',
    highlightPhrase: 'Mulher guerreira, de fé e um verdadeiro testemunho de força e perseverança.',
    signOff: 'Sua amiga do coração e irmã em Cristo 💕🌷'
  }
];

export const INITIAL_PHOTOS: PhotoMemory[] = [
  {
    id: 'photo-1',
    url: '/images/hero_dona_neia_real_1790294715156.jpg',
    title: 'Nossa Rainha Radiante',
    caption: 'Beleza, elegância e um sorriso que ilumina a vida de todos nós.',
    tag: 'Nossa Homenageada',
    aspect: 'portrait'
  },
  {
    id: 'photo-2',
    url: '/images/birthday_cake_roses_1790293175308.jpg',
    title: 'Comemoração dos Sonhos',
    caption: 'Mesa posta com amor, bolo especial e toda a doçura que ela merece.',
    tag: 'Festa & Brinde',
    aspect: 'square'
  },
  {
    id: 'photo-3',
    url: '/images/family_travel_memories_1790293185951.jpg',
    title: 'Viagens & Momentos Inesquecíveis',
    caption: 'Momentos únicos de viagem em família, risadas e novas memórias para colecionar.',
    tag: 'Viagem em Família',
    aspect: 'landscape'
  },
  {
    id: 'photo-4',
    url: '/images/roses_celebration_bouquet_1790293194576.jpg',
    title: 'Flores para a Mulher de Fé',
    caption: 'Rosas vermelhas e flores delicadas simbolizando o nosso amor eterno.',
    tag: 'Flores de Amor',
    aspect: 'portrait'
  }
];

export const CELEBRATION_STATS = [
  { label: 'Filhos Amados', value: '4', subtext: 'Igor H., Leandro, Ivo e Leticia' },
  { label: 'Genro & Nora', value: '2', subtext: 'Thayna & Igor Tiago' },
  { label: 'Neto do Coração', value: '1', subtext: 'Kaique (amor de vó)' },
  { label: 'Amor Incondicional', value: '100%', subtext: 'Mulher de fé e oração' }
];

export const RECOMMENDED_PROMPT = `Crie um biosite de parabéns em alta qualidade para celebrar o aniversário de uma mãe muito especial ("Vó Neia").
Ela é mãe de 3 filhos e 1 filha (Igor Henrique, Leandro, Ivo e Leticia), sogra de Thayna e Igor Tiago, avó amorosa de Kaique, e amiga/irmã em Cristo de Renata.

Requisitos Visuais e Funcionais:
1. Paleta de Cores: Vermelho rubi vibrante, branco puro e detalhes rosas/rosê gold delicados, transmitindo elegância, festa, sofisticação e afeto familiar.
2. Efeito de Abertura: Ao abrir o biosite, solte balões de festa flutuantes coloridos (vermelhos, rosas, dourados), chuva de confetes e uma mensagem interativa de "Feliz Aniversário! Toque para receber o carinho de todos nós".
3. Formato Carrossel Progressivo: Conforme o visitante desce a página (scroll vertical), apresente seções fluidas com carrosséis horizontais interativos:
   - Carrossel de Cartas e Mensagens: Cards refinados para cada pessoa da família com a mensagem na íntegra, dedicatória e assinatura carinhosa (ex: "do seu marrom bombom", "melhor genro", "norinha preferida", "vovó amada").
   - Carrossel de Fotos em Alta Resolução: Apresentações variadas (polaroids com inclinação sutil, molduras douradas, carrossel dinâmico e visualizador lightbox em tela cheia), permitindo também envio de fotos personalizadas.
   - Carrossel da Linha de Amor & Viagens: Destaque para as viagens em família, momentos inesquecíveis e orações.
4. Recursos Interativos:
   - Vela de Aniversário interativa para "soprar" ou acender a luz dos desejos.
   - Mural de recados interativo onde qualquer familiar pode deixar novos votos de parabéns.
   - Trilha sonora comemorativa suave (efeito sonoro de celebração).
5. Mensagens personalizadas inseridas na íntegra com tipografia editorial elegante (Playfair Display + Plus Jakarta Sans).`;

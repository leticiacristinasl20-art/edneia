# 🎂 Biosite Comemorativo - Parabéns Vó Neia

Biosite especial em alta qualidade criado para celebrar o aniversário da **Dona Neia (Vó Neia)** — mãe dedicada de 4 filhos, sogra exemplar e vovó amorosa.

---

## ✨ Recursos

- **Abertura Comemorativa**: Balões de festa interativos, confetes animados e melodia de parabéns.
- **Carrossel de Mensagens da Família**: Recados na íntegra de filhos (Igor Henrique, Leandro, Leticia, Ivo), nora (Thayna), genro (Igor Tiago), neto (Kaique) e amiga (Renata).
- **Contador Comemorativo / Regressivo**: Dias, horas, minutos e segundos em tempo real no topo, com data personalizável.
- **Galeria de Fotos em Alta Definição**: Apresentação polaroid e mural editorial com suporte a upload de múltiplas fotos diretamente pelo navegador.
- **Vela de Aniversário Interativa**: Bolo com vela que pode ser soprada para fazer um pedido.
- **Mural de Recados & Livro de Ouro**: Espaço para novos votos de parabéns com persistência no navegador.
- **Paleta de Cores**: Vermelho rubi, branco puro e detalhes rosas/rosê gold.

---

## 🚀 Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Abra no navegador em `http://localhost:3000`.

---

## 🌐 Como Publicar na Vercel

O projeto já inclui o arquivo `vercel.json` configurado para SPA React.

### Opção 1: Via GitHub (Recomendado)
1. Crie um repositório no seu GitHub.
2. Envie os arquivos do projeto para o repositório:
   ```bash
   git init
   git add .
   git commit -m "feat: biosite de aniversário vó neia"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```
3. Acesse [vercel.com](https://vercel.com) e faça login.
4. Clique em **"Add New..."** > **"Project"**.
5. Importe o repositório do GitHub. A Vercel detectará automaticamente o Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Clique em **"Deploy"**. Em menos de 1 minuto o site estará no ar com link público HTTPS!

### Opção 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🛠️ Scripts Disponíveis

- `npm run dev`: Inicia o servidor local de desenvolvimento.
- `npm run build`: Gera a versão de produção otimizada na pasta `dist/`.
- `npm run preview`: Visualiza o build de produção localmente.
- `npm run lint`: Valida o TypeScript e a integridade do código.

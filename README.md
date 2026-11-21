# 🥠 Biscoito Aleatório

Jogo de biscoito da sorte… ou do azar. Você pega o martelo, bate no biscoito até ele quebrar e descobre a mensagem que estava dentro: pode ser uma frase de **sorte** ou uma de **azar** (sempre na brincadeira).

Criado originalmente em 2022 em JavaScript puro e reescrito do zero em **React** na versão 2.0, com animações, efeitos sonoros e mais de mil mensagens.

## Como funciona

1. Digite seu nome para começar.
2. Bata no biscoito com o martelo: clique, toque na tela ou aperte **espaço/enter**.
3. Cada biscoito pede de 3 a 5 marteladas. A cada golpe aparecem rachaduras e farelos.
4. Ele se parte ao meio e o papelzinho abre com a mensagem:
   - **✦ Biscoito da sorte:** chuva de confete dourado e acorde que sobe;
   - **☁ Biscoito pessimista:** clima roxo, "nuvem de azar" e acorde que desce.
5. Compartilhe a frase ou pegue um novo biscoito.

## Destaques

- **1.020 mensagens** (510 de sorte e 510 de azar), sorteadas sem repetir até passar por todas
- Biscoito desenhado em SVG, com as metades se separando ao longo do vinco
- Martelo no lugar do cursor (no computador) e golpe no ponto do toque (no celular)
- Som original do biscoito quebrando + efeitos sintetizados com Web Audio
- Placar de sorte x azar, nome e preferência de som salvos no navegador
- Mobile-first e acessível por teclado; respeita "reduzir movimento"

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · Motion (animações)

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos + build de produção em `dist/` |
| `npm run preview` | Serve a build localmente |

## Estrutura

```
src/
├── components/  # Cookie, Hammer, Burst (partículas), FortuneCard, Welcome, Guide
├── data/        # frases de sorte e de azar
├── lib/         # sorteio sem repetição, sons e armazenamento local
└── App.tsx      # fluxo do jogo
```

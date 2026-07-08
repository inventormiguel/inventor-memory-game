# 🧠 Inventor Memory

**Jogar agora:** https://inventor-memory-game-production.up.railway.app

Jogo de memória de padrões: os quadrados acendem, somem, e você tem que repetir o padrão clicando. A cada fase o padrão cresce e a grade aumenta junto (3x3 até 7x7).

## Regras

- **15 segundos** pra repetir o padrão de cada fase
- Acertou tudo → 2 segundos de comemoração e já cai na próxima fase
- Clicou errado ou estourou o tempo → perde uma vidinha ❤️ e repete a fase com um padrão novo
- **3 vidinhas**; acabou → game over → coloca o nominho e entra no ranking 🏆

## Rodando

```bash
npm start
```

Abre em [http://localhost:8490](http://localhost:8490). Sem dependências — só Node.

O ranking fica em `data/scores.json` (criado automaticamente).

## Stack

- `server.cjs` — servidor HTTP em Node puro (estáticos + API do ranking)
- `public/index.html` — o jogo inteiro num arquivo só (HTML + CSS + JS, sons via WebAudio)

Feito com Claude Code 🤖

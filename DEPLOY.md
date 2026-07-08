# Publicar o Inventor Memory na Railway

O jogo é um servidor Node persistente que grava o ranking em arquivo, então precisa de um
host que rode processos de longa duração (Railway, Render, Fly). **Não roda em Vercel** sem
adaptar o ranking (serverless não tem disco permanente). A Railway roda o projeto sem nenhuma
alteração de código.

O login é feito por você (OAuth no navegador). O repo já está pronto: `railway.json` define o
start, o `PORT` é lido de variável de ambiente e o ranking vai pra um volume persistente.

## Opção A — Pelo site (mais simples, sem instalar nada)

1. Entra em https://railway.app e faz login com o GitHub.
2. **New Project → Deploy from GitHub repo → `inventormiguel/inventor-memory-game`**.
3. A Railway detecta o Node sozinho e roda `npm start`. Aguarda o primeiro deploy.
4. **Settings → Networking → Generate Domain**: gera a URL pública (tipo
   `inventor-memory-game-production.up.railway.app`).
5. **Ranking persistente** (recomendado): em **Variables**, adiciona `DATA_DIR=/data`.
   Depois **Settings → Volumes → New Volume**, mount path `/data`. Assim o ranking sobrevive
   a cada redeploy. (Sem isso o jogo funciona igual, só zera o ranking a cada deploy.)

## Opção B — Pela CLI

```bash
npm i -g @railway/cli
railway login          # abre o navegador (uma vez só)
cd ~/Documents/inventor-memory-game
railway init           # cria o projeto
railway up             # sobe o código
railway domain         # gera a URL pública
railway variables set DATA_DIR=/data   # opcional: ranking persistente (+ criar volume em /data no painel)
```

## Deploy automático

Depois de conectado ao repo, **todo `git push` na branch `main` dispara um novo deploy** —
como a gente já commita cada alteração, o jogo atualiza sozinho.

## Variáveis de ambiente

| Variável   | O que faz                                        | Padrão            |
|------------|--------------------------------------------------|-------------------|
| `PORT`     | Porta do servidor (a Railway define sozinha)     | `8490`            |
| `DATA_DIR` | Pasta onde o ranking (`scores.json`) é gravado   | `./data` no repo  |

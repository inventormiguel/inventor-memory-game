# Publicar o Inventor Memory na Railway

Toda a infraestrutura está declarada em código no [`.railway/railway.ts`](.railway/railway.ts):
serviço Node a partir do repo GitHub + **volume persistente montado em `/data`** (o ranking
nunca zera em redeploy) + variável `DATA_DIR=/data`. Nada é configurado no painel.

O jogo **não roda em Vercel** sem adaptar o ranking (serverless não tem disco permanente).

## Deploy (uma vez)

```bash
npm i -g @railway/cli
railway login                # única etapa manual: OAuth no navegador
cd ~/Documents/inventor-memory-game
railway config plan          # mostra o que vai ser criado (projeto, serviço, volume)
railway config apply         # cria tudo a partir do .railway/railway.ts
railway domain               # gera a URL pública
```

## Atualizações

O serviço fica conectado ao repo GitHub: **todo `git push` na branch `main` dispara um novo
deploy automático**. Mudanças de infra (volume, variáveis) são versionadas no
`.railway/railway.ts` e aplicadas com `railway config apply`.

## Variáveis de ambiente

| Variável                     | O que faz                                      | Padrão           |
|------------------------------|------------------------------------------------|------------------|
| `PORT`                       | Porta do servidor (a Railway define sozinha)   | `8490`           |
| `DATA_DIR`                   | Pasta onde o ranking (`scores.json`) é gravado | `./data` no repo |
| `RAILWAY_VOLUME_MOUNT_PATH`  | Fallback automático quando há volume anexado   | —                |

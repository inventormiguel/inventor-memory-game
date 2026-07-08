# Deploy do Inventor Memory na Railway

**Jogo no ar:** https://inventor-memory-game-production.up.railway.app

A infraestrutura está declarada em código no [`.railway/railway.ts`](.railway/railway.ts):
serviço Node + **volume persistente montado em `/data`** — o ranking (`scores.json`) vive no
volume e **nunca zera em redeploy** (testado: deploy novo manteve os scores). Nada foi
configurado manualmente no painel.

## Publicar uma atualização

```bash
cd ~/Documents/inventor-memory-game
railway up --detach
```

A CLI já está logada e linkada ao projeto (`inventor-memory-game`, ambiente `production`).

## Mudanças de infra (volume, variáveis, réplicas)

Edita o `.railway/railway.ts` e roda:

```bash
railway config plan    # mostra o diff
railway config apply   # aplica
```

`railway config pull --force` importa o estado real de volta pro arquivo.

## Comandos úteis

```bash
railway service status                 # status do deploy
railway service logs                   # logs do servidor
railway service files ls /data         # arquivos do volume (ranking)
railway domain                         # domínios do serviço
```

## Variáveis de ambiente

| Variável                    | O que faz                                      | Valor em produção |
|-----------------------------|------------------------------------------------|-------------------|
| `PORT`                      | Porta do servidor (a Railway define sozinha)   | automático        |
| `DATA_DIR`                  | Pasta onde o ranking é gravado                 | `/data` (volume)  |
| `RAILWAY_VOLUME_MOUNT_PATH` | Fallback automático quando há volume anexado   | `/data`           |

## Nota sobre Vercel

O jogo **não roda em Vercel** sem adaptação: o ranking usa disco persistente, e serverless
não tem isso. Na Railway roda o código exatamente como está.

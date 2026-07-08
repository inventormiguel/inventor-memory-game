import { defineRailway, github, project, service, volume } from "railway/iac";

// Infraestrutura declarada em código: serviço Node + volume persistente pro ranking.
// Aplicar com: railway config plan && railway config apply
export default defineRailway(() => {
  const rankingData = volume("ranking-data", {
    sizeMB: 512,
  });

  const game = service("inventor-memory", {
    source: github("inventormiguel/inventor-memory-game", { branch: "main" }),
    start: "npm start",
    volumeMounts: {
      "/data": rankingData,
    },
    env: {
      DATA_DIR: "/data",
    },
  });

  return project("inventor-memory-game", {
    resources: [game, rankingData],
  });
});

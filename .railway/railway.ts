import { defineRailway, preserve, project, service, volume } from "railway/iac";

export default defineRailway(() => {
  const inventorMemoryGameVolume = volume("inventor-memory-game-volume", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "sfo", sizeMB: 500 });
  const inventorMemoryGame = service("inventor-memory-game", {
    replicas: 1,
    volumeMounts: {
      "/data": inventorMemoryGameVolume,
    },
    env: {
      DATA_DIR: preserve(),
    },
  });

  return project("inventor-memory-game", {
    resources: [inventorMemoryGame, inventorMemoryGameVolume],
  });
});

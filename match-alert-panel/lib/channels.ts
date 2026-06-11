import type { ChannelConfig } from "./types";

export const channels: Record<string, ChannelConfig> = {
  live: {
    name: "live",
    description: "Partidos monitoreados en tiempo real",
    topics: ["marcador", "minuto a minuto", "posesion", "eventos"],
  },
  goals: {
    name: "goals",
    description: "Goles, anulaciones y cambios fuertes del marcador",
    topics: ["goles", "var", "marcador", "segundo tiempo"],
  },
  odds: {
    name: "odds",
    description: "Movimientos de cuota y ventanas de entrada",
    topics: ["cuotas", "mercados", "probabilidad", "valor"],
  },
  system: {
    name: "system",
    description: "Estado de integraciones y reglas automaticas",
    topics: ["api", "webhooks", "notificaciones", "latencia"],
    isWelcomeChannel: true,
  },
};

export function getWelcomeChannel(): ChannelConfig | undefined {
  return Object.values(channels).find((ch) => ch.isWelcomeChannel);
}

export function formatChannelGuide(): string {
  return Object.values(channels)
    .map(
      (ch) =>
        `#${ch.name} - ${ch.description} (topics: ${ch.topics.join(", ")})`
    )
    .join("\n");
}

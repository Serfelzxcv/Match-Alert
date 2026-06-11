import type { BotAction, ConversationMessage } from "@/lib/types";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function daysAgo(days: number, offsetHours = 0): number {
  return Date.now() - days * DAY - offsetHours * HOUR;
}

export const mockActions: BotAction[] = [
  {
    id: "match-1",
    type: "answered",
    channel: "#goals",
    user: "Regla: Gol despues del 30",
    description: "Gol de Alianza Lima al 64'. Se activo alerta para 42 usuarios.",
    metadata: { match: "Alianza Lima vs Melgar", minute: "64" },
    timestamp: daysAgo(0, 1),
  },
  {
    id: "match-2",
    type: "routed",
    channel: "#live",
    user: "Regla: Empate en vivo",
    description: "Sporting Cristal empato 1-1 y disparo 18 alertas de seguimiento.",
    metadata: { match: "Sporting Cristal vs Universitario", minute: "71" },
    timestamp: daysAgo(0, 2),
  },
  {
    id: "match-3",
    type: "surfaced",
    channel: "#odds",
    user: "Motor de cuotas",
    description: "La cuota de Melgar subio 22% tras tarjeta amarilla clave.",
    metadata: { match: "Alianza Lima vs Melgar", change: "+22%" },
    timestamp: daysAgo(0, 4),
  },
  {
    id: "match-4",
    type: "welcomed",
    channel: "#live",
    user: "API Football",
    description: "12 partidos activos conectados al feed minuto a minuto.",
    metadata: { provider: "API Football", status: "live" },
    timestamp: daysAgo(0, 5),
  },
  {
    id: "match-5",
    type: "flagged",
    channel: "#system",
    user: "Monitor de latencia",
    description: "Retraso de 3.2s en eventos de Cusco FC vs Cienciano.",
    metadata: { match: "Cusco FC vs Cienciano", latency: "3.2s" },
    timestamp: daysAgo(0, 8),
  },
  {
    id: "match-6",
    type: "answered",
    channel: "#goals",
    user: "Regla: Ambos anotan",
    description: "Universitario marco al 39'. Se completo condicion BTTS.",
    metadata: { match: "Sporting Cristal vs Universitario", minute: "39" },
    timestamp: daysAgo(1, 2),
  },
  {
    id: "match-7",
    type: "routed",
    channel: "#live",
    user: "Regla: Segundo tiempo",
    description: "Se enviaron 31 alertas al iniciar los ultimos 15 minutos.",
    metadata: { phase: "75+", alerts: "31" },
    timestamp: daysAgo(1, 6),
  },
  {
    id: "match-8",
    type: "surfaced",
    channel: "#odds",
    user: "Motor de cuotas",
    description: "Oportunidad detectada por baja repentina en empate.",
    metadata: { market: "1X2", change: "-18%" },
    timestamp: daysAgo(1, 9),
  },
  {
    id: "match-9",
    type: "welcomed",
    channel: "#system",
    user: "Notificaciones",
    description: "Email y panel web activos para nuevas reglas de usuario.",
    metadata: { channels: "email,panel" },
    timestamp: daysAgo(2, 1),
  },
  {
    id: "match-10",
    type: "answered",
    channel: "#goals",
    user: "Regla: Gol temprano",
    description: "Cienciano anoto antes del minuto 15 y activo alerta prioritaria.",
    metadata: { match: "Cusco FC vs Cienciano", minute: "12" },
    timestamp: daysAgo(2, 3),
  },
  {
    id: "match-11",
    type: "routed",
    channel: "#live",
    user: "Segmento favoritos",
    description: "Alertas enviadas solo a usuarios siguiendo Liga 1.",
    metadata: { segment: "Liga 1", alerts: "57" },
    timestamp: daysAgo(2, 8),
  },
  {
    id: "match-12",
    type: "flagged",
    channel: "#system",
    user: "Validador de reglas",
    description: "3 reglas quedaron en borrador por equipos duplicados.",
    metadata: { drafts: "3" },
    timestamp: daysAgo(3, 2),
  },
  {
    id: "match-13",
    type: "surfaced",
    channel: "#odds",
    user: "Motor de cuotas",
    description: "Cambio fuerte en mercado de proximo gol para Melgar.",
    metadata: { market: "next_goal", change: "+31%" },
    timestamp: daysAgo(3, 7),
  },
  {
    id: "match-14",
    type: "welcomed",
    channel: "#live",
    user: "Feed deportivo",
    description: "Sincronizacion correcta de calendario para 28 fixtures.",
    metadata: { fixtures: "28" },
    timestamp: daysAgo(4, 4),
  },
  {
    id: "match-15",
    type: "routed",
    channel: "#live",
    user: "Regla: Tarjeta roja",
    description: "Tarjeta roja detectada y enviada como alerta critica.",
    metadata: { severity: "critical" },
    timestamp: daysAgo(5, 5),
  },
  {
    id: "match-16",
    type: "answered",
    channel: "#goals",
    user: "Regla: Marcador exacto",
    description: "Marcador 2-1 alcanzado al minuto 83.",
    metadata: { score: "2-1", minute: "83" },
    timestamp: daysAgo(6, 3),
  },
];

export const mockConversations: Record<string, ConversationMessage[]> = {
  "match-1": [
    {
      role: "user",
      content: "Avisame si Alianza marca despues del minuto 30.",
      timestamp: daysAgo(0, 1),
    },
    {
      role: "assistant",
      content:
        "Alerta activada: Alianza Lima marco al minuto 64. Evento confirmado por el feed en vivo.",
      timestamp: daysAgo(0, 1),
    },
  ],
  "match-2": [
    {
      role: "user",
      content: "Quiero saber cuando Cristal y Universitario esten empatados en vivo.",
      timestamp: daysAgo(0, 2),
    },
    {
      role: "assistant",
      content:
        "Condicion cumplida: Sporting Cristal vs Universitario esta 1-1 al minuto 71.",
      timestamp: daysAgo(0, 2),
    },
  ],
  "match-3": [
    {
      role: "user",
      content: "Detecta cambios bruscos de cuota en partidos de Liga 1.",
      timestamp: daysAgo(0, 4),
    },
    {
      role: "assistant",
      content:
        "La cuota de Melgar subio 22% despues de una amarilla clave. Se marco como oportunidad.",
      timestamp: daysAgo(0, 4),
    },
  ],
};

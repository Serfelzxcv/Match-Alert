import { BellRing, Radio, SearchCheck, ShieldAlert, Trophy } from "lucide-react";
import type { BotAction } from "@/lib/types";

export interface TypeConfigEntry {
  bgColor: string;
  icon: typeof BellRing;
  iconColor: string;
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
}

export const typeConfig: Record<BotAction["type"], TypeConfigEntry> = {
  answered: {
    icon: Trophy,
    label: "Goles",
    variant: "default",
    iconColor: "text-type-answered",
    bgColor: "bg-type-answered/10",
  },
  routed: {
    icon: BellRing,
    label: "Alertas",
    variant: "outline",
    iconColor: "text-type-routed",
    bgColor: "bg-type-routed/10",
  },
  welcomed: {
    icon: Radio,
    label: "En vivo",
    variant: "secondary",
    iconColor: "text-type-welcomed",
    bgColor: "bg-type-welcomed/10",
  },
  surfaced: {
    icon: SearchCheck,
    label: "Oportunidades",
    variant: "outline",
    iconColor: "text-type-surfaced",
    bgColor: "bg-type-surfaced/10",
  },
  flagged: {
    icon: ShieldAlert,
    label: "Riesgos",
    variant: "destructive",
    iconColor: "text-type-flagged",
    bgColor: "bg-type-flagged/10",
  },
};

import {
  BellRing,
  Database,
  Hash,
  Radio,
  SlidersHorizontal,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Suspense, ViewTransition } from "react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getChannelCounts } from "@/data/queries/activity";
import { channels } from "@/lib/channels";
import { config } from "@/lib/config";

export default function SettingsPage() {
  return (
    <>
      <Header description="Reglas, integraciones y canales de alerta" title="Reglas" />
      <div className="flex-1 space-y-4 p-4">
        <ConfigSection />
        <Suspense
          fallback={
            <ViewTransition exit="slide-down">
              <ChannelsSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition default="none" enter="slide-up">
            <ChannelOverview />
          </ViewTransition>
        </Suspense>
      </div>
    </>
  );
}

function ConfigSection() {
  const items = [
    {
      icon: SlidersHorizontal,
      label: "Motor",
      value: config.model,
    },
    {
      icon: Radio,
      label: "Feed en vivo",
      value: "API Football listo para conectar",
    },
    {
      icon: BellRing,
      label: "Canales",
      value: "Email y panel web",
    },
    {
      icon: Database,
      label: "Datos",
      value: "Mock demo hasta conectar backend",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Configuracion</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y">
          {items.map((item) => (
            <div
              className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0"
              key={item.label}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <dt className="min-w-[120px] font-medium text-sm">
                {item.label}
              </dt>
              <dd className="min-w-0 flex-1 truncate text-muted-foreground text-sm">
                {(() => {
                  if (!item.value) {
                    return (
                      <span className="text-muted-foreground/60 italic">
                        Sin configurar
                      </span>
                    );
                  }
                  return (
                    <span className="font-mono text-xs">{item.value}</span>
                  );
                })()}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

async function ChannelOverview() {
  const channelCounts = await getChannelCounts();
  const channelEntries = Object.entries(channels);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Canales de monitoreo</CardTitle>
      </CardHeader>
      <CardContent>
        {channelEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Hash className="h-8 w-8 text-muted-foreground/50" />
            <h3 className="mt-3 font-medium text-base">
              No hay canales configurados
            </h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Agrega canales en{" "}
              <code className="rounded bg-muted px-1 text-xs">
                lib/channels.ts
              </code>{" "}
              para organizar los eventos de Match Alert.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {channelEntries.map(([key, ch]) => {
              const count = channelCounts[key] || 0;
              return (
                <div
                  className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0"
                  key={key}
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        className="rounded font-medium text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        href={
                          `/activity?q=${encodeURIComponent(ch.name)}` as Route
                        }
                      >
                        #{ch.name}
                      </Link>
                      {ch.isWelcomeChannel && (
                        <Badge className="text-[10px]" variant="secondary">
                          Sistema
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {ch.description}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {ch.topics.map((topic) => (
                        <Badge
                          className="font-normal text-[10px]"
                          key={topic}
                          variant="outline"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <span className="shrink-0 font-medium text-muted-foreground text-sm tabular-nums">
                    {count} {count === 1 ? "evento" : "eventos"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChannelsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-20" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div className="flex items-start gap-2.5" key={i}>
            <Skeleton className="h-6 w-6 shrink-0 rounded-md" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

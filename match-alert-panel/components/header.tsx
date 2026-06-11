import { ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  description?: string;
  title: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center gap-2 px-4 py-2">
      <SidebarTrigger />
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-semibold text-base">{title}</h1>
        {description && (
          <p className="truncate text-muted-foreground text-xs">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {process.env.NEXT_PUBLIC_MATCH_ALERT_URL && (
          <Button
            asChild
            className="hidden sm:inline-flex"
            size="sm"
            variant="outline"
          >
            <a
              href={process.env.NEXT_PUBLIC_MATCH_ALERT_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Abrir Match Alert <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

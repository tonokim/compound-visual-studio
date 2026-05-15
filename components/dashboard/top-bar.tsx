import { Bell, ChevronDown, Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type TopBarProps = {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
};

export function TopBar({
  title,
  subtitle,
  searchPlaceholder = "搜索资产、标签或模板...",
}: TopBarProps) {
  return (
    <header className="flex items-start justify-between gap-6 border-b border-border/60 bg-background/60 px-8 pt-6 pb-5 backdrop-blur">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="h-10 rounded-full pl-10"
          />
        </div>

        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-full border border-border/60 bg-card/50 text-muted-foreground hover:text-foreground"
          aria-label="通知"
        >
          <Bell className="size-4" />
          <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-primary" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 py-1.5 pr-3 pl-1.5 text-sm text-foreground/90 hover:bg-card"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-primary-foreground">
            CL
          </span>
          <span>Compound Life</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}

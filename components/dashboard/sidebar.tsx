"use client";

import { useSyncExternalStore } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  FileText,
  GitCommitHorizontal,
  Heart,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  Sparkles,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: typeof ImageIcon;
  href: string;
  badge?: string;
};

const navItems: NavItem[] = [
  { label: "资产库 (Gallery)", icon: ImageIcon, href: "/" },
  { label: "Prompt 模板库", icon: FileText, href: "/prompts" },
  { label: "一键生成器", icon: Sparkles, badge: "Beta", href: "/generate" },
  { label: "套装 (Collections)", icon: Layers, href: "/collections" },
];

const utilityItems: NavItem[] = [
  { label: "我的收藏", icon: Heart, href: "/favorites" },
  { label: "我的评论", icon: MessageSquare, href: "/comments" },
  { label: "版本管理", icon: GitCommitHorizontal, href: "/versions" },
  { label: "回收站", icon: Trash2, href: "/trash" },
];

const STORAGE_KEY = "compound:sidebar-collapsed";

const sidebarListeners = new Set<() => void>();

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    // ignore (private mode etc.)
  }
  sidebarListeners.forEach((l) => l());
}

function subscribeCollapsed(listener: () => void) {
  sidebarListeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    sidebarListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function DashboardSidebar({ activeHref }: { activeHref: string }) {
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    readCollapsed,
    () => false
  );
  const toggle = () => writeCollapsed(!collapsed);

  return (
    <aside
      data-collapsed={collapsed || undefined}
      className={cn(
        "relative flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-5 pt-5 pb-6",
          collapsed && "justify-center px-0"
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-primary-foreground">
          C
        </span>
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <div className="truncate text-base font-semibold">Compound</div>
            <div className="truncate text-xs text-muted-foreground">
              Visual Studio
            </div>
          </div>
        )}
      </div>

      <nav className={cn("flex-1 space-y-1", collapsed ? "px-2" : "px-3")}>
        {navItems.map((item) => (
          <NavRow
            key={item.href}
            item={item}
            active={item.href === activeHref}
            collapsed={collapsed}
          />
        ))}

        {!collapsed && (
          <div className="mt-6 mb-2 px-3 text-[11px] font-medium tracking-wider text-muted-foreground/70 uppercase">
            个人
          </div>
        )}
        {collapsed && <div className="mx-2 my-3 h-px bg-sidebar-border/60" />}
        {utilityItems.map((item) => (
          <NavRow
            key={item.href}
            item={item}
            active={item.href === activeHref}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className={cn("mt-auto", collapsed ? "px-2 pb-3" : "px-3 pb-3")}>
        {!collapsed && (
          <div className="relative h-[150px] overflow-hidden rounded-2xl border border-sidebar-border bg-card/40 px-4 pt-4">
            <div className="relative z-10">
              <div className="text-[15px] font-bold tracking-tight text-foreground">
                compoundlife.ai
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                AI 赋能健康长寿
              </p>
            </div>
            <BrandWave />
          </div>
        )}

        <div
          className={cn(
            "flex",
            collapsed ? "mt-1 justify-center" : "mt-2 justify-end pr-1"
          )}
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
            title={collapsed ? "展开" : "折叠"}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            {collapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <ChevronsLeft className="size-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavRow({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group flex items-center rounded-lg text-sm transition-colors",
        collapsed
          ? "justify-center px-0 py-2"
          : "gap-3 px-3 py-2",
        active
          ? "bg-sidebar-accent text-primary"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-foreground"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0",
          active ? "text-primary" : "text-muted-foreground"
        )}
      />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge ? (
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              {item.badge}
            </span>
          ) : null}
        </>
      )}
    </a>
  );
}

const r3 = (n: number) => Math.round(n * 1000) / 1000;

function BrandWave() {
  const W = 240;
  const H = 110;
  const cx = W / 2;
  const cy = H * 0.62;
  const dots: { x: number; y: number; o: number }[] = [];

  for (let i = 0; i < 110; i++) {
    const t = i / 109;
    const angle = (t - 0.5) * Math.PI * 1.7;
    const radius = 100 + Math.sin(t * Math.PI * 3) * 12;
    const px = cx + Math.cos(angle) * radius;
    const py1 = cy + Math.sin(angle) * radius * 0.42;
    const py2 = cy - Math.sin(angle) * radius * 0.42;
    const opacity = Math.pow(Math.sin(t * Math.PI), 1.1) * 0.95 + 0.05;
    dots.push({ x: r3(px), y: r3(py1), o: r3(opacity) });
    dots.push({ x: r3(px), y: r3(py2), o: r3(opacity * 0.9) });
  }
  for (let i = 0; i < 80; i++) {
    const t = i / 79;
    const a = (t - 0.5) * Math.PI * 1.4;
    const r = 60 + Math.sin(t * Math.PI * 2) * 8;
    const opacity = Math.pow(Math.sin(t * Math.PI), 1.2) * 0.9;
    dots.push({
      x: r3(cx + Math.cos(a) * r),
      y: r3(cy + Math.sin(a) * r * 0.55),
      o: r3(opacity),
    });
    dots.push({
      x: r3(cx + Math.cos(a) * r),
      y: r3(cy - Math.sin(a) * r * 0.55),
      o: r3(opacity),
    });
  }

  return (
    <svg
      className="absolute inset-x-0 bottom-0 z-0 w-full"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      <defs>
        <radialGradient id="brand-glow" cx="50%" cy="62%" r="38%">
          <stop offset="0%" stopColor="oklch(0.85 0.16 195)" stopOpacity="0.55" />
          <stop offset="60%" stopColor="oklch(0.6 0.18 230)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill="url(#brand-glow)" />
      <g fill="oklch(0.82 0.14 195)">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={0.85} opacity={d.o} />
        ))}
      </g>
    </svg>
  );
}

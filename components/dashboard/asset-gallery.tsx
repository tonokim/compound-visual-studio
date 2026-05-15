"use client";

import { useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Image as ImageIcon,
  MessageCircle,
  Play,
  Share2,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Asset = {
  id: string;
  title: string;
  version: string;
  tags: string[];
  comments: number;
  kind: "image" | "video";
  gradient: string;
  category: string;
};

const assets: Asset[] = [
  {
    id: "apob",
    title: "ApoB 分子结构可视化",
    version: "v2",
    tags: ["ApoB", "生物标志物"],
    comments: 3,
    kind: "image",
    gradient: "from-cyan-400/40 via-indigo-500/30 to-fuchsia-500/30",
    category: "生物标志物可视化",
  },
  {
    id: "aging",
    title: "生物年龄对比(男性)",
    version: "v1",
    tags: ["生物年龄", "衰老对比"],
    comments: 5,
    kind: "image",
    gradient: "from-amber-400/30 via-rose-400/30 to-slate-700/40",
    category: "衰老前后对比",
  },
  {
    id: "food",
    title: "食物扫描增强示例",
    version: "v2",
    tags: ["食物扫描", "AI识别"],
    comments: 2,
    kind: "image",
    gradient: "from-emerald-400/30 via-lime-400/30 to-teal-600/40",
    category: "食物扫描增强",
  },
  {
    id: "agent",
    title: "AI Health Agent 解释视频",
    version: "v1",
    tags: ["AI Agent", "健康报告"],
    comments: 7,
    kind: "video",
    gradient: "from-sky-400/40 via-cyan-400/40 to-indigo-600/50",
    category: "AI Health Agent 解释视频",
  },
  {
    id: "poster",
    title: "品牌海报 - LongEVity",
    version: "v3",
    tags: ["品牌", "海报"],
    comments: 1,
    kind: "image",
    gradient: "from-blue-500/40 via-indigo-600/40 to-slate-900/60",
    category: "品牌海报",
  },
  {
    id: "mito",
    title: "线粒体功能提升动画",
    version: "v2",
    tags: ["线粒体", "细胞健康"],
    comments: 4,
    kind: "video",
    gradient: "from-violet-500/40 via-fuchsia-500/30 to-cyan-500/40",
    category: "生物标志物可视化",
  },
  {
    id: "report",
    title: "个性化报告界面",
    version: "v2",
    tags: ["个性化报告", "界面设计"],
    comments: 0,
    kind: "image",
    gradient: "from-slate-700/60 via-cyan-500/30 to-emerald-500/20",
    category: "AI Health Agent 解释视频",
  },
  {
    id: "fitness",
    title: "运动健康数据可视化",
    version: "v1",
    tags: ["运动健康", "数据可视化"],
    comments: 2,
    kind: "image",
    gradient: "from-emerald-400/40 via-teal-500/30 to-slate-700/40",
    category: "衰老前后对比",
  },
];

const tabs = ["图片", "视频", "套装"] as const;
type Tab = (typeof tabs)[number];

const categories = [
  "全部",
  "生物标志物可视化",
  "衰老前后对比",
  "食物扫描增强",
  "AI Health Agent 解释视频",
  "品牌海报",
];

export function AssetGallery() {
  const [tab, setTab] = useState<Tab>("图片");
  const [category, setCategory] = useState("全部");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const visible = assets.filter((a) => {
    if (tab === "图片" && a.kind !== "image") return false;
    if (tab === "视频" && a.kind !== "video") return false;
    if (category !== "全部" && a.category !== category) return false;
    return true;
  });

  const toggleBookmark = (id: string) =>
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        资产库 (Gallery)
      </h2>

      <div className="mt-5 flex items-center gap-6 border-b border-border/60 text-sm">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "relative -mb-px pb-3 transition-colors",
              tab === t
                ? "font-medium text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
            {tab === t ? (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted-foreground">主题分类:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              category === cat
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border/60 bg-card/40 text-muted-foreground hover:bg-card hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
        <button
          type="button"
          className="ml-auto flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Filter className="size-3.5" />
          更多筛选
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {visible.length > 0 ? (
          visible.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              bookmarked={bookmarked.has(asset.id)}
              onToggleBookmark={() => toggleBookmark(asset.id)}
            />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-border/60 bg-card/30 py-16 text-center text-sm text-muted-foreground">
            该分类下暂无资产
          </div>
        )}
      </div>

      <Pagination page={page} onChange={setPage} />
    </section>
  );
}

function AssetCard({
  asset,
  bookmarked,
  onToggleBookmark,
}: {
  asset: Asset;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-colors hover:border-primary/30">
      <div
        className={cn(
          "relative aspect-[4/3] bg-gradient-to-br",
          asset.gradient
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(1_0_0_/_0.08),_transparent_60%)]" />
        <span className="absolute top-3 left-3 flex size-7 items-center justify-center rounded-md bg-black/40 text-white/80 backdrop-blur-sm">
          {asset.kind === "video" ? (
            <Play className="size-3.5 fill-current" />
          ) : (
            <ImageIcon className="size-3.5" />
          )}
        </span>
        <span className="absolute top-3 right-3 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
          {asset.version}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <h3 className="text-sm font-medium text-foreground">{asset.title}</h3>
        <div className="flex flex-wrap gap-1.5">
          {asset.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-1 text-muted-foreground">
          <IconBtn label="下载">
            <Download className="size-3.5" />
          </IconBtn>
          <IconBtn label="分享">
            <Share2 className="size-3.5" />
          </IconBtn>
          <button
            type="button"
            className="flex items-center gap-1 text-xs hover:text-foreground"
          >
            <MessageCircle className="size-3.5" />
            {asset.comments}
          </button>
          <button
            type="button"
            onClick={onToggleBookmark}
            aria-label="收藏"
            className={cn(
              "ml-auto flex size-6 items-center justify-center rounded-md hover:bg-muted",
              bookmarked
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Bookmark
              className={cn("size-3.5", bookmarked && "fill-current")}
            />
          </button>
        </div>
      </div>
    </article>
  );
}

function IconBtn({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "flex size-6 items-center justify-center rounded-md hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

function Pagination({
  page,
  onChange,
}: {
  page: number;
  onChange: (n: number) => void;
}) {
  const pages = [1, 2, 3, 4, 5, "...", 12] as const;
  return (
    <div className="mt-8 flex items-center justify-center gap-1.5 text-sm">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="flex size-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground hover:text-foreground disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p, i) => {
        const isNum = typeof p === "number";
        return (
          <button
            key={`${p}-${i}`}
            type="button"
            disabled={!isNum}
            onClick={() => isNum && onChange(p)}
            className={cn(
              "flex size-8 items-center justify-center rounded-md border text-xs",
              isNum && page === p
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border/60 text-muted-foreground hover:text-foreground",
              !isNum && "cursor-default"
            )}
          >
            {p}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onChange(Math.min(12, page + 1))}
        disabled={page >= 12}
        className="flex size-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground hover:text-foreground disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

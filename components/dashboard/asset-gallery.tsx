"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Bookmark,
  Download,
  Filter,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  Play,
  Share2,
} from "lucide-react";

import type { Asset } from "@/components/dashboard/asset-data";
import { fetchAssetsPage } from "@/lib/mock-fetch";
import { useInfiniteScroll } from "@/lib/use-infinite-scroll";
import { cn } from "@/lib/utils";

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["assets", tab, category],
    queryFn: ({ pageParam }) =>
      fetchAssetsPage(pageParam as number, { tab, category }),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextCursor,
  });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  const sentinelRef = useInfiniteScroll<HTMLDivElement>(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, !isLoading);

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

      {isLoading ? (
        <div className="mt-6 flex items-center justify-center py-16 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          加载中…
        </div>
      ) : items.length > 0 ? (
        <div className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
          {items.map((asset) => (
            <AssetCard
              key={asset.uid}
              asset={asset}
              bookmarked={bookmarked.has(asset.uid)}
              onToggleBookmark={() => toggleBookmark(asset.uid)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-border/60 bg-card/30 py-16 text-center text-sm text-muted-foreground">
          该分类下暂无资产
        </div>
      )}

      <div ref={sentinelRef} className="h-10" />

      <div className="mt-2 flex items-center justify-center pb-4 text-xs text-muted-foreground">
        {isFetchingNextPage ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="size-3.5 animate-spin" />
            加载更多…
          </span>
        ) : !hasNextPage && items.length > 0 ? (
          <span>已加载全部</span>
        ) : null}
      </div>
    </section>
  );
}

function AssetCard({
  asset,
  bookmarked,
  onToggleBookmark,
}: {
  asset: Asset & { uid: string; aspectRatio: number };
  bookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  return (
    <article className="group mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-colors hover:border-primary/30">
      <div
        style={{ aspectRatio: asset.aspectRatio }}
        className={cn("relative bg-gradient-to-br", asset.gradient)}
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

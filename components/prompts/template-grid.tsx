"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Download,
  LayoutGrid,
  Loader2,
  Plus,
  Rows3,
  Search,
  Star,
} from "lucide-react";

import { templates, type Template } from "@/components/prompts/template-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchTemplatesPage } from "@/lib/mock-fetch";
import { useInfiniteScroll } from "@/lib/use-infinite-scroll";
import { cn } from "@/lib/utils";

export { templates };
export type { Template };

const tabs = ["全部模板", "图片模板", "视频模板", "我的模板", "收藏"] as const;
type Tab = (typeof tabs)[number];

const ALL = "all" as const;

const categoryOptions = [
  { value: ALL, label: "全部主题" },
  { value: "ApoB", label: "ApoB / 生物标志物" },
  { value: "衰老", label: "衰老对比" },
  { value: "食物扫描", label: "食物扫描" },
  { value: "AI Agent", label: "AI Agent" },
  { value: "品牌", label: "品牌 / 海报" },
];

const sceneOptions = [
  { value: ALL, label: "全部场景" },
  { value: "popsci", label: "科普" },
  { value: "marketing", label: "营销" },
  { value: "product", label: "产品" },
  { value: "report", label: "报告" },
];

const styleOptions = [
  { value: ALL, label: "全部风格" },
  { value: "real", label: "真实感" },
  { value: "tech", label: "科技感" },
  { value: "ui", label: "UI 动画" },
  { value: "minimal", label: "极简" },
];

const modelOptions = [
  { value: ALL, label: "全部模型" },
  { value: "Grok (图像)", label: "Grok (图像)" },
  { value: "Banana (图像)", label: "Banana (图像)" },
  { value: "Veo 3.1", label: "Veo 3.1" },
  { value: "Seedance 2.0", label: "Seedance 2.0" },
];

const sortOptions = [
  { value: "latest", label: "最新创建" },
  { value: "downloads", label: "最多下载" },
  { value: "title", label: "按名称" },
];

export function TemplateLibrary({
  selectedId,
  onSelect,
  starred,
  onToggleStar,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  starred: Set<string>;
  onToggleStar: (id: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("全部模板");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [scene, setScene] = useState<string>(ALL);
  const [style, setStyle] = useState<string>(ALL);
  const [model, setModel] = useState<string>(ALL);
  const [sort, setSort] = useState<string>("latest");

  // scene / style are decorative filters in this demo
  void scene;
  void style;

  const starredKey = useMemo(
    () => [...starred].sort().join(","),
    [starred]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["templates", tab, category, model, keyword, sort, starredKey],
    queryFn: ({ pageParam }) =>
      fetchTemplatesPage(pageParam as number, {
        tab,
        category,
        model,
        keyword,
        sort,
        starredIds: [...starred],
      }),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextCursor,
  });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  const sentinelRef = useInfiniteScroll<HTMLDivElement>(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, !isLoading && view === "grid");

  return (
    <section>
      <div className="flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-6 text-sm">
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

        <Button className="bg-brand-gradient mb-2 h-9 gap-1.5 rounded-lg px-4 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 hover:opacity-95">
          <Plus className="size-4" />
          新建模板
        </Button>
      </div>

      <FilterBar
        view={view}
        onViewChange={setView}
        keyword={keyword}
        onKeywordChange={setKeyword}
        category={category}
        onCategoryChange={setCategory}
        scene={scene}
        onSceneChange={setScene}
        style={style}
        onStyleChange={setStyle}
        model={model}
        onModelChange={setModel}
        sort={sort}
        onSortChange={setSort}
      />

      {isLoading ? (
        <div className="mt-5 flex items-center justify-center py-16 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          加载中…
        </div>
      ) : items.length > 0 ? (
        view === "grid" ? (
          <div className="mt-5 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {items.map((tpl) => (
              <TemplateCard
                key={tpl.uid}
                template={tpl}
                selected={tpl.id === selectedId}
                starred={starred.has(tpl.id)}
                onSelect={() => onSelect(tpl.id)}
                onToggleStar={() => onToggleStar(tpl.id)}
              />
            ))}
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/30">
            {items.map((tpl) => (
              <TemplateListItem
                key={tpl.uid}
                template={tpl}
                selected={tpl.id === selectedId}
                starred={starred.has(tpl.id)}
                onSelect={() => onSelect(tpl.id)}
                onToggleStar={() => onToggleStar(tpl.id)}
              />
            ))}
          </ul>
        )
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-border/60 bg-card/30 py-16 text-center text-sm text-muted-foreground">
          没有匹配的模板
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

type FilterBarProps = {
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  keyword: string;
  onKeywordChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  scene: string;
  onSceneChange: (v: string) => void;
  style: string;
  onStyleChange: (v: string) => void;
  model: string;
  onModelChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
};

function FilterBar({
  view,
  onViewChange,
  keyword,
  onKeywordChange,
  category,
  onCategoryChange,
  scene,
  onSceneChange,
  style,
  onStyleChange,
  model,
  onModelChange,
  sort,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <FilterSelect
        value={category}
        onValueChange={onCategoryChange}
        placeholder="主题分类"
        options={categoryOptions}
      />
      <FilterSelect
        value={scene}
        onValueChange={onSceneChange}
        placeholder="场景"
        options={sceneOptions}
      />
      <FilterSelect
        value={style}
        onValueChange={onStyleChange}
        placeholder="风格"
        options={styleOptions}
      />
      <FilterSelect
        value={model}
        onValueChange={onModelChange}
        placeholder="模型"
        options={modelOptions}
      />

      <div className="relative min-w-[180px] flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="搜索模板关键词"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="h-9 rounded-lg pl-9 text-xs"
        />
      </div>

      <FilterSelect
        value={sort}
        onValueChange={onSortChange}
        placeholder="排序"
        options={sortOptions}
      />

      <div className="flex h-9 items-center rounded-lg border border-border/60 bg-card/40 p-0.5">
        <button
          type="button"
          aria-label="网格视图"
          onClick={() => onViewChange("grid")}
          className={cn(
            "flex size-7 items-center justify-center rounded-md transition-colors",
            view === "grid"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutGrid className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="列表视图"
          onClick={() => onViewChange("list")}
          className={cn(
            "flex size-7 items-center justify-center rounded-md transition-colors",
            view === "list"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Rows3 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onValueChange,
  placeholder,
  options,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  const isAll = value === ALL || value === options[0]?.value;
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as string)}>
      <SelectTrigger
        className={cn(
          "h-9 min-w-[110px] rounded-lg border bg-card/40 px-3 text-xs transition-colors",
          isAll
            ? "border-border/60 text-muted-foreground"
            : "border-primary/40 bg-primary/10 text-primary"
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="min-w-[180px]">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TemplateCard({
  template,
  selected,
  starred,
  onSelect,
  onToggleStar,
}: {
  template: Template & { uid: string; aspectRatio: number };
  selected: boolean;
  starred: boolean;
  onSelect: () => void;
  onToggleStar: () => void;
}) {
  return (
    <article
      onClick={onSelect}
      className={cn(
        "group mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-2xl border bg-card/40 transition-colors",
        selected
          ? "border-primary/70 shadow-lg shadow-primary/10"
          : "border-border/60 hover:border-primary/30"
      )}
    >
      <div
        style={{ aspectRatio: template.aspectRatio }}
        className={cn("relative bg-gradient-to-br", template.gradient)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(1_0_0_/_0.08),_transparent_60%)]" />
        <span className="absolute top-3 left-3 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
          {template.kind === "video" ? "视频" : "图片"}
        </span>
        <button
          type="button"
          aria-label="收藏"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar();
          }}
          className={cn(
            "absolute top-3 right-3 flex size-7 items-center justify-center rounded-md bg-black/40 backdrop-blur-sm hover:text-primary",
            starred ? "text-primary" : "text-white/80"
          )}
        >
          <Star className={cn("size-3.5", starred && "fill-current")} />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <h3 className="truncate text-sm font-medium text-foreground">
          {template.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="truncate">{template.model}</span>
          <div className="flex items-center gap-2">
            <span>{template.version}</span>
            <span className="flex items-center gap-0.5">
              <Download className="size-3" />
              {template.downloads}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function TemplateListItem({
  template,
  selected,
  starred,
  onSelect,
  onToggleStar,
}: {
  template: Template;
  selected: boolean;
  starred: boolean;
  onSelect: () => void;
  onToggleStar: () => void;
}) {
  return (
    <li
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer items-center gap-4 p-3 transition-colors first:rounded-t-2xl last:rounded-b-2xl",
        selected ? "bg-primary/10" : "hover:bg-card/60"
      )}
    >
      <div
        className={cn(
          "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br",
          template.gradient
        )}
      >
        <span className="absolute top-1.5 left-1.5 rounded bg-black/50 px-1 py-0.5 text-[9px] font-medium text-white/90">
          {template.kind === "video" ? "视频" : "图片"}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">
          {template.title}
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <span key={tag} className="text-[11px] text-primary/80">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-[11px] text-muted-foreground">
        <span>{template.model}</span>
        <span>{template.version}</span>
        <span className="flex items-center gap-0.5">
          <Download className="size-3" />
          {template.downloads}
        </span>
        <button
          type="button"
          aria-label="收藏"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar();
          }}
          className={cn(
            "flex size-7 items-center justify-center rounded-md hover:bg-muted",
            starred
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Star className={cn("size-3.5", starred && "fill-current")} />
        </button>
      </div>
    </li>
  );
}

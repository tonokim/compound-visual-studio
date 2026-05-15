"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  Plus,
  Rows3,
  Search,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type Template = {
  id: string;
  title: string;
  kind: "image" | "video";
  tags: string[];
  model: string;
  version: string;
  downloads: number;
  gradient: string;
};

export const templates: Template[] = [
  {
    id: "apob-3d",
    title: "生物标志物 3D 可视化",
    kind: "image",
    tags: ["ApoB", "3D", "科技感"],
    model: "Grok (图像)",
    version: "v2",
    downloads: 128,
    gradient: "from-cyan-400/40 via-indigo-500/30 to-fuchsia-500/30",
  },
  {
    id: "aging-compare",
    title: "衰老对比图生成",
    kind: "image",
    tags: ["衰老", "对比", "真实感"],
    model: "Grok (图像)",
    version: "v1",
    downloads: 96,
    gradient: "from-amber-400/30 via-rose-400/30 to-slate-700/40",
  },
  {
    id: "food-scan",
    title: "食物扫描增强",
    kind: "image",
    tags: ["食物扫描", "AI识别", "健康"],
    model: "Banana (图像)",
    version: "v3",
    downloads: 154,
    gradient: "from-emerald-400/30 via-lime-400/30 to-teal-600/40",
  },
  {
    id: "ai-agent-video",
    title: "AI Health Agent 解释视频",
    kind: "video",
    tags: ["AI Agent", "健康报告", "科普"],
    model: "Veo 3.1",
    version: "v2",
    downloads: 212,
    gradient: "from-sky-400/40 via-cyan-400/40 to-indigo-600/50",
  },
  {
    id: "running-data",
    title: "运动数据可视化动画",
    kind: "video",
    tags: ["运动健康", "数据可视化", "UI动画"],
    model: "Veo 3.1",
    version: "v1",
    downloads: 186,
    gradient: "from-emerald-400/40 via-teal-500/30 to-slate-700/40",
  },
  {
    id: "mito",
    title: "线粒体功能提升动画",
    kind: "video",
    tags: ["线粒体", "细胞健康", "科学"],
    model: "Seedance 2.0",
    version: "v2",
    downloads: 143,
    gradient: "from-violet-500/40 via-fuchsia-500/30 to-cyan-500/40",
  },
  {
    id: "brand-poster",
    title: "品牌科技感海报",
    kind: "image",
    tags: ["品牌", "科技感", "海报"],
    model: "Grok (图像)",
    version: "v2",
    downloads: 87,
    gradient: "from-blue-500/40 via-indigo-600/40 to-slate-900/60",
  },
  {
    id: "report-ui",
    title: "个性化报告界面",
    kind: "image",
    tags: ["报告", "UI设计", "可视化"],
    model: "Banana (图像)",
    version: "v1",
    downloads: 73,
    gradient: "from-slate-700/60 via-cyan-500/30 to-emerald-500/20",
  },
];

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
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [scene, setScene] = useState<string>(ALL);
  const [style, setStyle] = useState<string>(ALL);
  const [model, setModel] = useState<string>(ALL);
  const [sort, setSort] = useState<string>("latest");

  const visible = templates
    .filter((tpl) => {
      if (tab === "图片模板" && tpl.kind !== "image") return false;
      if (tab === "视频模板" && tpl.kind !== "video") return false;
      if (tab === "收藏" && !starred.has(tpl.id)) return false;
      if (
        category !== ALL &&
        !tpl.tags.some((t) =>
          t.toLowerCase().includes(category.toLowerCase())
        )
      )
        return false;
      if (model !== ALL && tpl.model !== model) return false;
      if (
        keyword &&
        !tpl.title.toLowerCase().includes(keyword.toLowerCase()) &&
        !tpl.tags.some((t) => t.toLowerCase().includes(keyword.toLowerCase()))
      )
        return false;
      // scene / style are visual-only filters in this static demo
      void scene;
      void style;
      return true;
    })
    .sort((a, b) => {
      if (sort === "downloads") return b.downloads - a.downloads;
      if (sort === "title") return a.title.localeCompare(b.title, "zh");
      return 0;
    });

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

      {visible.length > 0 ? (
        view === "grid" ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((tpl) => (
              <TemplateCard
                key={tpl.id}
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
            {visible.map((tpl) => (
              <TemplateListItem
                key={tpl.id}
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

      <Pagination page={page} onChange={setPage} />
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
  template: Template;
  selected: boolean;
  starred: boolean;
  onSelect: () => void;
  onToggleStar: () => void;
}) {
  return (
    <article
      onClick={onSelect}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-2xl border bg-card/40 transition-colors",
        selected
          ? "border-primary/70 shadow-lg shadow-primary/10"
          : "border-border/60 hover:border-primary/30"
      )}
    >
      <div
        className={cn(
          "relative aspect-[4/3] bg-gradient-to-br",
          template.gradient
        )}
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
        selected
          ? "bg-primary/10"
          : "hover:bg-card/60"
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
            <span
              key={tag}
              className="text-[11px] text-primary/80"
            >
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
            starred ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Star className={cn("size-3.5", starred && "fill-current")} />
        </button>
      </div>
    </li>
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

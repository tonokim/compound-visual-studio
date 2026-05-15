"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Template = {
  title: string;
  tags: string[];
  gradient: string;
};

const templates: Template[] = [
  {
    title: "生物标志物 3D 可视化",
    tags: ["ApoB", "3D", "科技感"],
    gradient: "from-cyan-400/40 via-indigo-500/30 to-fuchsia-500/40",
  },
  {
    title: "衰老对比图生成",
    tags: ["衰老", "对比", "真实感"],
    gradient: "from-amber-300/30 via-orange-400/20 to-slate-700/40",
  },
  {
    title: "科技感数据可视化海报",
    tags: ["海报", "数据", "科技感"],
    gradient: "from-sky-400/40 via-indigo-500/30 to-violet-600/40",
  },
];

const activity = [
  {
    text: "管理员 更新了资产《ApoB 分子结构可视化》到 v2",
    time: "2 小时前",
  },
  {
    text: "Compound Life 使用模板《科技感海报》生成了新图",
    time: "5 小时前",
  },
  { text: "用户 Lily 评论了《生物年龄对比(男性)》", time: "昨天 18:30" },
];

const previews = [
  "from-cyan-400/40 via-indigo-500/30 to-fuchsia-500/30",
  "from-emerald-400/30 via-teal-500/30 to-slate-700/40",
  "from-blue-500/40 via-indigo-600/40 to-slate-900/60",
];

const modelOptions = [
  "Grok (图像)",
  "Banana (图像)",
  "Veo 3.1",
  "Seedance 2.0",
];

export function RightPanel() {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border/60 bg-background/40 px-4 py-5">
      <PromptLibrary />
      <Generator />
      <ActivityFeed />
    </aside>
  );
}

function PanelCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/60 bg-card/50 p-4",
        className
      )}
    >
      {children}
    </section>
  );
}

function PromptLibrary() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const onCopy = (idx: number) => {
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx((cur) => (cur === idx ? null : cur)), 1500);
  };

  return (
    <PanelCard>
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Prompt 模板库
        </h3>
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          查看全部
        </button>
      </header>

      <ul className="mt-4 space-y-3">
        {templates.map((tpl, idx) => (
          <li
            key={tpl.title}
            className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/40 p-2"
          >
            <div
              className={cn(
                "size-12 shrink-0 rounded-lg bg-gradient-to-br",
                tpl.gradient
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">
                {tpl.title}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {tpl.tags.map((tag) => (
                  <span key={tag} className="text-[10px] text-primary/80">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onCopy(idx)}
              className="gap-1 rounded-md border-border/60 bg-transparent text-xs text-muted-foreground hover:text-foreground"
            >
              <Copy className="size-3" />
              {copiedIdx === idx ? "已复制" : "复制"}
            </Button>
          </li>
        ))}
      </ul>

      <Button
        variant="outline"
        className="mt-4 w-full rounded-lg border-primary/30 bg-transparent text-primary hover:bg-primary/10 hover:text-primary"
      >
        浏览所有模板
      </Button>
    </PanelCard>
  );
}

function Generator() {
  const [model, setModel] = useState(modelOptions[0]);
  const [generating, setGenerating] = useState(false);

  return (
    <PanelCard>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">一键生成器</h3>
          <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            Beta
          </span>
        </div>
        <button type="button" className="text-xs text-primary hover:underline">
          开始创作
        </button>
      </header>

      <div className="mt-4 space-y-2">
        <label className="text-xs text-muted-foreground">选择模型</label>
        <Select value={model} onValueChange={(v) => setModel(v as string)}>
          <SelectTrigger className="h-10 w-full rounded-lg border-border/60 bg-background/40 text-sm">
            <SelectValue placeholder="选择模型" />
          </SelectTrigger>
          <SelectContent>
            {modelOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {previews.map((g, i) => (
          <div
            key={i}
            className={cn("aspect-[4/3] rounded-lg bg-gradient-to-br", g)}
          />
        ))}
      </div>

      <Button
        onClick={() => {
          setGenerating(true);
          setTimeout(() => setGenerating(false), 1500);
        }}
        disabled={generating}
        className="bg-brand-gradient mt-4 h-11 w-full rounded-lg text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-95 disabled:opacity-70"
      >
        {generating ? "生成中..." : "开始生成"}
      </Button>
    </PanelCard>
  );
}

function ActivityFeed() {
  return (
    <PanelCard>
      <h3 className="text-sm font-semibold text-foreground">最近动态</h3>
      <ul className="mt-3 space-y-3 text-xs">
        {activity.map((item) => (
          <li
            key={item.text}
            className="flex items-start justify-between gap-3 text-muted-foreground"
          >
            <span className="flex-1 leading-relaxed text-foreground/80">
              {item.text}
            </span>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {item.time}
            </span>
          </li>
        ))}
      </ul>
    </PanelCard>
  );
}

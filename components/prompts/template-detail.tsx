"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  Sparkles,
  Star,
  ThumbsUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Template } from "./template-grid";

const promptText = `Ultra-detailed 3D scientific visualization of ApoB particle structure, floating in a microscopic environment, blue and purple neon color scheme, soft volumetric lighting, depth of field, high realism, Octane render, 8k --ar 16:9`;

type Comment = {
  id: string;
  author: string;
  initial: string;
  time: string;
  text: string;
  likes: number;
  likedByMe: boolean;
};

const initialComments: Comment[] = [
  {
    id: "willow-1",
    author: "Willow",
    initial: "W",
    time: "2天前",
    text: "这个效果很棒，适合科普内容！",
    likes: 1,
    likedByMe: false,
  },
];

export function TemplateDetail({
  template,
  starred,
  onToggleStar,
}: {
  template: Template;
  starred: boolean;
  onToggleStar: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [draft, setDraft] = useState("");
  const [tags, setTags] = useState<string[]>(template.tags);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
    } catch {
      // ignore — secure context required
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onSendComment = () => {
    const text = draft.trim();
    if (!text) return;
    setComments((prev) => [
      {
        id: `me-${Date.now()}`,
        author: "Compound Life",
        initial: "CL",
        time: "刚刚",
        text,
        likes: 0,
        likedByMe: false,
      },
      ...prev,
    ]);
    setDraft("");
  };

  return (
    <aside className="flex h-full w-96 shrink-0 flex-col overflow-y-auto border-l border-border/60 bg-background/40">
      <div className="space-y-5 px-5 py-5">
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br",
            template.gradient
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(1_0_0_/_0.08),_transparent_60%)]" />
          <span className="absolute top-3 left-3 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
            {template.kind === "video" ? "视频" : "图片"}
          </span>
          <span className="absolute top-3 right-3 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
            {template.version}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <h2 className="truncate text-base font-semibold text-foreground">
            {template.title}
          </h2>
          <div className="flex shrink-0 items-center text-muted-foreground">
            <button
              type="button"
              aria-label="收藏"
              onClick={onToggleStar}
              className={cn(
                "flex size-8 items-center justify-center rounded-md hover:bg-muted",
                starred ? "text-primary" : "hover:text-foreground"
              )}
            >
              <Star className={cn("size-4", starred && "fill-current")} />
            </button>
            <IconBtn label="分享">
              <Share2 className="size-4" />
            </IconBtn>
            <IconBtn label="更多">
              <MoreHorizontal className="size-4" />
            </IconBtn>
          </div>
        </div>

        <Meta template={template} tags={tags} onAddTag={(t) => setTags((p) => [...p, t])} />

        <PromptBlock />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCopy}
            className="h-10 flex-1 gap-1.5 rounded-lg border-border/70 bg-transparent text-foreground/90"
          >
            {copied ? (
              <>
                <Check className="size-4 text-primary" />
                已复制
              </>
            ) : (
              <>
                <Copy className="size-4" />
                复制 Prompt
              </>
            )}
          </Button>
          <Button className="bg-brand-gradient h-10 flex-[1.4] gap-1.5 rounded-lg text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-95">
            <Sparkles className="size-4" />
            使用此模板生成
          </Button>
        </div>

        <CommentSection
          comments={comments}
          draft={draft}
          onDraftChange={setDraft}
          onSend={onSendComment}
          onToggleLike={(id) =>
            setComments((prev) =>
              prev.map((c) =>
                c.id === id
                  ? {
                      ...c,
                      likedByMe: !c.likedByMe,
                      likes: c.likes + (c.likedByMe ? -1 : 1),
                    }
                  : c
              )
            )
          }
        />
      </div>
    </aside>
  );
}

function Meta({
  template,
  tags,
  onAddTag,
}: {
  template: Template;
  tags: string[];
  onAddTag: (tag: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const submit = () => {
    const v = draft.trim().replace(/^#/, "");
    if (v && !tags.includes(v)) onAddTag(v);
    setDraft("");
    setAdding(false);
  };

  return (
    <dl className="space-y-3 text-xs">
      <Row label="标签">
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary"
            >
              #{tag}
            </span>
          ))}
          {adding ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={submit}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") {
                  setDraft("");
                  setAdding(false);
                }
              }}
              placeholder="新标签"
              className="h-6 w-24 rounded-md border border-primary/40 bg-input/30 px-1.5 text-[11px] text-foreground outline-none"
            />
          ) : (
            <button
              type="button"
              aria-label="新增标签"
              onClick={() => setAdding(true)}
              className="flex size-5 items-center justify-center rounded-md border border-dashed border-border/60 text-muted-foreground hover:text-foreground"
            >
              <Plus className="size-3" />
            </button>
          )}
        </div>
      </Row>
      <Row label="模型">
        <span className="text-foreground/90">{template.model}</span>
      </Row>
      <Row label="创建时间">
        <span className="text-foreground/90">2024-05-18 14:32</span>
      </Row>
      <Row label="版本">
        <div className="flex items-center justify-between gap-2">
          <span className="text-foreground/90">{template.version} (最新)</span>
          <button type="button" className="text-primary hover:underline">
            查看历史版本
          </button>
        </div>
      </Row>
    </dl>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[68px_1fr] items-start gap-3">
      <dt className="pt-0.5 text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

function PromptBlock() {
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">Prompt 内容</div>
      <div className="rounded-xl border border-border/60 bg-card/40 p-3 text-xs leading-relaxed text-foreground/85">
        {promptText}
      </div>
    </div>
  );
}

function CommentSection({
  comments,
  draft,
  onDraftChange,
  onSend,
  onToggleLike,
}: {
  comments: Comment[];
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  onToggleLike: (id: string) => void;
}) {
  const count = useMemo(() => comments.length, [comments]);
  return (
    <section className="space-y-3 border-t border-border/60 pt-4">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          评论 <span className="text-muted-foreground">({count})</span>
        </h3>
        <button
          type="button"
          className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground"
        >
          查看全部
        </button>
      </header>

      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-semibold text-primary-foreground">
          CL
        </span>
        <div className="relative flex-1">
          <Input
            placeholder="写下你的评论..."
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            className="h-9 rounded-lg pr-9 text-xs"
          />
          <button
            type="button"
            aria-label="发送"
            onClick={onSend}
            disabled={!draft.trim()}
            className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-primary hover:bg-primary/10 disabled:opacity-40"
          >
            <Send className="size-3.5" />
          </button>
        </div>
      </div>

      <ul className="space-y-3 pt-1">
        {comments.map((c) => (
          <li key={c.id} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground/80">
              {c.initial}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-foreground">
                    {c.author}
                  </span>
                  <span className="text-muted-foreground">{c.time}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleLike(c.id)}
                  className={cn(
                    "flex items-center gap-1 text-[11px] hover:text-foreground",
                    c.likedByMe ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <ThumbsUp
                    className={cn("size-3", c.likedByMe && "fill-current")}
                  />
                  {c.likes}
                </button>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                {c.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function IconBtn({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-md hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

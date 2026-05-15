export type Asset = {
  id: string;
  title: string;
  version: string;
  tags: string[];
  comments: number;
  kind: "image" | "video";
  gradient: string;
  category: string;
};

export const assets: Asset[] = [
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

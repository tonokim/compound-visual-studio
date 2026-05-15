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

import { assets, type Asset } from "@/components/dashboard/asset-data";
import { templates, type Template } from "@/components/prompts/template-data";

const PAGE_SIZE = 12;
const TOTAL_TARGET = 60;
const ASPECT_RATIOS = [3 / 4, 4 / 3, 1, 4 / 5, 3 / 5, 5 / 4] as const;

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function aspectFor(id: string): number {
  return ASPECT_RATIOS[hashStr(id) % ASPECT_RATIOS.length];
}

function paginate<T extends { id: string }>(
  source: T[],
  pageParam: number
): { items: (T & { uid: string; aspectRatio: number })[]; nextCursor: number | null } {
  if (source.length === 0) {
    return { items: [], nextCursor: null };
  }

  const start = pageParam * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, TOTAL_TARGET);
  if (start >= TOTAL_TARGET) return { items: [], nextCursor: null };

  const items: (T & { uid: string; aspectRatio: number })[] = [];
  for (let i = start; i < end; i++) {
    const base = source[i % source.length];
    const uid = `${base.id}-${i}`;
    items.push({ ...base, uid, aspectRatio: aspectFor(uid) });
  }

  const nextCursor = end >= TOTAL_TARGET ? null : pageParam + 1;
  return { items, nextCursor };
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export type AssetFilters = { tab: string; category: string };

export async function fetchAssetsPage(
  pageParam: number,
  filters: AssetFilters
): Promise<{
  items: (Asset & { uid: string; aspectRatio: number })[];
  nextCursor: number | null;
}> {
  await delay(400);

  const filtered = assets.filter((a) => {
    if (filters.tab === "图片" && a.kind !== "image") return false;
    if (filters.tab === "视频" && a.kind !== "video") return false;
    if (filters.category !== "全部" && a.category !== filters.category) return false;
    return true;
  });

  return paginate(filtered, pageParam);
}

export type TemplateFilters = {
  tab: string;
  category: string;
  model: string;
  keyword: string;
  sort: string;
  starredIds: string[];
};

export async function fetchTemplatesPage(
  pageParam: number,
  filters: TemplateFilters
): Promise<{
  items: (Template & { uid: string; aspectRatio: number })[];
  nextCursor: number | null;
}> {
  await delay(400);

  const ALL = "all";
  const starredSet = new Set(filters.starredIds);

  const filtered = templates
    .filter((tpl) => {
      if (filters.tab === "图片模板" && tpl.kind !== "image") return false;
      if (filters.tab === "视频模板" && tpl.kind !== "video") return false;
      if (filters.tab === "收藏" && !starredSet.has(tpl.id)) return false;
      if (
        filters.category !== ALL &&
        !tpl.tags.some((t) =>
          t.toLowerCase().includes(filters.category.toLowerCase())
        )
      )
        return false;
      if (filters.model !== ALL && tpl.model !== filters.model) return false;
      if (
        filters.keyword &&
        !tpl.title.toLowerCase().includes(filters.keyword.toLowerCase()) &&
        !tpl.tags.some((t) =>
          t.toLowerCase().includes(filters.keyword.toLowerCase())
        )
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "downloads") return b.downloads - a.downloads;
      if (filters.sort === "title") return a.title.localeCompare(b.title, "zh");
      return 0;
    });

  return paginate(filtered, pageParam);
}

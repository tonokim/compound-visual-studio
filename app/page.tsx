import { AssetGallery } from "@/components/dashboard/asset-gallery";
import { RightPanel } from "@/components/dashboard/right-panel";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <DashboardSidebar activeHref="/" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          title="AI 影像资产中心 & 快速生成器"
          subtitle="为健康长寿领域打造的专业影像创作平台"
        />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <AssetGallery />
          </main>
          <RightPanel />
        </div>
      </div>
    </div>
  );
}

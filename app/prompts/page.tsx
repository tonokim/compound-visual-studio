import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { PromptsWorkspace } from "@/components/prompts/prompts-workspace";

export default function PromptsPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <DashboardSidebar activeHref="/prompts" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          title="Prompt 模板库"
          subtitle="高质量 Prompt 模板，助你快速生成专业影像"
          searchPlaceholder="搜索资产、模板、标签..."
        />
        <div className="flex flex-1 overflow-hidden">
          <PromptsWorkspace />
        </div>
      </div>
    </div>
  );
}

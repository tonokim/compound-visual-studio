"use client";

import { useState } from "react";

import { TemplateDetail } from "@/components/prompts/template-detail";
import { TemplateLibrary, templates } from "@/components/prompts/template-grid";

export function PromptsWorkspace() {
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const [starred, setStarred] = useState<Set<string>>(new Set());

  const selected = templates.find((t) => t.id === selectedId) ?? templates[0];

  const toggleStar = (id: string) =>
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <TemplateLibrary
          selectedId={selected.id}
          onSelect={setSelectedId}
          starred={starred}
          onToggleStar={toggleStar}
        />
      </main>
      <TemplateDetail
        key={selected.id}
        template={selected}
        starred={starred.has(selected.id)}
        onToggleStar={() => toggleStar(selected.id)}
      />
    </>
  );
}

"use client";
import { cn } from "@/lib/utils";
import type { Badge } from "@/lib/badges";

export function BadgeRow({
  badges,
}: {
  badges: (Badge & { unlocked: boolean })[];
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {badges.map((b) => (
        <div
          key={b.id}
          className={cn(
            "min-w-[6.5rem] flex-shrink-0 rounded-2xl border p-3 text-center",
            b.unlocked
              ? "border-accent/30 bg-accent/15"
              : "border-border bg-muted/40 opacity-50",
          )}
        >
          <p className="text-2xl">{b.unlocked ? b.emoji : "🔒"}</p>
          <p className="mt-1 text-xs leading-tight">{b.label}</p>
        </div>
      ))}
    </div>
  );
}

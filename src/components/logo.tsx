import { Brush } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Brush className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold font-headline tracking-tight group-data-[state=collapsed]/sidebar-wrapper:hidden">
        CraftConnect AI
      </h1>
    </div>
  );
}

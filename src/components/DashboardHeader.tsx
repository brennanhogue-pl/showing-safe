"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background border-b md:hidden">
      <div className="flex h-14 items-center gap-3 px-4">
        <SidebarTrigger className="md:hidden" />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold">ShowingSafe</h1>
            {title && <p className="text-xs text-muted-foreground">{title}</p>}
          </div>
        </div>
      </div>
    </header>
  );
}

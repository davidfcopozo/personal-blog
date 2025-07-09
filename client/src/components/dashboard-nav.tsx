import Link from "next/link";
import { LayoutDashboard, Settings, BarChart3, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { DashboardNavProps } from "@/typings/interfaces";

export function DashboardNav({
  activeTab,
  handleTabChange,
  isMobile = false,
}: DashboardNavProps) {
  return (
    <>
      <nav
        className={`flex ${
          isMobile
            ? "flex-row w-full justify-around items-center h-full"
            : "flex-col items-center mt-16 gap-4 px-2 sm:py-5"
        } `}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleTabChange("dashboard")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                  activeTab === "dashboard"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Dashboard"
              >
                <LayoutDashboard strokeWidth={2.2} className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side={isMobile ? "top" : "right"}>
              Dashboard
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleTabChange("performance")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                  activeTab === "performance"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Post Performance"
              >
                <BarChart3 strokeWidth={2.2} className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side={isMobile ? "top" : "right"}>
              Post Performance
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleTabChange("analytics")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                  activeTab === "analytics"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Analytics"
              >
                <TrendingUp strokeWidth={2.2} className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side={isMobile ? "top" : "right"}>
              Analytics
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      {!isMobile && (
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      )}
      {isMobile && (
        <Link
          href="/settings"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
      )}
    </>
  );
}

import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";
import { Search, RefreshCw, Sun, Moon, User } from "lucide-react";
import { NAV_ITEMS } from "@/constants/nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MobileNav } from "@/components/layout/MobileNav";

export function TopNav() {
  const { pathname } = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  const activeItem = NAV_ITEMS.find((item) =>
    item.to === "/" ? pathname === "/" : pathname.startsWith(item.to),
  );

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2.5 border-b bg-card px-4 print:hidden sm:gap-3.5 sm:px-6">
      <MobileNav />
      <div>
        <div className="text-[15px] font-semibold tracking-tight">
          {activeItem?.label ?? "CallVitals"}
        </div>
      </div>

      <div className="ml-2 hidden w-[280px] items-center gap-2 rounded-lg border bg-secondary px-2.5 py-1.5 text-muted-foreground focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring sm:flex">
        <Search className="size-3.5 shrink-0" aria-hidden="true" />
        <Input
          type="text"
          placeholder="Search caller, number, city…"
          aria-label="Search calls"
          className="h-auto border-0 bg-transparent p-0 text-[13px] shadow-none outline-none focus-visible:ring-0 focus-visible:outline-none"
        />
      </div>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="icon"
        aria-label="Refresh data"
        title="Refresh data"
        onClick={() => queryClient.invalidateQueries({ queryKey: ["cdr"] })}
      >
        <RefreshCw className="size-4" aria-hidden="true" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle dark mode"
        title="Toggle theme"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="size-4" aria-hidden="true" />
        ) : (
          <Moon className="size-4" aria-hidden="true" />
        )}
      </Button>

      <Avatar className="size-8" aria-hidden="true">
        <AvatarFallback>
          <User className="size-4" />
        </AvatarFallback>
      </Avatar>
    </header>
  );
}

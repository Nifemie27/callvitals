import { useState, type SubmitEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "next-themes";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, RefreshCw, Sun, Moon, User } from "lucide-react";
import { NAV_ITEMS } from "@/constants/nav";
import { QUERY_KEYS } from "@/constants/query-keys";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";

const PAGES_WITH_CALL_TABLE = ["/", "/reports"];

export function TopNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const isRefreshing = useIsFetching({ queryKey: QUERY_KEYS.cdr }) > 0;

  const hasCallTable = PAGES_WITH_CALL_TABLE.includes(pathname);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingSearch, setPendingSearch] = useState("");
  const searchValue = hasCallTable ? (searchParams.get("q") ?? "") : pendingSearch;

  const activeItem = NAV_ITEMS.find((item) =>
    item.to === "/" ? pathname === "/" : pathname.startsWith(item.to),
  );

  async function handleRefresh() {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cdr });
    toast.success("Call records refreshed");
  }

  function handleSearchChange(value: string) {
    if (hasCallTable) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set("q", value);
          else next.delete("q");
          return next;
        },
        { replace: true },
      );
    } else {
      setPendingSearch(value);
    }
  }

  function handleSearchSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasCallTable && searchValue) {
      navigate(`/reports?q=${encodeURIComponent(searchValue)}`);
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2.5 border-b bg-card px-4 print:hidden sm:gap-3.5 sm:px-6">
      <MobileNav />
      <div>
        <div className="text-[15px] font-semibold tracking-tight">
          {activeItem?.label ?? "CallVitals"}
        </div>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="ml-2 hidden w-[280px] items-center gap-2 rounded-lg border bg-secondary px-2.5 py-1.5 text-muted-foreground focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring sm:flex"
      >
        <Search className="size-3.5 shrink-0" aria-hidden="true" />
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={
            hasCallTable
              ? "Search caller, number, city…"
              : "Search calls, press Enter…"
          }
          aria-label="Search calls"
          className="h-auto border-0 bg-transparent p-0 text-[13px] shadow-none outline-none focus-visible:ring-0 focus-visible:outline-none"
        />
      </form>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="icon"
        aria-label="Refresh data"
        title="Refresh data"
        disabled={isRefreshing}
        onClick={handleRefresh}
      >
        <RefreshCw
          className={cn("size-4", isRefreshing && "animate-spin")}
          aria-hidden="true"
        />
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

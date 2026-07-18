import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CDR_API_URL } from "@/constants/config";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Settings"
        description="Appearance and data preferences for this workspace."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Appearance</CardTitle>
          <CardDescription>
            Choose how CallVitals looks on this device. System follows your
            OS setting and updates automatically if it changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="inline-flex gap-1 rounded-lg border bg-secondary p-1">
            {THEME_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant="ghost"
                aria-pressed={theme === option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "gap-1.5 text-muted-foreground",
                  theme === option.value &&
                    "bg-card text-foreground shadow-sm",
                )}
              >
                <option.icon className="size-3.5" aria-hidden="true" />
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Data source</CardTitle>
          <CardDescription>
            Call records are read directly from the CDR API below — there is
            no local database or write path in this application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <code className="block truncate rounded-md border bg-secondary px-3 py-2 text-xs text-muted-foreground">
            {CDR_API_URL}
          </code>
        </CardContent>
      </Card>
    </div>
  );
}

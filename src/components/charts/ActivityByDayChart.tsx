import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatDayLabel } from "@/lib/format/date";
import { CHART_SERIES_COLOR } from "@/constants/chart-colors";
import type { DailyCallVolume } from "@/features/calls/selectors/grouping";

const chartConfig = {
  calls: { label: "Calls", color: CHART_SERIES_COLOR },
} satisfies ChartConfig;

export function ActivityByDayChart({ data }: { data: DailyCallVolume[] }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[220px] w-full"
      role="img"
      aria-label="Bar chart of call volume by calendar day"
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(date: string) => formatDayLabel(date)}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatDayLabel(String(value))}
            />
          }
        />
        <Bar
          dataKey="calls"
          fill="var(--color-calls)"
          radius={[4, 4, 0, 0]}
          maxBarSize={64}
        />
      </BarChart>
    </ChartContainer>
  );
}

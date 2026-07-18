import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatHourLabel } from "@/lib/format/date";
import { CHART_SERIES_COLOR } from "@/constants/chart-colors";
import type { HourlyCallVolume } from "@/features/calls/selectors/grouping";

const chartConfig = {
  calls: { label: "Calls", color: CHART_SERIES_COLOR },
} satisfies ChartConfig;

export function ActivityTimelineChart({ data }: { data: HourlyCallVolume[] }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[220px] w-full"
      role="img"
      aria-label="Line chart of call volume by hour of day, aggregated across the sample, in UTC"
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ left: -20, right: 12, top: 8, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="hour"
          tickFormatter={(hour: number) => formatHourLabel(hour)}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={3}
        />
        <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `${formatHourLabel(Number(value))}:00 UTC`}
            />
          }
        />
        <Area
          dataKey="calls"
          type="monotone"
          fill="var(--color-calls)"
          fillOpacity={0.12}
          stroke="var(--color-calls)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

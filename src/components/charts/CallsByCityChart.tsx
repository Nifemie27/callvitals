import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CHART_SERIES_COLOR, CHART_OTHER_COLOR } from "@/constants/chart-colors";
import type { callsByCity } from "@/features/calls/selectors/grouping";

const chartConfig = {
  calls: { label: "Calls", color: CHART_SERIES_COLOR },
} satisfies ChartConfig;

interface CallsByCityChartProps {
  grouping: ReturnType<typeof callsByCity>;
}

export function CallsByCityChart({ grouping }: CallsByCityChartProps) {
  const data = useMemo(() => {
    const rows = grouping.top.map((c) => ({
      city: c.city,
      calls: c.calls,
      isOther: false,
    }));
    if (grouping.otherCityCount > 0) {
      rows.push({
        city: `Other (${grouping.otherCityCount})`,
        calls: grouping.otherCalls,
        isOther: true,
      });
    }
    return rows;
  }, [grouping]);

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 4, right: 24, top: 4, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="city"
          tickLine={false}
          axisLine={false}
          width={112}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="calls" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {data.map((row) => (
            <Cell
              key={row.city}
              fill={row.isOther ? CHART_OTHER_COLOR : "var(--color-calls)"}
              fillOpacity={row.isOther ? 0.6 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts";
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

function CityBar(props: BarShapeProps) {
  const isOther = Boolean((props.payload as { isOther?: boolean })?.isOther);
  return (
    <Rectangle
      {...props}
      fill={isOther ? CHART_OTHER_COLOR : "var(--color-calls)"}
      fillOpacity={isOther ? 0.6 : 1}
    />
  );
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
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[200px] w-full"
      role="img"
      aria-label="Horizontal bar chart of call volume by city, with the long tail folded into an Other bucket"
    >
      <BarChart
        accessibilityLayer
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
        <Bar
          dataKey="calls"
          radius={[0, 4, 4, 0]}
          maxBarSize={18}
          shape={CityBar}
        />
      </BarChart>
    </ChartContainer>
  );
}

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  CartesianGrid,
  YAxis,
} from "recharts";

import AnalyticsCard from "./AnalyticsCard";
import { useInvestigations } from "../../context/InvestigationContext";

export default function InvestigationTrendChart({
      investigations,
  }) {

  const data = useMemo(() => {
    const trend = {};

    investigations.forEach((report) => {
      if (!report.investigatedAt) return;

      const date = new Date(report.investigatedAt);

      const label = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      trend[label] = (trend[label] || 0) + 1;
    });

    return Object.entries(trend)
      .map(([name, investigations]) => ({
        name,
        investigations,
      }))
      .sort((a, b) => {
        const dateA = new Date(`${a.name} ${new Date().getFullYear()}`);
        const dateB = new Date(`${b.name} ${new Date().getFullYear()}`);
        return dateA - dateB;
      });
  }, [investigations]);

  return (
    <AnalyticsCard title="Investigation Trend">

      {data.length === 0 ? (

        <div className="flex h-[280px] items-center justify-center text-slate-500">

          No investigation trend available

        </div>

      ) : (

        <ResponsiveContainer width="100%" height={280}>

          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="name"
              stroke="#94A3B8"
            />

            <YAxis
              allowDecimals={false}
              stroke="#94A3B8"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111B33",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="investigations"
              stroke="#06B6D4"
              strokeWidth={3}
              fill="#06B6D4"
              fillOpacity={0.25}
            />

          </AreaChart>

        </ResponsiveContainer>

      )}

    </AnalyticsCard>
  );
}
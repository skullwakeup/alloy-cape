import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import AnalyticsCard from "./AnalyticsCard";
import { useInvestigations } from "../../context/InvestigationContext";

export default function TopRecipientsChart({
      investigations,
  }) {

  const data = useMemo(() => {
    const recipientCounts = {};

    investigations.forEach((report) => {
      const recipients =
        report.recipients?.length > 0
          ? report.recipients
          : ["Unknown"];

      recipients.forEach((recipient) => {
        recipientCounts[recipient] =
          (recipientCounts[recipient] || 0) + 1;
      });
    });

    return Object.entries(recipientCounts)
      .map(([name, docs]) => ({
        name:
          name.length > 22
            ? name.substring(0, 22) + "..."
            : name,
        docs,
      }))
      .sort((a, b) => b.docs - a.docs)
      .slice(0, 5);
  }, [investigations]);

  return (
    <AnalyticsCard title="Top Recipients">

      {data.length === 0 ? (

        <div className="flex h-[300px] items-center justify-center text-slate-500">

          No recipient data available

        </div>

      ) : (

        <ResponsiveContainer width="100%" height={300}>

          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              type="number"
              stroke="#94A3B8"
              allowDecimals={false}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={150}
              stroke="#94A3B8"
              tick={{
                fill: "#CBD5E1",
                fontSize: 13,
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111B33",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Bar
              dataKey="docs"
              fill="#06B6D4"
              radius={[0, 8, 8, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      )}

    </AnalyticsCard>
  );
}
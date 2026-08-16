import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import AnalyticsCard from "./AnalyticsCard";
import { useInvestigations } from "../../context/InvestigationContext";

const COLORS = [
  "#06B6D4",
  "#FACC15",
  "#22C55E",
  "#EF4444",
  "#A855F7",
  "#3B82F6",
];

export default function ClassificationPieChart({
      investigations,
  }) {

  const data = useMemo(() => {
    const counts = {};

    investigations.forEach((report) => {
      const classification = report.classification || "Unknown";

      counts[classification] =
        (counts[classification] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [investigations]);

  return (
    <AnalyticsCard title="Classification Distribution">

      {data.length === 0 ? (

        <div className="flex h-[300px] items-center justify-center text-slate-500">

          No investigation data available

        </div>

      ) : (

        <ResponsiveContainer width="100%" height={300}>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={95}
              innerRadius={55}
              paddingAngle={3}
              stroke="#16213A"
              strokeWidth={2}
            >

              {data.map((entry, index) => (

                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#111B33",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                color: "#CBD5E1",
                paddingTop: "16px",
              }}
            />

          </PieChart>

        </ResponsiveContainer>

      )}

    </AnalyticsCard>
  );
}
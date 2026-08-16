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

import { useInvestigations } from "../context/InvestigationContext";

export default function SecurityAnalytics() {

  const { investigations } = useInvestigations();

  const data = useMemo(() => {

    const growth = {};

    investigations.forEach((report) => {

      if (!report.investigatedAt) return;

      const date = new Date(report.investigatedAt);

      const label = date.toLocaleDateString("en-IN", {

        day: "2-digit",
        month: "short",

      });

      growth[label] = (growth[label] || 0) + 1;

    });

    return Object.entries(growth)

      .map(([name, investigations]) => ({

        name,
        investigations,

      }))

      .sort((a, b) => {

        const dateA =
          new Date(`${a.name} ${new Date().getFullYear()}`);

        const dateB =
          new Date(`${b.name} ${new Date().getFullYear()}`);

        return dateA - dateB;

      });

  }, [investigations]);

  return (

    <div
      className="
        group
        rounded-3xl
        border
        border-slate-700
        bg-[#16213A]
        p-6
        transition-all
        duration-300
        hover:border-cyan-400
        hover:shadow-[0_0_30px_rgba(6,182,212,.12)]
      "
    >

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-white">

            Investigation Growth

          </h2>

          <p className="mt-1 text-sm text-slate-500">

            Historical Investigation Activity

          </p>

        </div>

        <span className="text-sm font-semibold text-green-400">

          ● LIVE

        </span>

      </div>

      {/* Chart */}

      <div className="mt-6">

        <ResponsiveContainer
          width="100%"
          height={330}
        >

          <BarChart

            data={data}

            margin={{

              top: 10,
              right: 20,
              left: 0,
              bottom: 5,

            }}

          >

            <CartesianGrid

              stroke="#334155"

              strokeDasharray="3 3"

            />

            <XAxis

              dataKey="name"

              stroke="#94A3B8"

              tickLine={false}

              axisLine={false}

            />

            <YAxis

              stroke="#94A3B8"

              allowDecimals={false}

              tickLine={false}

              axisLine={false}

            />

            <Tooltip

              contentStyle={{

                background: "#16213A",

                border: "1px solid #334155",

                borderRadius: 12,

                color: "#fff",

              }}

              cursor={{

                fill: "rgba(6,182,212,.08)",

              }}

            />

            <Bar

              dataKey="investigations"

              fill="#06B6D4"

              radius={[8, 8, 0, 0]}

              animationDuration={1000}

            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* Footer */}

      <div className="mt-6 border-t border-slate-700 pt-4">

        <p className="text-xs text-slate-500">

          Live Enterprise Dashboard

        </p>

      </div>

    </div>

  );

}
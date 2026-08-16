import { useMemo } from "react";
import {
  FileText,
  ShieldCheck,
  SearchCheck,
  Activity,
} from "lucide-react";

import { useIssue } from "../../context/IssueContext";
import { useInvestigations } from "../../context/InvestigationContext";

export default function KPICards({
      investigations,
  }) {
  const { registry } = useIssue();

  const totalReports = investigations.length;

  const protectedDocuments = registry.filter(
    (doc) => doc.status === "Protected"
  ).length;

  const highRisk = investigations.filter(
    (r) => r.risk?.toLowerCase() === "high"
  ).length;

  const avgIntegrity =
    investigations.length === 0
      ? "100%"
      : (
          investigations.reduce(
            (sum, r) => sum + (r.integrity ?? 100),
            0
          ) / investigations.length
        ).toFixed(1) + "%";

  const cards = useMemo(
    () => [
      {
        title: "Protected Documents",
        value: protectedDocuments,
        icon: FileText,
        color: "text-cyan-400",
        glow: "shadow-cyan-500/20",
      },
      {
        title: "Investigations",
        value: totalReports,
        icon: SearchCheck,
        color: "text-green-400",
        glow: "shadow-green-500/20",
      },
      {
        title: "High Risk",
        value: highRisk,
        icon: ShieldCheck,
        color: "text-red-400",
        glow: "shadow-red-500/20",
      },
      {
        title: "Average Integrity",
        value: avgIntegrity,
        icon: Activity,
        color: "text-yellow-400",
        glow: "shadow-yellow-500/20",
      },
    ],
    [
      protectedDocuments,
      totalReports,
      highRisk,
      avgIntegrity,
    ]
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`group rounded-3xl border border-slate-700 bg-[#111B33] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-2xl ${card.glow}`}
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-4xl font-black text-white">
                  {card.value}
                </h2>

              </div>

              <div
                className={`rounded-2xl bg-[#1A2745] p-4 transition-transform duration-300 group-hover:scale-110 ${card.color}`}
              >
                <Icon size={28} />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
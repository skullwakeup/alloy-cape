import { useMemo } from "react";
import {
  Database,
  FileStack,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";

import { useInvestigations } from "../../context/InvestigationContext";

export default function DocumentInsights({
      investigations,
  }) {

  const documentInsights = useMemo(() => {
    const totalInvestigations = investigations.length;

    const averageIntegrity =
      totalInvestigations > 0
        ? (
            investigations.reduce(
              (sum, report) => sum + (report.integrity ?? 0),
              0
            ) / totalInvestigations
          ).toFixed(1)
        : "0.0";

    const uniqueDocuments = new Set(
      investigations.map((report) => report.documentId)
    ).size;

    const successfulVerifications = investigations.filter(
      (report) => report.success
    ).length;

    return {
      totalInvestigations,
      averageIntegrity,
      uniqueDocuments,
      successfulVerifications,
    };
  }, [investigations]);

  const cards = [
    {
      title: "Total Investigations",
      value: documentInsights.totalInvestigations,
      icon: Database,
      color: "text-cyan-400",
    },
    {
      title: "Average Integrity",
      value: `${documentInsights.averageIntegrity}%`,
      icon: FileStack,
      color: "text-yellow-400",
    },
    {
      title: "Unique Documents",
      value: documentInsights.uniqueDocuments,
      icon: Fingerprint,
      color: "text-purple-400",
    },
    {
      title: "Verified Documents",
      value: documentInsights.successfulVerifications,
      icon: ShieldCheck,
      color: "text-green-400",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-6 shadow-xl">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Document Insights
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Overall document protection metrics
          </p>

        </div>

        <div className="flex items-center gap-2">

          <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />

          <span className="text-sm font-semibold text-green-400">
            LIVE
          </span>

        </div>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-slate-700 bg-[#111B33] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-wider text-slate-500">

                    {card.title}

                  </p>

                  <h3 className="mt-2 text-3xl font-black text-white">

                    {card.value}

                  </h3>

                </div>

                <div
                  className={`rounded-xl bg-[#1A2745] p-3 transition-transform duration-300 group-hover:scale-110 ${card.color}`}
                >

                  <Icon size={28} />

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
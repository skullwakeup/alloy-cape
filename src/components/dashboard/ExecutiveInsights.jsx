import {
  BrainCircuit,
  ShieldAlert,
} from "lucide-react";

export default function ExecutiveInsights({ stats }) {

  const {
    documentCount,
    investigationCount,
    averageIntegrity,
    averageConfidence,
    riskDistribution,
  } = stats;

  const totalRisks =
    riskDistribution.High +
    riskDistribution.Medium +
    riskDistribution.Low;

  const dominantRisk =
    riskDistribution.High >= riskDistribution.Medium &&
    riskDistribution.High >= riskDistribution.Low
      ? "High"
      : riskDistribution.Medium >= riskDistribution.Low
      ? "Medium"
      : "Low";

  const insights = [

    `${documentCount} protected document${
      documentCount !== 1 ? "s" : ""
    } currently registered.`,

    `${investigationCount} forensic investigation${
      investigationCount !== 1 ? "s" : ""
    } completed.`,

    `Average document integrity remains at ${averageIntegrity}%.`,

    `Average AI confidence is ${averageConfidence}% across all investigations.`,

    totalRisks === 0
      ? "No active security incidents have been detected."
      : `${dominantRisk} risk investigations currently represent the highest proportion of forensic cases.`,

  ];

  return (

    <div
      className="
        group
        rounded-3xl
        border
        border-slate-700
        bg-[#16213A]
        p-8
        transition-all
        duration-300
        hover:border-cyan-400
        hover:shadow-[0_0_30px_rgba(6,182,212,.12)]
      "
    >

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <BrainCircuit
            size={34}
            className="text-cyan-400"
          />

          <div>

            <h2 className="text-xl font-bold text-white">

              Executive Insights

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              AI Generated Security Summary

            </p>

          </div>

        </div>

        <span className="text-sm font-semibold text-green-400">

          ● LIVE

        </span>

      </div>

      {/* Insights */}

      <div className="space-y-4">

        {

          insights.map((item, index) => (

            <div

              key={index}

              className="
                flex
                items-start
                gap-4
                rounded-2xl
                border
                border-slate-700
                bg-[#111B33]
                p-4
                transition
                hover:border-cyan-500
              "

            >

              <ShieldAlert
                size={20}
                className="mt-1 text-cyan-400"
              />

              <p className="leading-7 text-slate-200">

                {item}

              </p>

            </div>

          ))

        }

      </div>

      {/* Footer */}

      <div className="mt-8 border-t border-slate-700 pt-4">

        <p className="text-xs text-slate-500">

          AI Generated Enterprise Summary

        </p>

      </div>

    </div>

  );

}
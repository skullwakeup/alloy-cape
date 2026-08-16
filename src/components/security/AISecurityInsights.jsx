import {
  BrainCircuit,
  Sparkles,
} from "lucide-react";

export default function AISecurityInsights({ security }) {

  const insights = [];

  const successRate =
    security.total === 0
      ? 100
      : Math.round(
          (security.verified / security.total) * 100
        );

  if (security.total === 0) {

    insights.push(
      "No investigations have been performed yet."
    );

  } else {

    insights.push(
      `${successRate}% of investigated documents passed verification.`
    );

    insights.push(
      `Overall security health score is ${security.healthScore}%.`
    );

    if (security.highRisk > 0) {

      insights.push(
        `${security.highRisk} high-risk investigation(s) require immediate attention.`
      );

    } else {

      insights.push(
        "No high-risk investigations detected."
      );

    }

    if (security.poor > 0) {

      insights.push(
        `${security.poor} document(s) have integrity below 70%.`
      );

    } else {

      insights.push(
        "All investigated documents maintain acceptable integrity."
      );

    }

    if (security.healthScore >= 90) {

      insights.push(
        "Overall enterprise security posture is excellent."
      );

    }

    else if (security.healthScore >= 75) {

      insights.push(
        "Security posture is stable with minor improvement opportunities."
      );

    }

    else {

      insights.push(
        "Immediate security review is recommended."
      );

    }

  }

  return (

    <div className="rounded-3xl border border-cyan-500/20 bg-[#16213A] p-8 shadow-2xl">

      <div className="mb-8 flex items-center gap-4">

        <div className="rounded-2xl bg-cyan-500/10 p-3">

          <BrainCircuit
            size={28}
            className="text-cyan-400"
          />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">

            AI Security Insights

          </h2>

          <p className="mt-1 text-slate-400">

            Executive intelligence generated from investigation history.

          </p>

        </div>

      </div>

      <div className="space-y-4">

        {insights.map((item, index) => (

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
            p-5
            transition-all
            duration-300
            hover:border-cyan-500/40
            hover:shadow-xl
            "
          >

            <div className="rounded-xl bg-cyan-500/10 p-2">

              <Sparkles
                size={18}
                className="text-cyan-400"
              />

            </div>

            <p className="leading-7 text-slate-200">

              {item}

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}
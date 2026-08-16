import {
  Brain,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";

export default function AIInvestigationReport({
  intelligence,
  aiAnalysis,
  investigation,
}) {
  if (!aiAnalysis) return null;

  /*
   * IMPORTANT:
   * The completed forensic investigation is the source of truth.
   * AI-generated values are used for explanation/narrative only.
   */

  const risk = investigation?.risk ?? intelligence?.risk?.level ?? "Unknown";

  const riskScore =
    risk === "Low"
      ? 0
      : risk === "Medium"
      ? 50
      : risk === "High"
      ? 100
      : intelligence?.risk?.score ?? 0;

  const trustScore =
    investigation?.integrity ??
    intelligence?.trust?.score ??
    0;

  const confidenceValue =
    investigation?.confidence ??
    aiAnalysis?.confidence ??
    0;

  const confidence = Math.round(
    Number(
      String(confidenceValue)
        .replace("%", "")
        .trim()
    ) || 0
  );

  const integrity = Number(investigation?.integrity ?? 0);

  const leakProbability = Number(
    investigation?.leakProbability ?? 0
  );

  const leakLevel =
    investigation?.leakLevel ??
    "Minimal";

  const tampered =
    investigation?.tampered === true;

  const riskColor =
    risk === "Low"
      ? "text-green-400"
      : risk === "Medium"
      ? "text-yellow-400"
      : risk === "High"
      ? "text-red-400"
      : "text-slate-400";

  return (
    <section className="mt-10 rounded-3xl border border-slate-700 bg-[#111B33] p-7">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="mb-8 flex items-center gap-4">

        <Brain
          size={32}
          className="text-cyan-400"
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            Alloy AI Security Assessment
          </h3>

          <p className="text-slate-400">
            AI-assisted forensic interpretation based on the
            completed investigation.
          </p>

        </div>

      </div>


      {/* ====================================================== */}
      {/* EXECUTIVE SUMMARY */}
      {/* ====================================================== */}

      <section>

        <h4 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">

          <ShieldCheck className="text-green-400" />

          Executive Summary

        </h4>

        <p className="leading-8 break-words text-slate-300">

          {aiAnalysis.executiveSummary ||
            investigation?.summary ||
            "No executive summary is available."}

        </p>

      </section>


      {/* ====================================================== */}
      {/* INVESTIGATION INTELLIGENCE */}
      {/* ====================================================== */}

      <section className="mt-10">

        <h4 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">

          <Activity className="text-cyan-400" />

          Investigation Intelligence

        </h4>


        <div className="grid gap-5 md:grid-cols-3">


          <MetricCard
            title="Risk Score"
            score={riskScore}
            level={risk}
            color={riskColor}
          />


          <MetricCard
            title="Document Integrity"
            score={integrity}
            level={
              tampered
                ? "TAMPERED"
                : "AUTHENTIC"
            }
            color={
              tampered
                ? "text-red-400"
                : "text-green-400"
            }
          />


          <MetricCard
            title="Investigation Confidence"
            score={confidence}
            color="text-green-400"
          />

        </div>

      </section>


      {/* ====================================================== */}
      {/* LEAK ASSESSMENT */}
      {/* ====================================================== */}

      <section className="mt-10">

        <h4 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">

          <Activity className="text-cyan-400" />

          Leak Assessment

        </h4>


        <div className="grid gap-5 md:grid-cols-3">


          <MetricCard
            title="Leak Probability"
            score={leakProbability}
            level={leakLevel}
            color={
              leakProbability >= 60
                ? "text-red-400"
                : leakProbability >= 20
                ? "text-yellow-400"
                : "text-green-400"
            }
          />


          <MetricCard
            title="Trust Score"
            score={trustScore}
            level={
              trustScore >= 80
                ? "High"
                : trustScore >= 50
                ? "Moderate"
                : "Low"
            }
            color={
              trustScore >= 80
                ? "text-green-400"
                : trustScore >= 50
                ? "text-yellow-400"
                : "text-red-400"
            }
          />


          <MetricCard
            title="Integrity Status"
            score={integrity}
            level={
              tampered
                ? "Tampering Detected"
                : "No Tampering"
            }
            color={
              tampered
                ? "text-red-400"
                : "text-green-400"
            }
          />

        </div>

      </section>


      {/* ====================================================== */}
      {/* TECHNICAL ASSESSMENT */}
      {/* ====================================================== */}

      <section className="mt-10">

        <h4 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">

          <Activity className="text-cyan-400" />

          Technical Assessment

        </h4>

        <p className="leading-8 whitespace-normal break-words text-slate-300">

          {aiAnalysis.technicalAssessment ||
            "No technical assessment is available."}

        </p>

      </section>


      {/* ====================================================== */}
      {/* KEY FINDINGS */}
      {/* ====================================================== */}

      <ListCard
        title="Key Findings"
        icon={
          <CheckCircle2 className="text-green-400" />
        }
        items={aiAnalysis.keyFindings}
      />


      {/* ====================================================== */}
      {/* RECOMMENDATIONS */}
      {/* ====================================================== */}

      <ListCard
        title="Recommended Actions"
        icon={
          <Lightbulb className="text-yellow-400" />
        }
        items={aiAnalysis.recommendations}
      />


      {/* ====================================================== */}
      {/* POSSIBLE CAUSES */}
      {/* ====================================================== */}

      <ListCard
        title="Possible Causes"
        icon={
          <AlertTriangle className="text-red-400" />
        }
        items={aiAnalysis.possibleCauses}
      />

    </section>
  );
}


/* ============================================================ */
/* METRIC CARD */
/* ============================================================ */

function MetricCard({
  title,
  score,
  level,
  color,
}) {
  const safeScore = Math.min(
    100,
    Math.max(
      0,
      Number(score) || 0
    )
  );

  const barColor =
    color === "text-red-400"
      ? "bg-red-400"
      : color === "text-yellow-400"
      ? "bg-yellow-400"
      : color === "text-green-400"
      ? "bg-green-400"
      : color === "text-cyan-400"
      ? "bg-cyan-400"
      : "bg-cyan-400";

  return (
    <div className="rounded-2xl border border-slate-700 bg-[#16213A] p-5">

      <div className="flex flex-col gap-2">

        <p className="text-slate-400">
          {title}
        </p>

        {level && (
          <p className={`${color} text-sm font-semibold`}>
            {level}
          </p>
        )}

      </div>

      <div className="mt-4">

        <div className="mb-2 flex justify-between">

          <span className="text-3xl font-bold text-white">
            {safeScore}
          </span>

          <span className="text-sm text-slate-500">
            / 100
          </span>

        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700">

          <div
            className={`h-full rounded-full ${barColor} transition-all duration-1000`}
            style={{
              width: `${safeScore}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

/* ============================================================ */
/* LIST CARD */
/* ============================================================ */

function ListCard({
  title,
  icon,
  items,
}) {

  if (!items?.length) return null;

  return (

    <section className="mt-10">

      <h4 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">

        {icon}

        {title}

      </h4>


      <div className="space-y-4">

        {items.map((item, index) => (

          <div
            key={index}
            className="rounded-2xl border border-slate-700 bg-[#16213A] p-5"
          >

            <div className="flex gap-4">

              <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400" />

              <p className="leading-7 break-words text-slate-300">

                {item}

              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
import {
  ShieldCheck,
  Brain,
  FileText,
  Search,
} from "lucide-react";

function Metric({
  icon,
  label,
  value,
}) {
  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-700
        bg-[#111B33]
        p-4
        transition
        hover:border-cyan-500
      "
    >

      <div className="flex items-center gap-2 text-cyan-400">

        {icon}

        <span className="text-sm">

          {label}

        </span>

      </div>

      <h3 className="mt-3 text-2xl font-bold text-white">

        {value}

      </h3>

    </div>

  );
}

export default function SecurityOverview({ stats }) {

  const score = Math.round(

    (stats.averageIntegrity +

      stats.averageConfidence) / 2

  );

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

        <div>

          <h2 className="text-xl font-bold text-white">

            Security Overview

          </h2>

          <p className="mt-1 text-sm text-slate-500">

            Live Enterprise Security Status

          </p>

        </div>

        <span className="text-sm font-semibold text-green-400">

          ● LIVE

        </span>

      </div>

      {/* Score */}

      <div className="text-center">

        <h1 className="text-6xl font-black text-cyan-400">

          {score}%

        </h1>

        <p className="mt-3 font-semibold text-green-400">

          Excellent Protection

        </p>

      </div>

      {/* Progress */}

      <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-700">

        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-1000"
          style={{
            width: `${score}%`,
          }}
        />

      </div>

      {/* Metrics */}

      <div className="mt-8 grid grid-cols-2 gap-4">

        <Metric
          icon={<FileText size={18} />}
          label="Documents"
          value={stats.documentCount}
        />

        <Metric
          icon={<Search size={18} />}
          label="Investigations"
          value={stats.investigationCount}
        />

        <Metric
          icon={<ShieldCheck size={18} />}
          label="Integrity"
          value={`${stats.averageIntegrity}%`}
        />

        <Metric
          icon={<Brain size={18} />}
          label="AI Confidence"
          value={`${stats.averageConfidence}%`}
        />

      </div>

      {/* Footer */}

      <div className="mt-8 border-t border-slate-700 pt-4">

        <p className="text-xs text-slate-500">

          Live Enterprise Dashboard

        </p>

      </div>

    </div>

  );

}
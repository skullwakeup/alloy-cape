import { ShieldCheck } from "lucide-react";

export default function SecurityHealth({ healthScore }) {
  const status =
    healthScore >= 90
      ? "Excellent"
      : healthScore >= 75
      ? "Good"
      : "Needs Attention";

  const statusColor =
    healthScore >= 90
      ? "text-green-400"
      : healthScore >= 75
      ? "text-yellow-400"
      : "text-red-400";

  const progressColor =
    healthScore >= 90
      ? "bg-green-500"
      : healthScore >= 75
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#16213A] p-8">

      <div className="flex items-center justify-between">

        <div>

          <div className="flex items-center gap-3">

            <ShieldCheck
              className="text-cyan-400"
              size={30}
            />

            <h2 className="text-2xl font-bold text-white">
              Security Health
            </h2>

          </div>

          <p className="mt-3 max-w-2xl text-slate-400 leading-7">
            Overall health calculated from document integrity,
            forensic verification and investigation outcomes.
          </p>

        </div>

        <div className="text-right">

          <div className="text-6xl font-black text-cyan-400 drop-shadow-[0_0_18px_rgba(6,182,212,0.45)]">

            {healthScore}%

          </div>

          <div className={`mt-2 font-semibold ${statusColor}`}>

            {status}

          </div>

        </div>

      </div>

      <div className="mt-8 h-4 overflow-hidden rounded-full bg-slate-700">

        <div
          className={`${progressColor} h-full rounded-full transition-all duration-1000`}
          style={{
            width: `${healthScore}%`,
          }}
        />

      </div>

    </div>
  );
}
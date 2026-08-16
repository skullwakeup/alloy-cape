import { BarChart3, ShieldCheck } from "lucide-react";

export default function AnalyticsHeader() {
  return (
    <div className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-cyan-500/20
      bg-gradient-to-r
      from-[#0B1220]
      via-[#111C33]
      to-[#16213A]
      p-8
      shadow-2xl
      transition-all
      duration-300
      hover:border-cyan-400/40
    ">

      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="relative flex items-center justify-between">

        <div>

          <div className="flex items-center gap-3">

            <BarChart3
              className="text-cyan-400"
              size={34}
            />

            <h1 className="text-4xl font-bold text-white">
              Security Analytics
            </h1>

          </div>

          <p className="mt-4 max-w-3xl text-slate-400">
            Real-time operational intelligence generated from protected documents, forensic investigations, attribution analysis and registry activity.
          </p>

        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4">

          <div className="flex items-center gap-2">

            <ShieldCheck
              className="text-green-400"
              size={20}
            />

            <div>

                <div className="flex items-center gap-2">

                    <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse"/>

                    <span className="font-bold text-green-400">

                        LIVE

                    </span>

                </div>

                <p className="mt-1 text-xs text-slate-400">

                    Registry Healthy

                </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
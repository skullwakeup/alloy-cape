import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Activity,
} from "lucide-react";

function Card({
  title,
  value,
  icon: Icon,
  color,
  glow,
}) {
  return (
    <div
      className={`
        group
        rounded-3xl
        border
        border-slate-700
        bg-[#111B33]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-500/40
        hover:shadow-2xl
        ${glow}
      `}
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-4xl font-black text-white">
            {value}
          </h3>

        </div>

        <div
          className={`
            rounded-2xl
            bg-[#1A2745]
            p-4
            transition-transform
            duration-300
            group-hover:scale-110
            ${color}
          `}
        >
          <Icon size={28} />
        </div>

      </div>
    </div>
  );
}

export default function ThreatSummary({ security }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <Card
        title="Verified"
        value={security.verified}
        icon={ShieldCheck}
        color="text-green-400"
        glow="shadow-green-500/20"
      />

      <Card
        title="High Risk"
        value={security.highRisk}
        icon={ShieldX}
        color="text-red-400"
        glow="shadow-red-500/20"
      />

      <Card
        title="Medium Risk"
        value={security.mediumRisk}
        icon={ShieldAlert}
        color="text-yellow-400"
        glow="shadow-yellow-500/20"
      />

      <Card
        title="Total Investigations"
        value={security.total}
        icon={Activity}
        color="text-cyan-400"
        glow="shadow-cyan-500/20"
      />

    </div>
  );
}
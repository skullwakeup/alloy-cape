import {
  FileText,
  Search,
  ShieldCheck,
  Brain,
} from "lucide-react";

const icons = {
  documents: FileText,
  investigations: Search,
  integrity: ShieldCheck,
  confidence: Brain,
};

export default function StatCard({
  icon,
  title,
  value,
  color,
}) {
  const Icon = icons[icon];

  return (
    <div className="rounded-2xl border border-slate-700 bg-[#16213A] p-6 transition hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {value}
          </h2>

        </div>

        <div
          className={`rounded-xl p-4 ${color}`}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>

      </div>

    </div>
  );
}
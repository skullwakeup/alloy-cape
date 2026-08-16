import { Clock3, FileText } from "lucide-react";
import { useInvestigations } from "../../context/InvestigationContext";

export default function RecentActivity({
      investigations,
  }) {
    const loading = false;
  const data = [...investigations]
    .sort(
      (a, b) =>
        new Date(b.investigatedAt ?? 0) -
        new Date(a.investigatedAt ?? 0)
    )
    .slice(0, 8);

  return (
    <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-6 shadow-xl">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Recent Investigation Activity
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Latest forensic events across the platform
          </p>

        </div>

        <div className="flex items-center gap-2">

          <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />

          <span className="text-sm font-semibold text-green-400">
            LIVE
          </span>

        </div>

      </div>

      <div className="space-y-5">

        {loading && (
          <div className="py-10 text-center text-slate-400">
            Loading investigations...
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            No investigation activity found.
          </div>
        )}

        {!loading &&
          data.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start gap-4 rounded-2xl border border-slate-700 bg-[#111B33] p-4 transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/5"
            >

              <div className="rounded-xl bg-cyan-500/10 p-3">

                <FileText
                  className="text-cyan-400"
                  size={22}
                />

              </div>

              <div className="min-w-0 flex-1">

                <h3
                  className="truncate font-semibold text-white"
                  title={doc.fileName}
                >
                  {doc.fileName}
                </h3>

                <p className="mt-1 text-sm text-slate-400">

                  {doc.classification} • {doc.risk} Risk • {doc.investigator}

                </p>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">

                  <Clock3 size={14} />

                  {doc.investigatedAt
                    ? new Date(doc.investigatedAt).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "Unknown"}

                </div>

              </div>

            </div>
          ))}

      </div>

    </div>
  );
}
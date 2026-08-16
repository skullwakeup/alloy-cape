import {
  Clock3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

export default function RecentSecurityEvents({
  security,
}) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-8 shadow-2xl">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Recent Security Events
          </h2>

          <p className="mt-2 text-slate-400">
            Latest forensic investigations performed by the Alloy Cape security engine.
          </p>

        </div>

        <div className="rounded-2xl bg-cyan-500/10 p-3">

          <Clock3
            className="text-cyan-400"
            size={24}
          />

        </div>

      </div>

      <div className="space-y-5">

        {security.recentEvents.length === 0 && (

          <div className="rounded-2xl border border-dashed border-slate-700 py-12 text-center text-slate-500">

            No recent security events.

          </div>

        )}

        {security.recentEvents.map((event) => {

          const integrity = event.integrity ?? 0;

          let Icon = CheckCircle2;
          let color = "text-green-400";
          let badge =
            "bg-green-500/20 text-green-400 border-green-500/30";
          let status = "Verified";

          if (!event.success) {

            Icon = XCircle;
            color = "text-red-400";
            badge =
              "bg-red-500/20 text-red-400 border-red-500/30";
            status = "Verification Failed";

          } else if (integrity < 80) {

            Icon = AlertTriangle;
            color = "text-yellow-400";
            badge =
              "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            status = "Integrity Warning";

          }

          return (

            <div
              key={event.id}
              className="flex items-center justify-between rounded-2xl border border-slate-700 bg-[#111B33] p-5 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-xl"
            >

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-[#1A2745] p-3">

                  <Icon
                    size={24}
                    className={color}
                  />

                </div>

                <div>

                  <h3
                    className="max-w-md truncate font-semibold text-white"
                    title={event.fileName}
                  >
                    {event.fileName}
                  </h3>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}
                  >
                    {status}
                  </span>

                </div>

              </div>

              <div className="text-right">

                <div className="text-2xl font-bold text-cyan-400">

                  {integrity.toFixed(0)}%

                </div>

                <div className="mt-1 text-xs text-slate-500">

                  {new Date(
                    event.investigatedAt
                  ).toLocaleString("en-GB")}

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}
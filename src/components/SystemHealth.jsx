import {
  ShieldCheck,
  Database,
  Brain,
  Fingerprint,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getDashboardStatistics,
} from "../services/dashboard/dashboardService";

export default function SystemHealth() {

  const [stats, setStats] = useState(null);

  const [lastSync, setLastSync] = useState(
    new Date()
  );

  useEffect(() => {

    async function load() {

      try {

        const data =
          await getDashboardStatistics();

        setStats(data);

        setLastSync(new Date());

      }

      catch (err) {

        console.error(err);

      }

    }

    load();

  }, []);

  if (!stats) {

    return (

      <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-6">

        <h2 className="text-xl font-bold text-white mb-6">
          System Health
        </h2>

        <p className="text-slate-500">
          Loading...
        </p>

      </div>

    );

  }

  const services = [

    {
      icon: Fingerprint,
      name: "DNA Engine",
      value: "Healthy",
      color: "text-green-400",
    },

    {
      icon: Brain,
      name: "AI Engine",
      value: `${stats.averageConfidence}% Confidence`,
      color: "text-cyan-400",
    },

    {
      icon: Database,
      name: "Registry",
      value: `${stats.documentCount} Documents`,
      color: "text-yellow-400",
    },

    {
      icon: ShieldCheck,
      name: "Investigations",
      value: `${stats.investigationCount} Cases`,
      color: "text-purple-400",
    },

  ];

  return (

    <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold text-white">

          System Health

        </h2>

        <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">

          ● LIVE

        </span>

      </div>

      <div className="space-y-4">

        {services.map((service) => {

          const Icon = service.icon;

          return (

            <div
              key={service.name}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-slate-700
                bg-[#111B33]
                p-4
                transition
                hover:border-cyan-500
              "
            >

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-cyan-500/20 p-3">

                  <Icon
                    size={20}
                    className="text-cyan-400"
                  />

                </div>

                <div>

                  <p className="font-semibold text-white">
                    {service.name}
                  </p>

                  <p className={`text-sm ${service.color}`}>
                    {service.value}
                  </p>

                </div>

              </div>

              <span className="text-green-400 font-bold">

                ●

              </span>

            </div>

          );

        })}

      </div>

      <div className="mt-6 border-t border-slate-700 pt-4">

        <p className="text-xs text-slate-500">

          Last Sync

        </p>

        <p className="mt-1 text-sm text-cyan-400">

          {lastSync.toLocaleTimeString()}

        </p>

      </div>

    </div>

  );

}
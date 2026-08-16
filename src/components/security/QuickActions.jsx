import { useNavigate } from "react-router-dom";

import {
  FileKey,
  Search,
  Database,
  FileText,
  ArrowRight,
  LockKeyhole,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const actions = [
  {
    title: "Issue Document",
    subtitle: "Protect a new confidential document",
    icon: FileKey,
    color: "text-cyan-400",
    path: "/issue",
    administratorOnly: true,
  },
  {
    title: "Investigate Document",
    subtitle: "Run forensic attribution",
    icon: Search,
    color: "text-green-400",
    path: "/investigations",
  },
  {
    title: "DNA Registry",
    subtitle: "Browse protected documents",
    icon: Database,
    color: "text-yellow-400",
    path: "/registry",
  },
  {
    title: "Investigation Reports",
    subtitle: "View forensic reports",
    icon: FileText,
    color: "text-red-400",
    path: "/reports",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  const { role } = useAuth();

  const isAdministrator =
    role === "administrator";

  return (
    <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-8 shadow-2xl">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-white">
          Quick Actions
        </h2>

        <p className="mt-2 text-slate-400">
          Frequently used security operations.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {actions.map((action) => {

          const Icon = action.icon;

          const locked =
            action.administratorOnly &&
            !isAdministrator;

          if (locked) {
            return (
              <div
                key={action.title}
                className="
                  cursor-not-allowed
                  rounded-3xl
                  border
                  border-slate-700
                  bg-[#101A30]
                  p-6
                  opacity-70
                "
              >

                <div className="flex items-center justify-between">

                  <div className="rounded-2xl bg-[#16213A] p-4">

                    <Icon
                      size={26}
                      className="text-slate-500"
                    />

                  </div>

                  <LockKeyhole
                    size={20}
                    className="text-slate-600"
                  />

                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-400">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Administrator access required
                </p>

              </div>
            );
          }

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="
                group
                rounded-3xl
                border
                border-slate-700
                bg-[#111B33]
                p-6
                text-left
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-500/40
                hover:shadow-2xl
              "
            >

              <div className="flex items-center justify-between">

                <div
                  className={`
                    rounded-2xl
                    bg-[#1A2745]
                    p-4
                    ${action.color}
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  `}
                >
                  <Icon size={26} />
                </div>

                <ArrowRight
                  size={18}
                  className="
                    text-slate-500
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    group-hover:text-cyan-400
                  "
                />

              </div>

              <h3 className="mt-6 text-lg font-bold text-white">
                {action.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {action.subtitle}
              </p>

            </button>
          );

        })}

      </div>

    </div>
  );
}
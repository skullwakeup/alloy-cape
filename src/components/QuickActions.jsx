import { useNavigate } from "react-router-dom";

import {
  FilePlus2,
  Search,
  BarChart3,
  FolderOpen,
  ArrowRight,
  LockKeyhole,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function QuickActions() {

  const navigate = useNavigate();

  const { role } = useAuth();

  const isAdministrator =
    role === "administrator";

  const actions = [

    {
      title: "Issue Document",
      subtitle: isAdministrator
        ? "Generate protected copies"
        : "Administrator access required",
      icon: FilePlus2,
      color: isAdministrator
        ? "bg-yellow-400 text-black"
        : "bg-[#101A30] text-slate-400",
      locked: !isAdministrator,
      action: isAdministrator
        ? () => navigate("/issue")
        : undefined,
    },

    {
      title: "Investigate Leak",
      subtitle: "Run forensic attribution",
      icon: Search,
      color: "bg-[#1B2742] text-white",
      action: () => navigate("/investigations"),
    },

    {
      title: "View Analytics",
      subtitle: "Open security dashboard",
      icon: BarChart3,
      color: "bg-[#1B2742] text-white",
      action: () => navigate("/analytics"),
    },

    {
      title: "Document Registry",
      subtitle: "Browse protected files",
      icon: FolderOpen,
      color: "bg-[#1B2742] text-white",
      action: () => navigate("/registry"),
    },

  ];

  return (

    <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-6">

      <h2 className="mb-6 text-xl font-bold text-white">
        Quick Actions
      </h2>

      <div className="space-y-4">

        {actions.map((item) => {

          const Icon = item.icon;

          if (item.locked) {

            return (

              <div
                key={item.title}
                className="
                  flex
                  w-full
                  cursor-not-allowed
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-slate-700
                  bg-[#101A30]
                  px-5
                  py-4
                  opacity-70
                "
              >

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-[#16213A] p-2">

                    <Icon
                      size={22}
                      className="text-slate-500"
                    />

                  </div>

                  <div className="text-left">

                    <div className="flex items-center gap-2 font-semibold text-slate-400">

                      <span>
                        {item.title}
                      </span>

                      <LockKeyhole
                        size={15}
                        className="text-slate-500"
                      />

                    </div>

                    <div className="mt-1 text-sm text-slate-500">

                      {item.subtitle}

                    </div>

                  </div>

                </div>

                <LockKeyhole
                  size={18}
                  className="text-slate-600"
                />

              </div>

            );

          }

          return (

            <button
              key={item.title}
              onClick={item.action}
              className={`
                group
                flex
                w-full
                items-center
                justify-between
                rounded-2xl
                ${item.color}
                px-5
                py-4
                transition-all
                duration-300
                hover:scale-[1.02]
              `}
            >

              <div className="flex items-center gap-4">

                <Icon size={22} />

                <div className="text-left">

                  <div className="font-semibold">
                    {item.title}
                  </div>

                  <div
                    className={
                      item.color.includes("yellow")
                        ? "text-black/70 text-sm"
                        : "text-slate-400 text-sm"
                    }
                  >
                    {item.subtitle}
                  </div>

                </div>

              </div>

              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />

            </button>

          );

        })}

      </div>

    </div>

  );

}
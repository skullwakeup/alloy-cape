import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Shield,
  Search,
  BarChart3,
  Settings,
  Fingerprint,
  Database,
  Activity,
  FileText,
  FileKey,
  FolderOpen,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
    roles: [
      "administrator",
      "security_officer",
    ],
  },

  {
    name: "Issue Document",
    icon: FileKey,
    path: "/issue",
    roles: [
      "administrator",
    ],
  },

  {
    name: "Registry",
    icon: Database,
    path: "/registry",
    roles: [
      "administrator",
      "security_officer",
    ],
  },

  {
    name: "Investigation",
    icon: Search,
    path: "/investigations",
    roles: [
      "administrator",
      "security_officer",
    ],
  },

  {
    name: "Analytics",
    icon: BarChart3,
    path: "/analytics",
    roles: [
      "administrator",
      "security_officer",
    ],
  },

  {
    name: "Reports",
    icon: FileText,
    path: "/reports",
    roles: [
      "administrator",
      "security_officer",
    ],
  },

  {
    name: "Security",
    icon: Shield,
    path: "/security",
    roles: [
      "administrator",
      "security_officer",
    ],
  },

  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
    roles: [
      "administrator",
    ],
  },

  {
    name: "My Documents",
    icon: FolderOpen,
    path: "/employee",
    roles: [
      "employee",
    ],
  },
];

export default function Sidebar() {

  const {
    profile,
    role,
  } = useAuth();

  const visibleMenu =
    menu.filter((item) =>
      item.roles.includes(role)
    );

  return (

    <aside className="w-72 bg-[#0A1325] border-r border-cyan-900/40 flex flex-col">

      {/* Logo */}

      <div className="p-8 border-b border-slate-800">

        <div className="flex items-center gap-4">

          <div className="bg-cyan-500 rounded-2xl p-3 shadow-lg shadow-cyan-500/30">

            <Fingerprint
              className="text-black"
              size={28}
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              Alloy Cape
            </h1>

            <p className="text-sm text-cyan-400">
              Enterprise Edition
            </p>

          </div>

        </div>

      </div>


      {/* User Role */}

      <div className="px-5 pt-5">

        <div className="rounded-2xl border border-slate-700 bg-[#111B33] px-4 py-3">

          <div className="text-xs uppercase tracking-wider text-slate-500">
            Signed in as
          </div>

          <div className="mt-1 font-semibold text-white">

            {profile?.full_name ??
              "Authorized User"}

          </div>

          <div className="mt-1 text-xs capitalize text-cyan-400">

            {role?.replace(
              "_",
              " "
            ) ?? "Unknown Role"}

          </div>

        </div>

      </div>


      {/* Navigation */}

      <nav className="flex-1 px-5 py-6">

        {visibleMenu.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-2xl px-5 py-4 mb-3 transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                    : "text-slate-400 hover:bg-[#16213A] hover:text-white"
                }`
              }
            >

              <Icon size={20} />

              <span className="font-semibold">
                {item.name}
              </span>

            </NavLink>

          );

        })}

      </nav>


      {/* Registry Status */}

      <div className="mx-5 mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">

        <div className="flex items-center gap-3">

          <Activity
            size={18}
            className="text-green-400 animate-pulse"
          />

          <div>

            <div className="text-sm font-semibold text-green-400">
              Registry Healthy
            </div>

            <div className="text-xs text-slate-400">
              All services operational
            </div>

          </div>

        </div>

      </div>


      {/* Footer */}

      <div className="border-t border-slate-800 p-6">

        <div className="text-white font-semibold">
          Alloy Cape™
        </div>

        <div className="text-xs text-slate-500 mt-1">
          Enterprise Document Attribution
        </div>

        <div className="mt-3 text-xs text-cyan-400">
          Version 3.0 Enterprise
        </div>

      </div>

    </aside>

  );

}
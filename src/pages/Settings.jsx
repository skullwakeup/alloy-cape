import {
  Settings2,
  ShieldCheck,
  Database,
  BrainCircuit,
  Bell,
  Wrench,
  ChevronRight,
  X,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Save,
} from "lucide-react";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const DEFAULT_SETTINGS = {
  security: {
    strictVerification: true,
    auditLogging: true,
    tamperDetection: true,
  },

  ai: {
    forensicAnalysis: true,
    semanticAnalysis: true,
    behaviorAnalysis: true,
  },

  notifications: {
    securityAlerts: true,
    investigationAlerts: true,
    systemAlerts: true,
  },

  system: {
    autoRefresh: true,
    compactMode: false,
  },
};

const sections = [
  {
    title: "Security",
    description:
      "Configure document protection and verification settings.",
    icon: ShieldCheck,
    color: "text-green-400",
  },
  {
    title: "AI Engine",
    description:
      "Manage Alloy Intelligence and forensic analysis behaviour.",
    icon: BrainCircuit,
    color: "text-cyan-400",
  },
  {
    title: "Database",
    description:
      "Supabase storage, registry and investigation records.",
    icon: Database,
    color: "text-yellow-400",
  },
  {
    title: "Notifications",
    description:
      "Configure alerts and security notifications.",
    icon: Bell,
    color: "text-purple-400",
  },
  {
    title: "System",
    description:
      "Application preferences and environment configuration.",
    icon: Wrench,
    color: "text-red-400",
  },
];

function loadSettings() {
  try {
    const saved = localStorage.getItem(
      "alloy-cape-settings"
    );

    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(saved);

    return {
      security: {
        ...DEFAULT_SETTINGS.security,
        ...(parsed.security || {}),
      },
      ai: {
        ...DEFAULT_SETTINGS.ai,
        ...(parsed.ai || {}),
      },
      notifications: {
        ...DEFAULT_SETTINGS.notifications,
        ...(parsed.notifications || {}),
      },
      system: {
        ...DEFAULT_SETTINGS.system,
        ...(parsed.system || {}),
      },
    };
  } catch (error) {
    console.error(
      "Failed to load Alloy Cape settings:",
      error
    );

    return DEFAULT_SETTINGS;
  }
}

function SettingToggle({
  label,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-700 bg-[#111B33] p-5">

      <div>
        <h3 className="font-bold text-white">
          {label}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`
          relative
          h-7
          w-14
          shrink-0
          rounded-full
          transition
          duration-300
          ${
            enabled
              ? "bg-cyan-500"
              : "bg-slate-700"
          }
        `}
        aria-label={`Toggle ${label}`}
      >

        <span
          className={`
            absolute
            top-1
            h-5
            w-5
            rounded-full
            bg-white
            shadow
            transition
            duration-300
            ${
              enabled
                ? "left-8"
                : "left-1"
            }
          `}
        />

      </button>

    </div>
  );
}

export default function Settings() {

  const [settings, setSettings] =
    useState(loadSettings);

  const [activeSection, setActiveSection] =
    useState(null);

  const [saved, setSaved] =
    useState(false);

  const [resetting, setResetting] =
    useState(false);

  useEffect(() => {

    localStorage.setItem(
      "alloy-cape-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    const timer = setTimeout(() => {
      setSaved(false);
    }, 1500);

    return () => clearTimeout(timer);

  }, [settings]);

  const updateSetting = (
    category,
    key
  ) => {

    setSettings((current) => ({
      ...current,

      [category]: {
        ...current[category],
        [key]: !current[category][key],
      },
    }));

  };

  const resetSettings = () => {

    setResetting(true);

    localStorage.removeItem(
      "alloy-cape-settings"
    );

    setSettings(
      JSON.parse(
        JSON.stringify(DEFAULT_SETTINGS)
      )
    );

    setTimeout(() => {
      setResetting(false);
    }, 400);

  };

  const renderSectionContent = () => {

    if (!activeSection) {
      return null;
    }

    if (activeSection === "Security") {

      return (
        <div className="space-y-4">

          <SettingToggle
            label="Strict Document Verification"
            description="Require registry verification before a protected document is considered authentic."
            enabled={
              settings.security.strictVerification
            }
            onChange={() =>
              updateSetting(
                "security",
                "strictVerification"
              )
            }
          />

          <SettingToggle
            label="Audit Logging"
            description="Keep security-related application activity available for auditing."
            enabled={
              settings.security.auditLogging
            }
            onChange={() =>
              updateSetting(
                "security",
                "auditLogging"
              )
            }
          />

          <SettingToggle
            label="Tamper Detection"
            description="Enable forensic tampering analysis during document investigation."
            enabled={
              settings.security.tamperDetection
            }
            onChange={() =>
              updateSetting(
                "security",
                "tamperDetection"
              )
            }
          />

        </div>
      );
    }

    if (activeSection === "AI Engine") {

      return (
        <div className="space-y-4">

          <SettingToggle
            label="Forensic Analysis"
            description="Use the forensic analysis pipeline during investigations."
            enabled={
              settings.ai.forensicAnalysis
            }
            onChange={() =>
              updateSetting(
                "ai",
                "forensicAnalysis"
              )
            }
          />

          <SettingToggle
            label="Semantic Analysis"
            description="Analyze document content for meaningful semantic changes."
            enabled={
              settings.ai.semanticAnalysis
            }
            onChange={() =>
              updateSetting(
                "ai",
                "semanticAnalysis"
              )
            }
          />

          <SettingToggle
            label="Behavior Analysis"
            description="Enable behavioral analysis when supported by the investigation pipeline."
            enabled={
              settings.ai.behaviorAnalysis
            }
            onChange={() =>
              updateSetting(
                "ai",
                "behaviorAnalysis"
              )
            }
          />

        </div>
      );
    }

    if (activeSection === "Database") {

      const supabaseConfigured =
        Boolean(
          import.meta.env.VITE_SUPABASE_URL
        ) &&
        Boolean(
          import.meta.env.VITE_SUPABASE_ANON_KEY
        );

      return (
        <div className="space-y-5">

          <div className="rounded-2xl border border-slate-700 bg-[#111B33] p-6">

            <div className="flex items-center gap-4">

              {supabaseConfigured ? (
                <CheckCircle2
                  size={30}
                  className="text-green-400"
                />
              ) : (
                <AlertTriangle
                  size={30}
                  className="text-yellow-400"
                />
              )}

              <div>

                <h3 className="font-bold text-white">
                  Supabase Configuration
                </h3>

                <p className="mt-1 text-sm text-slate-400">

                  {supabaseConfigured
                    ? "Supabase environment variables are configured."
                    : "Supabase environment variables are not exposed to this page."}

                </p>

              </div>

            </div>

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl border border-slate-700 bg-[#111B33] p-5">

              <p className="text-sm text-slate-500">
                Registry
              </p>

              <p className="mt-2 text-lg font-bold text-white">
                Service Layer
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Document registry access is handled through application services.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-700 bg-[#111B33] p-5">

              <p className="text-sm text-slate-500">
                Investigation Records
              </p>

              <p className="mt-2 text-lg font-bold text-white">
                Service Layer
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Investigation data is accessed through the existing application pipeline.
              </p>

            </div>

          </div>

        </div>
      );
    }

    if (activeSection === "Notifications") {

      return (
        <div className="space-y-4">

          <SettingToggle
            label="Security Alerts"
            description="Receive notifications for important security events."
            enabled={
              settings.notifications.securityAlerts
            }
            onChange={() =>
              updateSetting(
                "notifications",
                "securityAlerts"
              )
            }
          />

          <SettingToggle
            label="Investigation Alerts"
            description="Receive notifications when document investigations require attention."
            enabled={
              settings.notifications
                .investigationAlerts
            }
            onChange={() =>
              updateSetting(
                "notifications",
                "investigationAlerts"
              )
            }
          />

          <SettingToggle
            label="System Alerts"
            description="Receive notifications for important application and system events."
            enabled={
              settings.notifications.systemAlerts
            }
            onChange={() =>
              updateSetting(
                "notifications",
                "systemAlerts"
              )
            }
          />

        </div>
      );
    }

    if (activeSection === "System") {

      return (
        <div className="space-y-4">

          <SettingToggle
            label="Automatic Refresh"
            description="Allow supported application views to refresh their displayed data automatically."
            enabled={
              settings.system.autoRefresh
            }
            onChange={() =>
              updateSetting(
                "system",
                "autoRefresh"
              )
            }
          />

          <SettingToggle
            label="Compact Mode"
            description="Use a more compact presentation for application controls and panels."
            enabled={
              settings.system.compactMode
            }
            onChange={() =>
              updateSetting(
                "system",
                "compactMode"
              )
            }
          />

          <div className="rounded-2xl border border-slate-700 bg-[#111B33] p-6">

            <p className="text-sm text-slate-500">
              Application
            </p>

            <p className="mt-2 text-xl font-bold text-white">
              Alloy Cape Enterprise Edition
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Enterprise Digital Document Attribution Platform
            </p>

          </div>

        </div>
      );
    }

    return null;
  };

  return (

    <Layout>

      <div className="space-y-10">

        {/* Hero */}

        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-[#0B1220] via-[#111C33] to-[#16213A] p-8">

          <div className="flex items-center justify-between gap-6">

            <div>

              <div className="flex items-center gap-3">

                <Settings2
                  className="text-cyan-400"
                  size={34}
                />

                <h1 className="text-4xl font-black text-white">
                  Settings
                </h1>

              </div>

              <p className="mt-4 max-w-3xl leading-7 text-slate-400">

                Configure Alloy Cape preferences,
                security behaviour, AI services
                and enterprise platform settings.

              </p>

            </div>

            <div className="hidden items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400 md:flex">

              <CheckCircle2 size={17} />

              Configuration Active

            </div>

          </div>

        </div>


        {/* Settings Grid */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {sections.map((section) => {

            const Icon = section.icon;

            return (

              <button
                key={section.title}
                type="button"
                onClick={() =>
                  setActiveSection(
                    section.title
                  )
                }
                className="
                  group
                  rounded-3xl
                  border
                  border-slate-700
                  bg-[#16213A]
                  p-6
                  text-left
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-cyan-500/40
                  hover:shadow-2xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-500/40
                "
              >

                <div className="flex items-center justify-between">

                  <div
                    className={`
                      rounded-2xl
                      bg-[#1A2745]
                      p-4
                      ${section.color}
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    `}
                  >

                    <Icon size={26} />

                  </div>

                  <ChevronRight
                    size={20}
                    className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                  />

                </div>

                <h2 className="mt-6 text-xl font-bold text-white">
                  {section.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-400">
                  {section.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-cyan-400 opacity-0 transition group-hover:opacity-100">
                  Configure →
                </div>

              </button>

            );

          })}

        </div>


        {/* Configuration Status */}

        <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-2xl font-bold text-white">
                Configuration Status
              </h2>

              <p className="mt-2 text-slate-400">
                Your Alloy Cape preferences are stored locally
                and persist across page refreshes.
              </p>

            </div>

            <div className="flex items-center gap-3">

              {saved && (
                <span className="flex items-center gap-2 text-sm font-semibold text-green-400">

                  <Save size={16} />

                  Saved

                </span>
              )}

              <button
                type="button"
                onClick={resetSettings}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-red-500/30
                  bg-red-500/10
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-red-400
                  transition
                  hover:bg-red-500/20
                "
              >

                <RotateCcw
                  size={17}
                  className={
                    resetting
                      ? "animate-spin"
                      : ""
                  }
                />

                Reset Settings

              </button>

            </div>

          </div>

        </div>


        {/* Footer */}

        <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-8 text-center">

          <h2 className="text-2xl font-bold text-white">
            Alloy Cape Enterprise Configuration
          </h2>

          <p className="mt-3 text-slate-400">
            Security, AI, database, notification and system
            controls are organized above for administrator use.
          </p>

        </div>

      </div>


      {/* Settings Modal */}

      {activeSection && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              setActiveSection(null);
            }

          }}
        >

          <div
            className="
              w-full
              max-w-3xl
              max-h-[90vh]
              overflow-y-auto
              rounded-3xl
              border
              border-slate-700
              bg-[#0B1220]
              shadow-2xl
            "
          >

            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-[#0B1220] p-6">

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-[#16213A] p-3">

                  {(() => {

                    const section =
                      sections.find(
                        (item) =>
                          item.title ===
                          activeSection
                      );

                    if (!section) {
                      return null;
                    }

                    const Icon =
                      section.icon;

                    return (
                      <Icon
                        size={25}
                        className={
                          section.color
                        }
                      />
                    );

                  })()}

                </div>

                <div>

                  <h2 className="text-2xl font-bold text-white">
                    {activeSection}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Alloy Cape configuration
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveSection(null)
                }
                className="
                  rounded-xl
                  p-2
                  text-slate-400
                  transition
                  hover:bg-slate-800
                  hover:text-white
                "
                aria-label="Close settings"
              >

                <X size={22} />

              </button>

            </div>


            {/* Modal Body */}

            <div className="p-6">

              {renderSectionContent()}

            </div>


            {/* Modal Footer */}

            <div className="flex justify-end border-t border-slate-700 p-6">

              <button
                type="button"
                onClick={() =>
                  setActiveSection(null)
                }
                className="
                  rounded-xl
                  bg-cyan-500
                  px-6
                  py-3
                  font-bold
                  text-slate-950
                  transition
                  hover:bg-cyan-400
                "
              >

                Done

              </button>

            </div>

          </div>

        </div>

      )}

    </Layout>

  );

}
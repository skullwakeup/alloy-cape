import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Circle,
  ShieldCheck,
  Activity,
  Database,
  Cpu,
  Terminal,
  Radar,
} from "lucide-react";

const steps = [
  "Uploading protected document...",
  "Parsing PDF structure...",
  "Extracting embedded DNA signature...",
  "Computing SHA-256 fingerprint...",
  "Searching Alloy Cape Registry...",
  "Authenticating recipient identity...",
  "Validating document integrity...",
  "Generating forensic report...",
];

export default function InvestigationScanner({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const logRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((v) => v + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentStep >= steps.length) {
      const timer = setTimeout(() => {
        onComplete();
      }, 900);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentStep((p) => p + 1);
    }, 700);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  const progress = Math.min(
    (currentStep / steps.length) * 100,
    100
  );

  const logs = useMemo(
    () =>
      steps.slice(0, currentStep).map((step, index) => ({
        id: index,
        time: new Date().toLocaleTimeString([], {
            hour12: false,
        }),
        text: step,
      })),
    [currentStep]
  );

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: "smooth",
       });
    }
  }, [logs]);

  return (
    <div className="rounded-3xl border border-cyan-500/40 bg-[#16213A] p-8 shadow-2xl">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-4">

            <Radar
              size={38}
              className="text-cyan-400 animate-pulse"
            />

            <div>

              <h2 className="text-3xl font-bold text-cyan-400">
                Enterprise Forensics Engine
              </h2>

              <p className="mt-2 text-slate-400">
                Performing digital forensic analysis...
              </p>

            </div>

          </div>

        </div>

        <div className="flex items-center gap-3 rounded-full bg-green-500/10 px-5 py-3">

            <div className="relative flex h-3 w-3 items-center justify-center">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-40" />

                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />

            </div>

            <span className="font-semibold text-green-400">
             LIVE
            </span>

        </div>

      </div>

      {/* ====================================================== */}
      {/* PROGRESS */}
      {/* ====================================================== */}

      <div className="mt-10">

        <div className="mb-4 flex items-center justify-between">

            <div>

                <p className="text-sm text-slate-500">
                Overall Progress
                </p>

                <h3 className="text-5xl font-bold text-cyan-400">
                    {Math.round(progress)}%
                </h3>

            </div>

            <div className="text-right">

                <p className="text-sm uppercase tracking-wider text-slate-500">

                STEP {Math.min(currentStep + 1, steps.length)} OF {steps.length}

                </p>

                <p className="font-semibold text-white">
                    {currentStep < steps.length
                    ? steps[currentStep]
                    : "Analysis Complete"}
                </p>

            </div>

        </div>

        <div className="relative h-5 overflow-hidden rounded-full bg-slate-800">

            <div
                className="absolute left-0 top-0 h-full rounded-full bg-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.8)] transition-all duration-700"
                style={{
                    width: `${progress}%`,
                }}
            />

        </div>

      </div>

      {/* ====================================================== */}
      {/* STEPS */}
      {/* ====================================================== */}

      <div className="mt-10 space-y-4">

        {steps.map((step, index) => {

          const completed = index < currentStep;
          const active = index === currentStep;

          return (

            <div
              key={step}
              className="flex items-center justify-between rounded-2xl border border-slate-700 bg-[#111B33] px-5 py-4 transition hover:border-cyan-500/30"
            >

              <div className="flex items-center gap-4">

                {completed && (
                  <CheckCircle2
                    size={22}
                    className="text-green-400"
                  />
                )}

                {active && (
                  <Loader2
                    size={22}
                    className="animate-spin text-yellow-400"
                  />
                )}

                {!completed && !active && (
                  <Circle
                    size={18}
                    className="text-slate-600"
                  />
                )}

                <span
                  className={
                    completed
                      ? "font-medium text-green-400"
                      : active
                      ? "font-medium text-yellow-400"
                      : "text-slate-500"
                  }
                >
                  {step}
                </span>

              </div>

              <span
                className={
                  completed
                    ? "font-semibold text-green-400"
                    : active
                    ? "animate-pulse font-semibold text-yellow-400"
                    : "text-slate-600"
                }
              >
                {completed
                  ? "COMPLETE"
                  : active
                  ? "PROCESSING..."
                  : "PENDING"}
              </span>

            </div>

          );

        })}

      </div>
            {/* ====================================================== */}
      {/* ENGINE STATUS */}
      {/* ====================================================== */}

      <div className="mt-10 grid gap-4 md:grid-cols-3">

        <StatusCard
          icon={ShieldCheck}
          title="Registry"
          value="Connected"
          color="text-green-400"
        />

        <StatusCard
          icon={Database}
          title="DNA Engine"
          value="Running"
          color="text-cyan-400"
        />

        <StatusCard
          icon={Cpu}
          title="SHA Engine"
          value="Verified"
          color="text-yellow-400"
        />

      </div>

      {/* ====================================================== */}
      {/* LIVE CONSOLE */}
      {/* ====================================================== */}

      <div className="mt-10 rounded-3xl border border-slate-700 bg-[#0B1220] overflow-hidden">

        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">

          <div className="flex items-center gap-3">

            <Terminal
              size={20}
              className="text-cyan-400"
            />

            <span className="font-semibold text-cyan-400">
              Live Investigation Console
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />

            <span className="text-sm text-green-400">
              STREAMING
            </span>

          </div>

        </div>

        <div
          ref={logRef}
          className="max-h-56 overflow-y-auto p-5 font-mono text-sm"
        >

          {logs.length === 0 && (

            <div className="text-slate-500">
              Waiting for forensic engine...
            </div>

          )}

          {logs.map((log) => (

            <div
              key={log.id}
              className="mb-2 flex gap-3 text-green-400"
            >

              <span className="text-cyan-400">
                [{log.time}]
              </span>

              <span>
                SUCCESS  {log.text}
              </span>

            </div>

          ))}

          {currentStep < steps.length && (

            <div className="mt-3 flex items-center gap-3 text-yellow-400">

              <Loader2
                size={15}
                className="animate-spin"
              />

              Processing next forensic task...

            </div>

          )}

        </div>

      </div>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <div className="mt-10 flex flex-col gap-4 border-t border-slate-700 pt-6 md:flex-row md:items-center md:justify-between">

        <div>

          <p className="font-semibold text-cyan-400">
            Alloy Cape Enterprise v3.0
          </p>

          <p className="text-sm text-slate-500">
            Enterprise Digital Document Attribution Platform
          </p>

        </div>

        <div className="flex items-center gap-8">

          <div>

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Elapsed
            </p>

            <p className="text-lg font-bold text-white">
              {elapsed}s
            </p>

          </div>

          <div>

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Confidence
            </p>

            <p className="text-lg font-bold text-green-400">

            {

            currentStep >= steps.length

            ? "100%"

            : `${Math.round(progress)}%`

            }

            </p>

          </div>

          <div>

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Status
            </p>

            <p className="text-lg font-bold text-cyan-400">
              {currentStep >= steps.length
                ? "COMPLETE"
                : "RUNNING"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

function StatusCard({
  icon: Icon,
  title,
  value,
  color,
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-[#111B33] p-5 transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(6,182,212,.15)]">

      <div className="mb-4 flex items-center gap-3">

        <div className="rounded-xl bg-[#16213A] p-3">

          <Icon
            size={22}
            className={color}
          />

        </div>

        <span className="text-slate-400">
          {title}
        </span>

      </div>

      <p className={`text-xl font-bold ${color}`}>
        {value}
      </p>

    </div>
  );
}
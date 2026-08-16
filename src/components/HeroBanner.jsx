import {
  ShieldCheck,
  FileLock2,
  Fingerprint,
  Activity,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

export default function HeroBanner({ stats }) {

  const { role } = useAuth();

  const isAdministrator =
    role === "administrator";

  const navigate = useNavigate();

  return (

    <div
      className="
        relative
        mb-8
        overflow-hidden
        rounded-3xl
        border
        border-cyan-500/30
        bg-gradient-to-br
        from-[#0B1220]
        via-[#111C33]
        to-[#16213A]
        p-10
        shadow-2xl
        transition-all
        duration-300
        hover:border-cyan-400/40
        hover:shadow-[0_0_45px_rgba(6,182,212,.12)]
      "
    >

      {/* Background Glow */}

      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10">

        {/* Status */}

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">

          <Activity
            size={16}
            className="animate-pulse"
          />

          Registry Status • HEALTHY

        </div>

        {/* Title */}

        <h1 className="text-5xl font-black tracking-tight text-white">

          ALLOY CAPE™

        </h1>

        <h2 className="mt-3 text-2xl font-semibold text-cyan-400">

          Enterprise Document Attribution &
          Digital Forensics Platform

        </h2>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">

          Protect confidential documents using embedded DNA fingerprints,
          cryptographic verification, recipient attribution and AI-powered
          forensic investigations. Every document remains traceable throughout
          its lifecycle.

        </p>

        <div className="my-8 h-px bg-gradient-to-r from-cyan-500/40 via-slate-600 to-transparent" />

        {/* Feature Cards */}

        <div className="flex flex-wrap gap-4">

          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#16213A] px-5 py-3 text-slate-200 transition hover:border-cyan-500 hover:bg-[#1B2742]">

            <ShieldCheck
              size={20}
              className="text-green-400"
            />

            Zero Trust Security

          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#16213A] px-5 py-3 text-slate-200 transition hover:border-cyan-500 hover:bg-[#1B2742]">

            <Fingerprint
              size={20}
              className="text-cyan-400"
            />

            DNA Attribution

          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#16213A] px-5 py-3 text-slate-200 transition hover:border-cyan-500 hover:bg-[#1B2742]">

            <FileLock2
              size={20}
              className="text-yellow-400"
            />

            SHA-256 Protected

          </div>

        </div>

        {/* Buttons */}

        <div className="mt-10 flex flex-wrap gap-4">

          {isAdministrator ? (
  <button
    onClick={() => navigate("/issue")}
      className="
        rounded-2xl
        bg-cyan-500
        px-8
        py-4
        font-bold
        text-black
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-cyan-400
        hover:shadow-xl
        hover:shadow-cyan-500/20
      "
    >
      Issue Protected Document
    </button>
  ) : (
    <div
      className="
        flex
        cursor-not-allowed
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-700
        bg-[#101A30]
        px-8
        py-4
        font-bold
        text-slate-500
      "
      title="Administrator access required"
    >
      Issue Protected Document
    </div>
  )}

          <button
            onClick={() => navigate("/registry")}
            className="
              rounded-xl
              border
              border-cyan-500/40
              bg-[#16213A]
              px-8
              py-4
              font-semibold
              text-cyan-300
              transition
              hover:border-cyan-400
              hover:bg-cyan-500/10
            "
          >

            Open Registry

          </button>

        </div>

        {/* Bottom Stats */}

        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">

          <div>

            <p className="text-4xl font-black text-white">

              {stats.averageConfidence}%

            </p>

            <p className="mt-2 text-sm text-slate-400">

              Platform Accuracy

            </p>

          </div>

          <div>

            <p className="text-4xl font-black text-white">

              SHA-256

            </p>

            <p className="mt-2 text-sm text-slate-400">

              Fingerprinting

            </p>

          </div>

          <div>

            <p className="text-4xl font-black text-white">

              DNA

            </p>

            <p className="mt-2 text-sm text-slate-400">

              Embedded Tracking

            </p>

          </div>

          <div>

            <p className="text-4xl font-black text-green-400">

              LIVE

            </p>

            <p className="mt-2 text-sm text-slate-400">

              Registry Monitoring

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}
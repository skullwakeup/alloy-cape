import {
  ShieldCheck,
  Fingerprint,
  Users,
  FileText,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle2,
  Activity,
  BadgeCheck,
  FileBadge2,
  Copy,
  MapPin,
  LockKeyhole,
} from "lucide-react";

import AIInvestigationReport from "./AIInvestigationReport";

import { generateInvestigationReport } from "../../services/reports/investigationReport";

export default function InvestigationResult({ result }) {

  if (!result) return null;


  if (!result.success) {

    return (

      <div className="rounded-3xl border border-red-500 bg-red-900/20 p-8">

        <div className="flex items-center gap-4">

          <AlertTriangle
            size={40}
            className="text-red-400"
          />

          <div>

            <h2 className="text-3xl font-bold text-red-400">
              Investigation Failed
            </h2>

            <p className="mt-2 text-slate-300">
              {result.message}
            </p>

          </div>

        </div>

      </div>

    );

  }


  const {
    match,
    reportId,
    investigator,
    confidence,
    integrity,
    risk,
    summary,
    generatedAt,
  } = result;


  const attribution =
    result.attribution ?? null;


  const leakProbability =
    result.leakProbability ?? 0;


  const leakLevel =
    result.leakLevel ?? "Minimal";

  const passwordReveals =
    result.passwordReveals ?? 0;

  const shortenFileName = (
    name,
    max = 45
  ) => {

    if (!name) return "";

    if (name.length <= max)
      return name;

    const dot =
      name.lastIndexOf(".");

    if (dot === -1)
      return (
        name.substring(
          0,
          max - 3
        ) + "..."
      );

    const ext =
      name.substring(dot);

    return (
      name.substring(
        0,
        max -
          ext.length -
          3
      ) +
      "..." +
      ext
    );

  };


  const riskColor =
    risk === "Low"
      ? "text-green-400"
      : risk === "Medium"
      ? "text-yellow-400"
      : "text-red-400";


  const progressColor =
    risk === "Low"
      ? "bg-green-500"
      : risk === "Medium"
      ? "bg-yellow-500"
      : "bg-red-500";


  const leakColor =
    leakProbability >= 80
      ? "text-red-400"
      : leakProbability >= 60
      ? "text-orange-400"
      : leakProbability >= 40
      ? "text-yellow-400"
      : leakProbability >= 20
      ? "text-cyan-400"
      : "text-green-400";


  const leakBarColor =
    leakProbability >= 80
      ? "bg-red-500"
      : leakProbability >= 60
      ? "bg-orange-500"
      : leakProbability >= 40
      ? "bg-yellow-500"
      : leakProbability >= 20
      ? "bg-cyan-500"
      : "bg-green-500";


  const isExternal =
    attribution?.recipientType ===
    "EXTERNAL";


  const checks = [

    {
      label: "DNA Identifier",
      ok: result.verification?.dna,
    },

    {
      label: "Registry Match",
      ok: result.verification?.registry,
    },

    {
      label: "Metadata",
      ok: result.verification?.metadata,
    },

    {
      label: "SHA-256",
      ok: result.verification?.sha256,
    },

    {
      label: "Text Hash",
      ok: result.verification?.text,
    },

    {
      label: "Page Count",
      ok: result.verification?.pageCount,
    },

  ];


  return (

    <div className="rounded-3xl border border-green-500 bg-[#16213A] p-8 shadow-2xl">


      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-4">

            <BadgeCheck
              className="text-green-400"
              size={36}
            />

            <div>

              <h2 className="text-3xl font-bold text-green-400">
                Investigation Complete
              </h2>

              <p className="mt-2 text-slate-400">
                Authentic enterprise document successfully verified
                against the Alloy Cape Registry.
              </p>

            </div>

          </div>

        </div>


        <div className="flex items-center gap-3">

          {result.tampered ? (

            <div className="
              rounded-full
              border
              border-red-500/30
              bg-red-500/20
              px-5
              py-2
              text-sm
              font-bold
              text-red-400
            ">
              ⚠ TAMPERED
            </div>

          ) : (

            <div className="
              rounded-full
              border
              border-green-500/30
              bg-green-500/20
              px-5
              py-2
              text-sm
              font-bold
              text-green-400
            ">
              ✓ VERIFIED
            </div>

          )}


          <span
            className={`
              rounded-full
              px-6
              py-3
              text-lg
              font-bold
              border
              ${
                risk === "Low"
                  ? "bg-green-500/20 border-green-500/30 text-green-400"
                  : risk === "Medium"
                  ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                  : "bg-red-500/20 border-red-500/30 text-red-400"
              }
            `}
          >
            {risk} RISK
          </span>

        </div>

      </div>


      {/* ====================================================== */}
      {/* SUMMARY */}
      {/* ====================================================== */}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <SummaryCard
          title="Integrity"
          value={`${result.integrity}%`}
        />

        <SummaryCard
          title="Risk"
          value={result.risk}
        />

        <SummaryCard
          title="Leak Level"
          value={leakLevel}
        />

        <SummaryCard
          title="Leak Probability"
          value={`${leakProbability}%`}
        />

        <SummaryCard
          title="Status"
          value={
            result.tampered
              ? "TAMPERED"
              : "AUTHENTIC"
          }
        />

        <SummaryCard
          title="Confidence"
          value={result.confidence}
        />

        <SummaryCard
          title="Password Reveals"
          value={passwordReveals}
        />

      </section>


      {/* ====================================================== */}
      {/* COPY ATTRIBUTION */}
      {/* ====================================================== */}

      <section
        className={`
          mt-10
          rounded-3xl
          border
          p-7
          ${
            attribution?.matched
              ? "border-cyan-500/40 bg-gradient-to-br from-cyan-900/20 to-[#111B33]"
              : "border-slate-700 bg-[#111B33]"
          }
        `}
      >

        <div className="mb-7 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Fingerprint
              className="text-cyan-400"
              size={28}
            />

            <div>

              <h3 className="text-2xl font-bold text-white">
                Copy Attribution
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Protected copy identity and recipient attribution
              </p>

            </div>

          </div>


          {attribution?.matched && (

            <div className="
              rounded-full
              border
              border-green-500/30
              bg-green-500/10
              px-4
              py-2
              text-sm
              font-bold
              text-green-400
            ">
              ✓ IDENTITY VERIFIED
            </div>

          )}

        </div>


        {attribution ? (

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">

            <InfoCard
              icon={Users}
              title="Recipient"
              value={
                attribution.recipient ||
                "Unknown"
              }
            />

            <InfoCard
              icon={Users}
              title="Organization"
              value={
                attribution.recipientOrganization ||
                "Unknown"
              }
            />

            <InfoCard
              icon={LockKeyhole}
              title="Recipient Type"
              value={
                attribution.recipientType ||
                "UNKNOWN"
              }
            />

            <InfoCard
              icon={Copy}
              title="Copy ID"
              value={
                attribution.copyId ||
                "Not Available"
              }
            />

            <InfoCard
              icon={Activity}
              title="Tracker ID"
              value={
                attribution.trackerId ||
                "Not Available"
              }
            />

            <InfoCard
              icon={Fingerprint}
              title="Document DNA"
              value={
                attribution.dnaId ||
                result.dnaId ||
                "Not Available"
              }
            />

            <InfoCard
              icon={ShieldCheck}
              title="Recipient Signature"
              value={
                attribution.recipientSignature ||
                "Not Available"
              }
            />

            <InfoCard
              icon={BadgeCheck}
              title="Attribution Confidence"
              value={`${attribution.confidence ?? 0}%`}
            />

          </div>

        ) : (

          <div className="
            min-w-0
            rounded-2xl
            border
            border-slate-700
            bg-[#16213A]
            p-6
            text-slate-400
          ">
            No recipient attribution data available.
          </div>

        )}


        {attribution?.reasoning?.length > 0 && (

          <div className="mt-6">

            <h4 className="mb-3 font-semibold text-slate-300">
              Attribution Evidence
            </h4>

            <div className="space-y-2">

              {attribution.reasoning.map(
                (reason, index) => (

                  <div
                    key={`${reason}-${index}`}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      bg-[#16213A]
                      p-3
                    "
                  >

                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-green-400"
                    />

                    <span className="text-sm text-slate-300">
                      {reason}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </section>


      {/* ====================================================== */}
      {/* LEAK ASSESSMENT */}
      {/* ====================================================== */}

      <section
        className={`
          mt-10
          rounded-3xl
          border
          p-7
          ${
            isExternal ||
            leakProbability >= 60
              ? "border-red-500/40 bg-gradient-to-br from-red-900/20 to-[#111B33]"
              : "border-slate-700 bg-[#111B33]"
          }
        `}
      >

        <div className="mb-7 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Activity
              className={
                isExternal ||
                leakProbability >= 60
                  ? "text-red-400"
                  : "text-cyan-400"
              }
              size={28}
            />

            <div>

              <h3 className="text-2xl font-bold text-white">
                Leak Assessment
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Behavioral and access-based leak analysis
              </p>

            </div>

          </div>


          <div
            className={`
              rounded-full
              border
              px-4
              py-2
              text-sm
              font-bold
              ${
                leakProbability >= 60
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : leakProbability >= 20
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                  : "border-green-500/30 bg-green-500/10 text-green-400"
              }
            `}
          >
            {leakLevel.toUpperCase()}
          </div>

        </div>


        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <SummaryCard
            title="Leak Probability"
            value={`${leakProbability}%`}
          />

          <SummaryCard
            title="Leak Level"
            value={leakLevel}
          />

          <SummaryCard
            title="Network Classification"
            value={
              attribution?.recipientType ||
              "UNKNOWN"
            }
          />

        </div>


        <div className="mt-7">

          <div className="mb-3 flex items-center justify-between">

            <span className="text-sm text-slate-400">
              Threat Probability
            </span>

            <strong
              className={`text-xl ${leakColor}`}
            >
              {leakProbability}%
            </strong>

          </div>


          <div className="h-4 overflow-hidden rounded-full bg-slate-700">

            <div
              className={`
                ${leakBarColor}
                h-full
                rounded-full
                transition-all
                duration-1000
              `}
              style={{
                width:
                  `${Math.min(
                    100,
                    leakProbability
                  )}%`,
              }}
            />

          </div>

        </div>


        {isExternal && (

          <div className="
            mt-7
            rounded-2xl
            border
            border-red-500/30
            bg-red-500/10
            p-5
          ">

            <div className="flex items-start gap-4">

              <AlertTriangle
                className="mt-1 shrink-0 text-red-400"
                size={24}
              />

              <div>

                <h4 className="font-bold text-red-400">
                  EXTERNAL RECIPIENT DETECTED
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  This protected copy is associated with an
                  external recipient. Additional investigation
                  is recommended if unauthorized distribution is
                  suspected.
                </p>

              </div>

            </div>

          </div>

        )}


        {result.leakEvidence?.length > 0 && (

          <div className="mt-7">

            <h4 className="mb-3 font-semibold text-slate-300">
              Leak Evidence
            </h4>

            <div className="space-y-2">

              {result.leakEvidence.map(
                (item, index) => {

                  const evidenceText =
                    typeof item === "string"
                      ? item
                      : item?.message ||
                        item?.type ||
                        "Leak indicator detected.";

                  return (

                    <div
                      key={`${evidenceText}-${index}`}
                      className="
                        rounded-xl
                        border
                        border-slate-700
                        bg-[#16213A]
                        p-4
                        text-sm
                        text-slate-300
                      "
                    >
                      {evidenceText}
                    </div>

                  );

                }
              )}

            </div>

          </div>

        )}

      </section>


      {/* ====================================================== */}
      {/* EXECUTIVE SUMMARY */}
      {/* ====================================================== */}

      <section className="mt-10 rounded-3xl border border-slate-700 bg-[#111B33] p-7">

        <div className="mb-5 flex items-center gap-3">

          <ShieldCheck
            className="text-cyan-400"
            size={26}
          />

          <h3 className="text-2xl font-bold text-white">
            Executive Summary
          </h3>

        </div>


        <p className="leading-8 break-words text-slate-300">

          {result.tampered

            ? "Forensic analysis detected unauthorized modifications after the document was issued. The uploaded document no longer matches the protected version stored in the Alloy Cape Registry."

            : summary}

        </p>


        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <SummaryCard
            title="Confidence"
            value={confidence}
          />

          <SummaryCard
            title="Integrity"
            value={`${integrity}%`}
          />

          <SummaryCard
            title="Investigator"
            value={investigator}
          />

        </div>

      </section>


      {/* ====================================================== */}
      {/* DOCUMENT DETAILS */}
      {/* ====================================================== */}

      <section className="mt-10">

        <div className="mb-5 flex items-center gap-3">

          <FileBadge2
            className="text-cyan-400"
            size={26}
          />

          <h3 className="text-2xl font-bold text-white">
            Document Details
          </h3>

        </div>


        <div className="grid gap-5 lg:grid-cols-2">

          <InfoCard
            icon={FileText}
            title="Document"
            value={shortenFileName(match.fileName)}
            tooltip={match.fileName}
          />

          <InfoCard
            icon={Fingerprint}
            title="DNA Identifier"
            value={match.dnaId}
          />

          <InfoCard
            icon={Users}
            title="Recipients"
            value={
              match.recipients?.join(", ") ||
              "None"
            }
          />

          <InfoCard
            icon={Calendar}
            title="Issued"
            value={
              match.issuedAt
                ? new Date(
                    match.issuedAt
                  ).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "Not Available"
            }
          />

        </div>

      </section>


      {/* ====================================================== */}
      {/* RISK ASSESSMENT */}
      {/* ====================================================== */}

      <section className="mt-10 rounded-3xl border border-slate-700 bg-[#111B33] p-7">

        <div className="mb-6 flex items-center gap-3">

          <Activity
            className="text-cyan-400"
            size={26}
          />

          <h3 className="text-2xl font-bold text-white">
            Risk Assessment
          </h3>

        </div>


        <div className="flex items-center justify-between">

          <span className="text-slate-400">
            Document Integrity
          </span>

          <strong
            className={`text-xl font-bold ${riskColor}`}
          >
            {integrity}%
          </strong>

        </div>


        <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-700">

          <div
            className={`${progressColor} h-full rounded-full transition-all duration-1000`}
            style={{
              width:
                `${integrity}%`,
            }}
          />

        </div>


        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <SummaryCard
            title="Risk Level"
            value={risk}
          />

          <SummaryCard
            title="Classification"
            value={match.classification}
          />

          <SummaryCard
            title="Status"
            value={match.status}
          />

        </div>

      </section>


      {/* ====================================================== */}
      {/* FORENSIC EVIDENCE */}
      {/* ====================================================== */}

      <section className="mt-10 rounded-3xl border border-slate-700 bg-[#111B33] p-7">

        <h3 className="mb-6 text-2xl font-bold text-white">
          Forensic Evidence
        </h3>


        {[
          ...(result.evidence ?? []),
          ...(result.leakEvidence ?? []),
        ].length ? (

          <div className="space-y-3">

            {[
              ...(result.evidence ?? []),
              ...(result.leakEvidence ?? []),
            ].map((item, index) => {

              const evidence =
                typeof item === "string"
                  ? {
                      severity: "INFO",
                      type: "Evidence",
                      message: item,
                    }
                  : item;

              return (

                <div
                  key={`${evidence?.type ?? "evidence"}-${index}`}
                  className="rounded-lg border border-red-700 p-3"
                >

                  <div className="font-semibold text-red-400">
                    {evidence?.severity ?? "INFO"}
                  </div>

                  <div className="text-white">
                    {evidence?.type ?? "Evidence"}
                  </div>

                  <div className="text-slate-400">
                    {evidence?.message ?? ""}
                  </div>

                </div>

              );

            })}

          </div>

        ) : (

          <div className="rounded-xl bg-green-500/10 p-5 text-green-400">
            No forensic anomalies detected.
          </div>

        )}

      </section>


      {/* ====================================================== */}
      {/* ALLOY AI REPORT */}
      {/* ====================================================== */}

      <AIInvestigationReport
        intelligence={result.intelligence}
        aiAnalysis={result.aiAnalysis}
        investigation={result}
      />


      {/* ====================================================== */}
      {/* VERIFICATION CHECKLIST */}
      {/* ====================================================== */}

      <section className="mt-10 rounded-3xl border border-slate-700 bg-[#111B33] p-7">

        <div className="mb-6 flex items-center gap-3">

          <CheckCircle2
            className="text-green-400"
            size={26}
          />

          <h3 className="text-2xl font-bold text-white">
            Verification Checklist
          </h3>

        </div>


        <div className="grid gap-4 md:grid-cols-2">

          {checks.map(
            (check) => (

              <div
                key={check.label}
                className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#16213A] p-4"
              >

                {check.ok ? (

                  <CheckCircle2
                    size={20}
                    className="text-green-400"
                  />

                ) : (

                  <AlertTriangle
                    size={20}
                    className="text-red-400"
                  />

                )}

                <span className="text-slate-200">
                  {check.label}
                </span>

              </div>

            )
          )}

        </div>

      </section>


      {/* ====================================================== */}
      {/* TIMELINE */}
      {/* ====================================================== */}

      <section className="mt-10 rounded-3xl border border-slate-700 bg-[#111B33] p-7">

        <h3 className="mb-8 text-2xl font-bold text-white">
          Investigation Timeline
        </h3>


        <div className="space-y-6">

          {(result.timeline ?? []).map(
            (step, index) => (

              <div
                key={`${step.event}-${index}`}
                className="flex gap-5"
              >

                <div className="flex flex-col items-center">

                  <div className="h-4 w-4 rounded-full bg-green-400" />

                  {index !==
                    result.timeline.length - 1 && (

                    <div className="mt-2 h-10 w-0.5 bg-slate-600" />

                  )}

                </div>


                <div>

                  <p className="text-sm text-cyan-400">
                    {step.time}
                  </p>

                  <p className="font-semibold text-white">
                    {step.event}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </section>


      {/* ====================================================== */}
      {/* AUDIT INFORMATION */}
      {/* ====================================================== */}

      <section className="mt-10 rounded-3xl border border-slate-700 bg-[#111B33] p-7">

        <h3 className="mb-6 text-2xl font-bold text-white">
          Audit Information
        </h3>


        <div className="grid gap-5 md:grid-cols-2">

          <InfoCard
            icon={Fingerprint}
            title="Report ID"
            value={result.reportId}
          />

          <InfoCard
            icon={Users}
            title="Investigator"
            value={result.investigator}
          />

          <InfoCard
            icon={ShieldCheck}
            title="Engine"
            value={result.engine}
          />

          <InfoCard
            icon={Calendar}
            title="Generated"
            value={
              result.generatedAt
                ? new Date(
                    result.generatedAt
                  ).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "Not Available"
            }
          />

        </div>

      </section>


      {/* ====================================================== */}
      {/* DIGITAL SIGNATURE */}
      {/* ====================================================== */}

      <section className="mt-10 rounded-3xl border border-green-700 bg-gradient-to-r from-green-900/20 to-cyan-900/20 p-7">

        <div className="flex items-center gap-4">

          <ShieldCheck
            className="text-green-400"
            size={40}
          />

          <div>

            <h3 className="text-2xl font-bold text-white">
              Digitally Signed
            </h3>

            <p className="mt-2 text-slate-300">
              This investigation was digitally verified by
              Alloy Cape Enterprise.
            </p>

            <div className="mt-4 space-y-1 text-sm text-slate-400">

              <p>
                Certificate ID :
                {" "}
                CERT-
                {result.dnaId
                  ?.slice(-6)
                  .toUpperCase()}
              </p>

              <p>
                Engine :
                {" "}
                {result.engine}
              </p>

              <p>
                Version :
                {" "}
                {result.version}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* DOWNLOAD */}
      {/* ====================================================== */}

      <div className="mt-12 flex justify-end">

        <button
          onClick={() =>
            generateInvestigationReport(
              result
            )
          }
          className="flex items-center gap-3 rounded-2xl bg-green-600 px-7 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-700 hover:shadow-green-500/30"
        >

          <Download size={22} />

          Download Investigation Report

        </button>

      </div>

    </div>

  );

}


/* ====================================================== */
/* SUMMARY CARD */
/* ====================================================== */

function SummaryCard({
  title,
  value,
}) {

  return (

    <div className="
      rounded-2xl
      border
      border-slate-700
      bg-[#16213A]
      p-5
      transition-all
      duration-300
      hover:border-cyan-500
      hover:-translate-y-1
    ">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h4 className="
        mt-3
        break-words
        text-xl
        font-bold
        leading-7
        text-white
      ">
        {value}
      </h4>

    </div>

  );

}


/* ====================================================== */
/* INFO CARD */
/* ====================================================== */

function InfoCard({
  icon: Icon,
  title,
  value,
  tooltip,
}) {

  return (

    <div className="
      min-w-0
      rounded-2xl
      border
      border-slate-700
      bg-[#16213A]
      p-5
      transition-all
      duration-300
      hover:border-cyan-500
      hover:-translate-y-1
    ">

      <div className="mb-3 flex items-center gap-3">

        <Icon
          className="shrink-0 text-cyan-400"
          size={22}
        />

        <span className="text-slate-400">
          {title}
        </span>

      </div>

      <p
        title={tooltip}
        className="
          break-all
          text-base
          font-semibold
          leading-6
          text-white
        "
      >
        {value ?? "Not Available"}
      </p>

    </div>

  );

}
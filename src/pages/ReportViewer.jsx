import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { supabase } from "../lib/supabase";

import {
  ArrowLeft,
  Download,
  FileText,
  ShieldCheck,
  Activity,
  LockKeyhole,
  Users,
  AlertTriangle,
  Database,
} from "lucide-react";

import {
  generateReportPDF,
} from "../services/reports/reportPdfGenerator";

import Layout from "../components/Layout";

import ReportSection from "../components/reports/ReportSection";
import ReportList from "../components/reports/ReportList";

import {
  getReport,
} from "../services/reports/reportViewerService";


export default function ReportViewer() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activity, setActivity] = useState({
    downloads: 0,
    emailShares: 0,
    cloudUploads: 0,
    externalAccesses: 0,
    passwordReveals: 0,
  });

  useEffect(() => {

  async function load() {

    try {

      setLoading(true);
      setError("");

      const data = await getReport(id);

      if (!data) {
        setError("Investigation report could not be found.");
        return;
      }

      setReport(data);

        try {
          const investigationData =
            data.investigation ||
            data.investigationData ||
            data;

          const documentData =
            data.document ||
            data.documentData ||
            {};

          const copies =
            Array.isArray(documentData.copies)
              ? documentData.copies
              : Array.isArray(investigationData.copies)
                ? investigationData.copies
                : Array.isArray(data.copies)
                  ? data.copies
                  : [];

          const documentId =
            documentData.id ||
            investigationData.documentId ||
            data.documentId ||
            null;

          /*
          * Load ALL document events.
          *
          * We intentionally use documentId only here rather than
          * restricting the report to the first protected copy.
          */
          if (documentId) {
            const { data: documentEvents, error: eventError } =
              await supabase
                .from("document_events")
                .select("*")
                .eq("document_id", documentId)
                .order("created_at", {
                  ascending: true,
                });

            if (eventError) {
              throw eventError;
            }

            const events = documentEvents ?? [];

            /*
            * Password reveals are stored on each protected copy.
            * The investigation snapshot can go stale after a reveal
            * happens later, so re-fetch the live copies here.
            */
            let livePasswordReveals = null;

            try {
              const { data: liveDocument, error: liveDocError } =
                await supabase
                  .from("documents")
                  .select("copies")
                  .eq("id", documentId)
                  .single();

              if (liveDocError) {
                throw liveDocError;
              }

              const liveCopies = Array.isArray(liveDocument?.copies)
                ? liveDocument.copies
                : [];

              livePasswordReveals = liveCopies.reduce(
                (total, copy) =>
                  total +
                  Number(
                    copy?.passwordRevealCount ??
                      copy?.password_reveal_count ??
                      0
                  ),
                0
              );
            } catch (liveError) {
              console.error(
                "LIVE PASSWORD REVEAL FETCH ERROR:",
                liveError
              );
            }

            const passwordReveals =
              livePasswordReveals !== null
                ? livePasswordReveals
                : copies.reduce(
                    (total, copy) =>
                      total +
                      Number(copy?.passwordRevealCount ?? 0),
                    0
                  );

            const eventDownloads = events.filter(
              event => event.event_type === "DOWNLOAD"
            ).length;

            const eventEmailShares = events.filter(
              event => event.event_type === "EMAIL_SHARE"
            ).length;

            const eventCloudUploads = events.filter(
              event => event.event_type === "CLOUD_UPLOAD"
            ).length;

            const eventExternalAccesses = events.filter(
              event => event.event_type === "EXTERNAL_ACCESS"
            ).length;

            const storedDownloads = Number(
              documentData.downloadCount ??
              documentData.download_count ??
              0
            );

            const storedEmailShares = Number(
              documentData.emailShares ??
              documentData.email_shares ??
              0
            );

            const storedCloudUploads = Number(
              documentData.cloudUploads ??
              documentData.cloud_uploads ??
              0
            );

            const storedExternalAccesses = Number(
              documentData.externalAccesses ??
              documentData.external_accesses ??
              0
            );

            setActivity({
              downloads:
                eventDownloads > 0
                  ? eventDownloads
                  : storedDownloads,

              emailShares:
                eventEmailShares > 0
                  ? eventEmailShares
                  : storedEmailShares,

              cloudUploads:
                eventCloudUploads > 0
                  ? eventCloudUploads
                  : storedCloudUploads,

              externalAccesses:
                eventExternalAccesses > 0
                  ? eventExternalAccesses
                  : storedExternalAccesses,

              passwordReveals,
            });
          }

        } catch (activityError) {
          console.error(
            "REPORT ACTIVITY LOAD ERROR:",
            activityError
          );
        }

      } catch (err) {

        console.error(
          "Failed to load report:",
          err
        );

        setError(
          "Unable to load the investigation report."
        );

      } finally {

        setLoading(false);

      }

    }

    load();

  }, [id]);


  if (loading) {

    return (
      <Layout>

        <div className="flex min-h-[60vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

            <p className="text-slate-400">
              Loading forensic investigation report...
            </p>

          </div>

        </div>

      </Layout>
    );

  }


  if (error || !report) {

    return (
      <Layout>

        <div className="flex min-h-[60vh] items-center justify-center">

          <div className="rounded-3xl border border-red-500/20 bg-[#16213A] p-10 text-center">

            <h1 className="text-2xl font-bold text-white">
              Report Unavailable
            </h1>

            <p className="mt-3 text-slate-400">
              {error ||
                "The requested investigation report could not be found."}
            </p>

            <button
              onClick={() =>
                navigate("/reports")
              }
              className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
            >
              Back to Reports
            </button>

          </div>

        </div>

      </Layout>
    );

  }


  /*
   * ---------------------------------------------------------
   * NORMALISE REPORT DATA
   * ---------------------------------------------------------
   *
   * Different parts of Alloy Cape may store investigation
   * information under slightly different objects.
   *
   * These fallbacks let the report display the available
   * information without breaking when a field is missing.
   */

  /*
   * ---------------------------------------------------------
   * ROBUST REPORT NORMALISATION
   * ---------------------------------------------------------
   *
   * Reports created by different Alloy Cape versions can have
   * the same forensic value at different nesting levels.
   *
   * IMPORTANT:
   * - "Not Recorded", "NA", "Not Available", null, undefined and "" are
   *   treated as missing.
   * - Boolean strings are converted to real booleans.
   * - We NEVER turn a missing value into MATCH/verified.
   */

  const isMissing = (value) => {
    if (value === null || value === undefined) return true;

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      return (
        normalized === "" ||
        normalized === "n/a" ||
        normalized === "na" ||
        normalized === "not available" ||
        normalized === "not recorded" ||
        normalized === "unknown" ||
        normalized === "undefined" ||
        normalized === "null"
      );
    }

    return false;
  };

  const firstValue = (...values) => {
    for (const value of values) {
      if (!isMissing(value)) return value;
    }
    return null;
  };

  const toBoolean = (value) => {
    if (typeof value === "boolean") return value;

    if (typeof value === "number") {
      if (value === 1) return true;
      if (value === 0) return false;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();

      if (
        ["true", "yes", "match", "matched", "verified", "valid", "pass", "passed"].includes(normalized)
      ) {
        return true;
      }

      if (
        ["false", "no", "mismatch", "modified", "tampered", "invalid", "fail", "failed"].includes(normalized)
      ) {
        return false;
      }
    }

    return null;
  };

  const toNumber = (value) => {
    if (isMissing(value)) return null;

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    const parsed = Number(
      String(value).replace("%", "").replace(/,/g, "").trim()
    );

    return Number.isFinite(parsed) ? parsed : null;
  };

  const ai =
    report.ai ||
    report.intelligence?.ai ||
    report.investigation?.ai ||
    {};

  const investigation =
    report.investigation ||
    report.investigationData ||
    {};

  const document =
    report.document ||
    report.documentData ||
    {};

  const intelligence =
    report.intelligence ||
    {};

  /*
   * risk can be:
   *   { level, score, evidence }
   * or simply "High"/"Medium"/"Low"
   */
  const rawRisk =
    firstValue(
      intelligence.risk,
      report.risk,
      investigation.risk
    );

  const risk =
    rawRisk && typeof rawRisk === "object"
      ? rawRisk
      : {};

  const rawConfidence =
    firstValue(
      intelligence.confidence,
      report.confidence,
      investigation.confidence,
      ai.confidence
    );

  const confidence = toNumber(rawConfidence);


  const keyFindings =
    Array.isArray(ai.keyFindings)
      ? ai.keyFindings
      : [];

  const recommendations =
    Array.isArray(ai.recommendations)
      ? ai.recommendations
      : [];

  const possibleCauses =
    Array.isArray(ai.possibleCauses)
      ? ai.possibleCauses
      : [];

  const events =
    investigation.events ||
    report.events ||
    [];

  const copies =
    document.copies ||
    investigation.copies ||
    report.copies ||
    [];

  const primaryCopy =
    copies[0] || {};


  const copyId =
    primaryCopy.copyId ||
    primaryCopy.copyID ||
    primaryCopy.id ||
    investigation.copyId ||
    report.copyId ||
    null;
  /*
   * ---------------------------------------------------------
   * FORENSIC VERIFICATION NORMALISATION
   * ---------------------------------------------------------
   *
   * The investigation engine returns these values in BOTH
   * top-level fields and inside report.verification:
   *
   *   sha256
   *   text
   *   pageCount
   *   metadata
   *
   * Older reports may use binaryMatch/textMatch/pageMatch/etc.
   */

  const verification =
    report.verification ||
    investigation.verification ||
    {};

  const forensic =
    report.forensic ||
    investigation.forensic ||
    {};

  const match =
    report.match ||
    investigation.match ||
    {};

  const binaryMatch = toBoolean(
    firstValue(
      investigation.binaryMatch,
      investigation.binaryIntegrity,
      report.binaryMatch,
      report.binaryIntegrity,
      verification.binaryMatch,
      verification.binaryIntegrity,
      verification.sha256,        // <-- add this
      forensic.binaryMatch,
      forensic.binaryIntegrity,
      match.binaryMatch
    )
  );

  const textMatch = toBoolean(
    firstValue(
      investigation.textMatch,
      investigation.textIntegrity,
      report.textMatch,
      report.textIntegrity,
      verification.textMatch,
      verification.textIntegrity,
      verification.text,          // <-- add this
      forensic.textMatch,
      forensic.textIntegrity,
      match.textMatch
    )
  );

  const pageMatch = toBoolean(
    firstValue(
      investigation.pageMatch,
      investigation.pageIntegrity,
      report.pageMatch,
      report.pageIntegrity,
      verification.pageMatch,
      verification.pageIntegrity,
      verification.pageCount,     // <-- add this
      forensic.pageMatch,
      forensic.pageIntegrity,
      match.pageMatch
    )
  );

  const metadataMatch = toBoolean(
    firstValue(
      investigation.metadataMatch,
      investigation.metadataIntegrity,
      report.metadataMatch,
      report.metadataIntegrity,
      verification.metadataMatch,
      verification.metadataIntegrity,
      verification.metadata,      // <-- add this
      forensic.metadataMatch,
      forensic.metadataIntegrity,
      match.metadataMatch
    )
  );

  const semanticChanged = toBoolean(
    firstValue(
      investigation.semanticChanged,
      report.semanticChanged,
      verification.semanticChanged,
      forensic.semanticChanged
    )
  );

  const riskEvidence =
    risk.evidence ||
    investigation.riskEvidence ||
    report.riskEvidence ||
    [];

  const behaviorEvidence =
    investigation.behaviorEvidence ||
    investigation.behavioralEvidence ||
    report.behaviorEvidence ||
    [];

  const semanticFindings =
    investigation.semanticFindings ||
    report.semanticFindings ||
    ai.semanticFindings ||
    [];

  const timeline =
    investigation.timeline ||
    report.timeline ||
    [];

  const forensicEvidence =
    investigation.evidence ||
    investigation.forensicEvidence ||
    report.evidence ||
    report.forensicEvidence ||
    [];


  /*
   * ---------------------------------------------------------
   * FORENSIC VALUES
   * ---------------------------------------------------------
   */

  const fileName =
    firstValue(
      document.fileName,
      document.filename,
      investigation.fileName,
      report.fileName
    ) || "Not Recorded";

  const dnaId =
    firstValue(
      document.dnaId,
      investigation.dnaId,
      report.dnaId
    ) || "Not Recorded";

  const sha256 =
    firstValue(
      document.sha256,
      document.sha256Hash,
      investigation.sha256,
      report.sha256,
      report.sha256Hash,
      verification.sha256Hash
    ) || "Not Recorded";

  const classification =
    firstValue(
      document.classification,
      investigation.classification,
      report.classification
    ) || "Not Recorded";

  const recipient =
    firstValue(
      document.investigatedRecipient,
      investigation.investigatedRecipient,
      report.investigatedRecipient,
      document.recipient,
      investigation.recipient,
      report.recipient,
      match.recipient
    ) || "Not Recorded";

  const integrity =
    investigation.integrity ??
    document.integrity ??
    report.integrity ??
    100;

    const allActivity = [
      ...(Array.isArray(events) ? events : []),
      ...(Array.isArray(forensicEvidence) ? forensicEvidence : []),
      ...(Array.isArray(timeline) ? timeline : []),
    ];

    const getEventText = (event) =>
      [
        event?.type,
        event?.action,
        event?.event,
        event?.activity,
        event?.name,
        event?.description,
        event?.message,
        event?.operation,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    const countActivity = (keywords) => {
      return allActivity.filter((event) => {
        const text = getEventText(event);

        return keywords.some((keyword) =>
          text.includes(keyword)
        );
      }).length;
    };

    const downloads =
      toNumber(
        firstValue(
          investigation.downloads,
          investigation.downloadCount,
          document.downloads,
          document.downloadCount,
          report.downloads,
          report.downloadCount
        )
      );

    const emailShares =
      toNumber(
        firstValue(
          investigation.emailShares,
          document.emailShares,
          report.emailShares,
          report.emailShareCount
        )
      );

    const cloudUploads =
      toNumber(
        firstValue(
          investigation.cloudUploads,
          document.cloudUploads,
          report.cloudUploads,
          report.cloudUploadCount
        )
      );

    const externalAccesses =
      toNumber(
        firstValue(
          investigation.externalAccesses,
          document.externalAccesses,
          report.externalAccesses,
          report.externalAccessCount
        )
      );

    const passwordReveals =
      toNumber(
        firstValue(
          investigation.passwordReveals,
          investigation.passwordRevealCount,
          document.passwordReveals,
          report.passwordReveals,
          report.passwordRevealCount
        )
      );

    const resolvedDownloads =
      downloads !== null
        ? downloads
        : countActivity([
            "download",
            "downloaded",
            "file download",
            "document download",
          ]);

    const resolvedEmailShares =
      emailShares !== null
        ? emailShares
        : countActivity([
            "email share",
            "email sent",
            "shared by email",
            "mail share",
          ]);

    const resolvedCloudUploads =
      cloudUploads !== null
        ? cloudUploads
        : countActivity([
            "cloud upload",
            "uploaded to cloud",
            "cloud",
            "upload",
          ]);

    const resolvedExternalAccesses =
      externalAccesses !== null
        ? externalAccesses
        : countActivity([
            "external access",
            "external",
            "outside organization",
            "unauthorized access",
          ]);

    const resolvedPasswordReveals =
      passwordReveals !== null
        ? passwordReveals
        : countActivity([
            "password reveal",
            "password revealed",
            "password access",
            "credential reveal",
            "password viewed",
          ]);

  const tampered =
    investigation.tampered ??
    document.tampered ??
    report.tampered ??
    false;


  const riskScore =
    toNumber(
      firstValue(
        risk.score,
        report.riskScore,
        report.risk_score,
        investigation.riskScore,
        investigation.risk_score,
        intelligence.riskScore,
        ai.riskScore
      )
    );

  const riskLevelRaw =
    firstValue(
      risk.level,
      risk.riskLevel,
      report.riskLevel,
      investigation.riskLevel,
      intelligence.riskLevel,
      typeof report.risk === "string" ? report.risk : null
    );

  const riskLevel =
    riskLevelRaw || "Not Recorded";


  return (
    <Layout>

      <div className="space-y-8">


        {/* =====================================================
            TOP ACTIONS
        ====================================================== */}

        <div className="flex items-center justify-between">

          <button
            onClick={() =>
              navigate("/reports")
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-700
              bg-[#16213A]
              px-4
              py-3
              text-white
              transition
              hover:border-cyan-500/40
              hover:text-cyan-400
            "
          >

            <ArrowLeft size={18} />

            Back to Reports

          </button>


          <button
            onClick={() =>
              generateReportPDF(report)
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-cyan-500
              px-5
              py-3
              font-semibold
              text-black
              transition
              hover:bg-cyan-400
            "
          >

            <Download size={18} />

            Download PDF

          </button>

        </div>


        {/* =====================================================
            REPORT IDENTITY
        ====================================================== */}

        <div className="
          rounded-3xl
          border
          border-cyan-500/20
          bg-gradient-to-r
          from-[#0B1220]
          via-[#111C33]
          to-[#16213A]
          p-8
        ">

          <div className="flex items-start gap-4">

            <div className="rounded-2xl bg-cyan-500/10 p-4">

              <FileText
                size={32}
                className="text-cyan-400"
              />

            </div>

            <div>

              <div className="
                mb-3
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-cyan-500/20
                bg-cyan-500/10
                px-3
                py-1
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-cyan-400
              ">

                Forensic Investigation

              </div>

              <h1 className="
                text-4xl
                font-black
                text-white
                md:text-5xl
              ">

                Investigation Report

              </h1>

              <p className="
                mt-3
                max-w-3xl
                leading-7
                text-slate-400
              ">

                Formal forensic investigation record generated
                by the Alloy Cape document attribution platform.

              </p>

            </div>

          </div>


          <div className="mt-8 grid gap-6 md:grid-cols-3">

            <InfoBox
              label="Report ID"
              value={
                firstValue(report.reportId, report.id) ||
                "Not Recorded"
              }
              mono
            />

            <InfoBox
              label="Generated"
              value={
                report.generatedAt
                  ? new Date(
                      report.generatedAt
                    ).toLocaleString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "Not Recorded"
              }
            />

            <InfoBox
              label="Analysis Engine"
              value={
                report.engine ||
                "Alloy Cape DNA Inspector"
              }
            />

          </div>

        </div>


        {/* =====================================================
            DOCUMENT INFORMATION
        ====================================================== */}

        <section>

          <SectionTitle
            icon={Database}
            title="Document Information"
            subtitle="Verified identity and registry information for the investigated document."
          />

          <div className="
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-3
          ">

            <EvidenceCard
              label="File Name"
              value={fileName}
              icon={FileText}
            />

            <EvidenceCard
              label="DNA ID"
              value={dnaId}
              icon={Database}
              mono
            />

            <EvidenceCard
              label="Classification"
              value={classification}
              icon={ShieldCheck}
            />

            <EvidenceCard
              label="Recipient"
              value={recipient}
              icon={Users}
            />

            <EvidenceCard
              label="SHA-256"
              value={sha256}
              icon={LockKeyhole}
              mono
            />

          </div>

        </section>


        {/* =====================================================
            SECURITY / FORENSIC EVIDENCE
        ====================================================== */}

          <section>

            <SectionTitle
              icon={ShieldCheck}
              title="Forensic Verification"
              subtitle="Security and integrity verification collected during the investigation."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                label="Integrity"
                value={`${integrity}%`}
                icon={ShieldCheck}
                positive={integrity >= 90}
              />

              <MetricCard
                label="Downloads"
                value={activity.downloads}
                icon={Download}
              />

              <MetricCard
                label="Email Shares"
                value={activity.emailShares}
                icon={Users}
              />

              <MetricCard
                label="Cloud Uploads"
                value={activity.cloudUploads}
                icon={Database}
              />

              <MetricCard
                label="External Accesses"
                value={activity.externalAccesses}
                icon={Activity}
              />

              <MetricCard
                label="Password Reveals"
                value={activity.passwordReveals}
                icon={LockKeyhole}
              />

              <MetricCard
                label="Tampered"
                value={tampered ? "YES" : "NO"}
                icon={AlertTriangle}
                danger={tampered}
              />

              <MetricCard
                label="Risk"
                value={`${riskLevel} (${riskScore})`}
                icon={AlertTriangle}
                danger={
                  String(riskLevel).toLowerCase() === "high"
                }
              />

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                label="Binary Integrity"
                value={
                  binaryMatch === null
                    ? "Not Recorded"
                    : binaryMatch
                      ? "MATCH"
                      : "MISMATCH"
                }
                icon={LockKeyhole}
                positive={binaryMatch === true}
                danger={binaryMatch === false}
              />

              <MetricCard
                label="Text Integrity"
                value={
                  textMatch === null
                    ? "Not Recorded"
                    : textMatch
                      ? "MATCH"
                      : "MISMATCH"
                }
                icon={FileText}
                positive={textMatch === true}
                danger={textMatch === false}
              />

              <MetricCard
                label="Page Integrity"
                value={
                  pageMatch === null
                    ? "Not Recorded"
                    : pageMatch
                      ? "MATCH"
                      : "MISMATCH"
                }
                icon={Database}
                positive={pageMatch === true}
                danger={pageMatch === false}
              />

              <MetricCard
                label="Metadata Integrity"
                value={
                  metadataMatch === null
                    ? "Not Recorded"
                    : metadataMatch
                      ? "MATCH"
                      : "MISMATCH"
                }
                icon={ShieldCheck}
                positive={metadataMatch === true}
                danger={metadataMatch === false}
              />

            </div>

            {semanticChanged !== null && (
              <div className="mt-6">

                <MetricCard
                  label="Semantic Modification"
                  value={
                    semanticChanged
                      ? "DETECTED"
                      : "NONE DETECTED"
                  }
                  icon={Activity}
                  positive={!semanticChanged}
                  danger={semanticChanged}
                />

              </div>
            )}

          </section>

        {/* =====================================================
            AI ANALYSIS
        ====================================================== */}

        <div>

          <SectionTitle
            icon={Activity}
            title="Alloy AI Forensic Assessment"
            subtitle="AI-generated interpretation of the verified investigation evidence."
          />

          <div className="space-y-6">

            <ReportSection
              title="Executive Summary"
              text={
                ai.executiveSummary ||
                "No executive summary available."
              }
            />

            <ReportSection
              title="Technical Assessment"
              text={
                ai.technicalAssessment ||
                "No technical assessment available."
              }
            />

            <ReportList
              title="Key Findings"
              items={keyFindings}
            />

            <ReportList
              title="Recommendations"
              items={recommendations}
            />

            <ReportList
              title="Possible Causes"
              items={possibleCauses}
            />

          </div>

        </div>


        {/* =====================================================
            TRUST / CONFIDENCE
        ====================================================== */}

        <section>

          <SectionTitle
            icon={ShieldCheck}
            title="Intelligence Assessment"
            subtitle="Calculated intelligence generated from the investigation evidence."
          />

          <div className="grid gap-6 md:grid-cols-3">

            <MetricCard
              label="Risk Score"
              value={
                riskScore !== null
                  ? riskScore
                  : "Not Recorded"
              }
              icon={AlertTriangle}
              danger={
                ["high", "critical"].includes(
                  String(
                    report.risk ||
                    riskLevel ||
                    ""
                  ).toLowerCase()
                )
              }
            />

            <MetricCard
              label="Risk Level"
              value={riskLevel}
              icon={ShieldCheck}
              danger={
                ["high", "critical"].includes(
                  String(
                    report.risk ||
                    riskLevel ||
                    ""
                  ).toLowerCase()
                )
              }
            />

            <MetricCard
              label="AI Confidence"
              value={
                confidence !== null
                  ? `${confidence}%`
                  : "Not Recorded"
              }
              icon={Activity}
              positive={
                confidence !== null &&
                confidence >= 80
              }
            />

          </div>

        </section>


        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="
          rounded-2xl
          border
          border-slate-700
          bg-[#111B33]
          p-5
          text-center
        ">

          <p className="text-xs text-slate-500">

            Alloy Cape Enterprise Document Attribution Platform

          </p>

          <p className="mt-1 text-xs text-slate-600">

            Forensic report • Controlled security information

          </p>

        </div>

      </div>

    </Layout>
  );
}


/* ============================================================
   SMALL UI COMPONENTS
============================================================ */

function InfoBox({
  label,
  value,
  mono = false,
}) {

  return (

    <div className="
      rounded-2xl
      border
      border-slate-700
      bg-[#0D162B]/70
      p-5
    ">

      <p className="
        text-xs
        uppercase
        tracking-wider
        text-slate-500
      ">
        {label}
      </p>

      <p
        className={`
          mt-2
          break-all
          text-sm
          text-white
          ${mono ? "font-mono text-cyan-400" : ""}
        `}
      >
        {value}
      </p>

    </div>

  );
}


function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}) {

  return (

    <div className="mb-5">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-cyan-500/10 p-3">

          <Icon
            size={22}
            className="text-cyan-400"
          />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {subtitle}
          </p>

        </div>

      </div>

    </div>

  );
}


function EvidenceCard({
  label,
  value,
  icon: Icon,
  mono = false,
}) {

  return (

    <div className="
      rounded-2xl
      border
      border-slate-700
      bg-[#16213A]
      p-5
      transition
      hover:border-cyan-500/30
    ">

      <div className="flex items-start gap-4">

        <div className="rounded-xl bg-[#1A2745] p-3">

          <Icon
            size={20}
            className="text-cyan-400"
          />

        </div>

        <div className="min-w-0">

          <p className="text-xs uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p
            className={`
              mt-2
              break-all
              text-sm
              text-white
              ${mono ? "font-mono text-cyan-400" : ""}
            `}
          >
            {value}
          </p>

        </div>

      </div>

    </div>

  );
}


function MetricCard({
  label,
  value,
  icon: Icon,
  positive = false,
  danger = false,
}) {

  return (

    <div className="
      rounded-2xl
      border
      border-slate-700
      bg-[#16213A]
      p-5
    ">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p
            className={`
              mt-2
              text-2xl
              font-black
              ${
                danger
                  ? "text-red-400"
                  : positive
                    ? "text-green-400"
                    : "text-white"
              }
            `}
          >
            {value}
          </p>

        </div>

        <div className="rounded-xl bg-[#1A2745] p-3">

          <Icon
            size={22}
            className={
              danger
                ? "text-red-400"
                : positive
                  ? "text-green-400"
                  : "text-cyan-400"
            }
          />

        </div>

      </div>

    </div>

  );
}
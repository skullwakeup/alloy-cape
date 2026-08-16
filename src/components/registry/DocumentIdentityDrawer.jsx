import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

import { useIssue } from "../../context/IssueContext";

import {
  getCopyEvents,
  logDocumentEvent,
} from "../../services/document/documentEventService";

import {
  deleteDocumentCascade,
  incrementDownload,
  incrementEmailShare,
  incrementCloudUpload,
  incrementExternalAccess,
  uploadProtectedCopy,
  revealCopyPassword,
  downloadProtectedCopy,
  downloadExternalCopy,
} from "../../services/document/documentSupabaseService";


import {
  getDocumentInvestigations,
} from "../../services/investigation/investigationService";

export default function DocumentIdentityDrawer({
  open,
  document,
  onClose,
}) {

  const navigate = useNavigate();

  const {
    loadRegistry,
  } = useIssue();

  const [investigations, setInvestigations] =
    useState([]);

  const [selectedCopyId, setSelectedCopyId] =
    useState(null);

  const [passwordRevealCounts, setPasswordRevealCounts] =
    useState({});  

  const [liveActivity, setLiveActivity] = useState({
    downloads: 0,
    emailShares: 0,
    cloudUploads: 0,
    externalAccesses: 0,
    lastAccessed: null,
    lastLocation: null,
  });

  const [copyActivity, setCopyActivity] = useState({
    downloads: 0,
    emailShares: 0,
    cloudUploads: 0,
    externalAccesses: 0,
    lastAccessed: null,
    lastLocation: null,
  });

  useEffect(() => {

    if (!document) return;

    setPasswordRevealCounts({});

    setLiveActivity({
      downloads: document.downloadCount ?? 0,
      emailShares: document.emailShares ?? 0,
      cloudUploads: document.cloudUploads ?? 0,
      externalAccesses: document.externalAccesses ?? 0,
      lastAccessed: document.lastAccessed ?? null,
      lastLocation: document.lastLocation ?? null,
    });

    const copies =
      document.copies ?? [];

    setSelectedCopyId(
      copies.length > 0
        ? copies[0].copyId
        : null
    );

    async function load() {

      try {

        const data =
          await getDocumentInvestigations(
            document.id
          );

        setInvestigations(data);

      }

      catch (err) {

        console.error(err);

      }

    }

    load();

  }, [document]);

  useEffect(() => {
    if (!document?.id || !selectedCopyId) {
      setCopyActivity({
        downloads: 0,
        emailShares: 0,
        cloudUploads: 0,
        externalAccesses: 0,
        lastAccessed: null,
        lastLocation: null,
      });

      return;
    }

    async function loadCopyActivity() {
      try {
        const events = await getCopyEvents(
          document.id,
          selectedCopyId
        );

        const lastEvent =
          events.length > 0
            ? events[events.length - 1]
            : null;

        setCopyActivity({
          downloads: events.filter(
            event =>
              event.event_type === "DOWNLOAD"
          ).length,

          emailShares: events.filter(
            event =>
              event.event_type === "EMAIL_SHARE"
          ).length,

          cloudUploads: events.filter(
            event =>
              event.event_type === "CLOUD_UPLOAD"
          ).length,

          externalAccesses: events.filter(
            event =>
              event.event_type === "EXTERNAL_ACCESS"
          ).length,

          lastAccessed:
            lastEvent?.created_at ?? null,

          lastLocation:
            lastEvent?.location ?? null,
        });
      } catch (err) {
        console.error(
          "COPY ACTIVITY LOAD ERROR",
          err
        );
      }
    }

    loadCopyActivity();
  }, [document?.id, selectedCopyId]);

  function getSelectedCopy() {

    const copies =
      document?.copies ?? [];

    if (copies.length === 0)
      return null;

    if (!selectedCopyId)
      return copies[0];

    return (
      copies.find(
        copy =>
          copy.copyId === selectedCopyId
      ) ?? copies[0]
    );
  }

  function getAccessRules() {

  const classification =
      String(
        document?.classification ?? ""
      )
        .trim()
        .toUpperCase();

    return {

      canDownload:
        classification === "PUBLIC" ||
        classification === "INTERNAL" ||
        classification === "CONFIDENTIAL",

      canEmailShare:
        classification === "PUBLIC" ||
        classification === "INTERNAL" ||
        classification === "CONFIDENTIAL" ||
        classification === "RESTRICTED",

      canCloudUpload:
        classification === "PUBLIC" ||
        classification === "INTERNAL",

      canExternalAccess:
        classification === "PUBLIC" ||
        classification === "INTERNAL",

      isRestricted:
        classification === "RESTRICTED",

    };
  }

  async function handleRevealPassword() {
    try {
      const copy = getSelectedCopy();

      if (!copy) {
        alert("No protected copy selected.");
        return;
      }

      const result = await revealCopyPassword(
        document.id,
        copy.copyId
      );

      const count = result.passwordRevealCount ?? 0;

      // Update counter immediately in the UI
      setPasswordRevealCounts(prev => ({
        ...prev,
        [copy.copyId]: count,
      }));

      setCopyActivity(prev => ({
        ...prev,
        lastAccessed: new Date().toISOString(),
        lastLocation: "Internal Network",
      }));

      // Also refresh copy activity / registry

      const warning =
        count >= 5
          ? "\n\n⚠️ WARNING: This password has been revealed frequently and may require investigation."
          : "";

      alert(
        "🔑 Protected Copy Password\n\n" +
          `Copy ID: ${copy.copyId}\n` +
          `Recipient: ${copy.recipient}\n\n` +
          `Password: ${result.password}\n\n` +
          `Password Revealed: ${count} time${
            count === 1 ? "" : "s"
          }` +
          warning
      );

    } catch (err) {
      console.error(
        "PASSWORD REVEAL ERROR",
        err
      );

      alert(
        err.message ??
          "Failed to reveal protected copy password."
      );
    }
  }


  async function handleDelete() {

    const confirmed = window.confirm(

      `Delete "${document.fileName}"?\n\n` +

      "This will permanently delete:\n\n" +

      "• Registry Entry\n" +

      "• Investigation History\n" +

      "• AI Reports\n\n" +

      "This action cannot be undone."

    );

    if (!confirmed) return;

    try {

      await deleteDocumentCascade(document.id);

      await loadRegistry();

      onClose();

    }

    catch (err) {

      console.error(err);

      alert("Failed to delete document.");

    }

  }

  async function handleDownload() {
    try {

      const classification =
        String(document?.classification ?? "")
          .trim()
          .toUpperCase();

      if (classification === "RESTRICTED") {
        alert(
          "🔒 Restricted documents cannot be downloaded after issuance."
        );
        return;
      }

      const copy = getSelectedCopy();

      if (!copy) {
        alert("No protected copy selected.");
        return;
      }

      if (!copy.storagePath) {
        alert(
          "Protected PDF storage path is missing."
        );
        return;
      }

      const blob =
        await downloadProtectedCopy(
          copy.storagePath
        );

      const copyId =
        copy.copyId ?? null;

      const trackerId =
        copy.trackerId ??
        document.trackerId ??
        null;

      const recipient =
        copy.recipient ??
        null;

      const fileName =
        copy.fileName ??
        `Protected_${copyId}.pdf`;

      saveAs(
        blob,
        fileName
      );

      await logDocumentEvent({
        documentId:
          document.id,

        trackerId,

        copyId,

        recipient,

        type:
          "DOWNLOAD",

        details: {
          action:
            "Protected copy downloaded",

          copyId,

          trackerId,

          recipient,

          recipientType:
            copy.recipientType ??
            null,

          recipientOrganization:
            copy.recipientOrganization ??
            null,

          fileName,
        },
      });

      await incrementDownload(
        document
      );

      const now =
        new Date().toISOString();

      setLiveActivity(prev => ({
        ...prev,

        downloads:
          prev.downloads + 1,

        lastAccessed:
          now,

        lastLocation:
          "Internal Network",
      }));

      setCopyActivity(prev => ({
        ...prev,

        downloads:
          prev.downloads + 1,

        lastAccessed:
          now,

        lastLocation:
          "Internal Network",
      }));

      await loadRegistry();

      const freshEvents =
        await getCopyEvents(
          document.id,
          copyId
        );

      const lastEvent =
        freshEvents.length > 0
          ? freshEvents[
              freshEvents.length - 1
            ]
          : null;

      setCopyActivity({
        downloads:
          freshEvents.filter(
            event =>
              event.event_type ===
              "DOWNLOAD"
          ).length,

        emailShares:
          freshEvents.filter(
            event =>
              event.event_type ===
              "EMAIL_SHARE"
          ).length,

        cloudUploads:
          freshEvents.filter(
            event =>
              event.event_type ===
              "CLOUD_UPLOAD"
          ).length,

        externalAccesses:
          freshEvents.filter(
            event =>
              event.event_type ===
              "EXTERNAL_ACCESS"
          ).length,

        lastAccessed:
          lastEvent?.created_at ??
          now,

        lastLocation:
          lastEvent?.location ??
          "Internal Network",
      });

    } catch (err) {

      console.error(
        "DOWNLOAD ERROR",
        err
      );

      alert(
        err.message ??
        "Failed to download protected copy."
      );
    }
  }

  async function handleEmailShare() {
    try {
      const classification =
        String(document?.classification ?? "")
          .trim()
          .toUpperCase();

      if (
        classification !== "PUBLIC" &&
        classification !== "INTERNAL" &&
        classification !== "CONFIDENTIAL" &&
        classification !== "RESTRICTED"
      ) {
        alert("⚠️ Email sharing is not allowed for this document.");
        return;
      }

      const copy = getSelectedCopy();
    

      if (!copy) {
        alert("No protected copy selected.");
        return;
      }

      if (!copy.storagePath) {
        alert(
          "Protected PDF storage path is missing."
        );
        return;
      }

      const protectedBlob =
        await downloadProtectedCopy(
          copy.storagePath
        );

      const fileName =
        copy.fileName ??
        `Protected_${copy.copyId}.pdf`;

      const file = new File(
        [protectedBlob],
        fileName,
        {
          type: "application/pdf",
        }
      );

      const recipient =
        copy.recipient ??
        document.recipients?.[0] ??
        "";

      const subject =
        `Protected Document - ${document.fileName}`;

      const body =
        `Please find the protected document attached.\n\n` +
        `Document: ${document.fileName}\n` +
        `Copy ID: ${copy.copyId}\n` +
        `Recipient: ${recipient}`;

      // ----------------------------------------
      // REAL FILE SHARE
      // ----------------------------------------

      if (
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: subject,
          text: body,
          files: [file],
        });
      } else {
        // Fallback: open user's email client
        window.location.href =
          `mailto:${encodeURIComponent(recipient)}` +
          `?subject=${encodeURIComponent(subject)}` +
          `&body=${encodeURIComponent(body)}`;
      }

      // ----------------------------------------
      // FORENSIC EVENT
      // ----------------------------------------

      await logDocumentEvent({
        documentId: document.id,

        trackerId:
          copy.trackerId ??
          document.trackerId ??
          null,

        copyId:
          copy.copyId ??
          null,

        recipient,

        type: "EMAIL_SHARE",

        details: {
          action: "Protected copy shared via email",
          copyId: copy.copyId ?? null,
          recipientType:
            copy.recipientType ?? null,
          recipientOrganization:
            copy.recipientOrganization ?? null,
          fileName:
            fileName,
        },
      });

      await incrementEmailShare(document);

      const now = new Date().toISOString();

      setCopyActivity(prev => ({
        ...prev,
        emailShares:
          prev.emailShares + 1,
        lastAccessed: now,
        lastLocation: "Internal Network",
      }));

      setLiveActivity(prev => ({
        ...prev,
        emailShares:
          prev.emailShares + 1,
        lastAccessed: now,
        lastLocation: "Internal Network",
      }));

      await loadRegistry();

    } catch (err) {

      // User cancelling navigator.share is not an application error
      if (err?.name === "AbortError") {
        return;
      }

      console.error(
        "EMAIL SHARE ERROR",
        err
      );

      alert(
        err.message ??
        "Failed to share protected document."
      );
    }
  }

  async function handleCloudUpload() {
    try {
      const classification =
        String(document?.classification ?? "")
          .trim()
          .toUpperCase();

      if (
        classification !== "PUBLIC" &&
        classification !== "INTERNAL"
      ) {
        alert(
          "🔒 Cloud upload is only allowed for PUBLIC and INTERNAL documents."
        );
        return;
      }

      const copy = getSelectedCopy();

      if (!copy) {
        alert("No protected copy selected.");
        return;
      }

      if (!copy.storagePath) {
        alert(
          "Protected PDF storage path is missing."
        );
        return;
      }

      const protectedBlob =
        await downloadProtectedCopy(
          copy.storagePath
        );

      const fileName =
        copy.fileName ??
        `Protected_${copy.copyId}.pdf`;

      // ----------------------------------------
      // REAL SUPABASE CLOUD UPLOAD
      // ----------------------------------------

      const uploadResult =
        await uploadProtectedCopy(
          document.id,
          copy.copyId,
          fileName,
          protectedBlob
        );

      // ----------------------------------------
      // FORENSIC EVENT
      // ----------------------------------------

      await logDocumentEvent({
        documentId: document.id,

        trackerId:
          copy.trackerId ??
          document.trackerId ??
          null,

        copyId:
          copy.copyId ??
          null,

        recipient:
          copy.recipient ??
          document.recipients?.[0] ??
          null,

        type: "CLOUD_UPLOAD",

        details: {
          action:
            "Protected copy uploaded to Supabase Cloud Storage",

          copyId:
            copy.copyId ?? null,

          recipientType:
            copy.recipientType ?? null,

          recipientOrganization:
            copy.recipientOrganization ?? null,

          fileName,

          storagePath:
            `${document.id}/${copy.copyId}/${fileName}`,
        },
      });

      await incrementCloudUpload(document);

      const now =
        new Date().toISOString();

      setCopyActivity(prev => ({
        ...prev,

        cloudUploads:
          prev.cloudUploads + 1,

        lastAccessed: now,

        lastLocation:
          "Cloud Storage",
      }));

      setLiveActivity(prev => ({
        ...prev,

        cloudUploads:
          prev.cloudUploads + 1,

        lastAccessed: now,

        lastLocation:
          "Cloud Storage",
      }));

      await loadRegistry();

      alert(
        "☁ Protected copy uploaded successfully to cloud storage."
      );

    } catch (err) {

      console.error(
        "CLOUD UPLOAD ERROR",
        err
      );

      alert(
        err.message ??
        "Failed to upload protected copy to cloud storage."
      );
    }
  }

  async function handleExternalAccess() {
    try {
      const classification =
        String(document?.classification ?? "")
          .trim()
          .toUpperCase();

      if (
        classification !== "PUBLIC" &&
        classification !== "INTERNAL"
      ) {
        alert(
          "🔒 External access is only allowed for PUBLIC and INTERNAL documents."
        );
        return;
      }

      const copy = getSelectedCopy();

      if (!copy) {
        alert("No protected copy selected.");
        return;
      }

      if (!copy.externalStoragePath) {
        alert(
          "External access copy is not available for this protected copy."
        );
        return;
      }

      // ==========================================
      // DOWNLOAD PERSISTED EXTERNAL COPY
      // ==========================================

      const externalBlob =
        await downloadExternalCopy(
          copy.externalStoragePath
        );

      const externalFileName =
        copy.externalFileName ??
        (
          copy.fileName ??
          `Protected_${copy.copyId}.pdf`
        ).replace(
          /\.pdf$/i,
          "_EXTERNAL.pdf"
        );

      saveAs(
        externalBlob,
        externalFileName
      );

      // ==========================================
      // FORENSIC EVENT
      // ==========================================

      await logDocumentEvent({
        documentId:
          document.id,

        trackerId:
          copy.trackerId ??
          document.trackerId ??
          null,

        copyId:
          copy.copyId ??
          null,

        recipient:
          copy.recipient ??
          document.recipients?.[0] ??
          null,

        type:
          "EXTERNAL_ACCESS",

        location:
          "External Network",

        details: {
          action:
            "Non-encrypted external copy released",

          copyId:
            copy.copyId ?? null,

          recipientType:
            copy.recipientType ?? null,

          recipientOrganization:
            copy.recipientOrganization ?? null,

          fileName:
            externalFileName,

          encrypted:
            false,

          passwordRequired:
            false,

          accessMode:
            "External Access",
        },
      });

      // ==========================================
      // UPDATE DOCUMENT COUNTER
      // ==========================================

      await incrementExternalAccess(
        document
      );

      // ==========================================
      // IMMEDIATE UI UPDATE
      // ==========================================

      const now =
        new Date().toISOString();

      setCopyActivity(prev => ({
        ...prev,

        externalAccesses:
          prev.externalAccesses + 1,

        lastAccessed:
          now,

        lastLocation:
          "External Network",
      }));

      setLiveActivity(prev => ({
        ...prev,

        externalAccesses:
          prev.externalAccesses + 1,

        lastAccessed:
          now,

        lastLocation:
          "External Network",
      }));

      await loadRegistry();

      alert(
        "🌐 External Access copy downloaded successfully."
      );

    } catch (err) {

      console.error(
        "EXTERNAL ACCESS ERROR",
        err
      );

      alert(
        err.message ??
        "Failed to access external copy."
      );
    }
  }

  if (!open || !document) return null;

  const accessRules = getAccessRules();

  const selectedCopy = getSelectedCopy();

  const passwordReveals =
    passwordRevealCounts[selectedCopy?.copyId] ??
    selectedCopy?.passwordRevealCount ??
    0;

  const riskScore = Math.min(
    100,
    copyActivity.downloads * 3 +
    copyActivity.emailShares * 8 +
    copyActivity.cloudUploads * 15 +
    copyActivity.externalAccesses * 20 +
    passwordReveals * 5
  );

  return (

    <div className="fixed inset-0 z-50">

      {/* Backdrop */}

      <div

        onClick={onClose}

        className="absolute inset-0 bg-black/50 backdrop-blur-sm"

      />

      {/* Drawer */}

      <div className="absolute right-0 top-0 h-full w-[480px] overflow-y-auto border-l border-slate-700 bg-[#111B33] shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-700 bg-[#111B33] p-6">

          <h2 className="text-2xl font-bold text-white">

            Document Identity

          </h2>

          <button onClick={onClose}>

            <X className="text-slate-400 transition hover:text-white" />

          </button>

        </div>

        <div className="space-y-8 p-6">

          {/* Hero */}

          <div className="rounded-3xl border border-cyan-700 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-6">

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0 flex-1">

                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">

                  Document Identity

                </p>

                <h1 className="mt-2 break-all text-2xl font-bold leading-snug text-white">

                  {document.fileName}

                </h1>

                <p className="mt-4 break-all font-mono text-cyan-300">

                  {document.dnaId}

                </p>

              </div>

              <span className="inline-flex whitespace-nowrap rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400">

                VERIFIED

              </span>

            </div>

          </div>

          {/* Document Details */}

          <DocumentSection title="Document Details">

            <IdentityItem

              title="DNA Identifier"

              value={document.dnaId}

            />

            <IdentityItem

              title="Classification"

              value={document.classification}

            />

            <IdentityItem

              title="Pages"

              value={document.pageCount}

            />

            <IdentityItem

              title="Recipients"

              value={document.recipients?.length ?? 0}

            />

          </DocumentSection>

          <DocumentSection title="Protected Copy">

            {(document.copies ?? []).length === 0 ? (

              <div className="rounded-2xl border border-dashed border-slate-700 p-5">

                <p className="text-slate-400">
                  No protected copies registered.
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                <select
                  value={selectedCopyId ?? ""}
                  onChange={(e) =>
                    setSelectedCopyId(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#16213A] p-4 text-white outline-none focus:border-cyan-500"
                >

                  {(document.copies ?? []).map(
                    (copy) => (

                      <option
                        key={copy.copyId}
                        value={copy.copyId}
                      >

                        {copy.recipient ?? "Unknown"} —{" "}
                        {copy.recipientType ?? "UNKNOWN"} —{" "}
                        {copy.copyId}

                      </option>

                    )
                  )}

                </select>

                {(() => {

                  const copy =
                    getSelectedCopy();

                  if (!copy) return null;

                  const revealCount =
                    passwordRevealCounts[copy.copyId] ??
                    copy.passwordRevealCount ??
                    0;

                  return (

                    <div className="rounded-2xl border border-cyan-800 bg-cyan-950/20 p-5 space-y-3">

                      <IdentityItem
                        title="Copy ID"
                        value={copy.copyId}
                        color="text-cyan-400"
                      />

                      <IdentityItem
                        title="Recipient"
                        value={
                          copy.recipient ??
                          "Unknown"
                        }
                      />

                      <IdentityItem
                        title="Recipient Type"
                        value={
                          copy.recipientType ??
                          "Unknown"
                        }
                        color={
                          copy.recipientType === "EXTERNAL"
                            ? "text-red-400"
                            : "text-green-400"
                        }
                      />

                      <IdentityItem
                        title="Organization"
                        value={
                          copy.recipientOrganization ??
                          "Unknown"
                        }
                      />

                      <IdentityItem
                        title="Tracker ID"
                        value={
                          copy.trackerId ??
                          document.trackerId ??
                          "Unknown"
                        }
                        color="text-cyan-400"
                      />

                      <IdentityItem
                        title="Recipient Signature"
                        value={
                          copy.recipientSignature ??
                          "Unknown"
                        }
                      />

                      <button
                        onClick={handleRevealPassword}
                        className="mt-3 w-full rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700"
                      >
                        🔑 Reveal Password
                      </button>

                      <div className="rounded-xl border border-slate-700 bg-[#111B33] p-4">

                        <div className="flex items-center justify-between">

                          <span className="text-sm text-slate-400">
                            Password Reveals
                          </span>

                          <span
                            className={`font-bold ${
                              revealCount >= 5
                                ? "text-red-400"
                                : revealCount >= 3
                                ? "text-yellow-400"
                                : "text-green-400"
                            }`}
                          >
                            {revealCount}
                          </span>

                        </div>

                        {revealCount >= 5 && (
                          <p className="mt-2 text-xs text-red-400">
                            ⚠️ Frequently revealed password
                          </p>
                        )}

                      </div>

                    </div>

                  );

                })()}

              </div>

            )}

          </DocumentSection>

          {/* Security */}

          <DocumentSection title="Security">

            <IdentityItem

              title="Status"

              value={document.status}

              color="text-green-400"

            />

            <IdentityItem

              title="Integrity"

              value="100%"

              color="text-green-400"

            />

          </DocumentSection>

          {/* Issue Information */}

          <DocumentSection title="Issue Information">

            <IdentityItem

              title="File Size"

              value={`${(

                document.fileSize /

                1024 /

                1024

              ).toFixed(2)} MB`}

            />

            <IdentityItem

              title="Issued"

              value={
                document.issuedAt
                  ? new Date(
                      document.issuedAt
                    ).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "-"
              }

            />

          </DocumentSection>

          <DocumentSection title="Document Activity Monitor">

            <IdentityItem
              title="Tracker ID"
              value={document.trackerId || "-"}
              color="text-cyan-400"
            />

            <IdentityItem
              title="Downloads"
              value={copyActivity.downloads}
            />

            <IdentityItem
              title="Email Shares"
              value={copyActivity.emailShares}
            />

            <IdentityItem
              title="Cloud Uploads"
              value={copyActivity.cloudUploads}
            />

            <IdentityItem
              title="External Accesses"
              value={copyActivity.externalAccesses}
            />

            <IdentityItem
              title="Activity Score"
              value={`${riskScore}/100`}
              color={

                  riskScore>80

                  ? "text-red-400"

                  : riskScore>50

                  ? "text-yellow-400"

                  : "text-green-400"

              }
            />

            <IdentityItem
              title="Last Activity"
              value={
                copyActivity.lastAccessed
                  ? new Date(
                      copyActivity.lastAccessed
                    ).toLocaleString()
                  : "Never"
              }
            />

            <IdentityItem
              title="Current Network"
              value={
                copyActivity.lastLocation ||
                "Internal Network"
              }
            />

          </DocumentSection>

                    {/* Recent Investigations */}

          <DocumentSection title="Recent Investigations">

            {investigations.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">

                <p className="text-slate-400">

                  No investigations have been performed for this document.

                </p>

                <p className="mt-2 text-sm text-slate-500">

                  Start a new investigation to generate forensic evidence.

                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {[...investigations]

                  .sort(

                    (a, b) =>

                      new Date(b.investigatedAt) -

                      new Date(a.investigatedAt)

                  )

                  .map((inv) => (

                    <div
                      key={inv.id}
                      className="rounded-2xl border border-slate-700 bg-[#16213A] p-4 transition hover:border-cyan-500/40"
                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <h4 className="font-semibold text-white">

                            {(inv.ai?.riskLevel ?? inv.risk)} Risk

                          </h4>

                          <p className="mt-1 text-sm text-slate-400">

                            {new Date(
                              inv.investigatedAt
                            ).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}

                          </p>

                        </div>

                        <div className="text-right">

                          <div className="text-xl font-bold text-cyan-400">

                            {Math.round(
                              inv.ai?.confidence ?? 0
                            )}%

                          </div>

                          <div className="text-xs text-slate-500">

                            Confidence

                          </div>

                        </div>

                      </div>

                    </div>

                  ))}

              </div>

            )}

          </DocumentSection>

          {/* Quick Actions */}

          <DocumentSection title="Quick Actions">

            <div className="grid grid-cols-2 gap-4">

              {/* New Investigation */}

              <button

                onClick={() => {

                  onClose();

                  navigate("/investigations");

                }}

                className="rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700"

              >

                New Investigation

              </button>

              {/* Open Latest Report */}

              <button

                disabled={investigations.length === 0}

                onClick={() => {

                  const latest = [...investigations]

                    .sort(

                      (a, b) =>

                        new Date(b.investigatedAt) -

                        new Date(a.investigatedAt)

                    )[0];

                  if (!latest) return;

                  onClose();

                  navigate(`/reports/${latest.id}`);

                }}

                className={`

                  rounded-xl

                  py-3

                  font-semibold

                  transition

                  ${

                    investigations.length === 0

                      ? "cursor-not-allowed bg-slate-800 text-slate-500"

                      : "bg-slate-700 text-white hover:bg-slate-600"

                  }

                `}

              >

                Open Latest Report

              </button>

              {/* Download */}

              <div className="grid grid-cols-2 gap-3">

                <button
                  onClick={handleDownload}
                  disabled={!accessRules.canDownload}
                  className={`rounded-xl py-3 font-semibold text-white ${
                    accessRules.canDownload
                      ? "bg-cyan-600 hover:bg-cyan-700"
                      : "cursor-not-allowed bg-slate-700 text-slate-500"
                  }`}
                >
                  ⬇ Download
                </button>

                <button
                  onClick={handleEmailShare}
                  disabled={!accessRules.canEmailShare}
                  className={`rounded-xl py-3 font-semibold text-white ${
                    accessRules.canEmailShare
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "cursor-not-allowed bg-slate-700 text-slate-500"
                  }`}
                >
                  📧 Email Share
                </button>

                <button
                  onClick={handleCloudUpload}
                  disabled={!accessRules.canCloudUpload}
                  className={`rounded-xl py-3 font-semibold text-white ${
                    accessRules.canCloudUpload
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "cursor-not-allowed bg-slate-700 text-slate-500"
                  }`}
                >
                  ☁ Cloud Upload
                </button>

                <button
                  onClick={handleExternalAccess}
                  disabled={!accessRules.canExternalAccess}
                  className={`rounded-xl py-3 font-semibold text-white ${
                    accessRules.canExternalAccess
                      ? "bg-red-600 hover:bg-red-700"
                      : "cursor-not-allowed bg-slate-700 text-slate-500"
                  }`}
                >
                  🌐 External Access
                </button>

              </div>

              {/* Delete */}

              <button

                onClick={handleDelete}

                className="rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"

              >

                Delete Document

              </button>

            </div>

          </DocumentSection>

        </div>

      </div>

    </div>

  );

}

function DocumentSection({ title, children }) {

  return (

    <div className="space-y-4">

      <h3 className="text-lg font-semibold text-white">

        {title}

      </h3>

      <div className="space-y-3">

        {children}

      </div>

    </div>

  );

}

function IdentityItem({

  title,

  value,

  color = "text-white",

}) {

  return (

    <div className="rounded-2xl border border-slate-700 bg-[#16213A] p-5 transition hover:border-cyan-500">

      <p className="text-xs uppercase tracking-wider text-slate-500">

        {title}

      </p>

      <h3 className={`mt-3 break-words text-lg font-semibold ${color}`}>

        {value}

      </h3>

    </div>

  );

}
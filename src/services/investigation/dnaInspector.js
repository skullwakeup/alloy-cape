import { extractMetadata } from "./extractMetadata";
import {
  decryptPDF,
  isEncrypted,
} from "@pdfsmaller/pdf-decrypt";

import {
  getDocumentByDNA,
  getCopyPasswordByRecipient,
} from "../document/documentSupabaseService";

import {
  getLatestInvestigation,
} from "./investigationService";

import { analyzeDocument } from "../documentAnalyzer";

import {
  analyzeSemanticChanges,
} from "../security/semanticEngine";

import {
  detectTampering,
} from "../security/tamperEngine";

import {
  attributeRecipient,
} from "../security/attributionEngine";

import {
  buildChainOfCustody,
} from "../security/chainOfCustody";

import {
  calculateRisk,
} from "../security/riskEngine";

import {
  detectLeak,
} from "../security/leakDetectionEngine";

import {
  getDocumentEvents,
} from "../document/documentEventService";

import {
  analyzeBehavior,
} from "../security/behaviorEngine";

import {
  findCopyIdentity,
} from "../security/copyIdentityService";


async function prepareInvestigationFile(file) {

  const originalBytes =
    new Uint8Array(
      await file.arrayBuffer()
    );

  // ==========================================
  // CHECK WHETHER PDF IS ENCRYPTED
  // ==========================================

  let encryptionInfo;

  try {

    encryptionInfo =
      await isEncrypted(
        originalBytes
      );

  } catch (error) {

    console.error(
      "PDF ENCRYPTION CHECK FAILED",
      error
    );

    return {
      file,
      encrypted: false,
    };

  }



  // ==========================================
  // NORMAL UNPROTECTED PDF
  // ==========================================

  if (!encryptionInfo?.encrypted) {

    return {
      file,
      encrypted: false,
    };

  }


  // ==========================================
  // PROTECTED PDF
  // ==========================================

  // ==========================================
  // GET RECIPIENT FROM FILE NAME
  // USED ONLY TO FIND THE PASSWORD
  // ==========================================

  const fileName =
    file.name ?? "";

  const extensionIndex =
    fileName
      .toLowerCase()
      .lastIndexOf(".pdf");

  const withoutExtension =
    extensionIndex >= 0
      ? fileName.substring(
          0,
          extensionIndex
        )
      : fileName;

  const separatorIndex =
    withoutExtension.lastIndexOf("_");

  let recipientEmail = null;

  if (separatorIndex >= 0) {

    recipientEmail =
      withoutExtension
        .substring(separatorIndex + 1)
        .trim()
        .toLowerCase();

    // Strip browser-added duplicate suffixes like " (1)", " (2)"
    recipientEmail = recipientEmail.replace(/\s*\(\d+\)\s*$/, "").trim();

  }


  if (!recipientEmail) {

    throw new Error(
      "This PDF is password protected, but the recipient could not be determined from the filename."
    );

  }

  if (!recipientEmail) {

    throw new Error(
      "Unable to determine recipient email from protected PDF filename."
    );

  }

  // ==========================================
  // FIND PASSWORD USING RECIPIENT
  // ==========================================

  const passwordRecord =
    await getCopyPasswordByRecipient(
      recipientEmail
    );



  if (
    !passwordRecord ||
    !passwordRecord.password
  ) {

    throw new Error(
      `No password was found for protected copy recipient: ${recipientEmail}`
    );

  }

  // ==========================================
  // DECRYPT
  // ==========================================

  let decryptedBytes;

  try {

    decryptedBytes =
      await decryptPDF(
        originalBytes,
        passwordRecord.password
      );

  } catch (error) {

    console.error(
      "PDF DECRYPTION FAILED",
      error
    );

    throw new Error(
      "Unable to decrypt this protected PDF. The stored copy password may be incorrect."
    );

  }


  // ==========================================
  // CREATE DECRYPTED FILE
  // ==========================================

  const decryptedFile =
    new File(
      [
        decryptedBytes
      ],

      file.name,

      {
        type:
          "application/pdf",
      }
    );



  return {

    file:
      decryptedFile,

    encrypted:
      true,

    copyId:
      passwordRecord.copyId,

    passwordRecord,

  };
}

export async function inspectDocument(file) {

  const startTime = Date.now();

  // --------------------------------------------------
  // 0. PREPARE PDF
  // --------------------------------------------------
  // Protected PDFs are decrypted first.
  // Unprotected PDFs pass through unchanged.
  // --------------------------------------------------

  const prepared =
    await prepareInvestigationFile(
      file
    );

  const investigationFile =
    prepared.file;


  // --------------------------------------------------
  // 1. EXTRACT PDF METADATA
  // --------------------------------------------------

  const metadata =
    await extractMetadata(
      investigationFile
    );


  // --------------------------------------------------
  // 2. ANALYZE UPLOADED PDF
  // --------------------------------------------------

  const uploaded =
  await analyzeDocument({

    file:
      investigationFile,

    fileName:
      investigationFile.name,

    fileSize:
      investigationFile.size,

  });


  // --------------------------------------------------
  // 3. CHECK DNA
  // --------------------------------------------------

  if (!metadata?.keywords) {

    return {

      success: false,

      message:
        "No Document DNA Found",

    };

  }


  // --------------------------------------------------
  // 4. EXTRACT COPY IDENTITY
  //
  // DNA | RECIPIENT | SIGNATURE | COPY ID | TYPE
  // --------------------------------------------------

  const [
    dnaId,
    recipient,
    signature,
    copyId,
    recipientType,
  ] =
    metadata.keywords.split("|");


  uploaded.dnaId =
    dnaId;

  uploaded.recipientSignature =
    signature;

  uploaded.recipient =
    recipient;


  // --------------------------------------------------
  // 5. FIND ORIGINAL DOCUMENT
  // --------------------------------------------------

  const match =
    await getDocumentByDNA(
      dnaId
    );


  if (!match) {

    return {
      success: false,
      message: "DNA Not Registered",
    };

  }

  const protectedCopy =
    match.copies?.find(
      copy =>
        copy.copyId === copyId ||
        copy.copy_id === copyId
    ) ?? null;

  if (!protectedCopy) {

    throw new Error(
      `Protected copy ${copyId} was not found in the registry.`
    );

  }

  const password =
    protectedCopy.copyPassword ??
    protectedCopy.copy_password;

  if (!password) {

    throw new Error(
      `Password is missing for protected copy ${copyId}.`
    );

  }


  const passwordRecord = {

    copyId:
      protectedCopy.copyId ??
      protectedCopy.copy_id,

    recipient:
      protectedCopy.recipient ??
      recipient,

    password,

  };

  // --------------------------------------------------
  // 6. FIND EXACT COPY IDENTITY
  // --------------------------------------------------

  let copyIdentity =
    null;

  if (copyId) {

    try {

      copyIdentity =
        await findCopyIdentity(
          copyId
        );

    } catch (error) {

      console.error(
        "COPY IDENTITY LOOKUP ERROR",
        error
      );

    }

  }

  // --------------------------------------------------
  // 7. FALLBACK COPY INFORMATION
  // --------------------------------------------------

  const resolvedRecipient =
    copyIdentity?.recipient ??
    recipient ??
    null;

  const resolvedRecipientType =
    copyIdentity?.recipientType ??
    recipientType ??
    "UNKNOWN";

  const resolvedOrganization =
    copyIdentity?.recipientOrganization ??
    "Unknown";

  const resolvedCopyId =
    copyIdentity?.copyId ??
    copyId ??
    null;

  const resolvedSignature =
    copyIdentity?.recipientSignature ??
    signature ??
    null;

  // --------------------------------------------------
  // 8. COPY-SPECIFIC LEAK ANALYSIS
  // --------------------------------------------------

  const events =
    await getDocumentEvents(match.id);

  // Find the exact protected copy
  const selectedCopy =
    match.copies?.find(
      copy =>
        copy.copyId === resolvedCopyId ||
        copy.copy_id === resolvedCopyId
    ) ?? null;

  // If the copy is not present inside the stored copies array,
  // create a lightweight copy identity so the event engine
  // can still filter events correctly.
  const leakCopy =
    selectedCopy ??
    (
      resolvedCopyId
        ? {
            copyId: resolvedCopyId,
            recipient:
              resolvedRecipient,
            recipientType:
              resolvedRecipientType,
            recipientOrganization:
              resolvedOrganization,
            recipientSignature:
              resolvedSignature,
          }
        : null
    );

  // IMPORTANT:
  // Pass events as the third argument.
  const leak =
    detectLeak(
        match,
        selectedCopy,
        events
    );

  // Behavior is also restricted to this exact copy.
  const behavior =
    analyzeBehavior(
        events,
        selectedCopy?.copyId ??
        selectedCopy?.copy_id ??
        resolvedCopyId
    );

  const combinedLeakScore =
    Math.min(
      100,
      leak.probability +
        behavior.score
    );

  let combinedLeakLevel =
    "Minimal";

  if (
    combinedLeakScore >= 20
  ) {
    combinedLeakLevel =
      "Low";
  }

  if (
    combinedLeakScore >= 40
  ) {
    combinedLeakLevel =
      "Medium";
  }

  if (
    combinedLeakScore >= 60
  ) {
    combinedLeakLevel =
      "High";
  }

  if (
    combinedLeakScore >= 80
  ) {
    combinedLeakLevel =
      "Critical";
  }

  // --------------------------------------------------
  // 9. FORENSIC TAMPERING
  // --------------------------------------------------

  // --------------------------------------------------
// 9. FORENSIC TAMPERING
// --------------------------------------------------

// Use the EXACT protected copy as the forensic baseline.
// Do NOT compare against the original document.
const forensicBaseline =
    selectedCopy?.analysis ??
    selectedCopy ??
    null;


const forensic =
    forensicBaseline
        ? detectTampering(
            forensicBaseline,
            uploaded,
            {
                skipBinaryCheck:
                    prepared.encrypted === true,
            }
          )
        : {
            tampered: true,
            integrity: 0,
            evidence: [
                {
                    severity: "CRITICAL",
                    type: "Baseline",
                    message:
                        "Protected copy forensic baseline could not be found.",
                },
            ],
            binaryMatch: false,
            textMatch: false,
            pageMatch: false,
            metadataMatch: false,
        };


  // --------------------------------------------------
  // 10. SEMANTIC ANALYSIS
  // --------------------------------------------------

  const semanticBaseline =
    forensicBaseline?.text ?? ""; 

  const semantic =
      analyzeSemanticChanges(
          semanticBaseline,
          uploaded.text
      );


  // --------------------------------------------------
  // 11. RECIPIENT ATTRIBUTION
  // --------------------------------------------------

  const attribution =
    attributeRecipient(
      match,
      {

        dnaId,

        recipient:
          resolvedRecipient,

        signature:
          resolvedSignature,

        copyId:
          resolvedCopyId,

        recipientType:
          resolvedRecipientType,

        recipientOrganization:
          resolvedOrganization,

        trackerId:
          match.trackerId,

      }
    );




  // --------------------------------------------------
  // 12. LATEST INVESTIGATION
  // --------------------------------------------------

  const latestInvestigation =
    await getLatestInvestigation(
      match.id
    );


  const ai =
    latestInvestigation?.ai;


  const confidence =
    Math.round(
      ai?.confidence ??
        forensic.integrity
    );


  // --------------------------------------------------
  // 13. RISK ANALYSIS
  // --------------------------------------------------

  const riskActivity =
    leak.activity ?? {
      downloads: 0,
      emailShares: 0,
      cloudUploads: 0,
      externalAccesses: 0,
    };

  const passwordReveals =
  selectedCopy?.passwordRevealCount ??
  selectedCopy?.password_reveal_count ??
  0;

const riskAnalysis =
  calculateRisk({

    downloads:
      riskActivity.downloads,

    emailShares:
      riskActivity.emailShares,

    cloudUploads:
      riskActivity.cloudUploads,

    externalAccesses:
      riskActivity.externalAccesses,

    passwordReveals:
      passwordReveals,

    tampered:
      forensic.tampered,

    integrity:
      forensic.integrity,

    classification:
      match.classification,

    semanticScore:
      semantic.score,

  });


  // --------------------------------------------------
  // FINAL RISK OVERRIDE
  // --------------------------------------------------
  // A critical forensic finding must never be displayed
  // as Low or Medium risk.

  const criticalForensic =
    forensic?.tampered === true &&
    (
      forensic?.integrity <= 20 ||
      forensic?.evidence?.some(
        item =>
          String(item?.severity ?? "")
            .toUpperCase() === "CRITICAL"
      )
    );

  const highForensic =
    forensic?.tampered === true &&
    !criticalForensic;

  if (criticalForensic) {

    riskAnalysis.level = "Critical";

    riskAnalysis.score = Math.max(
      Number(riskAnalysis.score) || 0,
      90
    );

  } else if (highForensic) {

    if (
      String(riskAnalysis.level ?? "")
        .toLowerCase() === "low" ||
      String(riskAnalysis.level ?? "")
        .toLowerCase() === "minimal"
    ) {
      riskAnalysis.level = "High";
    }

    riskAnalysis.score = Math.max(
      Number(riskAnalysis.score) || 0,
      70
    );
  }

  // --------------------------------------------------
  // 14. CHAIN OF CUSTODY
  // --------------------------------------------------

  const custody =
    buildChainOfCustody(
      match,
      {

        recipient:
          resolvedRecipient,

        risk:
          riskAnalysis?.level,

      }
    );


  // --------------------------------------------------
  // 15. SUMMARY
  // --------------------------------------------------

  const summary = [];


  if (
    forensic.binaryMatch
  ) {

    summary.push(
      "Binary fingerprint verified."
    );

  } else {

    summary.push(
      "Binary SHA-256 mismatch detected."
    );

  }


  if (
    forensic.textMatch
  ) {

    summary.push(
      "Document text matches the protected copy."
    );

  } else {

    summary.push(
      "Document text has been modified."
    );

  }


  if (
    forensic.pageMatch
  ) {

    summary.push(
      "Page structure verified."
    );

  } else {

    summary.push(
      "Page count mismatch detected."
    );

  }


  if (
    leak.activity?.emailShares > 0
  ) {

    summary.push(
      `${leak.activity.emailShares} email share(s) recorded for this protected copy.`
    );

  }

  if (
    leak.activity?.cloudUploads > 0
  ) {

    summary.push(
      `${leak.activity.cloudUploads} cloud upload(s) detected for this protected copy.`
    );

  }

  if (
    leak.activity?.externalAccesses > 0
  ) {

    summary.push(
      `${leak.activity.externalAccesses} external access event(s) detected for this protected copy.`
    );

  }

  if (
    passwordReveals > 0
  ) {

    summary.push(
      `${passwordReveals} password reveal(s) recorded for this protected copy.`
    );

  }

  if (
    semantic.changed
  ) {

    summary.push(
      `${semantic.findings.length} semantic modification(s) detected.`
    );

  }


  // --------------------------------------------------
  // 16. COPY ATTRIBUTION SUMMARY
  // --------------------------------------------------

  if (
    resolvedCopyId
  ) {

    summary.push(
      `Copy ${resolvedCopyId} attributed to ${resolvedRecipient ?? "unknown recipient"}.`
    );

  }


  if (
    resolvedRecipientType ===
    "EXTERNAL"
  ) {

    summary.push(
      "External recipient detected."
    );

  }


  if (
    resolvedRecipientType ===
    "INTERNAL"
  ) {

    summary.push(
      "Internal recipient verified."
    );

  }


  // --------------------------------------------------
  // 17. INVESTIGATOR
  // --------------------------------------------------

  const investigator =
    latestInvestigation?.investigator ??
    "Administrator";


  // --------------------------------------------------
  // 18. REPORT ID
  // --------------------------------------------------

  const reportId =
    "INV-" +
    new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "") +
    "-" +
    Math.floor(
      Math.random() * 100000
    )
      .toString()
      .padStart(5, "0");


  // --------------------------------------------------
  // 19. TIMELINE
  // --------------------------------------------------

  const generatedAt =
    new Date();


  const timeline = [

    {
      time:
        generatedAt.toLocaleTimeString(),

      event:
        "Document uploaded",
    },

    {
      time:
        generatedAt.toLocaleTimeString(),

      event:
        "Metadata extracted",
    },

    {
      time:
        generatedAt.toLocaleTimeString(),

      event:
        forensic.binaryMatch
          ? "SHA-256 verified"
          : "SHA-256 mismatch detected",
    },

    {
      time:
        generatedAt.toLocaleTimeString(),

      event:
        forensic.textMatch
          ? "Text integrity verified"
          : "Document text modified",
    },

    {
      time:
        generatedAt.toLocaleTimeString(),

      event:
        forensic.tampered
          ? "Tampering detected"
          : "No tampering detected",
    },

    {
      time:
        generatedAt.toLocaleTimeString(),

      event:
        resolvedCopyId
          ? `Copy ${resolvedCopyId} identified`
          : "Copy identity not found",
    },

    {
      time:
        generatedAt.toLocaleTimeString(),

      event:
        resolvedRecipient
          ? `Recipient identified: ${resolvedRecipient}`
          : "Recipient could not be identified",
    },

    {
      time:
        generatedAt.toLocaleTimeString(),

      event:
        `Risk Score ${riskAnalysis.score}/100`,
    },

    {
      time:
        generatedAt.toLocaleTimeString(),

      event:
        `Risk Level: ${riskAnalysis.level}`,
    },

    {
      time:
        generatedAt.toLocaleTimeString(),

      event:
        passwordReveals > 0
          ? `${passwordReveals} password reveal(s) detected`
          : "No password reveal activity detected",
    },

  ];


  // --------------------------------------------------
  // 20. FINAL RESULT
  // --------------------------------------------------

  return {

    success: true,

    metadata,

    dnaId,

    events,

    behaviorScore:
      behavior.score,

    behaviorLevel:
      behavior.level,

    behaviorEvidence:
      behavior.evidence,

    behaviorPatterns:
      behavior.patterns,

    // Original recipient fields
    recipient:
      resolvedRecipient,

    signature:
      resolvedSignature,

    // NEW COPY IDENTITY
    copyId:
      resolvedCopyId,

    recipientType:
      resolvedRecipientType,

    recipientOrganization:
      resolvedOrganization,

    copyIdentity,

    match,

    reportId,

    generatedAt,

    investigator,

    engine:
      "Alloy Cape DNA Inspector",

    version:
      "3.0",

    confidence:
      `${confidence}%`,

    investigationTime:
      (
        (Date.now() - startTime) /
        1000
      ).toFixed(2) +
      " sec",

    integrity:
      forensic.integrity,

    risk:
      riskAnalysis.level,

    riskScore:
      riskAnalysis.score,

    riskEvidence:
      riskAnalysis.evidence,

    passwordReveals:
      passwordReveals,

    summary:
      summary.join("\n"),

    verification: {

      registry:
        true,

      dna:
        forensic.metadataMatch,

      metadata:
        forensic.metadataMatch,

      sha256:
        forensic.binaryMatch,

      text:
        forensic.textMatch,

      pageCount:
        forensic.pageMatch,

    },

    tampered:
      forensic.tampered,

    evidence:
      forensic.evidence,

    semanticChanged:
      semantic.changed,

    semanticScore:
      semantic.score,

    semanticFindings:
      semantic.findings,

    binaryMatch:
      forensic.binaryMatch,

    textMatch:
      forensic.textMatch,

    pageMatch:
      forensic.pageMatch,

    metadataMatch:
      forensic.metadataMatch,

    uploaded,

    timeline,

    ai,

    attribution,

    chainOfCustody:
      custody,

    leakProbability:
      combinedLeakScore,

    leakLevel:
      combinedLeakLevel,

    leakEvidence: [

      ...(leak.evidence ?? []),

      ...(behavior.evidence ?? []),

    ],

  };

}
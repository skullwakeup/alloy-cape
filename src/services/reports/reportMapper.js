export function mapReport(data) {
  const ai = data.investigation_ai_reports?.[0] ?? {};
  const doc = data.documents ?? {};

  // `findings` is stored as JSON.stringify(result.verification) by
  // saveInvestigation(). Parse it back into an object so ReportViewer
  // can read verification.sha256 / .text / .pageCount / .metadata.
  let verification = {};
  let semanticScore = 0;

  try {
      const parsed = data.findings ? JSON.parse(data.findings) : {};

      // New format: { verification, semanticScore }
      // Old format: verification fields directly at top level
      if (parsed.verification) {
          verification = parsed.verification;
          semanticScore = parsed.semanticScore ?? 0;
      } else {
          verification = parsed;
      }
  } catch (e) {
      console.error("Failed to parse investigation findings JSON:", e);
  }

  return {
    id: data.id,

    reportId: data.id.slice(0, 8).toUpperCase(),

    investigator: data.investigator,

    investigatedAt: data.investigated_at,

    generatedAt: ai.created_at ?? data.investigated_at,

    engine: ai.model
      ? `Alloy Cape DNA Inspector (${ai.model})`
      : "Alloy Cape DNA Inspector v3.0",

    integrity: data.integrity,

    risk: data.risk,

    success: data.success,

    findings: data.findings,

    // NEW — was missing entirely, so ReportViewer always fell back to 0
    passwordReveals: data.password_reveals ?? 0,

    // NEW — was missing entirely, so ReportViewer always showed "Not Recorded"
    tampered: data.tampered ?? false,

    // NEW — parsed verification object matching what dnaInspector.js saves
    verification,

    semanticScore,

    document: {
      id: doc.id,

      fileName: doc.title,

      dnaId: doc.dna_id,

      classification: doc.classification,

      sha256: doc.sha256,

      recipient: doc.recipient,

      recipients: doc.recipient
        ? doc.recipient.split(",").map((r) => r.trim())
        : [],

      status: doc.status,

      fileSize: doc.file_size,

      issuedAt: doc.created_at,
    },

    ai: {
      model: ai.model,

      confidence: ai.confidence,

      riskLevel: ai.risk_level,

      riskScore: ai.risk_score,

      executiveSummary: ai.executive_summary,

      technicalAssessment: ai.technical_assessment,

      keyFindings: ai.key_findings ?? [],

      recommendations: ai.recommendations ?? [],

      possibleCauses: ai.possible_causes ?? [],

      generatedAt: ai.created_at,
    },
  };
}
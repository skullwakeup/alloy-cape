export function mapInvestigation(inv) {
  const ai = inv.investigation_ai_reports?.[0];

  return {
    id: inv.id,
    documentId: inv.document_id,
    investigator: inv.investigator,
    integrity: inv.integrity,
    risk: inv.risk,
    success: inv.success,
    findings: inv.findings,
    investigatedAt: inv.investigated_at,
    investigatedRecipient: inv.investigated_recipient,

    ai: {
      confidence: ai?.confidence ?? 0,
      riskLevel: ai?.risk_level ?? inv.risk,
      executiveSummary: ai?.executive_summary ?? "",
      technicalAssessment: ai?.technical_assessment ?? "",
      recommendations: ai?.recommendations ?? [],
      possibleCauses: ai?.possible_causes ?? [],
    },
  };
}
import { supabase } from "../../lib/supabase";

export async function getInvestigations() {

  const { data, error } = await supabase
    .from("investigations")
    .select(`
      *,
      documents (
        id,
        title,
        classification,
        sha256,
        dna_id,
        status,
        file_size,
        recipient,
        created_at
      ),
      investigation_ai_reports (
        confidence,
        risk_level,
        risk_score,
        executive_summary,
        technical_assessment,
        key_findings,
        recommendations,
        possible_causes,
        created_at
      )
    `)
    .order("investigated_at", { ascending: false });

  if (error) throw error;

  return data.map((item) => {

    const aiReport =
      item.investigation_ai_reports?.[0] ?? {};

    const match = {

      id: item.document_id,

      fileName:
        item.documents?.title || "Unknown Document",

      dnaId:
        item.documents?.dna_id || "",

      classification:
        item.documents?.classification || "Unknown",

      sha256:
        item.documents?.sha256 || "",

      fileSize:
        item.documents?.file_size || 0,

      recipients:
        item.investigated_recipient
          ? [item.investigated_recipient]
          : ["Unknown"],

      integrity:
        item.integrity ?? 100,

      status:
        item.documents?.status || "",

      issuedAt:
        item.documents?.created_at ?? null,

    };

    return {

      id: item.id,

      documentId: item.document_id,

      reportId:
        item.report_id ??
        item.id.slice(0, 8).toUpperCase(),

      investigator:
        item.investigator,

      success:
        item.success,

      integrity:
        item.integrity ?? 100,

      risk:
        item.risk,

      confidence:
        aiReport.confidence ?? 0,

      generatedAt:
        aiReport.created_at ??
        item.investigated_at,

      investigatedAt:
        item.investigated_at,

      summary:
        item.findings,

      findings:
        item.findings,

      dnaId:
        match.dnaId,

      engine:
        "Alloy Cape Intelligence Engine",

      version:
        "3.0",

      match,

      tampered:
        item.tampered,

      leakProbability:
        item.leak_probability,

      evidence:
        item.evidence ?? [],

      passwordReveals:
        item.password_reveals ?? 0,

      fileName:
        match.fileName,

      classification:
        match.classification,

      sha256:
        match.sha256,

      fileSize:
        match.fileSize,

      status:
        match.status,

      recipients:
        match.recipients,

      riskScore:
        aiReport.risk_score ?? null,

      riskLevel:
        aiReport.risk_level ?? item.risk,

      intelligence: {

        confidence:
          aiReport.confidence ?? 0,

        risk:
          item.risk,

        score:
          aiReport.risk_score ?? null,

        passwordReveals:
          item.password_reveals ?? 0,

      },

      aiAnalysis: {

        executiveSummary:
          aiReport.executive_summary ?? "",

        technicalAssessment:
          aiReport.technical_assessment ?? "",

        keyFindings:
          aiReport.key_findings ?? [],

        recommendations:
          aiReport.recommendations ?? [],

        possibleCauses:
          aiReport.possible_causes ?? [],

      },

      timeline: [
        {
          time: new Date(
            item.documents?.created_at ??
            item.investigated_at
          ).toLocaleString(),
          event: "Document Registered",
        },
        {
          time: new Date(
            item.investigated_at
          ).toLocaleString(),
          event: "Investigation Completed",
        },
      ],

    };

  });

}

export async function saveInvestigation(
  document,
  result
) {

  const { data, error } =
    await supabase
      .from("investigations")
      .insert([
        {

          document_id:
            document.id,

          investigated_recipient:
            document.investigatedRecipient,

          investigator:
            "Administrator",

          integrity:
            result.integrity,

          risk:
            result.risk,

          success:
            result.success,

          tampered:
            result.tampered,

          leak_probability:
            result.leakProbability,

          evidence:
            result.evidence,

          password_reveals:
            result.passwordReveals ?? 0,

          findings:
            JSON.stringify({
                verification:
                    result.verification,
                semanticScore:
                    result.semanticScore ?? 0,
            }),

        },
      ])
      .select()
      .single();

  if (error) throw error;

  return data;
}

export async function deleteInvestigation(id) {

  const { error } = await supabase
    .from("investigations")
    .delete()
    .eq("id", id);

  if (error) throw error;

}
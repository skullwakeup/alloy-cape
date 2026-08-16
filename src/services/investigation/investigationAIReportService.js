import { supabase } from "../../lib/supabase";

export async function saveAIReport(
    investigationId,
    intelligence,
    aiAnalysis
) {

    const { error } = await supabase
        .from("investigation_ai_reports")
        .insert({

            investigation_id: investigationId,

            model: "gemini-3.1-flash-lite",

            executive_summary:
                aiAnalysis.executiveSummary,

            technical_assessment:
                aiAnalysis.technicalAssessment,

            key_findings:
                aiAnalysis.keyFindings,

            recommendations:
                aiAnalysis.recommendations,

            possible_causes:
                aiAnalysis.possibleCauses,

            confidence:
                aiAnalysis.confidence,

            risk_level:
                intelligence.risk.level,

            risk_score:
                intelligence.risk.score,

        });

    if (error) {
        throw error;
    }
}
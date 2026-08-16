import { supabase } from "../../lib/supabase";
import { mapReport } from "./reportMapper";

export async function getReport(reportId) {
  const { data, error } = await supabase
    .from("investigations")
    .select(`
      *,
      documents(
        id,
        title,
        classification,
        sha256,
        dna_id,
        status,
        recipient,
        file_size,
        created_at,
        copies,
        tracker_id,
        download_count,
        email_shares,
        cloud_uploads,
        external_accesses,
        last_accessed,
        last_location
      ),
      investigation_ai_reports(
        model,
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
    .eq("id", reportId)
    .single();

  if (error) throw error;

  return mapReport(data);
}
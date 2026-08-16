import { supabase } from "../../lib/supabase";

export async function getDashboardStatistics() {
  const [
    { count: documentCount, error: docError },
    { count: investigationCount, error: invError },
    { data: investigations, error: integrityError },
    { data: reports, error: confidenceError },
  ] = await Promise.all([
    supabase
      .from("documents")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("investigations")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("investigations")
      .select("integrity,risk"),

    supabase
      .from("investigation_ai_reports")
      .select("confidence"),
  ]);

  if (docError) throw docError;
  if (invError) throw invError;
  if (integrityError) throw integrityError;
  if (confidenceError) throw confidenceError;

  const averageIntegrity =
    investigations.length === 0
      ? 0
      : Math.round(
          investigations.reduce(
            (sum, item) => sum + item.integrity,
            0
          ) / investigations.length
        );

  const averageConfidence =
    reports.length === 0
      ? 0
      : Math.round(
          reports.reduce(
            (sum, item) => sum + item.confidence,
            0
          ) / reports.length
        );

  const riskDistribution = {
    Low: investigations.filter(
      (i) => i.risk === "Low"
    ).length,

    Medium: investigations.filter(
      (i) => i.risk === "Medium"
    ).length,

    High: investigations.filter(
      (i) => i.risk === "High"
    ).length,
  };

  return {
    documentCount,
    investigationCount,
    averageIntegrity,
    averageConfidence,
    riskDistribution,
  };
}
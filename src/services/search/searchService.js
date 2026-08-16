import { supabase } from "../../lib/supabase";

export async function globalSearch(query) {
  const search = query.trim();

  if (!search) {
    return {
      documents: [],
      investigations: [],
      reports: [],
    };
  }

  const documentQuery = `
title.ilike.%${search}%,
dna_id.ilike.%${search}%,
recipient.ilike.%${search}%,
sha256.ilike.%${search}%`;

  const investigationQuery = `
investigator.ilike.%${search}%,
investigated_recipient.ilike.%${search}%,
findings.ilike.%${search}%`;

  const reportQuery = `
executive_summary.ilike.%${search}%,
technical_assessment.ilike.%${search}%`;

  const [
    { data: documents = [] },
    { data: investigations = [] },
    { data: reports = [] },
  ] = await Promise.all([
    supabase
      .from("documents")
      .select("*")
      .or(documentQuery.replace(/\s+/g, "")),

    supabase
      .from("investigations")
      .select("*")
      .or(investigationQuery.replace(/\s+/g, "")),

    supabase
      .from("investigation_ai_reports")
      .select("*")
      .or(reportQuery.replace(/\s+/g, "")),
  ]);

  return {
    documents,
    investigations,
    reports,
  };
}
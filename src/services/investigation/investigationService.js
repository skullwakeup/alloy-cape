import { supabase } from "../../lib/supabase";
import { mapInvestigation } from "./investigationMapper";

export async function getDocumentInvestigations(documentId) {

  const { data, error } = await supabase
    .from("investigations")
    .select(`
      *,
      investigation_ai_reports(*)
    `)
    .eq("document_id", documentId)
    .order("investigated_at", {
      ascending: false,
    });

  if (error) throw error;

  return data.map(mapInvestigation);
}

export async function getLatestInvestigation(documentId) {
  const { data, error } = await supabase
    .from("investigations")
    .select(`
      *,
      investigation_ai_reports(*)
    `)
    .eq("document_id", documentId)
    .order("investigated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  if (!data) return null;

  return mapInvestigation(data);
}

export async function getInvestigation(id) {

  const { data, error } = await supabase
    .from("investigations")
    .select(`
      *,
      investigation_ai_reports(*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return mapInvestigation(data);
}

export async function getRecentInvestigations(limit = 10) {

  const { data, error } = await supabase
    .from("investigations")
    .select(`
      *,
      investigation_ai_reports(*)
    `)
    .order("investigated_at", {
      ascending: false,
    })
    .limit(limit);

  if (error) throw error;

  return data.map(mapInvestigation);
}
import { supabase } from "../../lib/supabase";

export async function findCopyIdentity(copyId) {

  if (!copyId) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("documents")
      .select("id, dna_id, title, copies")
      .not("copies", "is", null);

  if (error) {
    throw error;
  }

  for (const document of data || []) {

    const copies =
      Array.isArray(document.copies)
        ? document.copies
        : [];

    const match =
      copies.find(
        (copy) =>
          copy?.copyId === copyId
      );

    if (match) {

      return {

        ...match,

        documentId:
          document.id,

        dnaId:
          document.dna_id,

        documentName:
          document.title,

      };

    }
  }

  return null;
}
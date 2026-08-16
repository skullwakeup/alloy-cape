import { supabase } from "../../lib/supabase";
import { mapDocument } from "./documentMapper";

export async function getDocuments() {

  const { data, error } =
    await supabase
      .from("documents")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) throw error;

  return data.map(mapDocument);
}

export async function uploadProtectedCopy(
  documentId,
  copyId,
  fileName,
  bytes
) {
  if (!documentId || !copyId || !bytes) {
    throw new Error(
      "Missing protected copy information."
    );
  }

  const path =
    `${documentId}/${copyId}/${fileName}`;

  const { data, error } =
    await supabase.storage
      .from("protected-copies")
      .upload(
        path,
        bytes,
        {
          contentType:
            "application/pdf",

          upsert: true,
        }
      );

  if (error) throw error;

  return data;
}

export async function uploadExternalCopy(
  documentId,
  copyId,
  fileName,
  bytes
) {
  if (
    !documentId ||
    !copyId ||
    !fileName ||
    bytes === undefined ||
    bytes === null
  ) {
    throw new Error(
      "Missing external copy information."
    );
  }

  const path =
    `${documentId}/${copyId}/external/${fileName}`;

  const uploadBytes =
    bytes instanceof Blob
      ? bytes
      : new Blob(
          [bytes],
          {
            type:
              "application/pdf",
          }
        );

  const {
    data,
    error,
  } =
    await supabase.storage
      .from("protected-copies")
      .upload(
        path,
        uploadBytes,
        {
          contentType:
            "application/pdf",

          upsert:
            true,
        }
      );

  if (error) {
    console.error(
      "EXTERNAL UPLOAD STORAGE ERROR",
      error
    );

    throw error;
  }

  return {
    ...data,
    storagePath:
      path,
  };
}


export async function downloadExternalCopy(
  storagePath
) {
  if (!storagePath) {
    throw new Error(
      "External copy storage path is missing."
    );
  }

  const {
    data,
    error,
  } =
    await supabase.storage
      .from("protected-copies")
      .download(storagePath);

  if (error) {
    throw error;
  }

  return data;
}

export async function documentAlreadyProtected(
  sha256
) {
  if (!sha256) {
    return false;
  }

  const {
    data,
    error,
  } = await supabase
    .from("documents")
    .select("id, dna_id")
    .eq("sha256", sha256)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}

export async function addDocument(document) {

  // Check whether this document has already been issued
  const {
    data: existing,
    error: lookupError,
  } = await supabase
    .from("documents")
    .select("*")
    .eq("sha256", document.sha256)
    .maybeSingle();

  if (lookupError) throw lookupError;

  // Document already registered
  if (existing) {

    return {
      ...mapDocument(existing),
      alreadyExists: true,
    };

  }

  // Get copy information
  const copies =
    document.copies ?? [];

  const firstCopy =
    copies.length > 0
      ? copies[0]
      : null;

  // Register new document
  const {
    data,
    error,
  } = await supabase
    .from("documents")
    .insert([
      {

        title:
          document.fileName,

        classification:
          document.classification,

        sha256:
          document.sha256,

        dna_id:
          document.dnaId,

        text_hash:
          document.textHash,

        fingerprint:
          document.fingerprint,

        recipient_signature:
          document.recipientSignature,

        sender:
          "Alloy Cape",

        recipient:
          document.recipients.join(", "),

        // Copy identities
        copies:
          copies,

        // Primary copy classification
        recipient_type:
          firstCopy?.recipientType ?? null,

        recipient_organization:
          firstCopy?.recipientOrganization ?? null,

        file_size:
          document.fileSize,

        page_count:
          document.pageCount,

        status:
          document.status,

        email_shares:
          0,

        tracker_id:
          document.trackerId,

        cloud_uploads:
          0,

        external_accesses:
          0,

      },
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    ...mapDocument(data),
    alreadyExists: false,
  };
}

export async function getDocumentByDNA(
  dnaId
) {

  const {
    data,
    error,
  } = await supabase
    .from("documents")
    .select("*")
    .eq("dna_id", dnaId)
    .single();

  if (error) return null;

  return mapDocument(data);
}

export async function deleteDocumentCascade(
  documentId
) {

  // Get all investigations for this document
  const {
    data: investigations,
    error: investigationError,
  } = await supabase
    .from("investigations")
    .select("id")
    .eq("document_id", documentId);

  if (investigationError)
    throw investigationError;

  const investigationIds =
    investigations?.map(
      (i) => i.id
    ) || [];

  // Delete AI reports
  if (investigationIds.length > 0) {

    const {
      error: aiError,
    } = await supabase
      .from("investigation_ai_reports")
      .delete()
      .in(
        "investigation_id",
        investigationIds
      );

    if (aiError)
      throw aiError;

    // Delete investigations
    const {
      error: invError,
    } = await supabase
      .from("investigations")
      .delete()
      .in(
        "id",
        investigationIds
      );

    if (invError)
      throw invError;
  }

  // Delete document
  const {
    error: docError,
  } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (docError)
    throw docError;
}

export async function incrementDownload(
  document
) {

  const { error } =
    await supabase
      .from("documents")
      .update({

        download_count:
          (document.downloadCount ?? 0) + 1,

        last_accessed:
          new Date().toISOString(),

      })
      .eq("id", document.id);

  if (error) throw error;
}

export async function incrementEmailShare(
  document
) {

  const { error } =
    await supabase
      .from("documents")
      .update({

        email_shares:
          (document.emailShares ?? 0) + 1,

        last_accessed:
          new Date().toISOString(),

      })
      .eq("id", document.id);

  if (error) throw error;
}

export async function incrementCloudUpload(
  document
) {

  const { error } =
    await supabase
      .from("documents")
      .update({

        cloud_uploads:
          (document.cloudUploads ?? 0) + 1,

        last_accessed:
          new Date().toISOString(),

      })
      .eq("id", document.id);

  if (error) throw error;
}

export async function incrementExternalAccess(
  document
) {

  const { error } =
    await supabase
      .from("documents")
      .update({

        external_accesses:
          (document.externalAccesses ?? 0) + 1,

        last_accessed:
          new Date().toISOString(),

        last_location:
          "External Network",

      })
      .eq("id", document.id);

  if (error) throw error;
}

export async function getCopyPasswordByRecipient(
  recipientEmail
) {
  if (!recipientEmail?.trim()) {
    throw new Error(
      "Please enter a recipient email."
    );
  }

  const email =
    recipientEmail
      .trim()
      .toLowerCase();

  const {
    data,
    error,
  } = await supabase
    .from("documents")
    .select(
      "id, title, dna_id, copies, created_at"
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    throw error;
  }

  for (const document of data ?? []) {

    const copies =
      document.copies ?? [];

    const copy =
      copies.find(
        item =>
          item?.recipient
            ?.trim()
            .toLowerCase() === email
      );

    if (!copy) {
      continue;
    }

    const password =
      copy.copyPassword ??
      copy.password ??
      null;

    if (!password) {
      return {
        found: true,

        passwordAvailable:
          false,

        documentId:
          document.id,

        fileName:
          document.title,

        dnaId:
          document.dna_id,

        copyId:
          copy.copyId ??
          copy.copy_id ??
          null,

        recipient:
          copy.recipient,

        recipientType:
          copy.recipientType ??
          null,

        recipientOrganization:
          copy.recipientOrganization ??
          null,

        password:
          null,
      };
    }

    return {
      found: true,

      passwordAvailable:
        true,

      documentId:
        document.id,

      fileName:
        document.title,

      dnaId:
        document.dna_id,

      copyId:
        copy.copyId ??
        copy.copy_id ??
        null,

      recipient:
        copy.recipient,

      recipientType:
        copy.recipientType ??
        null,

      recipientOrganization:
        copy.recipientOrganization ??
        null,

      password,
    };
  }

  return null;
}

export async function downloadProtectedCopy(
  storagePath
) {

  if (!storagePath) {
    throw new Error(
      "Protected copy storage path is missing."
    );
  }

  const {
    data,
    error,
  } =
    await supabase.storage
      .from("protected-copies")
      .download(
        storagePath
      );

  if (error) {
    throw error;
  }

  return data;
}

export async function updateDocumentCopies(
  documentId,
  copies
) {
  if (!documentId) {
    throw new Error(
      "Document ID is required."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("documents")
    .update({
      copies: copies,
    })
    .eq(
      "id",
      documentId
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapDocument(data);
}

export async function revealCopyPassword(
  documentId,
  copyId
) {
  if (!documentId || !copyId) {
    throw new Error(
      "Document and copy ID are required."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("documents")
    .select("id, copies")
    .eq("id", documentId)
    .single();

  if (error) {
    throw error;
  }

  const copies =
    Array.isArray(data?.copies)
      ? data.copies
      : [];

  const index =
    copies.findIndex(
      copy =>
        (copy?.copyId ??
          copy?.copy_id) === copyId
    );

  if (index === -1) {
    throw new Error(
      "Protected copy not found."
    );
  }

  const copy = copies[index];

  const password =
    copy.copyPassword ??
    copy.password ??
    null;

  if (!password) {
    throw new Error(
      "No password is assigned to this protected copy."
    );
  }

  const revealCount =
    Number(
      copy.passwordRevealCount ?? 0
    ) + 1;

  const revealedAt =
    new Date().toISOString();

  const updatedCopy = {
    ...copy,

    passwordRevealCount:
      revealCount,

    lastPasswordRevealedAt:
      revealedAt,
  };

  const updatedCopies =
    [...copies];

  updatedCopies[index] =
    updatedCopy;

  const {
    data: updatedDocument,
    error: updateError,
  } =
    await supabase
      .from("documents")
      .update({
        copies:
          updatedCopies,
      })
      .eq(
        "id",
        documentId
      )
      .select()
      .single();

  if (updateError) {
    throw updateError;
  }

  return {
    password,
    passwordRevealCount:
      revealCount,
    lastPasswordRevealedAt:
      revealedAt,
    copyId,
    document:
      mapDocument(updatedDocument),
  };
}
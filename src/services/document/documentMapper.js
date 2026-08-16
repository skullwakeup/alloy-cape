export function mapDocument(doc) {
  return {
    id: doc.id,

    dnaId: doc.dna_id,

    fileName: doc.title,

    classification: doc.classification,

    sha256: doc.sha256,

    fileSize: doc.file_size,

    recipients: doc.recipient
      ? doc.recipient.split(", ")
      : [],

    integrity: doc.integrity ?? 100,

    status: doc.status,

    pageCount: doc.page_count ?? 0,

    issuedAt: doc.created_at,

    trackerId: doc.tracker_id,

    downloadCount: doc.download_count ?? 0,

    emailShares: doc.email_shares ?? 0,

    cloudUploads: doc.cloud_uploads ?? 0,

    externalAccesses: doc.external_accesses ?? 0,

    lastAccessed: doc.last_accessed,

    lastLocation: doc.last_location,

    text: doc.text,

    textHash: doc.text_hash,

    fingerprint: doc.fingerprint,

    recipientSignature: doc.recipient_signature,

    // Protected copy identities
    copies: Array.isArray(doc.copies)
      ? doc.copies.map((copy) => ({
          ...copy,

          copyId:
            copy.copyId ??
            copy.copy_id ??
            null,

          dnaId:
            copy.dnaId ??
            copy.dna_id ??
            doc.dna_id ??
            null,

          recipient:
            copy.recipient ??
            null,

          recipientType:
            copy.recipientType ??
            copy.recipient_type ??
            null,

          recipientOrganization:
            copy.recipientOrganization ??
            copy.recipient_organization ??
            null,

          recipientSignature:
            copy.recipientSignature ??
            copy.recipient_signature ??
            null,

          trackerId:
            copy.trackerId ??
            copy.tracker_id ??
            doc.tracker_id ??
            null,

          copyPassword:
            copy.copyPassword ??
            null,

          fileName:
            copy.fileName ??
            null,

          storagePath:
            copy.storagePath ??
            null,

          externalStoragePath:
            copy.externalStoragePath ?? null,

          externalFileName:
            copy.externalFileName ?? null,

          downloadCount:
            copy.downloadCount ??
            0,

          passwordRevealCount:
            copy.passwordRevealCount ??
            0,

          lastPasswordRevealedAt:
            copy.lastPasswordRevealedAt ??
            null,

          issuedAt:
            copy.issuedAt ??
            null,

          // FORENSIC BASELINE
          sha256:
            copy.sha256 ??
            null,

          textHash:
            copy.textHash ??
            null,

          pageCount:
            copy.pageCount ??
            0,

          text:
            copy.text ??
            null,

          fingerprint:
            copy.fingerprint ??
            null,

          fileSize:
            copy.fileSize ??
            null,

          classification:
            copy.classification ??
            doc.classification ??
            null,
        }))
      : [],

    recipientType:
      doc.recipient_type ?? null,

    recipientOrganization:
      doc.recipient_organization ?? null,
  };
}
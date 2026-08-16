export function createDocument(
  file,
  classification = "Confidential",
  metadata = {}
) {

  const trackerId =
    `TRK-${crypto
      .randomUUID()
      .replace(/-/g, "")
      .substring(0, 8)
      .toUpperCase()}`;

  return {

    id:
      crypto.randomUUID(),

    // Original file
    file,

    fileName:
      file.name,

    fileSize:
      file.size,

    mimeType:
      file.type,


    // Analysis
    pageCount:
      0,

    sha256:
      "",


    // Document DNA
    dnaId:
      "",

    fingerprint:
      "",

    recipientSignature:
      "",


    // Tracking
    trackerId,


    // Metadata
    uploadedAt:
      new Date().toISOString(),

    classification,

    recipients:
      [],


    // Protected copies
    copies:
      [],


    // Security
    integrity:
      100,

    status:
      "Uploaded",

    metadata,

  };
}
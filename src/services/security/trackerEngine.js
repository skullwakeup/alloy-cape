export function detectTampering(original, uploaded) {

  const evidence = [];

  let integrity = 100;

  if (!original || !uploaded) {

    return {

      tampered: true,

      integrity: 0,

      evidence: ["Original document not found"],

      binaryMatch: false,

      textMatch: false,

      pageMatch: false,

      metadataMatch: false,

    };

  }

  // ==========================
  // Binary SHA-256 Comparison
  // ==========================

  const binaryMatch =
    original.sha256 === uploaded.sha256;

  if (!binaryMatch) {

    integrity -= 30;

    evidence.push(
      "Binary SHA-256 mismatch detected."
    );

  }

  // ==========================
  // Text Comparison
  // ==========================

  const textMatch =
    original.textHash === uploaded.textHash;

  if (!textMatch) {

    integrity -= 40;

    evidence.push(
      "Document text has been modified."
    );

  }

  // ==========================
  // Page Count Comparison
  // ==========================

  const pageMatch =
    original.pageCount === uploaded.pageCount;

  if (!pageMatch) {

    integrity -= 15;

    evidence.push(
      "Page count differs from original."
    );

  }

  // ==========================
  // Document DNA Comparison
  // ==========================

  const metadataMatch =
    original.dnaId === uploaded.dnaId;

  if (!metadataMatch) {

    integrity -= 15;

    evidence.push(
      "Document DNA identifier mismatch."
    );

  }

  integrity = Math.max(0, integrity);

  return {

    tampered: integrity < 100,

    integrity,

    evidence,

    binaryMatch,

    textMatch,

    pageMatch,

    metadataMatch,

  };

}
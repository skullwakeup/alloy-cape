export function detectTampering(
    original,
    uploaded,
    options = {}
) {

  const evidence = [];

  let integrity = 100;

  let binaryMatch = true;
  let textMatch = true;
  let pageMatch = true;
  let metadataMatch = true;

  // ==========================
  // Binary Fingerprint
  // ==========================

  if (
    !options.skipBinaryCheck &&
    original.sha256 !== uploaded.sha256
) {

    binaryMatch = false;

    integrity -= 10;

    evidence.push({
        severity: "LOW",
        type: "Binary",
        message:
            "Binary fingerprint differs.",
    });
}

  // ==========================
  // Text Integrity
  // ==========================

  if (original.textHash !== uploaded.textHash) {

    textMatch = false;

    integrity -= 40;

    evidence.push({
      severity: "HIGH",
      type: "Content",
      message: "Document text has changed.",
    });

  }

  // ==========================
  // Page Structure
  // ==========================

  if (original.pageCount !== uploaded.pageCount) {

    pageMatch = false;

    integrity -= 20;

    evidence.push({
      severity: "MEDIUM",
      type: "Structure",
      message: "Page count mismatch.",
    });

  }

  // ==========================
  // Identity
  // ==========================

  if (original.dnaId !== uploaded.dnaId) {

    metadataMatch = false;

    integrity -= 30;

    evidence.push({
      severity: "CRITICAL",
      type: "Identity",
      message: "DNA identifier mismatch.",
    });

  }

  integrity = Math.max(0, integrity);

  return {

    tampered:

      !textMatch ||

      !pageMatch ||

      !metadataMatch,

    integrity,

    evidence,

    binaryMatch,

    textMatch,

    pageMatch,

    metadataMatch,

  };

}
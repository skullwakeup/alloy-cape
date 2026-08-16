export function attributeRecipient(
  document,
  investigation
) {

  const result = {

    matched: false,

    confidence: 0,

    recipient: "Unknown",

    trackerId: null,

    copyId: null,

    dnaId: null,

    recipientType: "UNKNOWN",

    recipientOrganization: "Unknown",

    recipientSignature: null,

    reasoning: [],

  };

  if (!document) {
    return result;
  }


  // --------------------------------
  // Basic investigation information
  // --------------------------------

  result.recipient =
    investigation?.recipient ??
    "Unknown";

  result.copyId =
    investigation?.copyId ??
    null;

  result.dnaId =
    investigation?.dnaId ??
    document.dnaId ??
    null;

  result.recipientType =
    investigation?.recipientType ??
    "UNKNOWN";

  result.recipientOrganization =
    investigation?.recipientOrganization ??
    "Unknown";

  result.recipientSignature =
    investigation?.signature ??
    null;


  // --------------------------------
  // Find exact stored copy
  // --------------------------------

  const copies =
    Array.isArray(document.copies)
      ? document.copies
      : [];

  const matchedCopy =
    result.copyId
      ? copies.find(
          copy =>
            copy?.copyId ===
            result.copyId
        )
      : null;


  // --------------------------------
  // Use authoritative copy data
  // --------------------------------

  if (matchedCopy) {

    result.matched = true;

    result.copyId =
      matchedCopy.copyId ??
      result.copyId;

    result.recipient =
      matchedCopy.recipient ??
      result.recipient;

    result.recipientType =
      matchedCopy.recipientType ??
      result.recipientType;

    result.recipientOrganization =
      matchedCopy.recipientOrganization ??
      result.recipientOrganization;

    result.recipientSignature =
      matchedCopy.recipientSignature ??
      result.recipientSignature;

    result.trackerId =
      matchedCopy.trackerId ??
      null;

    result.reasoning.push(
      "Protected copy identity verified."
    );

  }


  // --------------------------------
  // Tracker fallback
  // --------------------------------

  if (!result.trackerId) {

    result.trackerId =
      investigation?.trackerId ??
      document.trackerId ??
      null;

  }


  // --------------------------------
  // Recipient Signature
  // --------------------------------

  if (

    investigation?.signature &&

    result.recipientSignature &&

    investigation.signature ===
      result.recipientSignature

  ) {

    result.matched = true;

    result.confidence += 45;

    result.reasoning.push(
      "Recipient signature matches."
    );

  }


  // --------------------------------
  // Copy identity confidence
  // --------------------------------

  if (matchedCopy) {

    result.confidence += 10;

  }


  // --------------------------------
  // DNA Match
  // --------------------------------

  if (

    investigation?.dnaId &&

    investigation.dnaId ===
      document.dnaId

  ) {

    result.confidence += 30;

    result.reasoning.push(
      "Document DNA verified."
    );

  }


  // --------------------------------
  // Tracker
  // --------------------------------

  if (result.trackerId) {

    result.confidence += 15;

    result.reasoning.push(
      "Tracker identifier located."
    );

  }


  // --------------------------------
  // External Activity
  // --------------------------------

  if (
    (document.externalAccesses ?? 0) > 0
  ) {

    result.reasoning.push(
      "Copy accessed outside trusted network."
    );

  }


  // --------------------------------
  // Recipient classification
  // --------------------------------

  if (
    result.recipientType ===
    "EXTERNAL"
  ) {

    result.reasoning.push(
      "Recipient is classified as external."
    );

  }


  if (
    result.recipientType ===
    "INTERNAL"
  ) {

    result.reasoning.push(
      "Recipient is classified as internal."
    );

  }


  // --------------------------------
  // Limit confidence
  // --------------------------------

  result.confidence =
    Math.min(
      result.confidence,
      100
    );


  return result;
}
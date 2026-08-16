function normalizeEmail(email) {

  return email
    .trim()
    .toLowerCase();

}


function getOrganization(email) {

  const normalized =
    normalizeEmail(email);

  const domain =
    normalized.split("@")[1] || "";

  if (
    domain === "alloycape.com"
  ) {

    return "Alloy Cape";

  }

  return domain || "Unknown";

}


export function generateCopyPassword() {

  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let password =
    "AC-";

  for (let i = 0; i < 8; i++) {

    password +=
      chars[
        Math.floor(
          Math.random() *
          chars.length
        )
      ];

  }

  return password;

}


function getRecipientType(email) {

  const normalized =
    normalizeEmail(email);

  const domain =
    normalized.split("@")[1] || "";

  if (
    domain === "alloycape.com"
  ) {

    return "INTERNAL";

  }

  return "EXTERNAL";

}


export function createIdentity(
  sha256,
  recipient = null,
  trackerId = null
) {

  // --------------------------------
  // Document DNA
  // --------------------------------

  const fingerprint =
    sha256
      .substring(0, 24)
      .toUpperCase();

  const dnaId =
    `DNA-${sha256
      .substring(0, 4)
      .toUpperCase()}-${sha256
      .substring(4, 8)
      .toUpperCase()}-${sha256
      .substring(8, 12)
      .toUpperCase()}`;


  // --------------------------------
  // Recipient
  // --------------------------------

  const recipientEmail =
    recipient
      ? normalizeEmail(recipient)
      : null;

  const recipientType =
    recipientEmail
      ? getRecipientType(
          recipientEmail
        )
      : null;

  const organization =
    recipientEmail
      ? getOrganization(
          recipientEmail
        )
      : null;


  // --------------------------------
  // Unique Copy ID
  // --------------------------------

  const copyId =
    recipientEmail
      ? `CPY-${crypto
          .randomUUID()
          .replace(/-/g, "")
          .substring(0, 8)
          .toUpperCase()}`
      : null;


  // --------------------------------
  // Recipient Signature
  // --------------------------------

  const recipientSignature =
    recipientEmail
      ? btoa(recipientEmail)
          .replace(/=/g, "")
          .substring(0, 6)
          .toUpperCase()
      : "";


  // --------------------------------
  // Copy Password
  // --------------------------------
  //
  // EVERY protected copy receives
  // a unique password.
  //
  // Internal → password
  // External → password
  //
  // External access simulation will
  // deliberately distribute the
  // unprotected version.
  // --------------------------------

  const copyPassword =
    recipientEmail
      ? generateCopyPassword()
      : null;


  // --------------------------------
  // Final Identity
  // --------------------------------

  return {

    dnaId,

    fingerprint,

    trackerId,

    recipientSignature,

    copyId,

    recipientType,

    recipientOrganization:
      organization,

    copyPassword,

  };

}
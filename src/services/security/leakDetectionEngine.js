function getCopyEvents(
  events = [],
  copyId = null
) {
  if (!copyId) {
    return [];
  }

  return events.filter(
    event =>
      event.copy_id === copyId ||
      event.copyId === copyId
  );
}

function countEvents(
  events,
  type
) {
  return events.filter(
    event =>
      event.event_type === type
  ).length;
}

export function detectLeak(
  document,
  copy = null,
  events = []
) {
  let score = 0;

  const evidence = [];

  const copyId =
    copy?.copyId ??
    copy?.copy_id ??
    null;

  // --------------------------------------------------
  // COPY-SPECIFIC EVENTS
  // --------------------------------------------------

  const copyEvents =
    getCopyEvents(
      events,
      copyId
    );

  // --------------------------------------------------
  // ACTIVITY COUNTS
  // --------------------------------------------------

  let downloadCount = 0;
  let emailShares = 0;
  let cloudUploads = 0;
  let externalAccesses = 0;

  if (copyId) {
    downloadCount =
      countEvents(
        copyEvents,
        "DOWNLOAD"
      );

    emailShares =
      countEvents(
        copyEvents,
        "EMAIL_SHARE"
      );

    cloudUploads =
      countEvents(
        copyEvents,
        "CLOUD_UPLOAD"
      );

    externalAccesses =
      countEvents(
        copyEvents,
        "EXTERNAL_ACCESS"
      );
  }

  // --------------------------------------------------
  // DOWNLOADS
  // --------------------------------------------------

  if (downloadCount >= 1) {
    score += 5;

    evidence.push({
      severity: "Low",

      type: "Download",

      message:
        `${downloadCount} download(s) recorded for protected copy ${copyId}.`,
    });
  }

  if (downloadCount >= 5) {
    score += 10;

    evidence.push({
      severity: "Medium",

      type: "Repeated Downloads",

      message:
        "High download frequency detected for this protected copy.",
    });
  }

  // --------------------------------------------------
  // EMAIL
  // --------------------------------------------------

  if (emailShares > 0) {
    score += 15;

    evidence.push({
      severity: "Medium",

      type: "Email",

      message:
        "Protected copy was shared by email.",
    });
  }

  // --------------------------------------------------
  // CLOUD
  // --------------------------------------------------

  if (cloudUploads > 0) {
    score += 20;

    evidence.push({
      severity: "High",

      type: "Cloud",

      message:
        "Protected copy was uploaded to cloud storage.",
    });
  }

  // --------------------------------------------------
  // EXTERNAL ACCESS
  // --------------------------------------------------

  if (externalAccesses > 0) {
    score += 30;

    evidence.push({
      severity: "Critical",

      type: "External",

      message:
        "Protected copy was accessed from an external network.",
    });
  }

  // --------------------------------------------------
  // RECIPIENT TYPE
  // --------------------------------------------------

  const recipientType =
    copy?.recipientType ??
    null;

  if (
    recipientType === "EXTERNAL"
  ) {
    score += 10;

    evidence.push({
      severity: "Medium",

      type: "External Recipient",

      message:
        "Protected copy was issued to an external recipient.",
    });
  }

  // --------------------------------------------------
  // INTERNAL COPY + EXTERNAL ACCESS
  // --------------------------------------------------

  if (
    recipientType === "INTERNAL" &&
    externalAccesses > 0
  ) {
    score += 20;

    evidence.push({
      severity: "Critical",

      type:
        "Internal Copy External Access",

      message:
        "A protected copy issued to an internal recipient was accessed from an external network.",
    });
  }

  // --------------------------------------------------
  // CAP
  // --------------------------------------------------

  score = Math.min(
    score,
    100
  );

  let level = "Minimal";

  if (score >= 20)
    level = "Low";

  if (score >= 40)
    level = "Medium";

  if (score >= 60)
    level = "High";

  if (score >= 80)
    level = "Critical";

  return {
    probability: score,

    level,

    evidence,

    copyId,

    activity: {
      downloads: downloadCount,
      emailShares,
      cloudUploads,
      externalAccesses,
      totalEvents:
        copyEvents.length,
    },
  };
}
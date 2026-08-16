export function analyzeBehavior(
  events = [],
  copyId = null
) {
  const evidence = [];

  let score = 0;

  // --------------------------------------------------
  // FILTER TO SELECTED COPY
  // --------------------------------------------------

  const copyEvents = copyId
    ? events.filter(
        event =>
          event.copy_id === copyId ||
          event.copyId === copyId
      )
    : events;

  if (!copyEvents.length) {
    return {
      score: 0,
      level: "Minimal",
      evidence: [],
      patterns: [],
      eventCount: 0,
      copyId,
    };
  }

  // --------------------------------------------------
  // SORT EVENTS
  // --------------------------------------------------

  const sorted = [...copyEvents].sort(
    (a, b) =>
      new Date(a.created_at) -
      new Date(b.created_at)
  );

  const types = sorted.map(
    event => event.event_type
  );

  // --------------------------------------------------
  // DOWNLOADS
  // --------------------------------------------------

  const downloads =
    sorted.filter(
      event =>
        event.event_type === "DOWNLOAD"
    );

  if (downloads.length >= 5) {
    score += 15;

    evidence.push({
      severity: "Medium",

      type: "Repeated Downloads",

      message:
        `${downloads.length} downloads detected for protected copy ${copyId}.`,
    });
  }

  // --------------------------------------------------
  // DOWNLOAD → EMAIL
  // --------------------------------------------------

  if (
    types.includes("DOWNLOAD") &&
    types.includes("EMAIL_SHARE")
  ) {
    score += 15;

    evidence.push({
      severity: "Medium",

      type: "Download → Email",

      message:
        "Protected copy was downloaded and subsequently shared by email.",
    });
  }

  // --------------------------------------------------
  // DOWNLOAD → CLOUD
  // --------------------------------------------------

  if (
    types.includes("DOWNLOAD") &&
    types.includes("CLOUD_UPLOAD")
  ) {
    score += 20;

    evidence.push({
      severity: "High",

      type: "Download → Cloud",

      message:
        "Protected copy was downloaded and subsequently uploaded to cloud storage.",
    });
  }

  // --------------------------------------------------
  // DOWNLOAD → EXTERNAL
  // --------------------------------------------------

  if (
    types.includes("DOWNLOAD") &&
    types.includes("EXTERNAL_ACCESS")
  ) {
    score += 25;

    evidence.push({
      severity: "High",

      type: "Download → External Access",

      message:
        "Protected copy was downloaded and later accessed from an external network.",
    });
  }

  // --------------------------------------------------
  // EMAIL → CLOUD
  // --------------------------------------------------

  if (
    types.includes("EMAIL_SHARE") &&
    types.includes("CLOUD_UPLOAD")
  ) {
    score += 20;

    evidence.push({
      severity: "High",

      type: "Email → Cloud",

      message:
        "Protected copy sharing was followed by cloud upload activity.",
    });
  }

  // --------------------------------------------------
  // CLOUD → EXTERNAL
  // --------------------------------------------------

  if (
    types.includes("CLOUD_UPLOAD") &&
    types.includes("EXTERNAL_ACCESS")
  ) {
    score += 25;

    evidence.push({
      severity: "Critical",

      type: "Cloud → External",

      message:
        "Cloud upload was followed by external network access.",
    });
  }

  // --------------------------------------------------
  // FULL EXFILTRATION SEQUENCE
  // --------------------------------------------------

  const hasDownload =
    types.includes("DOWNLOAD");

  const hasEmail =
    types.includes("EMAIL_SHARE");

  const hasCloud =
    types.includes("CLOUD_UPLOAD");

  const hasExternal =
    types.includes("EXTERNAL_ACCESS");

  if (
    hasDownload &&
    hasEmail &&
    hasCloud &&
    hasExternal
  ) {
    score += 30;

    evidence.push({
      severity: "Critical",

      type: "Potential Exfiltration Sequence",

      message:
        "Download, email sharing, cloud upload and external access were all observed for the same protected copy.",
    });
  }

  // --------------------------------------------------
  // EXTERNAL ACCESS
  // --------------------------------------------------

  if (hasExternal) {
    evidence.push({
      severity: "High",

      type: "External Access",

      message:
        "This protected copy was accessed from an external network.",
    });
  }

  // --------------------------------------------------
  // CAP
  // --------------------------------------------------

  score = Math.min(score, 100);

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
    score,

    level,

    evidence,

    patterns:
      evidence.map(
        item => item.type
      ),

    eventCount:
      copyEvents.length,

    copyId,
  };
}
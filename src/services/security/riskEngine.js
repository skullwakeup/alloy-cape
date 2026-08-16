export function calculateRisk(input) {

  const data = input || {};

  let score = 0;

  const evidence = [];

  // =========================
  // Downloads
  // =========================

  score += (data.downloads ?? 0) * 2;

  if ((data.downloads ?? 0) > 5) {

    evidence.push({
      title: "Multiple Downloads",
      points: 10,
      description: "Document downloaded several times.",
    });

  }

  // =========================
  // Email Shares
  // =========================

  score += (data.emailShares ?? 0) * 8;

  if ((data.emailShares ?? 0) > 0) {

    evidence.push({
      title: "Email Distribution",
      points: (data.emailShares ?? 0) * 8,
      description: `${data.emailShares} email share(s) detected.`,
    });

  }

  // =========================
  // Cloud Uploads
  // =========================

  score += (data.cloudUploads ?? 0) * 15;

  if ((data.cloudUploads ?? 0) > 0) {

    evidence.push({
      title: "Cloud Upload",
      points: (data.cloudUploads ?? 0) * 15,
      description: `${data.cloudUploads} cloud upload(s) detected.`,
    });

  }

  // =========================
  // External Access
  // =========================

  score += (data.externalAccesses ?? 0) * 20;

  if ((data.externalAccesses ?? 0) > 0) {

    evidence.push({
      title: "External Access",
      points: (data.externalAccesses ?? 0) * 20,
      description: `${data.externalAccesses} external access event(s).`,
    });

  }

  // =========================
  // Tampering
  // =========================

  if (data.tampered) {

    score += 40;

    evidence.push({
      title: "Tampering",
      points: 40,
      description: "Document integrity compromised.",
    });

  }

  // =========================
  // Integrity
  // =========================

  if ((data.integrity ?? 100) < 90) {

    score += 15;

    evidence.push({
      title: "Integrity Reduced",
      points: 15,
      description: `Integrity ${data.integrity}%`,
    });

  }

  if ((data.integrity ?? 100) < 70) {

    score += 20;

  }

  // =========================
  // Semantic Analysis
  // =========================

  score += data.semanticScore ?? 0;

  if ((data.semanticScore ?? 0) > 0) {

    evidence.push({
      title: "Semantic Changes",
      points: data.semanticScore,
      description: "Meaningful content modifications detected.",
    });

  }

  // =========================
  // Password Reveals
  // =========================

  const passwordReveals =
    data.passwordReveals ?? 0;

  if (passwordReveals > 0) {

    let revealPoints = 0;

    if (passwordReveals >= 3)
      revealPoints += 5;

    if (passwordReveals >= 5)
      revealPoints += 10;

    if (passwordReveals >= 10)
      revealPoints += 20;

    score += revealPoints;

    if (passwordReveals >= 3) {

      evidence.push({
        title: "Frequent Password Reveals",
        points: revealPoints,
        description:
          `${passwordReveals} password reveal(s) recorded for this protected copy.`,
      });

    }

  }
    // =========================
    // Leak Probability
    // =========================

    const leakProbability = data.leakProbability ?? 0;

    if (leakProbability > 0) {

      const leakPoints = Math.round(leakProbability * 0.5);

      score += leakPoints;

      if (leakProbability >= 40) {

        evidence.push({
          title: "Elevated Leak Probability",
          points: leakPoints,
          description: `Leak probability calculated at ${leakProbability}%.`,
        });

      }

    }

    // =========================
    // External Recipient
    // =========================

    if ((data.recipientType || "").toUpperCase() === "EXTERNAL") {

      score += 25;

      evidence.push({
        title: "External Recipient",
        points: 25,
        description: "Protected copy is attributed to an external recipient.",
      });

    }

    // =========================
    // Classification Weight
    // =========================

  let multiplier = 1;

  switch ((data.classification || "").toLowerCase()) {

    case "public":
      multiplier = 0.25;
      break;

    case "internal":
      multiplier = 0.6;
      break;

    case "confidential":
      multiplier = 1.2;
      evidence.push({
        title: "Confidential Document",
        points: 0,
        description: "Higher sensitivity weighting applied.",
      });
      break;

    case "restricted":
      multiplier = 1.8;
      evidence.push({
        title: "Restricted Document",
        points: 0,
        description: "Maximum sensitivity weighting applied.",
      });
      break;

    default:
      break;
  }

  score = Math.round(score * multiplier);

  score = Math.min(score, 100);

  let level = "Low";

  if (score >= 80)
    level = "Critical";

  else if (score >= 55)
    level = "High";

  else if (score >= 30)
    level = "Medium";

  return {

    score,

    level,

    evidence,

  };

}


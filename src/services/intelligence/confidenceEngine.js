export function calculateConfidence({
    integrity,
    risk,
    trust,
    historyCount,
}) {

    let score = 100;

    // Document integrity carries the highest weight.
    if (integrity < 100) {
        score -= (100 - integrity) * 0.6;
    }

    // Risk adjustments.
    switch (risk.level) {

        case "High":
            score -= 15;
            break;

        case "Medium":
            score -= 8;
            break;

        case "Low":
            score -= 2;
            break;

        default:
            break;
    }

    // Trust adjustments.
    switch (trust.level) {

        case "Suspicious":
            score -= 10;
            break;

        case "Unknown":
            score -= 5;
            break;

        case "Trusted":
            break;

        default:
            break;
    }

    // More historical evidence = more confidence.
    score += Math.min(historyCount * 2, 8);

    score = Math.max(60, Math.min(99, Math.round(score)));

    return score;
}
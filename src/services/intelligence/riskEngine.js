import {
    CLASSIFICATION_WEIGHTS,
    RISK_LEVELS,
    SCORE_LIMITS,
    ENGINE,
} from "./constants";

export function calculateRisk(data = {}) {

    let score = 0;

    const factors = [];

    const classification =
        data.classification ?? "Confidential";

    const integrity =
        data.integrity ?? 100;

    const downloads =
        data.downloads ?? 0;

    const emailShares =
        data.emailShares ?? 0;

    const cloudUploads =
        data.cloudUploads ?? 0;

    const externalAccesses =
        data.externalAccesses ?? 0;

    const passwordReveals =
        data.passwordReveals ?? 0;

    const semanticScore =
        data.semanticScore ?? 0;

    const tampered =
        data.tampered ?? false;

    // ======================================================
    // Classification
    // ======================================================

    const classificationScore =
        CLASSIFICATION_WEIGHTS[
            classification
        ] ?? 0;

    score += classificationScore;

    factors.push({

        category:
            "Classification",

        value:
            classification,

        impact:
            classificationScore,

    });

    // ======================================================
    // Downloads
    // ======================================================

    if (downloads > 5) {

        const impact =
            Math.min(
                downloads * 2,
                20
            );

        score += impact;

        factors.push({

            category:
                "Downloads",

            value:
                downloads,

            impact,

        });

    }

    // ======================================================
    // Email Shares
    // ======================================================

    if (emailShares > 0) {

        const impact =
            emailShares * 8;

        score += impact;

        factors.push({

            category:
                "Email Distribution",

            value:
                emailShares,

            impact,

        });

    }

    // ======================================================
    // Cloud Uploads
    // ======================================================

    if (cloudUploads > 0) {

        const impact =
            cloudUploads * 15;

        score += impact;

        factors.push({

            category:
                "Cloud Upload",

            value:
                cloudUploads,

            impact,

        });

    }

    // ======================================================
    // External Access
    // ======================================================

    if (externalAccesses > 0) {

        const impact =
            externalAccesses * 20;

        score += impact;

        factors.push({

            category:
                "External Access",

            value:
                externalAccesses,

            impact,

        });

    }

    // ======================================================
    // Password Reveals
    // ======================================================

    if (passwordReveals >= 3) {

        let impact = 5;

        if (passwordReveals >= 5)
            impact += 10;

        if (passwordReveals >= 10)
            impact += 20;

        score += impact;

        factors.push({

            category:
                "Password Reveals",

            value:
                passwordReveals,

            impact,

        });

    }

    // ======================================================
    // Tampering
    // ======================================================

    if (tampered) {

        score += 40;

        factors.push({

            category:
                "Tampering",

            value:
                "Detected",

            impact:
                40,

        });

    }

    // ======================================================
    // Integrity
    // ======================================================

    if (integrity < 60) {

        score += 30;

        factors.push({

            category:
                "Integrity",

            value:
                integrity,

            impact:
                30,

        });

    }

    else if (integrity < 80) {

        score += 20;

        factors.push({

            category:
                "Integrity",

            value:
                integrity,

            impact:
                20,

        });

    }

    else if (integrity < 95) {

        score += 10;

        factors.push({

            category:
                "Integrity",

            value:
                integrity,

            impact:
                10,

        });

    }

    // ======================================================
    // Semantic Analysis
    // ======================================================

    if (semanticScore > 0) {

        score += semanticScore;

        factors.push({

            category:
                "Semantic Changes",

            value:
                semanticScore,

            impact:
                semanticScore,

        });

    }

    // ======================================================
    // Leak Probability
    // ======================================================

    const leakProbability =
        data.leakProbability ?? 0;

    if (leakProbability > 0) {

        const impact =
            Math.round(leakProbability * 0.5);

        score += impact;

        factors.push({

            category:
                "Leak Probability",

            value:
                `${leakProbability}%`,

            impact,

        });

    }

    // ======================================================
    // External Recipient
    // ======================================================

    if (
        (data.recipientType || "")
            .toUpperCase() === "EXTERNAL"
    ) {

        score += 25;

        factors.push({

            category:
                "External Recipient",

            value:
                "EXTERNAL",

            impact:
                25,

        });

    }

    // ======================================================
    // Score Limits
    // ======================================================

    score = Math.max(
        ENGINE.MIN_SCORE,
        Math.min(
            score,
            ENGINE.MAX_SCORE
        )
    );

    let level;

    if (
        score <=
        SCORE_LIMITS.LOW
    ) {

        level =
            RISK_LEVELS.LOW;

    }

    else if (
        score <=
        SCORE_LIMITS.MEDIUM
    ) {

        level =
            RISK_LEVELS.MEDIUM;

    }

    else if (
        score <=
        SCORE_LIMITS.HIGH
    ) {

        level =
            RISK_LEVELS.HIGH;

    }

    else {

        level =
            RISK_LEVELS.CRITICAL;

    }

    return {

        score,

        level,

        factors,

    };

}
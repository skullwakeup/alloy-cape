import { calculateRisk } from "./riskEngine";
import { calculateTrust } from "./trustEngine";
import { generateRecommendations } from "./recommendationEngine";
import { calculateConfidence } from "./confidenceEngine";

export function generateIntelligence({
    document = {},
    investigation = {},
    investigations = [],
}) {

    const trust = calculateTrust(
        investigation.investigatedRecipient,
        investigations
    );

    const risk = calculateRisk({
        ...document,
        ...investigation,
    });

    const confidence = calculateConfidence({

        integrity:
            investigation.integrity ??
            100,

        risk,

        trust,

        historyCount:
            trust.historyCount,

    });

    const recommendations =
        generateRecommendations(
            risk,
            trust
        );

    return {

        risk,

        trust,

        confidence,

        recommendations,

        generatedAt:
            new Date().toISOString(),

    };

}
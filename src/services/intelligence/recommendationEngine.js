export function generateRecommendations(risk, trust) {

    const recommendations = [];

    if (risk.level === "Critical") {

        recommendations.push(
            "Suspend document access immediately."
        );

        recommendations.push(
            "Notify the Security Operations Center."
        );

    }

    if (risk.level === "High") {

        recommendations.push(
            "Perform a manual security review."
        );

    }

    if (
        trust.level === "Suspicious" ||
        trust.level === "Untrusted"
    ) {

        recommendations.push(
            "Review recipient permissions."
        );

        recommendations.push(
            "Monitor future document activity."
        );

    }

    if (recommendations.length === 0) {

        recommendations.push(
            "No immediate action required."
        );

    }

    return recommendations;

}
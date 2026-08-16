export const SecuritySchema = {
    type: "object",
    properties: {
        executiveSummary: {
            type: "string",
        },
        positiveFindings: {
            type: "array",
            items: {
                type: "string",
            },
        },
        risks: {
            type: "array",
            items: {
                type: "string",
            },
        },
        recommendations: {
            type: "array",
            items: {
                type: "string",
            },
        },
        overallThreatLevel: {
            type: "string",
        },
    },
};
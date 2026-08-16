export const InvestigationSchema = {
    type: "object",

    properties: {

        executiveSummary: {
            type: "string",
        },

        technicalAssessment: {
            type: "string",
        },

        keyFindings: {
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

        possibleCauses: {
            type: "array",
            items: {
                type: "string",
            },
        },

        confidence: {
            type: "number",
        },

    },

    required: [
        "executiveSummary",
        "technicalAssessment",
        "keyFindings",
        "recommendations",
        "possibleCauses",
        "confidence",
    ],
};
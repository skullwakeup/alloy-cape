import { generateMarkdown, generateJSON } from "./geminiClient";

import { buildSecurityPrompt } from "./prompts/securityPrompt";
import { buildInvestigationPrompt } from "./prompts/investigationPrompt";

import { InvestigationSchema } from "./schema/investigationSchema";

export async function generateSecurityInsights(security) {
    try {

        const prompt =
            buildSecurityPrompt(security);

        return await generateMarkdown(prompt);

    } catch (error) {

        console.error("Alloy AI Error:", error);

        return "Unable to generate AI insights.";

    }
}

export async function analyzeInvestigation(data) {

    try {

        const prompt =
            buildInvestigationPrompt(data);

        const analysis =
            await generateJSON({

                prompt,

                schema:
                    InvestigationSchema,

            });

        return analysis;

    } catch (error) {

        console.error(
            "Investigation AI Error:",
            error
        );

        return {

            executiveSummary:
                "Unable to generate executive summary.",

            technicalAssessment:
                "AI analysis unavailable.",

            keyFindings: [],

            recommendations: [],

            possibleCauses: [],

            confidence: 0,

        };

    }

}
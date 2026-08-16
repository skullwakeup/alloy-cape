import { SYSTEM_PROMPT } from "./systemPrompt";

export function buildSecurityPrompt(security) {
    return `
${SYSTEM_PROMPT}

Analyze the following enterprise security metrics.

Return ONLY markdown.

Sections:

# Executive Summary

# Positive Findings

# Risks

# Recommendations

# Overall Threat Level

Security Metrics:

${JSON.stringify(security, null, 2)}
`;
}
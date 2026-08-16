// ======================================================
// Alloy Intelligence Engine Configuration
// ======================================================

export const CLASSIFICATION_WEIGHTS = {

    // Classification affects sensitivity,
    // but should not dominate investigation risk.

    Public: 0,

    Internal: 5,

    Confidential: 10,

    Restricted: 20,

    Secret: 30,

};

export const RISK_LEVELS = {

    LOW: "Low",

    MEDIUM: "Medium",

    HIGH: "High",

    CRITICAL: "Critical",

};

export const SCORE_LIMITS = {

    LOW: 25,

    MEDIUM: 50,

    HIGH: 75,

};

export const INTEGRITY = {

    EXCELLENT: 95,

    GOOD: 85,

    FAIR: 70,

};

export const TRUST = {

    VERIFIED_RECIPIENT: 20,

    REPEAT_SUCCESS: 10,

    FAILED_INVESTIGATION: -25,

    UNKNOWN_RECIPIENT: -15,

};

export const ENGINE = {

    MAX_SCORE: 100,

    MIN_SCORE: 0,

};
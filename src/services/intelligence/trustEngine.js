import { TRUST } from "./constants";

export function calculateTrust(recipient, investigations = []) {

    let score = 50;

    const history = investigations.filter(
        item => item.investigatedRecipient === recipient
    );

    if (history.length === 0) {

        score += TRUST.UNKNOWN_RECIPIENT;

    } else {

        history.forEach(item => {

            if (item.success) {

                score += TRUST.REPEAT_SUCCESS;

            } else {

                score += TRUST.FAILED_INVESTIGATION;

            }

        });

    }

    score = Math.max(0, Math.min(score, 100));

    let level;

    if (score >= 80)
        level = "Trusted";

    else if (score >= 60)
        level = "Reliable";

    else if (score >= 40)
        level = "Neutral";

    else if (score >= 20)
        level = "Suspicious";

    else
        level = "Untrusted";

    return {

        score,

        level,

        historyCount: history.length,

    };

}
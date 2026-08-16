export function analyzeSemanticChanges(originalText, uploadedText) {

    if (!originalText || !uploadedText) {

        return {

            changed: false,

            score: 0,

            findings: [],

        };

    }

    const findings = [];

    let score = 0;

    const beforeLines =
        originalText
            .split(/\r?\n/)
            .map(l => l.trim())
            .filter(Boolean);

    const afterLines =
        uploadedText
            .split(/\r?\n/)
            .map(l => l.trim())
            .filter(Boolean);

    const max =
        Math.max(
            beforeLines.length,
            afterLines.length
        );

    for (let i = 0; i < max; i++) {

        const before =
            beforeLines[i] ?? "";

        const after =
            afterLines[i] ?? "";

        if (before === after)
            continue;

        let severity = "Low";

        let type = "Content Modified";

        if (/\d/.test(before) || /\d/.test(after)) {

            severity = "Critical";

            type = "Numeric Value Modified";

            score += 20;

        }

        else if (

            /(approved|rejected|true|false|yes|no)/i.test(before) ||

            /(approved|rejected|true|false|yes|no)/i.test(after)

        ) {

            severity = "High";

            type = "Decision Keyword Modified";

            score += 15;

        }

        else if (

            /(confidential|restricted|internal|public)/i.test(before) ||

            /(confidential|restricted|internal|public)/i.test(after)

        ) {

            severity = "Critical";

            type = "Classification Modified";

            score += 25;

        }

        else {

            score += 5;

        }

        findings.push({

            line: i + 1,

            before,

            after,

            severity,

            type,

        });

    }

    return {

        changed:
            findings.length > 0,

        score,

        findings,

    };

}
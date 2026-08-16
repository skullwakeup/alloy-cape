import { calculateIntegrity } from "./integrityEngine";
import { calculateRisk } from "./riskEngine";

export function runForensicAnalysis({

    document,

    uploadedFile,

    tracker,

    checks,

}) {

    const integrity =
        calculateIntegrity(checks);

    const tampered =
        integrity < 90;

    const risk =
        calculateRisk({

            classification:
                document.classification,

            integrity,

            tampered,

            externalShare:
                tracker.externalShares > 0,

            downloadCount:
                tracker.downloadCount,

        });

    return {

        integrity,

        tampered,

        risk,

        recipient:
            document.recipients,

        tracker,

        checks,

    };

}
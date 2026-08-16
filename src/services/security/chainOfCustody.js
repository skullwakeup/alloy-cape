export function buildChainOfCustody(document) {

    const events = [];

    if (!document) return events;

    if (document.issuedAt) {

        events.push({

            type: "DOCUMENT_ISSUED",

            severity: "Info",

            time: document.issuedAt,

            description: "Protected document issued.",

        });

    }

    if (document.lastAccessed) {

        events.push({

            type: "LAST_ACTIVITY",

            severity: "Info",

            time: document.lastAccessed,

            description: "Last recorded document activity.",

        });

    }

    events.push({

        type: "INVESTIGATION",

        severity: "Info",

        time: new Date().toISOString(),

        description: "Forensic investigation completed.",

    });

    return events.sort(

        (a, b) =>

            new Date(a.time) -

            new Date(b.time)

    );

}
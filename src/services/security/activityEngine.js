export function addActivity(
    tracker,
    type,
    performedBy,
    metadata = {}
) {

    tracker.activities.unshift({

        id: crypto.randomUUID(),

        type,

        performedBy,

        timestamp:
            new Date().toISOString(),

        metadata,

    });

}
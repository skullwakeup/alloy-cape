export function calculateIntegrity({

    shaMatch,

    dnaMatch,

    pageMatch,

    metadataMatch,

    watermarkMatch,

    textSimilarity,

}) {

    let integrity = 100;

    if (!shaMatch)
        integrity -= 30;

    if (!dnaMatch)
        integrity -= 100;

    if (!pageMatch)
        integrity -= 15;

    if (!metadataMatch)
        integrity -= 10;

    if (!watermarkMatch)
        integrity -= 20;

    integrity -= Math.max(0, 100 - textSimilarity) * 0.25;

    return Math.max(0, Math.round(integrity));

}
export function calculateLeakProbability(document) {

  let score = 0;

  score += (document.downloadCount || 0) * 5;

  score += (document.externalShares || 0) * 30;

  score += (document.internalShares || 0) * 5;

  if (document.classification === "Confidential")
    score += 20;

  if (document.classification === "Restricted")
    score += 35;

  if (document.classification === "Top Secret")
    score += 50;

  return Math.min(score, 100);

}
function formatDNA(hash) {

  return `DNA-${hash
    .substring(0, 4)
    .toUpperCase()}-${hash
    .substring(4, 8)
    .toUpperCase()}-${hash
    .substring(8, 12)
    .toUpperCase()}`;

}

export function generateDNA(hash, recipient) {

  const recipientHash = btoa(recipient)
    .replace(/=/g, "")
    .substring(0, 6)
    .toUpperCase();

  return {

    dnaId: formatDNA(hash),

    recipientSignature: recipientHash,

    fingerprint:

      hash.substring(0, 24).toUpperCase(),

  };

}
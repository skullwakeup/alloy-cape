export async function investigateDocument(document) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const hashValid = !!document.sha256;
  const dnaValid = !!document.dnaId;
  const metadataValid = !!document.fileName;
  const integrity = document.integrity ?? 100;

  let risk = "Low";
  let status = "Authentic";

  if (integrity < 80) {
    risk = "Medium";
  }

  if (integrity < 60) {
    risk = "High";
    status = "Suspicious";
  }

  return {
    hashValid,
    dnaValid,
    metadataValid,
    integrity,
    risk,
    status,
  };
}
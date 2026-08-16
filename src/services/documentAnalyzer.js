import { sha256, hashText } from "./crypto/hashService";

import {
  getPageCount,
  extractPDFText,
} from "./pdf/pdfEngine";

export async function analyzeDocument(document) {

  const binaryHash =
    await sha256(document.file);

  const text =
    await extractPDFText(document.file);

  const textHash =
    await hashText(text);

  const pages =
    await getPageCount(document.file);

  return {

    ...document,

    sha256: binaryHash,

    text,

    textHash,

    pageCount: pages,

    integrityBaseline: 100,

    status: "Verified",

  };

}
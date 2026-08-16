import { encryptPDF } from "@pdfsmaller/pdf-encrypt";

export async function protectPDF(
  pdfBytes,
  password
) {
  if (!pdfBytes) {
    throw new Error("PDF bytes are missing.");
  }

  if (!password) {
    throw new Error(
      "PDF protection password is missing."
    );
  }

  const protectedBytes =
    await encryptPDF(
      new Uint8Array(pdfBytes),
      password,
      {
        algorithm: "AES-256",

        allowPrinting: true,
        allowModifying: false,
        allowCopying: false,
        allowAnnotating: false,
        allowFillingForms: false,
        allowExtraction: false,
        allowAssembly: false,
        allowHighQualityPrint: true,

        ownerPassword:
          `${password}-OWNER`,
      }
    );

  return protectedBytes;
}
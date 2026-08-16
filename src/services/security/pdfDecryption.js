import { decryptPDF } from "@pdfsmaller/pdf-decrypt";

export async function decryptProtectedPDF(
  pdfBytes,
  password
) {
  if (!pdfBytes) {
    throw new Error(
      "Encrypted PDF bytes are missing."
    );
  }

  if (!password) {
    throw new Error(
      "PDF decryption password is missing."
    );
  }

  try {

    const decryptedBytes =
      await decryptPDF(
        new Uint8Array(pdfBytes),
        password
      );

    return decryptedBytes;

  } catch (error) {

    console.error(
      "PDF DECRYPTION ERROR",
      error
    );

    throw new Error(
      "Unable to decrypt protected PDF. The password may be incorrect."
    );

  }
}
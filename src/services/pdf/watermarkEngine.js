import { analyzeDocument } from "../documentAnalyzer";
import { createIdentity } from "../security/identityEngine";
import { buildMetadata } from "./metadataEngine";

import { protectPDF } from "../security/pdfProtection";

import {
  embedMetadata,
  savePDF,
  getFont,
} from "./pdfEngine";

import { drawFooter } from "./footerEngine";

export async function generateProtectedCopy(
  document,
  recipient
) {

  // ==========================================
  // 1. CREATE UNIQUE IDENTITY
  // ==========================================

  const identity =
    createIdentity(
      document.sha256,
      recipient,
      document.trackerId
    );


  // ==========================================
  // 2. MERGE IDENTITY INTO DOCUMENT
  // ==========================================

  const identityDocument = {
    ...document,
    ...identity,
  };




  // ==========================================
  // 3. BUILD PROTECTED PDF METADATA
  // ==========================================

  const metadata =
    buildMetadata(
      identityDocument,
      recipient
    );


  // ==========================================
  // 4. EMBED METADATA
  // ==========================================

  const pdf =
    await embedMetadata(
      document.file,
      metadata
    );


  // ==========================================
  // 5. ADD FOOTER / DOCUMENT DNA
  // ==========================================

  const font =
    await getFont(pdf);

  pdf.getPages().forEach(page => {

    drawFooter(
      page,
      font,
      identityDocument,
      recipient
    );

  });


  // ==========================================
  // 6. CREATE FINAL UNPROTECTED PDF
  // ==========================================

  const unprotectedBytes =
    await savePDF(pdf);



  // ==========================================
  // 7. CREATE FILE FOR FORENSIC ANALYSIS
  // ==========================================

  const unprotectedFile =
    new File(
      [
        unprotectedBytes
      ],

      document.fileName.replace(
        ".pdf",
        `_${recipient}.pdf`
      ),

      {
        type:
          "application/pdf",
      }
    );


  // ==========================================
  // 8. ANALYZE UNPROTECTED BASELINE
  // ==========================================
  //
  // IMPORTANT:
  // The forensic baseline is generated
  // BEFORE encryption.
  //
  // This keeps the existing forensic
  // analysis engine compatible with
  // the PDF.
  //
  // ==========================================

  const analysis =
    await analyzeDocument({

      file:
        unprotectedFile,

      fileName:
        unprotectedFile.name,

      fileSize:
        unprotectedFile.size,

      classification:
        document.classification,

    });


  // ==========================================
  // 9. CREATE PASSWORD-PROTECTED PDF
  // ==========================================

  const protectedBytes =
    await protectPDF(
      unprotectedBytes,
      identity.copyPassword
    );


  // ==========================================
  // 10. CREATE PROTECTED FILE
  // ==========================================

  const protectedFile =
    new File(
      [
        protectedBytes
      ],

      document.fileName.replace(
        ".pdf",
        `_${recipient}.pdf`
      ),

      {
        type:
          "application/pdf",
      }
    );


  // ==========================================
  // 11. PRESERVE FORENSIC BASELINE
  // ==========================================

  const protectedBaseline = {

    ...analysis,

    dnaId:
      identity.dnaId,

    fingerprint:
      identity.fingerprint,

    trackerId:
      identity.trackerId,

    recipientSignature:
      identity.recipientSignature,

    copyId:
      identity.copyId,

    recipient:
      recipient,

    recipientType:
      identity.recipientType,

    recipientOrganization:
      identity.recipientOrganization,

    copyPassword:
      identity.copyPassword,

  };

  // ==========================================
  // 12. RETURN BOTH VERSIONS
  // ==========================================

  return {
    recipient:
      recipient,

    fileName:
      protectedFile.name,

    // PASSWORD-PROTECTED VERSION
    bytes:
      protectedBytes,

    // UNPROTECTED EXTERNAL VERSION
    unprotectedBytes:
      unprotectedBytes,

    passwordProtected:
      true,

    analysis:
      protectedBaseline,
  };

}
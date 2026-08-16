import { useState } from "react";

import {
  addDocument,
  documentAlreadyProtected,
  uploadProtectedCopy,
  uploadExternalCopy,
  updateDocumentCopies,
} from "../services/document/documentSupabaseService";

import { useIssue } from "../context/IssueContext";

import { generateCopies } from "../services/generator/generateCopies";

import { downloadProtectedCopies } from "../services/download/zipService";

export default function useGenerateDNA() {
  const {
    document,
    recipients,
    classification,
    loadRegistry,
    setGeneratedCopies,
    setGenerationProgress,
    setGenerationStatus,
  } = useIssue();

  const [isGenerating, setIsGenerating] = useState(false);

  async function generateDNA() {
    if (!document) {
      alert("Please upload a PDF.");
      return;
    }

    if (recipients.length === 0) {
      alert("Please add at least one recipient.");
      return;
    }

    setIsGenerating(true);

    try {
      const initialSteps = [
        {
          status: "Reading Document...",
          progress: 15,
        },
        {
          status: "Generating SHA-256...",
          progress: 30,
        },
        {
          status: "Checking Registry...",
          progress: 40,
        },
      ];

      for (const step of initialSteps) {
        setGenerationStatus(step.status);
        setGenerationProgress(step.progress);

        await new Promise((resolve) =>
          setTimeout(resolve, 500)
        );
      }

      const exists =
        await documentAlreadyProtected(
          document.sha256
        );

      if (exists) {
        setGenerationProgress(0);

        alert(
          "🔒 Document Already Protected\n\n" +
            "This document has already been issued and its Document DNA is immutable.\n\n" +
            "For security and forensic integrity, Alloy Cape does not allow recipients to be modified after issuance.\n\n" +
            "Delete the existing registry entry before issuing this document again."
        );

        return;
      }

      const remainingSteps = [
        {
          status: "Building Document DNA...",
          progress: 55,
        },
        {
          status: "Generating Protected Copies...",
          progress: 70,
        },
        {
          status: "Embedding Watermarks...",
          progress: 85,
        },
        {
          status: "Creating ZIP Package...",
          progress: 95,
        },
      ];

      for (const step of remainingSteps) {
        setGenerationStatus(step.status);
        setGenerationProgress(step.progress);

        await new Promise((resolve) =>
          setTimeout(resolve, 500)
        );
      }

      // ============================================
      // Generate protected PDFs
      // ============================================

      const issuanceDocument = {
        ...document,
        classification,
      };

      const copies =
        await generateCopies(
          issuanceDocument,
          recipients
        );

      if (!copies || copies.length === 0) {
        throw new Error(
          "No protected copies were generated."
        );
      }

      const baseline =
        copies[0].analysis;

      // ============================================
      // Build COMPLETE copy identities
      // INCLUDING FORENSIC BASELINE
      // ============================================

      const copyIdentities =
        copies.map((copy) => {
          const analysis =
            copy.analysis;

          return {
            // -------------------------
            // Copy Identity
            // -------------------------

            copyId:
              analysis.copyId,

            dnaId:
              analysis.dnaId,

            recipient:
              analysis.recipient,

            recipientType:
              analysis.recipientType,

            recipientOrganization:
              analysis.recipientOrganization,

            recipientSignature:
              analysis.recipientSignature,

            trackerId:
              analysis.trackerId,

            copyPassword:
              analysis.copyPassword,

            fileName:
              copy.fileName,

            issuedAt:
              new Date().toISOString(),

            // -------------------------
            // FORENSIC BASELINE
            // -------------------------

            sha256:
              analysis.sha256,

            textHash:
              analysis.textHash,

            text:
              analysis.text,

            pageCount:
              analysis.pageCount,

            fileSize:
              analysis.fileSize,

            fingerprint:
              analysis.fingerprint,

            classification:
              classification,
          };
        });


      // ============================================
      // Registry metadata
      // ============================================

      const entry = {
        dnaId:
          baseline.dnaId,

        sha256:
          baseline.sha256,

        textHash:
          baseline.textHash,

        fingerprint:
          baseline.fingerprint,

        recipientSignature:
          baseline.recipientSignature,

        trackerId:
          baseline.trackerId,

        fileName:
          document.fileName,

        fileSize:
          baseline.fileSize,

        pageCount:
          baseline.pageCount,

        classification:
          classification,

        copies:
          copyIdentities,

        recipients:
          [...recipients],

        integrityBaseline:
          100,

        integrity:
          100,

        tampered:
          false,

        risk:
          "Low",

        issuedAt:
          new Date().toISOString(),

        status:
          "Protected",
      };

      // ============================================
      // SAVE DOCUMENT FIRST
      // ============================================

      const savedDocument =
        await addDocument(entry);


      // ============================================
      // UPLOAD EVERY PROTECTED COPY
      // ============================================

      const persistedCopies =
        [];

      for (
        const copy of copies
      ) {

        const copyId =
          copy.analysis.copyId;

        const fileName =
          copy.fileName;

        const storagePath =
          `${savedDocument.id}/${copyId}/${fileName}`;

        await uploadProtectedCopy(
          savedDocument.id,
          copyId,
          fileName,
          copy.bytes
        );

        const externalFileName =
          fileName.replace(
            /\.pdf$/i,
            "_EXTERNAL.pdf"
          );

        const externalStoragePath =
          `${savedDocument.id}/${copyId}/external/${externalFileName}`;


        await uploadExternalCopy(
          savedDocument.id,
          copyId,
          externalFileName,
          copy.unprotectedBytes
        );

        persistedCopies.push({

          ...copyIdentities.find(
            item =>
              item.copyId === copyId
          ),

          storagePath,

          externalStoragePath,

          externalFileName,

          downloadCount:
            0,

          passwordRevealCount:
            0,

          lastPasswordRevealedAt:
            null,

        });
      }

      // ============================================
      // SAVE STORAGE PATHS INTO REGISTRY
      // ============================================

      await updateDocumentCopies(
        savedDocument.id,
        persistedCopies
      );

      // ============================================
      // Download ZIP
      // ============================================

      await downloadProtectedCopies(
        copies
      );

      // ============================================
      // KEEP COPIES IN MEMORY
      // ============================================

      setGeneratedCopies(
        copies
      );

      await loadRegistry();

      setGenerationStatus(
        "✅ Document DNA Successfully Registered"
      );

      setGenerationProgress(
        100
      );

      setTimeout(() => {
        setGenerationProgress(0);
      }, 2000);

    } catch (err) {
      console.error(
        "GENERATION ERROR"
      );

      console.error(err);

      console.error(
        err.message
      );

      console.error(
        err.details
      );

      console.error(
        err.hint
      );

      console.error(
        err.code
      );

      setGenerationStatus(
        "❌ Generation Failed"
      );

      setGenerationProgress(
        0
      );

    } finally {
      setIsGenerating(false);
    }
  }

  return {
    generateDNA,
    isGenerating,
  };
}
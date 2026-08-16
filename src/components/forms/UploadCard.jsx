import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { createDocument } from "../../models/Document";
import { createIdentity } from "../../services/security/identityEngine";
import { analyzeDocument } from "../../services/documentAnalyzer";

import { useIssue } from "../../context/IssueContext";

import {
  UploadCloud,
  FileText,
  RefreshCcw,
} from "lucide-react";


export default function UploadCard() {

  const {
    document,
    setDocument,
    classification,
  } = useIssue();


  const onDrop = useCallback(
    async (acceptedFiles) => {

      if (
        acceptedFiles.length === 0
      ) {
        return;
      }


      // --------------------------------
      // Create initial document
      // --------------------------------

      const doc =
        createDocument(
          acceptedFiles[0],
          classification
        );




      // Show immediately
      setDocument(doc);


      try {

        // --------------------------------
        // Analyze original document
        // --------------------------------

        const analyzedDoc =
          await analyzeDocument(doc);


        // --------------------------------
        // Create immutable identity
        // Preserve original tracker
        // --------------------------------

        const identity =
          createIdentity(
            analyzedDoc.sha256,
            null,
            doc.trackerId
          );


        // --------------------------------
        // Merge everything
        //
        // IMPORTANT:
        // Start with doc so trackerId
        // cannot be lost.
        // --------------------------------

        const finalDocument = {

          ...doc,

          ...analyzedDoc,

          ...identity,

          // Explicitly preserve tracker
          trackerId:
            doc.trackerId,

          // Preserve protected copies
          copies:
            doc.copies ?? [],

        };



        // Store in context
        setDocument(
          finalDocument
        );

      } catch (error) {

        console.error(
          "Document analysis failed:",
          error
        );


        setDocument({

          ...doc,

          status:
            "Analysis Failed",

        });

      }

    },

    [
      setDocument,
      classification,
    ]
  );


  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } =
    useDropzone({

      onDrop,

      multiple: false,

      accept: {
        "application/pdf":
          [".pdf"],
      },

    });


  return (

    <div>

      <h2 className="text-xl font-semibold mb-6">
        Upload Document
      </h2>


      {!document ? (

        <div
          {...getRootProps()}
          className={`
            border-2
            border-dashed
            rounded-2xl
            h-72
            flex
            flex-col
            justify-center
            items-center
            cursor-pointer
            transition-all
            ${
              isDragActive
                ? "border-yellow-400 bg-yellow-400/10"
                : "border-slate-600 hover:border-yellow-400"
            }
          `}
        >

          <input
            {...getInputProps()}
          />


          <UploadCloud
            size={64}
            className="text-yellow-400 mb-6"
          />


          <h3 className="text-xl font-semibold">
            Drag & Drop PDF
          </h3>


          <p className="text-slate-400 mt-2">
            or click to browse
          </p>


          <p className="text-xs text-slate-500 mt-4">
            Supported format: PDF
          </p>

        </div>

      ) : (

        <div className="bg-[#0F172A] rounded-2xl p-6 min-h-[320px] flex flex-col">

          <FileText
            size={60}
            className="text-yellow-400 mb-6"
          />


          <div className="space-y-4 flex-1">

            <h2 className="text-xl font-bold break-words">
              {document.fileName}
            </h2>


            <div className="flex justify-between">

              <span className="text-slate-400">
                Pages
              </span>

              <span>
                {document.pageCount || "..."}
              </span>

            </div>


            <div className="flex justify-between">

              <span className="text-slate-400">
                File Size
              </span>

              <span>
                {
                  (
                    document.fileSize /
                    1024 /
                    1024
                  ).toFixed(2)
                } MB
              </span>

            </div>


            <div className="flex justify-between">

              <span className="text-slate-400">
                File Type
              </span>

              <span>
                PDF
              </span>

            </div>


            <div className="flex justify-between">

              <span className="text-slate-400">
                DNA ID
              </span>

              <span className="text-yellow-400 font-semibold">

                {
                  document.dnaId ||
                  "Generating..."
                }

              </span>

            </div>


            <div className="flex justify-between">

              <span className="text-slate-400">
                Tracker ID
              </span>

              <span className="text-yellow-400 font-semibold text-xs">

                {
                  document.trackerId ||
                  "Generating..."
                }

              </span>

            </div>


            <div className="flex justify-between">

              <span className="text-slate-400">
                SHA-256
              </span>

              <span className="text-xs">

                {
                  document.sha256
                    ? `${document.sha256.substring(0, 12)}...`
                    : "Calculating..."
                }

              </span>

            </div>


            <div className="flex justify-between">

              <span className="text-slate-400">
                Status
              </span>

              <span
                className={`
                  font-semibold
                  ${
                    document.status ===
                    "Verified"
                      ? "text-green-400"
                      : document.status ===
                        "Analysis Failed"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }
                `}
              >

                {document.status}

              </span>

            </div>

          </div>


          <button
            onClick={() =>
              setDocument(null)
            }
            className="mt-8 bg-yellow-400 text-black rounded-xl py-3 flex items-center justify-center gap-3 hover:scale-[1.02] transition"
          >

            <RefreshCcw
              size={18}
            />

            Replace File

          </button>

        </div>

      )}

    </div>

  );

}
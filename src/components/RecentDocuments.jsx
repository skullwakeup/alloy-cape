import {
  FileText,
  ShieldCheck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getDocuments,
} from "../services/document/documentSupabaseService";

function shorten(text, max = 38) {

  if (!text) return "";

  if (text.length <= max) return text;

  const dot = text.lastIndexOf(".");

  if (dot !== -1) {

    const ext = text.substring(dot);

    return (
      text.substring(0, max - ext.length - 3) +
      "..." +
      ext
    );

  }

  return text.substring(0, max) + "...";

}

export default function RecentDocuments() {

  const [
    documents,
    setDocuments,
  ] = useState([]);

  useEffect(() => {

    getDocuments()
      .then(setDocuments)
      .catch(console.error);

  }, []);

  return (

    <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold text-white">
          Recent Documents
        </h2>

        <span className="text-sm text-cyan-400">
          {documents.length} Registered
        </span>

      </div>

      <div className="space-y-4">

        {documents.length === 0 ? (

          <div className="py-10 text-center text-slate-500">
            No documents registered.
          </div>

        ) : (

          documents.slice(0, 5).map((doc) => (

            <div
              key={doc.id}
              className="
                rounded-2xl
                border
                border-slate-700
                bg-[#111B33]
                p-4
                transition
                hover:border-cyan-500
                hover:bg-[#182544]
                cursor-pointer
              "
            >

              <div className="flex items-start gap-4">

                <div className="rounded-xl bg-cyan-500/20 p-3">

                  <FileText
                    size={20}
                    className="text-cyan-400"
                  />

                </div>

                <div className="min-w-0 flex-1">

                  <h3
                    className="
                      font-semibold
                      text-white
                      break-words
                    "
                    style={{
                      overflowWrap: "anywhere",
                    }}
                    title={doc.fileName}
                  >
                    {shorten(doc.fileName)}
                  </h3>

                  <p className="mt-1 font-mono text-xs text-cyan-400">
                    {doc.dnaId}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
                      {doc.classification}
                    </span>

                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
                      {doc.pageCount} Pages
                    </span>

                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
                      {doc.recipients.length} Recipient
                    </span>

                  </div>

                </div>

                <div className="text-right">

                  <div className="flex items-center gap-2 text-green-400">

                    <ShieldCheck size={16} />

                    <span className="text-sm font-semibold">
                      {doc.status}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}
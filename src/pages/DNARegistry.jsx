import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";

import Layout from "../components/Layout";
import { useIssue } from "../context/IssueContext";
import DocumentIdentityDrawer from "../components/registry/DocumentIdentityDrawer";

import { deleteDocumentCascade } from "../services/document/documentSupabaseService";

export default function DNARegistry() {

  const {
    registry,
    loadRegistry,
    searchQuery,
  } = useIssue();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  async function handleDelete(e, doc) {
    e.stopPropagation();

    const confirmed = window.confirm(
      `Delete "${doc.fileName}"?\n\nThis will permanently delete:\n\n• Registry Entry\n• Investigation History\n• AI Reports\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteDocumentCascade(doc.id);
      await loadRegistry();

      if (selectedDocument?.id === doc.id) {
        setDrawerOpen(false);
        setSelectedDocument(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete document.");
    }
  }

  let filteredRegistry = [];

  try {

    filteredRegistry = registry.filter((doc) => {

      const q = searchQuery.trim().toLowerCase();

      if (!q) return true;

      return (
        (doc.fileName || "").toLowerCase().includes(q) ||
        (doc.dnaId || "").toLowerCase().includes(q) ||
        (doc.classification || "").toLowerCase().includes(q) ||
        (doc.status || "").toLowerCase().includes(q) ||
        (doc.recipients || []).some((r) =>
          (r || "").toLowerCase().includes(q)
        )

      );

    });

  } catch (err) {

    console.error("FILTER ERROR", err);

  }


  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          DNA Registry
        </h1>

        <p className="mt-2 text-slate-400">
          All generated Document DNA records are stored here.
        </p>
      </div>

      {filteredRegistry.length===0 ? (
        <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-14 text-center">

            <h2 className="text-3xl font-bold text-white">
              {searchQuery
                ? "No matching documents found."
                : "No Documents Registered."}
            </h2>
            <p className="mt-4 text-slate-400">

                Issue your first protected document to create a DNA registry entry.

            </p>

        </div>
      ) : (
        <div
          className="
          overflow-hidden
          rounded-3xl
          border
          border-slate-700
          bg-[#16213A]
          shadow-2xl
          "
        >
          <table className="w-full">
            <thead className="bg-[#111B33] text-slate-400 uppercase text-xs tracking-widest">
              <tr>
                <th className="p-4 text-left">DNA ID</th>
                <th className="p-4 text-left">Document</th>
                <th className="p-4 text-left">Pages</th>
                <th className="p-4 text-left">Recipients</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRegistry.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocument(doc);
                    setDrawerOpen(true);
                  }}
                  className="
                  cursor-pointer
                  border-t
                  border-slate-700
                  transition-all
                  duration-300
                  hover:bg-cyan-500/5
                  hover:shadow-inner
                  "
                >
                  <td className="w-[220px] px-6 py-5">

                  <span
                  className="
                  inline-flex
                  whitespace-nowrap
                  rounded-lg
                  bg-yellow-500/10
                  px-3
                  py-2
                  font-mono
                  text-xs
                  text-yellow-400
                  "
                  >

                  {doc.dnaId}

                  </span>

                  </td>

                  <td className="px-6 py-5">

                  <div>

                  <p
                  className="max-w-[420px] truncate font-semibold text-white"
                  title={doc.fileName}
                  >

                  {doc.fileName}

                  </p>

                  <p className="mt-1 text-xs text-slate-500">

                  {doc.classification}

                  </p>

                  </div>

                  </td>

                  <td className="px-6 py-5 text-left">
                    {doc.pageCount}
                  </td>

                  <td className="px-6 py-5">

                    <div className="flex flex-wrap gap-2">

                      {(doc.recipients ?? [])
                        .slice(0, 2)
                        .map((recipient) => (

                          <span
                            key={recipient}
                            className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400"
                          >
                            {recipient.split("@")[0]}
                          </span>

                        ))}

                      {(doc.recipients ?? []).length > 2 && (

                        <span className="text-slate-500">
                          +{(doc.recipients ?? []).length - 2}
                        </span>

                      )}

                    </div>

                  </td>

                  <td className="px-6 py-5">

                  <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400">

                  {doc.status}

                  </span>

                  </td>

                  <td className="px-6 py-5 text-left">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDocument(doc);
                          setDrawerOpen(true);
                        }}
                        className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-cyan-500/20
                        px-4
                        py-2
                        text-sm
                        text-cyan-400
                        transition
                        hover:bg-cyan-500/30
                        "
                        title="View Document"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, doc)}
                        className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-cyan-500/20
                        px-4
                        py-2
                        text-sm
                        text-cyan-400
                        transition
                        hover:bg-cyan-500/30
                        "
                        title="Delete Document"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DocumentIdentityDrawer
        open={drawerOpen}
        document={selectedDocument}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedDocument(null);
        }}
      />
    </Layout>
  );
}
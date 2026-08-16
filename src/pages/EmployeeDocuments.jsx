import {
  useEffect,
  useState,
} from "react";

import {
  saveAs,
} from "file-saver";

import {
  incrementDownload,
} from "../services/document/documentSupabaseService";

import {
  logDocumentEvent,
} from "../services/document/documentEventService";

import {
  FileText,
  Download,
  Eye,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  FolderOpen,
  RefreshCw,
} from "lucide-react";

import Layout from "../components/Layout";

import {
  useAuth,
} from "../context/AuthContext";

import {
  supabase,
} from "../lib/supabase";

import {
  downloadProtectedCopy,
} from "../services/document/documentSupabaseService";

export default function EmployeeDocuments() {

  const {
    user,
    profile,
  } = useAuth();

  const [
    documents,
    setDocuments,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  async function loadDocuments() {

    if (!user?.email) {

      setDocuments([]);

      setLoading(false);

      return;
    }

    try {

      setLoading(true);
      setError("");

      const {
        data,
        error: queryError,
        } = await supabase
        .from("documents")
        .select(`
            id,
            title,
            classification,
            sha256,
            dna_id,
            status,
            file_size,
            recipient,
            created_at,
            copies
        `)
        .order(
            "created_at",
            {
            ascending: false,
            }
        );

      if (queryError) {
        throw queryError;
      }

      setDocuments(
        data ?? []
      );

    } catch (err) {

      console.error(
        "EMPLOYEE DOCUMENT LOAD ERROR:",
        err
      );

      setError(
        err?.message ||
        "Unable to load your documents."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadDocuments();

  }, [user?.email]);


  function formatFileSize(bytes) {

    if (!bytes) {
      return "—";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {

      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;

    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }


  async function handleView(document) {
    try {
        const copies = document?.copies ?? [];

        if (copies.length === 0) {
        alert("No protected copy is available.");
        return;
        }

        const copy = copies[0];

        if (!copy.storagePath) {
        alert("Protected PDF storage path is missing.");
        return;
        }

        const blob = await downloadProtectedCopy(
        copy.storagePath
        );

        const url = URL.createObjectURL(blob);

        window.open(
        url,
        "_blank",
        "noopener,noreferrer"
        );

        setTimeout(() => {
        URL.revokeObjectURL(url);
        }, 60000);

    } catch (err) {
        console.error(
        "VIEW DOCUMENT ERROR:",
        err
        );

        alert(
        err?.message ??
        "Unable to open protected document."
        );
    }
    }


    async function handleDownload(document) {
        try {

            const classification =
            String(
                document?.classification ?? ""
            )
                .trim()
                .toUpperCase();

            // Confidential and Restricted
            // cannot be downloaded by employees.

            if (
            classification === "CONFIDENTIAL" ||
            classification === "RESTRICTED"
            ) {

            alert(
                classification === "RESTRICTED"
                ? "🔒 Restricted documents cannot be downloaded."
                : "🔒 Confidential documents cannot be downloaded."
            );

            return;
            }

            // Only Public and Internal are downloadable.

            if (
            classification !== "PUBLIC" &&
            classification !== "INTERNAL"
            ) {

            alert(
                "This document cannot be downloaded by employees."
            );

            return;
            }

            const copies =
            document?.copies ?? [];

            if (copies.length === 0) {

            alert(
                "No protected copy is available."
            );

            return;
            }

            const copy =
            copies[0];

            if (!copy.storagePath) {

            alert(
                "Protected PDF storage path is missing."
            );

            return;
            }

            // ---------------------------------------------
            // Download protected PDF
            // ---------------------------------------------

            const blob =
            await downloadProtectedCopy(
                copy.storagePath
            );

            const copyId =
            copy.copyId ?? null;

            const trackerId =
            copy.trackerId ??
            document.trackerId ??
            null;

            const recipient =
            copy.recipient ??
            user?.email ??
            null;

            const fileName =
            copy.fileName ??
            document.title ??
            `Protected_${copyId}.pdf`;

            // ---------------------------------------------
            // Browser download
            // ---------------------------------------------

            saveAs(
            blob,
            fileName
            );

            // ---------------------------------------------
            // FORENSIC EVENT
            // ---------------------------------------------

            await logDocumentEvent({

            documentId:
                document.id,

            trackerId,

            copyId,

            recipient,

            type:
                "DOWNLOAD",

            details: {

                action:
                "Employee downloaded protected copy",

                classification,

                copyId,

                trackerId,

                recipient,

                recipientType:
                copy.recipientType ??
                null,

                recipientOrganization:
                copy.recipientOrganization ??
                null,

                fileName,

                actor:
                user?.email ??
                null,

                actorRole:
                "employee",

            },

            });

            // ---------------------------------------------
            // INCREMENT DATABASE DOWNLOAD COUNT
            // ---------------------------------------------

            await incrementDownload(
            document
            );

        } catch (err) {

            console.error(
            "EMPLOYEE DOWNLOAD ERROR:",
            err
            );

            alert(
            err?.message ??
            "Unable to download protected document."
            );

        }
        }


  return (

    <Layout>

      <div className="space-y-8">


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="
          rounded-3xl
          border
          border-cyan-500/20
          bg-gradient-to-r
          from-[#0B1220]
          via-[#111C33]
          to-[#16213A]
          p-8
        ">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-cyan-500/10 p-4">

                <FolderOpen
                  size={34}
                  className="text-cyan-400"
                />

              </div>

              <div>

                <h1 className="text-3xl font-black text-white">

                  My Documents

                </h1>

                <p className="mt-2 text-slate-400">

                  Documents issued to your account.

                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={loadDocuments}
              disabled={loading}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-700
                bg-[#0B1220]
                px-4
                py-3
                text-sm
                font-semibold
                text-slate-300
                transition
                hover:border-cyan-500/40
                hover:text-white
                disabled:opacity-50
              "
            >

              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

          </div>


          <div className="mt-6 grid gap-3 sm:grid-cols-2">

            <div className="
              rounded-xl
              border
              border-slate-700
              bg-[#0B1220]
              px-4
              py-3
            ">

              <div className="text-xs uppercase tracking-wider text-slate-500">

                Account

              </div>

              <div className="mt-1 truncate text-sm font-semibold text-white">

                {profile?.full_name ??
                  "Employee"}

              </div>

              <div className="mt-1 truncate text-xs text-slate-500">

                {user?.email}

              </div>

            </div>


            <div className="
              rounded-xl
              border
              border-slate-700
              bg-[#0B1220]
              px-4
              py-3
            ">

              <div className="text-xs uppercase tracking-wider text-slate-500">

                Assigned Documents

              </div>

              <div className="mt-1 text-2xl font-black text-cyan-400">

                {documents.length}

              </div>

            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (

          <div className="
            flex
            items-start
            gap-4
            rounded-2xl
            border
            border-red-500/30
            bg-red-500/10
            p-5
          ">

            <AlertTriangle
              className="mt-0.5 shrink-0 text-red-400"
              size={24}
            />

            <div>

              <div className="font-bold text-red-300">

                Unable to load documents

              </div>

              <div className="mt-1 text-sm text-slate-400">

                {error}

              </div>

            </div>

          </div>

        )}


        {/* ================================================== */}
        {/* LOADING */}
        {/* ================================================== */}

        {loading && (

          <div className="
            flex
            min-h-64
            items-center
            justify-center
            rounded-3xl
            border
            border-slate-700
            bg-[#111B33]
          ">

            <div className="text-center">

              <Loader2
                size={36}
                className="mx-auto animate-spin text-cyan-400"
              />

              <p className="mt-4 text-sm text-slate-400">

                Loading your documents...

              </p>

            </div>

          </div>

        )}


        {/* ================================================== */}
        {/* EMPTY */}
        {/* ================================================== */}

        {!loading &&
          !error &&
          documents.length === 0 && (

            <div className="
              rounded-3xl
              border
              border-slate-700
              bg-[#111B33]
              p-12
              text-center
            ">

              <FileText
                size={52}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-xl font-bold text-white">

                No Documents Issued

              </h2>

              <p className="
                mx-auto
                mt-2
                max-w-lg
                text-sm
                leading-6
                text-slate-500
              ">

                There are currently no documents
                registered to your employee account.

              </p>

            </div>

          )}


        {/* ================================================== */}
        {/* DOCUMENT LIST */}
        {/* ================================================== */}

        {!loading &&
          documents.length > 0 && (

            <div className="space-y-5">

              {documents.map((document) => (

                <div
                  key={document.id}
                  className="
                    rounded-3xl
                    border
                    border-slate-700
                    bg-[#111B33]
                    p-6
                    transition
                    hover:border-cyan-500/30
                    hover:shadow-xl
                    hover:shadow-cyan-950/20
                  "
                >

                  <div className="
                    flex
                    flex-col
                    gap-6
                    xl:flex-row
                    xl:items-center
                    xl:justify-between
                  ">


                    {/* ====================================== */}
                    {/* DOCUMENT                                */}
                    {/* ====================================== */}

                    <div className="flex min-w-0 items-start gap-4">

                      <div className="
                        shrink-0
                        rounded-2xl
                        bg-cyan-500/10
                        p-4
                      ">

                        <FileText
                          size={28}
                          className="text-cyan-400"
                        />

                      </div>


                      <div className="min-w-0">

                        <h2 className="
                          truncate
                          text-lg
                          font-bold
                          text-white
                        ">

                          {document.title ||
                            "Untitled Document"}

                        </h2>


                        <div className="
                          mt-2
                          truncate
                          font-mono
                          text-xs
                          text-slate-500
                        ">

                          DNA:{" "}
                          {document.dna_id ||
                            "Unavailable"}

                        </div>


                        <div className="mt-4 flex flex-wrap gap-2">

                          <span className="
                            rounded-lg
                            border
                            border-cyan-500/20
                            bg-cyan-500/10
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-cyan-400
                          ">

                            {document.classification ||
                              "Unknown"}

                          </span>


                          <span className="
                            rounded-lg
                            border
                            border-green-500/20
                            bg-green-500/10
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-green-400
                          ">

                            {document.status ||
                              "Issued"}

                          </span>

                        </div>

                      </div>

                    </div>


                    {/* ====================================== */}
                    {/* INFORMATION                             */}
                    {/* ====================================== */}

                    <div className="
                      grid
                      grid-cols-2
                      gap-3
                      lg:grid-cols-3
                    ">

                      <div className="
                        rounded-xl
                        bg-[#0B1220]
                        px-4
                        py-3
                      ">

                        <div className="text-xs text-slate-500">
                          File Size
                        </div>

                        <div className="mt-1 text-sm font-semibold text-white">
                          {formatFileSize(
                            document.file_size
                          )}
                        </div>

                      </div>


                      <div className="
                        rounded-xl
                        bg-[#0B1220]
                        px-4
                        py-3
                      ">

                        <div className="text-xs text-slate-500">
                          Issued
                        </div>

                        <div className="mt-1 text-sm font-semibold text-white">

                          {document.created_at
                            ? new Date(
                                document.created_at
                              ).toLocaleDateString()
                            : "—"}

                        </div>

                      </div>


                      <div className="
                        col-span-2
                        rounded-xl
                        bg-[#0B1220]
                        px-4
                        py-3
                        lg:col-span-1
                      ">

                        <div className="text-xs text-slate-500">
                          Recipient
                        </div>

                        <div className="mt-1 truncate text-sm font-semibold text-white">

                          {document.recipient ||
                            user?.email}

                        </div>

                      </div>

                    </div>


                    {/* ====================================== */}
                    {/* ACTIONS                                 */}
                    {/* ====================================== */}

                    <div className="
                      flex
                      shrink-0
                      gap-3
                    ">

                      <button
                        type="button"
                        onClick={() =>
                          handleView(
                            document
                          )
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-slate-700
                          bg-[#0B1220]
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-slate-300
                          transition
                          hover:border-cyan-500/40
                          hover:text-white
                        "
                      >

                        <Eye size={17} />

                        View

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(
                            document
                          )
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-cyan-500
                          px-4
                          py-3
                          text-sm
                          font-bold
                          text-slate-950
                          transition
                          hover:bg-cyan-400
                        "
                      >

                        <Download size={17} />

                        Download

                      </button>

                    </div>

                  </div>


                  {/* ====================================== */}
                  {/* SECURITY FOOTER                         */}
                  {/* ====================================== */}

                  <div className="
                    mt-6
                    flex
                    items-center
                    gap-3
                    border-t
                    border-slate-800
                    pt-5
                  ">

                    <ShieldCheck
                      size={18}
                      className="text-green-400"
                    />

                    <span className="text-xs text-slate-500">

                      Access is restricted to documents
                      issued to your authenticated account.

                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

      </div>

    </Layout>

  );
}
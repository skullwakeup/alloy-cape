import { useState } from "react";

import {
  KeyRound,
  Search,
  Copy,
  Check,
} from "lucide-react";

import {
  getCopyPasswordByRecipient,
} from "../../services/document/documentSupabaseService";


export default function PasswordRetrievalCard() {

  const [email, setEmail] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleRetrieve() {

    setError("");
    setResult(null);
    setCopied(false);

    if (!email.trim()) {
      setError(
        "Please enter the recipient email."
      );
      return;
    }

    try {

      setLoading(true);

      const data =
        await getCopyPasswordByRecipient(
          email
        );

      if (!data) {

        setError(
          "No protected copy was found for this email address."
        );

        return;
      }

      if (!data.password) {

        setError(
          "The protected copy was found, but no password is stored for it."
        );

        return;
      }

      setResult(data);

    } catch (err) {

      console.error(
        "PASSWORD RETRIEVAL ERROR",
        err
      );

      setError(
        err?.message ??
        "Failed to retrieve password."
      );

    } finally {

      setLoading(false);

    }
  }


  async function handleCopy() {

    if (!result?.password) return;

    try {

      await navigator.clipboard.writeText(
        result.password
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (err) {

      console.error(
        "COPY PASSWORD ERROR",
        err
      );

    }
  }


  return (

    <div className="mt-6 rounded-3xl border border-slate-700 bg-[#111B33] p-6">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-cyan-500/10 p-3">

          <KeyRound
            size={22}
            className="text-cyan-400"
          />

        </div>

        <div>

          <h2 className="text-xl font-semibold text-white">
            Retrieve Protected File Password
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Enter the recipient email to retrieve
            the password for their protected copy.
          </p>

        </div>

      </div>


      <div className="mt-6">

        <label className="mb-2 block text-sm font-medium text-slate-300">
          Recipient Email
        </label>

        <div className="flex gap-3">

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                handleRetrieve();
              }

            }}
            placeholder="recipient@example.com"
            className="
              flex-1
              rounded-xl
              border
              border-slate-700
              bg-[#16213A]
              px-4
              py-3
              text-white
              outline-none
              placeholder:text-slate-500
              focus:border-cyan-400
            "
          />


          <button
            type="button"
            onClick={handleRetrieve}
            disabled={loading}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-cyan-500
              px-5
              py-3
              font-semibold
              text-[#08111F]
              transition
              hover:bg-cyan-400
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            <Search size={18} />

            {loading
              ? "Searching..."
              : "Retrieve Password"}

          </button>

        </div>

      </div>


      {error && (

        <div className="
          mt-4
          rounded-xl
          border
          border-red-500/30
          bg-red-500/10
          px-4
          py-3
          text-sm
          text-red-400
        ">

          {error}

        </div>

      )}


      {result && (

        <div className="
          mt-6
          rounded-2xl
          border
          border-green-500/30
          bg-green-500/5
          p-5
        ">

          <div className="mb-4">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Protected Copy
            </p>

            <p className="mt-1 font-semibold text-white">
              {result.fileName ??
                "Protected Document"}
            </p>

          </div>


          <div className="grid gap-4 md:grid-cols-2">

            <div>

              <p className="text-xs text-slate-500">
                Recipient
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {result.recipient}
              </p>

            </div>


            <div>

              <p className="text-xs text-slate-500">
                Copy ID
              </p>

              <p className="mt-1 font-mono text-sm text-cyan-400">
                {result.copyId}
              </p>

            </div>

          </div>


          <div className="mt-5">

            <p className="mb-2 text-xs text-slate-500">
              PDF Password
            </p>

            <div className="flex gap-3">

              <div className="
                flex-1
                rounded-xl
                border
                border-slate-700
                bg-[#0B1224]
                px-4
                py-3
                font-mono
                text-green-400
                break-all
              ">

                {result.password}

              </div>


              <button
                type="button"
                onClick={handleCopy}
                className="
                  flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-700
                  bg-[#16213A]
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:border-cyan-400
                  hover:text-cyan-400
                "
              >

                {copied ? (
                  <>
                    <Check size={17} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={17} />
                    Copy
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}
import {
  ShieldCheck,
  Fingerprint,
} from "lucide-react";

export default function DocumentIdentityBanner({
  document,
}) {

  if (!document?.alreadyExists) return null;

  return (

    <div className="mt-6 rounded-3xl border border-cyan-700 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-6">

      <div className="flex items-start gap-4">

        <ShieldCheck
          className="mt-1 text-cyan-400"
          size={34}
        />

        <div className="flex-1">

          <h3 className="text-xl font-bold text-cyan-300">

            Existing Document Detected

          </h3>

          <p className="mt-2 text-slate-300">

            This PDF has already been registered in the Alloy Cape
            Registry. The original document identity has been
            preserved.

          </p>

          <div className="mt-5 rounded-xl bg-[#16213A] p-4">

            <div className="flex items-center gap-3">

              <Fingerprint
                className="text-cyan-400"
                size={20}
              />

              <span className="font-semibold text-white">

                {document.dna_id}

              </span>

            </div>

          </div>

          <p className="mt-4 text-sm text-slate-400">

            New recipient-specific protected copies have been
            generated using the existing document identity.

          </p>

        </div>

      </div>

    </div>

  );

}
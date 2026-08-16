import { ShieldCheck, Loader2 } from "lucide-react";
import useGenerateDNA from "../../hooks/useGenerateDNA";
import { useIssue } from "../../context/IssueContext";

export default function GenerateCard() {

  const {

    generationProgress,

    generationStatus,

  } = useIssue();

  const {

    generateDNA,

    isGenerating,

  } = useGenerateDNA();

  return (

    <div className="bg-[#16213A] border border-slate-800 rounded-2xl p-8">

      <h2 className="text-2xl font-bold mb-3">

        Ready to Generate

      </h2>

      <p className="text-slate-400 mb-8">

        Alloy Cape will generate a unique Document DNA
        for every recipient and package all protected
        copies into a downloadable ZIP archive.

      </p>

      <button

        onClick={generateDNA}

        disabled={isGenerating}

        className={`
          w-full
          rounded-xl
          py-4
          font-semibold
          flex
          justify-center
          items-center
          gap-3
          transition-all
          duration-300

          ${
            isGenerating
              ? "bg-slate-700 text-slate-300 cursor-not-allowed"
              : "bg-yellow-400 text-black hover:scale-[1.02]"
          }
        `}

      >

        {isGenerating ? (

          <>

            <Loader2
              size={22}
              className="animate-spin"
            />

            Generating...

          </>

        ) : (

          <>

            <ShieldCheck size={22} />

            Generate Document DNA

          </>

        )}

      </button>

      {generationStatus && (

        <div className="mt-8">

          <div className="flex justify-between mb-2">

            <span className="font-medium">

              {generationStatus}

            </span>

            <span>

              {generationProgress}%

            </span>

          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

            <div

              className="bg-yellow-400 h-3 rounded-full transition-all duration-500"

              style={{
                width: `${generationProgress}%`,
              }}

            />

          </div>

        </div>

      )}

    </div>

  );

}
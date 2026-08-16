import { ShieldCheck } from "lucide-react";

export default function ReportHeader({ report }) {
  return (
    <div className="rounded-3xl bg-[#16213A] border border-slate-700 p-8">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            {report.document.fileName}
          </h1>

          <p className="text-slate-400 mt-2">
            Report ID: {report.reportId}
          </p>

        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2">

          <ShieldCheck className="text-green-400"/>

          <span className="text-green-400 font-semibold">
            VERIFIED
          </span>

        </div>

      </div>

    </div>
  );
}
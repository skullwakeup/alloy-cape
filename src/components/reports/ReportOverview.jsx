export default function ReportOverview({ report }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">

      <Info title="DNA" value={report.document.dnaId} />

      <Info title="Recipient" value={report.document.recipient} />

      <Info title="Classification" value={report.document.classification} />

      <Info title="SHA-256" value={report.document.sha256} />

      <Info title="Confidence" value={`${report.ai.confidence}%`} />

      <Info title="Risk" value={report.ai.riskLevel} />

      <Info title="Risk Score" value={report.ai.riskScore} />

      <Info title="Model" value={report.ai.model} />

      <Info
        title="Generated"
        value={new Date(report.ai.generatedAt).toLocaleString()}
      />

    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="rounded-2xl bg-[#111B33] p-5">

      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <p className="mt-2 font-semibold break-all">
        {value || "-"}
      </p>

    </div>
  );
}
export default function ReportSection({ title, text }) {
  return (
    <div className="rounded-2xl bg-[#111B33] p-6 mt-6">

      <h2 className="text-2xl font-bold mb-4">
        {title}
      </h2>

      <p className="leading-8 text-slate-300 whitespace-pre-wrap">
        {text || "No information available."}
      </p>

    </div>
  );
}
export default function AnalyticsCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-[#111B33] p-6 shadow-xl">

      <h3 className="mb-6 text-lg font-semibold text-white">
        {title}
      </h3>

      {children}

    </div>
  );
}
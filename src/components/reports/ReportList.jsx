export default function ReportList({ title, items = [] }) {
  return (
    <div className="rounded-2xl bg-[#111B33] p-6 mt-6">

      <h2 className="text-2xl font-bold mb-4">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="text-slate-400">
          No data available.
        </p>
      ) : (
        <ul className="space-y-3">

          {items.map((item, index) => (
            <li
              key={index}
              className="flex gap-3 text-slate-300"
            >
              <span className="text-green-400">
                ✓
              </span>

              <span>{item}</span>

            </li>
          ))}

        </ul>
      )}

    </div>
  );
}
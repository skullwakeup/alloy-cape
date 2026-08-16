function Progress({
  label,
  value,
  total,
  color,
}) {
  const percent =
    total === 0
      ? 0
      : (value / total) * 100;

  return (
    <div>

      <div className="mb-3 flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold text-white">
            {label}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {percent.toFixed(0)}% of investigations
          </p>

        </div>

        <div className="text-right">

          <span className="text-2xl font-bold text-white">
            {value}
          </span>

        </div>

      </div>

      <div className="h-4 overflow-hidden rounded-full bg-slate-700">

        <div
          className={`${color} h-full rounded-full transition-all duration-1000`}
          style={{
            width: `${percent}%`,
          }}
        />

      </div>

    </div>
  );
}

export default function IntegrityDistribution({
  security,
}) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-8 shadow-2xl">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-white">
          Integrity Distribution
        </h2>

        <p className="mt-2 text-slate-400">
          Distribution of document integrity across all investigations.
        </p>

      </div>

      <div className="space-y-8">

        <Progress
          label="Excellent (90–100%)"
          value={security.excellent}
          total={security.total}
          color="bg-green-500"
        />

        <Progress
          label="Good (70–89%)"
          value={security.good}
          total={security.total}
          color="bg-yellow-500"
        />

        <Progress
          label="Poor (Below 70%)"
          value={security.poor}
          total={security.total}
          color="bg-red-500"
        />

      </div>

    </div>
  );
}
import { Search } from "lucide-react";

export default function AnalyticsFilters({
  filters,
  setFilters,
  classifications,
  recipients,
}) {
  return (
    <div className="mt-8 rounded-3xl border border-slate-700 bg-[#16213A] p-6">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          Analytics Filters
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Filter analytics by classification, status, recipient and keywords.
        </p>

      </div>

      <div className="grid gap-4 lg:grid-cols-3">

        <select
          className="
          rounded-xl
          border
          border-slate-700
          bg-[#111B33]
          p-3
          text-white
          outline-none
          transition-all
          duration-300
          focus:border-cyan-400
          focus:ring-2
          focus:ring-cyan-500/20
          "
          value={filters.classification}
          onChange={(e) =>
            setFilters({
              ...filters,
              classification: e.target.value,
            })
          }
        >
          <option value="">All Classifications</option>

          {classifications.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}

        </select>

        <select
          className="
          rounded-xl
          border
          border-slate-700
          bg-[#111B33]
          p-3
          text-white
          outline-none
          transition-all
          duration-300
          focus:border-cyan-400
          focus:ring-2
          focus:ring-cyan-500/20
          "
          value={filters.recipient}
          onChange={(e) =>
            setFilters({
              ...filters,
              recipient: e.target.value,
            })
          }
        >
          <option value="">All Recipients</option>

          {recipients.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}

        </select>

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-4 text-slate-500"
          />

          <input
            placeholder="Search document, recipient or classification..."
            className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-[#111B33]
            py-3
            pl-10
            pr-3
            text-white
            outline-none
            transition-all
            duration-300
            focus:border-cyan-400
            focus:ring-2
            focus:ring-cyan-500/20
            "
            value={filters.search}
            onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value,
              })
            }
          />

        </div>

      </div>

      <button
        onClick={() =>
          setFilters({
              classification:"",
              recipient:"",
              search:"",
          })
        }
        className="
        mt-5
        rounded-lg
        border
        border-cyan-500/20
        bg-cyan-500/10
        px-4
        py-2
        text-sm
        font-medium
        text-cyan-400
        transition
        hover:bg-cyan-500/20
        "
      >
        Clear Filters
      </button>

    </div>
  );
}
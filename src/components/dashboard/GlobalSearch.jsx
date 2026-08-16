import { useState } from "react";
import {
  Search,
  FileText,
  ScanSearch,
  Bot,
} from "lucide-react";

import { globalSearch } from "../../services/search/searchService";

export default function GlobalSearch() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {

    const value = e.target.value;

    setQuery(value);

    if (!value.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);

    try {

      const data = await globalSearch(value);

      setResults(data);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="relative">

      <div className="flex items-center rounded-3xl border border-cyan-700/30 bg-[#16213A] px-6 py-5 shadow-xl">

        <Search
          className="text-cyan-400"
          size={22}
        />

        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search documents, recipients, DNA IDs, investigators, AI reports..."
          className="
            ml-4
            w-full
            bg-transparent
            text-white
            text-lg
            outline-none
            placeholder:text-slate-500
          "
        />

      </div>

      {loading && (

        <div className="absolute mt-3 w-full rounded-3xl border border-slate-700 bg-[#16213A] p-8 text-center text-slate-400 shadow-2xl z-50">

          Searching...

        </div>

      )}

      {!loading && results && (

        <div className="absolute z-50 mt-3 w-full rounded-3xl border border-slate-700 bg-[#16213A] p-6 shadow-2xl">

          <SearchSection
            title="Documents"
            icon={FileText}
            items={results.documents}
            field="title"
          />

          <SearchSection
            title="Investigations"
            icon={ScanSearch}
            items={results.investigations}
            field="investigator"
          />

          <SearchSection
            title="AI Reports"
            icon={Bot}
            items={results.reports}
            field="executive_summary"
          />

        </div>

      )}

    </div>

  );

}

function SearchSection({
  title,
  icon: Icon,
  items,
  field,
}) {

  return (

    <div className="mb-8 last:mb-0">

      <div className="mb-4 flex items-center gap-3">

        <Icon
          size={18}
          className="text-cyan-400"
        />

        <h2 className="text-lg font-bold text-cyan-400">

          {title}

        </h2>

      </div>

      {items.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-500">

          No matching results.

        </div>

      ) : (

        items.slice(0,5).map(item=>(

          <div
            key={item.id}
            className="
              mb-3
              rounded-2xl
              border
              border-slate-700
              bg-[#111B33]
              p-4
              transition
              hover:border-cyan-500
              hover:bg-[#19284A]
              cursor-pointer
            "
          >

            <p className="font-semibold text-white">

              {item[field]}

            </p>

          </div>

        ))

      )}

    </div>

  );

}
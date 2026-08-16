import {
  FileText,
  ShieldCheck,
  Search,
  Brain,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

const icons = {
  documents: FileText,
  investigations: Search,
  integrity: ShieldCheck,
  confidence: Brain,
};

export default function StatCard({

  icon,

  title,

  value,

  color,

  subtitle,

}) {

  const Icon = icons[icon];

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {

    const numeric =
      typeof value === "number"
        ? value
        : parseInt(value);

    if (isNaN(numeric)) {

      setDisplayValue(value);

      return;

    }

    let current = 0;

    const duration = 1200;

    const fps = 60;

    const increment =
      Math.max(
        1,
        Math.ceil(
          numeric /
          (duration / (1000 / fps))
        )
      );

    const timer = setInterval(() => {

      current += increment;

      if (current >= numeric) {

        current = numeric;

        clearInterval(timer);

      }

      setDisplayValue(current);

    }, 1000 / fps);

    return () => clearInterval(timer);

  }, [value]);

  return (

    <div
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-slate-700
      bg-[#16213A]
      p-6
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-cyan-400
      hover:shadow-[0_0_40px_rgba(6,182,212,.18)]
      "
    >

      {/* Background Glow */}

      <div

        className="
        absolute
        -right-16
        -top-16
        h-44
        w-44
        rounded-full
        blur-3xl
        opacity-20
        transition
        group-hover:opacity-40
        "

        style={{
          background: color,
        }}

      />

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">

            {title}

          </p>

          <h2

            className="mt-5 text-5xl font-black"

            style={{
              color,
            }}

          >

            {displayValue}

            {

              typeof value === "string" &&
              value.includes("%")

                ? "%"

                : ""

            }

          </h2>

          <p className="mt-4 text-sm text-slate-500">

            {subtitle}

          </p>

        </div>

        <div

          className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          backdrop-blur
          "

          style={{
            background: `${color}22`,
          }}

        >

          <Icon

            size={30}

            style={{
              color,
            }}

          />

        </div>

      </div>

      {/* Bottom */}

      <div className="mt-8 flex items-center justify-between border-t border-slate-700 pt-4">

        <span className="text-sm font-semibold text-green-400">

          ● Live

        </span>

        <span className="text-sm text-slate-500">

          Enterprise

        </span>

      </div>

      {/* Accent */}

      <div

        className="
        absolute
        bottom-0
        left-0
        h-1
        w-0
        transition-all
        duration-500
        group-hover:w-full
        "

        style={{
          background: color,
        }}

      />

    </div>

  );

}
export default function RiskDistribution({ data }) {

  const total =
    data.High +
    data.Medium +
    data.Low;

  const risks = [

    {
      label: "High",
      value: data.High,
      color: "bg-red-500",
      dot: "bg-red-500",
    },

    {
      label: "Medium",
      value: data.Medium,
      color: "bg-yellow-500",
      dot: "bg-yellow-500",
    },

    {
      label: "Low",
      value: data.Low,
      color: "bg-green-500",
      dot: "bg-green-500",
    },

  ];

  return (

    <div
      className="
        group
        rounded-3xl
        border
        border-slate-700
        bg-[#16213A]
        p-6
        transition-all
        duration-300
        hover:border-cyan-400
        hover:shadow-[0_0_30px_rgba(6,182,212,.12)]
      "
    >

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-white">

            Risk Distribution

          </h2>

          <p className="mt-1 text-sm text-slate-500">

            Investigation Risk Levels

          </p>

        </div>

        <span className="text-sm font-semibold text-green-400">

          ● LIVE

        </span>

      </div>

      <div className="space-y-6">

        {

          risks.map((risk) => (

            <div key={risk.label}>

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className={`h-3 w-3 rounded-full ${risk.dot}`}
                  />

                  <span className="font-medium text-white">

                    {risk.label}

                  </span>

                </div>

                <span className="font-semibold text-white">

                  {risk.value}

                  {

                    total > 0 && (

                      <span className="ml-2 text-sm text-slate-400">

                        (

                        {

                          Math.round(
                            (risk.value / total) * 100
                          )

                        }

                        %)

                      </span>

                    )

                  }

                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-700">

                <div

                  className={`${risk.color} h-full rounded-full transition-all duration-1000`}

                  style={{

                    width:

                      total === 0

                        ? "0%"

                        : `${(risk.value / total) * 100}%`,

                  }}

                />

              </div>

            </div>

          ))

        }

      </div>

      <div className="mt-6 border-t border-slate-700 pt-4">

        <p className="text-xs text-slate-500">

          Live Enterprise Dashboard

        </p>

      </div>

    </div>

  );

}
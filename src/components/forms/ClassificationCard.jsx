import { useIssue } from "../../context/IssueContext";
import {
  Globe,
  Building2,
  Shield,
  Lock,
} from "lucide-react";

const options = [
  {
    title: "Public",
    icon: Globe,
    color: "border-green-500",
  },
  {
    title: "Internal",
    icon: Building2,
    color: "border-blue-500",
  },
  {
    title: "Confidential",
    icon: Shield,
    color: "border-yellow-400",
  },
  {
    title: "Restricted",
    icon: Lock,
    color: "border-red-500",
  },
];

export default function ClassificationCard() {

  const {
    classification,
    setClassification,
  } = useIssue();

  return (

    <div className="bg-[#16213A] border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-6">

        Classification

      </h2>

      <div className="grid grid-cols-2 gap-4">

        {options.map((item) => {

          const Icon = item.icon;

          const active = classification === item.title;

          return (

            <button
              key={item.title}
              onClick={() => setClassification(item.title)}
              className={`
              p-5 rounded-2xl border
              transition-all
              ${
                active
                  ? `${item.color} bg-[#0F172A] scale-[1.02]`
                  : "border-slate-700 hover:border-slate-500"
              }
              `}
            >

              <Icon
                size={32}
                className="mx-auto mb-3 text-yellow-400"
              />

              <h3 className="font-semibold">

                {item.title}

              </h3>

            </button>

          );

        })}

      </div>

    </div>

  );

}
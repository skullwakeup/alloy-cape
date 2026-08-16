import {
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getRecentActivities,
} from "../services/activity/activityService";

const icons = {
  document: FileText,
  investigation: Search,
  security: ShieldCheck,
};

function shortenFilename(text, max = 55) {
  if (!text) return "";

  if (text.length <= max) return text;

  const dot = text.lastIndexOf(".");

  if (dot !== -1) {
    const ext = text.substring(dot);

    return (
      text.substring(0, max - ext.length - 3) +
      "..." +
      ext
    );
  }

  return text.substring(0, max) + "...";
}

export default function ActivityTimeline() {

  const [
    activities,
    setActivities,
  ] = useState([]);

  useEffect(() => {

    getRecentActivities()
      .then(setActivities)
      .catch(console.error);

  }, []);

  function timeAgo(date) {

    const diff = Math.floor(
      (Date.now() - new Date(date)) / 60000
    );

    if (diff < 1) return "Just now";

    if (diff < 60)
      return `${diff} min ago`;

    if (diff < 1440)
      return `${Math.floor(diff / 60)} hr ago`;

    return `${Math.floor(diff / 1440)} day ago`;

  }

  return (

    <div className="rounded-3xl border border-slate-700 bg-[#16213A] p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold text-white">
          Live Activity
        </h2>

        <span className="text-sm font-semibold text-green-400">
          ● LIVE
        </span>

      </div>

      <div className="space-y-4">

        {activities.length === 0 ? (

          <div className="py-10 text-center text-slate-500">
            No recent activity
          </div>

        ) : (

          activities.map((activity) => {

            const Icon =
              icons[activity.type] ??
              ShieldCheck;

            return (

              <div
                key={activity.id}
                className="
                  flex
                  items-start
                  gap-4
                  rounded-2xl
                  border
                  border-slate-700
                  bg-[#111B33]
                  p-4
                  transition
                  hover:border-cyan-500
                  hover:bg-[#182544]
                "
              >

                <div className="rounded-xl bg-cyan-500/20 p-3">

                  <Icon
                    size={18}
                    className="text-cyan-400"
                  />

                </div>

                <div className="min-w-0 flex-1">

                  <p
                    className="
                      text-white
                      break-words
                      leading-7
                    "
                    style={{
                      overflowWrap: "anywhere",
                    }}
                    title={activity.title}
                  >
                    {shortenFilename(activity.title)}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">

                    {timeAgo(
                      activity.createdAt ??
                        activity.created_at
                    )}

                  </p>

                </div>

              </div>

            );

          })

        )}

      </div>

    </div>

  );

}
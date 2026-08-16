import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import Layout from "../components/Layout";
import HeroBanner from "../components/HeroBanner";
import StatCard from "../components/StatCard";
import SecurityAnalytics from "../components/SecurityAnalytics";
import ActivityTimeline from "../components/ActivityTimeline";
import SystemHealth from "../components/SystemHealth";
import RecentDocuments from "../components/RecentDocuments";
import QuickActions from "../components/QuickActions";
import RiskDistribution from "../components/dashboard/RiskDistribution";
import { getDashboardStatistics } from "../services/dashboard/dashboardService";
import SecurityOverview from "../components/dashboard/SecurityOverview";
import ExecutiveInsights from "../components/dashboard/ExecutiveInsights";
import GlobalSearch from "../components/dashboard/GlobalSearch";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardStatistics();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Layout>

        <div className="animate-pulse">

          <div className="h-64 rounded-3xl bg-[#16213A] mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {[1,2,3,4].map(i => (

              <div
                key={i}
                className="h-44 rounded-3xl bg-[#16213A]"
              />

            ))}

          </div>

          <div className="h-96 rounded-3xl bg-[#16213A] mt-10" />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">

            <div className="h-80 rounded-3xl bg-[#16213A]" />

            <div className="h-80 rounded-3xl bg-[#16213A]" />

          </div>

        </div>

      </Layout>
    );
  }

  return (
    <Layout>

      <HeroBanner stats={stats} />

      {/* Enterprise Global Search */}
      <div className="mt-8 mb-10">
        <GlobalSearch />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          icon="documents"
          title="Protected Documents"
          value={stats.documentCount}
          color="#facc15"
          subtitle="Stored in Registry"
        />

        <StatCard
          icon="investigations"
          title="Investigations"
          value={stats.investigationCount}
          color="#ef4444"
          subtitle="Completed Cases"
        />

        <StatCard
          icon="integrity"
          title="Average Integrity"
          value={`${stats.averageIntegrity}%`}
          color="#22c55e"
          subtitle="Across All Documents"
        />

        <StatCard
          icon="confidence"
          title="AI Confidence"
          value={`${stats.averageConfidence}%`}
          color="#8b5cf6"
          subtitle="Gemini Analysis"
        />

      </div>

      <div className="mt-10 grid grid-cols-1 xl:grid-cols-2 gap-6">

        <SecurityOverview stats={stats} />

        <RiskDistribution
          data={stats.riskDistribution}
        />

      </div>

      <div className="mt-10">
        <SecurityAnalytics />
      </div>

      <div className="mt-10">
        <ExecutiveInsights stats={stats} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <ActivityTimeline />
        <SystemHealth />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <RecentDocuments />
        <QuickActions />
      </div>

    </Layout>
  );
}
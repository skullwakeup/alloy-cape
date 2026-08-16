import { useMemo } from "react";
import SecurityHealth from "../components/security/SecurityHealth";
import ThreatSummary from "../components/security/ThreatSummary";
import IntegrityDistribution from "../components/security/IntegrityDistribution";
import RecentSecurityEvents from "../components/security/RecentSecurityEvents";
import QuickActions from "../components/security/QuickActions";
import AISecurityInsights from "../components/security/AISecurityInsights";

import Layout from "../components/Layout";
import { useInvestigations } from "../context/InvestigationContext";

export default function Security() {

  const { investigations } = useInvestigations();

  const security = useMemo(() => {

    const total = investigations.length;

    const verified = investigations.filter(
      (r) => r.success
    ).length;

    const highRisk = investigations.filter(
      (r) => (r.risk || "") === "High"
    ).length;

    const mediumRisk = investigations.filter(
      (r) => (r.risk || "") === "Medium"
    ).length;

    const averageIntegrity =
      total > 0
        ? investigations.reduce(
            (sum, r) => sum + (r.integrity ?? 0),
            0
          ) / total
        : 100;

    const healthScore = Math.round(
      averageIntegrity * 0.7 +
      (verified / Math.max(total, 1)) * 100 * 0.3
    );

    const excellent = investigations.filter(
      (r) => (r.integrity ?? 0) >= 90
    ).length;

    const good = investigations.filter(
      (r) =>
        (r.integrity ?? 0) >= 70 &&
        (r.integrity ?? 0) < 90
    ).length;

    const poor = investigations.filter(
      (r) => (r.integrity ?? 0) < 70
    ).length;

    const recentEvents = investigations
      .slice()
      .sort(
        (a, b) =>
          new Date(b.investigatedAt) -
          new Date(a.investigatedAt)
    )
    .slice(0, 8);

    return {
      total,
      verified,
      highRisk,
      mediumRisk,
      healthScore,
      excellent,
      good,
      poor,
      recentEvents,
    };

  }, [investigations]);


  return (

    <Layout>

      <div className="space-y-10">

        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-[#0B1220] via-[#111C33] to-[#16213A] p-8">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-4xl font-black text-white">
                Security Operations Center
              </h1>

              <p className="mt-3 max-w-3xl text-slate-400 leading-7">
                Monitor document integrity, investigate security incidents,
                evaluate forensic evidence and maintain the health of the
                Alloy Cape document protection ecosystem.
              </p>

            </div>

            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4">

              <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />

                <span className="font-semibold text-green-400">

                  SYSTEM SECURE

                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Health Score */}

        <SecurityHealth
            healthScore={security.healthScore}
        />

        {/* Summary */}

        <ThreatSummary
            security={security}
        />

        {/* Integrity Distribution */}

        <IntegrityDistribution
          security={security}
        />

        {/* Recent Security Events */}

        <RecentSecurityEvents
          security={security}
        />

        <QuickActions />

        <AISecurityInsights
          security={security}
        />

      </div>

    </Layout>

  );

}

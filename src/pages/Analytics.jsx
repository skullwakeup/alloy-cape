import { useMemo, useState } from "react";

import Layout from "../components/Layout";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import AnalyticsFilters from "../components/analytics/AnalyticsFilters";
import KPICards from "../components/analytics/KPICards";
import SecurityAnalytics from "../components/SecurityAnalytics";
import ClassificationPieChart from "../components/analytics/ClassificationPieChart";
import TopRecipientsChart from "../components/analytics/TopRecipientsChart";
import InvestigationTrendChart from "../components/analytics/InvestigationTrendChart";
import RecentActivity from "../components/analytics/RecentActivity";
import DocumentInsights from "../components/analytics/DocumentInsights";

import { useInvestigations } from "../context/InvestigationContext";

export default function Analytics() {

  const { investigations } = useInvestigations();

  const [filters, setFilters] = useState({
    classification: "",
    recipient: "",
    search: "",
  });

  const classifications = useMemo(() => {

    return [
      ...new Set(
        investigations
          .map(inv => inv.classification)
          .filter(Boolean)
      ),
    ];

  }, [investigations]);

  const recipients = useMemo(() => {

    return [
      ...new Set(
        investigations.flatMap(inv => inv.recipients || [])
      ),
    ];

  }, [investigations]);

  const filteredInvestigations = useMemo(() => {

    return investigations.filter(inv => {

      const matchesClassification =
        !filters.classification ||
        inv.classification === filters.classification;


      const matchesRecipient =
        !filters.recipient ||
        (inv.recipients || []).includes(filters.recipient);

      const q = filters.search.trim().toLowerCase();

      const matchesSearch =
        !q ||

        inv.fileName?.toLowerCase().includes(q) ||

        inv.investigator?.toLowerCase().includes(q) ||

        inv.classification?.toLowerCase().includes(q) ||

        inv.risk?.toLowerCase().includes(q) ||

        (inv.recipients || []).some(r =>
          r.toLowerCase().includes(q)
        );

      return (

        matchesClassification &&

        matchesRecipient &&

        matchesSearch

      );

    });

  }, [investigations, filters]);

  return (

    <Layout>

      <AnalyticsHeader />

      <AnalyticsFilters
        filters={filters}
        setFilters={setFilters}
        classifications={classifications}
        recipients={recipients}
      />

      <div className="mt-8">

        <KPICards
          investigations={filteredInvestigations}
        />

      </div>

      <div className="mt-8">

        <SecurityAnalytics />

      </div>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">

        <ClassificationPieChart
          investigations={filteredInvestigations}
        />

        <TopRecipientsChart
          investigations={filteredInvestigations}
        />

      </div>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">

        <InvestigationTrendChart
          investigations={filteredInvestigations}
        />

        <RecentActivity
          investigations={filteredInvestigations}
        />

      </div>

      <div className="mt-8">

        <DocumentInsights
          investigations={filteredInvestigations}
        />

      </div>

    </Layout>

  );

}
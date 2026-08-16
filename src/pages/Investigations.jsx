import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import InvestigationUpload from "../components/investigation/InvestigationUpload";
import InvestigationResult from "../components/investigation/InvestigationResult";
import InvestigationScanner from "../components/investigation/InvestigationScanner";

import {
  getActiveReport,
  clearActiveReport,
} from "../services/investigation/activeReportService";
import useInvestigation from "../hooks/useInvestigation";

export default function Investigations() {
  const {
    loading,
    result,
    investigate,
  } = useInvestigation();

  const [showScanner, setShowScanner] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [activeReport, setActiveReport] = useState(null);

  useEffect(() => {
    if (loading) {
      setShowScanner(true);
      setShowResult(false);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && result) {
      // Wait for scanner to finish before showing the result
    }
  }, [loading, result]);

  useEffect(() => {
    const report = getActiveReport();

    if (report) {
      setActiveReport(report);
      clearActiveReport();

      setShowResult(true);
      setShowScanner(false);
    }
  }, []);

  const handleScannerComplete = () => {
    setShowScanner(false);
    setShowResult(true);
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-2">
        DNA Inspector
      </h1>

      <p className="text-slate-400 mb-8">
        Upload a protected PDF to identify its original recipient.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">

        <InvestigationUpload
          onFile={investigate}
        />

        <div>

          {showScanner && (
            <InvestigationScanner
              onComplete={handleScannerComplete}
            />
          )}

          {!showScanner && showResult && (
            <InvestigationResult
              result={activeReport || result}
            />
          )}

        </div>

      </div>
    </Layout>
  );
}
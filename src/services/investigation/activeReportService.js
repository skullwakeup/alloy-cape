const ACTIVE_REPORT_KEY = "active-investigation-report";

export function setActiveReport(report) {
  sessionStorage.setItem(
    ACTIVE_REPORT_KEY,
    JSON.stringify(report)
  );
}

export function getActiveReport() {
  const data = sessionStorage.getItem(
    ACTIVE_REPORT_KEY
  );

  return data ? JSON.parse(data) : null;
}

export function clearActiveReport() {
  sessionStorage.removeItem(
    ACTIVE_REPORT_KEY
  );
}
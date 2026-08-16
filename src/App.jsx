import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import IssueDocument from "./pages/IssueDocument";
import Investigations from "./pages/Investigations";
import Analytics from "./pages/Analytics";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import DNARegistry from "./pages/DNARegistry";
import Reports from "./pages/Reports";
import ReportViewer from "./pages/ReportViewer";
import Login from "./pages/Login";
import EmployeeDocuments from "./pages/EmployeeDocuments";

import {
  useAuth,
} from "./context/AuthContext";


function LoadingScreen() {

  return (

    <div className="flex min-h-screen items-center justify-center bg-[#070D1A]">

      <div className="text-center">

        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

        <p className="text-sm text-slate-400">
          Loading Alloy Cape...
        </p>

      </div>

    </div>

  );

}


function ProtectedRoute() {

  const {
    user,
    loading,
    profile,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  /*
   * User exists but the profile is still being
   * resolved. Do NOT redirect yet.
   */

  if (!profile) {
    return <LoadingScreen />;
  }

  return <Outlet />;

}


function RoleRoute({
  allowedRoles,
}) {

  const {
    role,
    loading,
    profile,
  } = useAuth();

  if (loading || !profile) {
    return <LoadingScreen />;
  }

  if (!role) {
    return <LoadingScreen />;
  }

  if (!allowedRoles.includes(role)) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }

  return <Outlet />;

}


function RoleLanding() {

  const {
    role,
    loading,
    profile,
  } = useAuth();

  if (loading || !profile) {
    return <LoadingScreen />;
  }

  if (role === "employee") {

    return (
      <Navigate
        to="/employee"
        replace
      />
    );

  }

  if (
    role === "administrator" ||
    role === "security_officer"
  ) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }

  return (
    <Navigate
      to="/login"
      replace
    />
  );

}


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================================================= */}
        {/* PUBLIC                                            */}
        {/* ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================================================= */}
        {/* AUTHENTICATED                                     */}
        {/* ================================================= */}

        <Route
          element={<ProtectedRoute />}
        >


          {/* ============================================= */}
          {/* ROOT                                          */}
          {/* ============================================= */}

          <Route
            path="/"
            element={<RoleLanding />}
          />


          {/* ============================================= */}
          {/* ADMIN + SECURITY OFFICER                      */}
          {/* ============================================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "administrator",
                  "security_officer",
                ]}
              />
            }
          >

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/investigations"
              element={<Investigations />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/reports/:id"
              element={<ReportViewer />}
            />

            <Route
              path="/registry"
              element={<DNARegistry />}
            />

            <Route
              path="/security"
              element={<Security />}
            />

          </Route>


          {/* ============================================= */}
          {/* ADMIN ONLY                                     */}
          {/* ============================================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "administrator",
                ]}
              />
            }
          >

            <Route
              path="/issue"
              element={<IssueDocument />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>


          {/* ============================================= */}
          {/* EMPLOYEE ONLY                                  */}
          {/* ============================================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "employee",
                ]}
              />
            }
          >

            <Route
              path="/employee"
              element={
                <EmployeeDocuments />
              }
            />

          </Route>


          {/* ============================================= */}
          {/* UNKNOWN AUTHENTICATED ROUTE                   */}
          {/* ============================================= */}

          <Route
            path="*"
            element={<RoleLanding />}
          />

        </Route>


        {/* ================================================ */}
        {/* UNKNOWN PUBLIC ROUTE                             */}
        {/* ================================================ */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;
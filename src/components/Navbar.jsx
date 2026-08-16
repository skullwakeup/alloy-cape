import {
  Bell,
  Search,
  UserCircle2,
  ShieldCheck,
  Activity,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  ScanSearch,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useIssue } from "../context/IssueContext";
import { useInvestigations } from "../context/InvestigationContext";

export default function Navbar() {

  const {
    role,
    profile,
    signOut,
  } = useAuth();

  const {
    registry,
    searchQuery,
    setSearchQuery,
  } = useIssue();

  const {
    investigations,
  } = useInvestigations();

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const [
    signingOut,
    setSigningOut,
  ] = useState(false);


  // =========================================================
  // ROLE
  // =========================================================

  const isEmployee =
    role === "employee";

  const isAdministrator =
    role === "administrator";

  const isSecurityOfficer =
    role === "security_officer";


  // =========================================================
  // EMPLOYEE NAVBAR
  // =========================================================

  if (isEmployee) {

    async function handleSignOut() {

      try {

        setSigningOut(true);

        await signOut();

      } catch (error) {

        console.error(
          "SIGN OUT ERROR:",
          error
        );

        setSigningOut(false);

      }

    }

    return (

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-slate-800
          bg-[#0D162B]/95
          backdrop-blur-xl
        "
      >

        <div
          className="
            flex
            h-20
            items-center
            justify-between
            px-6
          "
        >

          {/* Brand */}

          <div>

            <div className="flex items-center gap-3">

              <ShieldCheck
                size={24}
                className="text-cyan-400"
              />

              <h1
                className="
                  whitespace-nowrap
                  text-2xl
                  font-black
                  text-white
                "
              >
                Alloy Cape
              </h1>

            </div>

            <p
              className="
                ml-9
                text-xs
                text-slate-400
              "
            >
              Employee Document Portal
            </p>

          </div>


          {/* Employee status */}

          <div
            className="
              hidden
              items-center
              gap-2
              rounded-2xl
              border
              border-green-500/20
              bg-green-500/10
              px-4
              py-2
              md:flex
            "
          >

            <Activity
              size={16}
              className="
                animate-pulse
                text-green-400
              "
            />

            <div>

              <div
                className="
                  text-xs
                  font-semibold
                  text-green-400
                "
              >
                Registry Healthy
              </div>

              <div
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                Access monitored
              </div>

            </div>

          </div>


          {/* Employee account */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <UserCircle2
              size={38}
              className="text-cyan-400"
            />

            <div className="hidden sm:block">

              <div
                className="
                  font-semibold
                  text-white
                "
              >
                {profile?.full_name ||
                  "Employee"}
              </div>

              <div
                className="
                  text-xs
                  text-slate-400
                "
              >
                Employee
              </div>

            </div>


            {/* Logout */}

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              title="Sign out"
              className="
                rounded-xl
                border
                border-slate-700
                bg-[#16213A]
                p-3
                text-slate-300
                transition
                hover:border-red-500/40
                hover:bg-red-500/10
                hover:text-red-400
                disabled:opacity-50
              "
            >

              <LogOut
                size={19}
              />

            </button>

          </div>

        </div>

      </header>

    );

  }


  // =========================================================
  // ADMIN / SECURITY OFFICER NAVBAR
  // =========================================================

  const totalDocs =
    registry.length;

  const totalRecipients =
    new Set(
      registry.flatMap(
        (d) => d.recipients || []
      )
    ).size;

  const integrity =
    registry.length === 0
      ? 100
      : Math.round(
          registry.reduce(
            (sum, d) =>
              sum +
              (d.integrity ?? 100),
            0
          ) / registry.length
        );

  const highRisk =
    investigations.filter(
      (i) =>
        i.risk?.toLowerCase() ===
        "high"
    ).length;

  const criticalRisk =
    investigations.filter(
      (i) =>
        i.risk?.toLowerCase() ===
        "critical"
    ).length;

  const threat =
    criticalRisk > 0
      ? "Critical"
      : highRisk > 0
      ? "High"
      : "Low";


  const notifications = [];


  if (criticalRisk > 0) {

    notifications.push(
      `${criticalRisk} critical investigation(s) detected`
    );

  }


  if (highRisk > 0) {

    notifications.push(
      `${highRisk} high-risk investigation(s) detected`
    );

  }


  notifications.push(
    `${totalDocs} protected documents registered`
  );


  notifications.push(
    `${investigations.length} investigation(s) completed`
  );


  async function handleSignOut() {

    try {

      setSigningOut(true);

      await signOut();

    } catch (error) {

      console.error(
        "SIGN OUT ERROR:",
        error
      );

      setSigningOut(false);

    }

  }


  const displayName =
    profile?.full_name ||
    (
      isAdministrator
        ? "Administrator"
        : "Security Officer"
    );

  const roleLabel =
    isAdministrator
      ? "Administrator"
      : isSecurityOfficer
      ? "Security Officer"
      : "User";


  return (

    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-slate-800
        bg-[#0D162B]/95
        backdrop-blur-xl
      "
    >

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div
        className="
          flex
          h-16
          items-center
          justify-between
          px-6
        "
      >

        {/* Logo */}

        <div className="min-w-[340px]">

          <div className="flex items-center gap-3">

            <ShieldCheck
              size={24}
              className="text-cyan-400"
            />

            <h1
              className="
                whitespace-nowrap
                text-[28px]
                font-black
                text-white
              "
            >
              Alloy Cape Command Center
            </h1>

          </div>

          <p
            className="
              ml-9
              text-xs
              text-slate-400
            "
          >
            Enterprise Document Attribution Platform
          </p>

        </div>


        {/* Search */}

        <div
          className="
            mx-6
            hidden
            flex-1
            lg:flex
          "
        >

          <div
            className="
              flex
              w-full
              max-w-xl
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-700
              bg-[#16213A]
              px-4
              py-2
            "
          >

            <Search
              size={18}
              className="text-slate-500"
            />

            <input
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Search documents..."
              className="
                flex-1
                bg-transparent
                text-white
                outline-none
              "
            />

          </div>

        </div>


        {/* Right */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          {/* Registry */}

          <div
            className="
              hidden
              items-center
              gap-2
              rounded-2xl
              border
              border-green-500/20
              bg-green-500/10
              px-4
              py-2
              xl:flex
            "
          >

            <Activity
              size={16}
              className="
                animate-pulse
                text-green-400
              "
            />

            <div>

              <div
                className="
                  text-xs
                  font-semibold
                  text-green-400
                "
              >
                Registry Healthy
              </div>

              <div
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                Live Monitoring
              </div>

            </div>

          </div>


          {/* Notifications */}

          <div className="relative">

            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className="
                rounded-xl
                bg-[#16213A]
                p-3
                transition
                hover:bg-[#1E2D4E]
              "
            >

              <Bell
                size={20}
                className="text-white"
              />

              {notifications.length > 0 && (

                <span
                  className="
                    absolute
                    right-2
                    top-2
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {notifications.length}
                </span>

              )}

            </button>


            {showNotifications && (

              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-80
                  rounded-2xl
                  border
                  border-slate-700
                  bg-[#16213A]
                  shadow-2xl
                "
              >

                <div
                  className="
                    border-b
                    border-slate-700
                    p-4
                    font-semibold
                    text-white
                  "
                >
                  Notifications
                </div>


                {notifications.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="
                        border-b
                        border-slate-800
                        p-4
                        text-sm
                        text-slate-300
                        hover:bg-[#1B2745]
                      "
                    >
                      {item}
                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* User */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <UserCircle2
              size={38}
              className="text-cyan-400"
            />

            <div>

              <div
                className="
                  font-semibold
                  text-white
                "
              >
                {displayName}
              </div>

              <div
                className="
                  text-xs
                  text-slate-400
                "
              >
                {roleLabel}
              </div>

            </div>


            {/* Logout */}

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              title="Sign out"
              className="
                rounded-xl
                border
                border-slate-700
                bg-[#16213A]
                p-3
                text-slate-300
                transition
                hover:border-red-500/40
                hover:bg-red-500/10
                hover:text-red-400
                disabled:opacity-50
              "
            >

              <LogOut
                size={19}
              />

            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          KPI BAR
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-5
          border-t
          border-slate-800
          bg-[#111B33]
        "
      >

        <Stat
          icon={FileText}
          color="text-cyan-400"
          value={totalDocs}
          label="Protected Documents"
        />

        <Stat
          icon={Users}
          color="text-yellow-400"
          value={totalRecipients}
          label="Recipients"
        />

        <Stat
          icon={Shield}
          color="text-green-400"
          value={`${integrity}%`}
          label="Integrity"
        />

        <Stat
          icon={AlertTriangle}
          color={
            threat === "Low"
              ? "text-green-400"
              : threat === "High"
              ? "text-orange-400"
              : "text-red-400"
          }
          value={threat}
          label="Threat Level"
        />

        <Stat
          icon={ScanSearch}
          color="text-purple-400"
          value={
            investigations.length
          }
          label="Investigations"
        />

      </div>

    </header>

  );

}


function Stat({
  icon: Icon,
  value,
  label,
  color,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-center
        gap-4
        border-r
        border-slate-800
        py-4
        transition
        hover:bg-[#16213A]
      "
    >

      <Icon
        size={24}
        className={color}
      />

      <div>

        <div
          className={`
            text-2xl
            font-bold
            ${color}
          `}
        >
          {value}
        </div>

        <div
          className="
            text-xs
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          {label}
        </div>

      </div>

    </div>

  );

}
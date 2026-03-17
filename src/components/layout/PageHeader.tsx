import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, Home, FileText, Printer } from "lucide-react";

import { useTripsContext } from "@/context/TripsContext";
import { useTripContext } from "@/context/TripContext";
import { formatHoursMinutes } from "@/lib/formatTime";

function getPageLabel(pathname: string): string {
  if (pathname === "/app" || pathname === "/app/") return "Dashboard";
  if (pathname.startsWith("/app/new")) return "New Trip";
  if (pathname.includes("/logs")) return "Log Sheets";
  if (pathname.includes("/trips/")) return "Trip Details";
  return "ELD Trip Planner";
}

export default function PageHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tripId } = useParams<{ tripId: string }>();
  const { trips } = useTripsContext();
  const { tripResult } = useTripContext();

  const pathname = location.pathname;
  const pageLabel = getPageLabel(pathname);
  const isDashboard = pathname === "/app" || pathname === "/app/";
  const isTripDetail =
    Boolean(tripId) && !pathname.includes("/logs") && pathname.includes("/trips/");
  const isLogSheet = pathname.includes("/logs");
  const isTripPage = isTripDetail || isLogSheet;

  const tripListItem = tripId
    ? trips.find((t) => t.id === tripId)
    : undefined;

  const handleBack = () => {
    if (isLogSheet && tripId) {
      navigate(`/app/trips/${tripId}`);
    } else {
      navigate("/app");
    }
  };

  return (
    <header className="sticky top-0 z-[2000] border-b border-slate-200 bg-white print-hide">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          {!isDashboard && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shrink-0"
              aria-label="Go back"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {pageLabel}
            </p>
            {isTripPage && tripListItem ? (
              <h1 className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                {tripListItem.title}
              </h1>
            ) : (
              <h1 className="text-sm font-semibold text-slate-900 mt-0.5">
                {isDashboard ? "Welcome back" : pageLabel}
              </h1>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isTripPage && tripResult && (
            <div className="hidden sm:flex items-center gap-4 mr-4 text-xs text-slate-500">
              <span>
                <span className="font-mono font-medium text-slate-700">
                  {tripResult.route.totalMiles.toFixed(0)}
                </span>{" "}
                mi
              </span>
              <span>
                <span className="font-mono font-medium text-slate-700">
                  {formatHoursMinutes(tripResult.route.totalDrivingHours)}
                </span>{" "}
                drive
              </span>
              <span>
                <span className="font-mono font-medium text-slate-700">
                  {tripResult.route.totalTripDays}
                </span>{" "}
                days
              </span>
            </div>
          )}

          {isTripDetail && tripId && (
            <button
              type="button"
              onClick={() => navigate(`/app/trips/${tripId}/logs`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              <FileText size={14} />
              Log Sheets
            </button>
          )}

          {isLogSheet && (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors"
            >
              <Printer size={14} />
              Print Logs
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/app")}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            aria-label="Go to dashboard"
          >
            <Home size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

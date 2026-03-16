import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { useTripsContext } from "@/context/TripsContext";

function formatCreatedAt(createdAt: string): string {
  const ts = Date.parse(createdAt);
  if (Number.isNaN(ts)) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
  }).format(new Date(ts));
}

export default function TripsList() {
  const { trips, removeTrip } = useTripsContext();
  const navigate = useNavigate();
  const location = useLocation();

  if (trips.length === 0) {
    return (
      <div className="px-3 py-6 text-sm text-slate-500">
        No trips yet. Create one to get started.
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {trips.map((trip) => (
        <li key={trip.id}>
          <NavLink to={`/app/trips/${trip.id}`}>
            {({ isActive }) => (
              <div
                className={[
                  "group flex items-start gap-3 rounded-md px-3 py-2",
                  "hover:bg-slate-50",
                  isActive ? "bg-blue-50 ring-1 ring-inset ring-blue-200" : "",
                ].join(" ")}
              >
                <div
                  className={[
                    "mt-1 h-2 w-2 rounded-full shrink-0",
                    "bg-slate-300 group-hover:bg-slate-400",
                  ].join(" ")}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {trip.title}
                    </p>
                    <span className="shrink-0 text-xs text-slate-400">
                      {formatCreatedAt(trip.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-500">{trip.subtitle}</p>
                </div>

                <button
                  type="button"
                  className={[
                    "ml-1 mt-0.5 shrink-0 rounded-md p-1",
                    "text-slate-400 hover:text-slate-700 hover:bg-white",
                    "opacity-0 group-hover:opacity-100 focus:opacity-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                  ].join(" ")}
                  aria-label="Delete trip"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const ok = window.confirm("Delete this trip? This cannot be undone.");
                    if (!ok) return;

                    const activePath = location.pathname;
                    await removeTrip(trip.id);

                    if (activePath.includes(`/app/trips/${trip.id}`)) {
                      navigate("/app");
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}


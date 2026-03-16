import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

import { TripProvider } from "@/context/TripContext";
import { TripsProvider } from "@/context/TripsContext";
import AppShell from "@/layout/AppShell";
import DashboardHome from "@/pages/DashboardHome";
import NewTripPage from "@/pages/NewTripPage";
import TripDetailsPage from "@/pages/TripDetailsPage";
import LogSheetPage from "@/pages/LogSheetPage";
import NotFoundPage from "@/pages/NotFoundPage";

function LegacyTripResultRedirect() {
  const { tripId } = useParams<{ tripId: string }>();
  if (!tripId) return <Navigate to="/app" replace />;
  return <Navigate to={`/app/trips/${tripId}`} replace />;
}

function LegacyTripLogsRedirect() {
  const { tripId } = useParams<{ tripId: string }>();
  if (!tripId) return <Navigate to="/app" replace />;
  return <Navigate to={`/app/trips/${tripId}/logs`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <TripProvider>
        <TripsProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/app" replace />} />
            <Route path="/trip/:tripId/result" element={<LegacyTripResultRedirect />} />
            <Route path="/trip/:tripId/logs" element={<LegacyTripLogsRedirect />} />

            <Route path="/app" element={<AppShell />}>
              <Route index element={<DashboardHome />} />
              <Route path="new" element={<NewTripPage />} />
              <Route path="trips/:tripId" element={<TripDetailsPage />} />
              <Route path="trips/:tripId/logs" element={<LogSheetPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </TripsProvider>
      </TripProvider>
    </BrowserRouter>
  );
}

import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import PageHeader from "@/components/layout/PageHeader";
import LeftSidebar from "@/components/sidebar/LeftSidebar";
import { useTripsContext } from "@/context/TripsContext";
import {
  APP_MAIN,
  APP_MAIN_SCROLL,
  APP_SHELL_ROOT,
  APP_SIDEBAR_FIXED,
} from "@/lib/styles";

export default function AppShell() {
  const { hydrateTrips } = useTripsContext();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    void hydrateTrips();
  }, [hydrateTrips]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDrawerOpen(false);
  }, [location.pathname]);

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);

  return (
    <div className={APP_SHELL_ROOT}>
      <aside className={`${APP_SIDEBAR_FIXED} print-hide`} aria-label="Trip navigation">
        <LeftSidebar />
      </aside>

      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 print-hide">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close trips drawer"
            onClick={closeDrawer}
          />
          <div className="absolute inset-y-0 left-0 w-[280px] bg-white border-r border-slate-200">
            <LeftSidebar />
          </div>
        </div>
      )}

      <div className={APP_MAIN}>
        {/* Mobile-only hamburger bar */}
          <div className="sticky top-0 z-[2000] h-12 border-b border-slate-200 bg-white px-4 flex items-center lg:hidden print-hide">
          <button
            type="button"
            className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            aria-label="Open trips drawer"
            onClick={openDrawer}
          >
            <span className="text-lg leading-none">&#x2261;</span>
          </button>
        </div>

        <PageHeader />

        <main className={APP_MAIN_SCROLL}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

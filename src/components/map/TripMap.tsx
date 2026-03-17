import { useCallback, useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, Map as LeafletMap } from "leaflet";

import { LocateFixed } from "lucide-react";

import { RoutePolyline } from "@/components/map/RoutePolyline";
import { StopMarker } from "@/components/map/StopMarker";
import { DEFAULT_CENTER, DEFAULT_ZOOM, STOP_ZOOM, TILE_ATTRIBUTION, TILE_URL } from "@/constants/mapConfig";
import type { TripStop, RouteInfo } from "@/types/trip";
import { StopType } from "@/types/trip";

const MAP_HIDDEN_STOP_TYPES: ReadonlySet<StopType> = new Set<StopType>([]);
const FIT_BOUNDS_OPTIONS = { padding: [40, 40] as [number, number] };

const LEGEND_ITEMS: { color: string; label: string }[] = [
  { color: "#16a34a", label: "Start" },
  { color: "#dc2626", label: "Drop-off" },
  { color: "#0891b2", label: "Pickup" },
  { color: "#d97706", label: "Fuel Stop" },
  { color: "#7c3aed", label: "Rest Break" },
  { color: "#2563eb", label: "Mandatory Rest" },
  { color: "#4f46e5", label: "Cycle Reset" },
  { color: "#6b7280", label: "End" },
];

interface MapControllerProps {
  bounds: LatLngBoundsExpression | undefined;
  selectedStop: TripStop | undefined;
}

function MapController({ bounds, selectedStop }: MapControllerProps) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (!bounds) {
      return;
    }

    const fitNow = () => {
      map.invalidateSize();
      map.fitBounds(bounds, FIT_BOUNDS_OPTIONS);
    };

    if (!hasFitted.current) {
      // First fit: retry until the container has a real size
      const tryFit = () => {
        const size = map.getSize();
        if (size.x > 0 && size.y > 0) {
          fitNow();
          hasFitted.current = true;
        } else {
          requestAnimationFrame(tryFit);
        }
      };
      requestAnimationFrame(tryFit);
    } else {
      fitNow();
    }
  }, [map, bounds]);

  useEffect(() => {
    if (!selectedStop) {
      return;
    }
    map.setView(
      { lat: selectedStop.latitude, lng: selectedStop.longitude },
      STOP_ZOOM,
    );
  }, [map, selectedStop]);

  return null;
}

interface TripMapProps {
  route: RouteInfo;
  stops: TripStop[];
  selectedStopId: number | null;
  onStopClick: (stopId: number) => void;
}

export function TripMap({
  route,
  stops,
  selectedStopId,
  onStopClick,
}: TripMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);

  const visibleStops = useMemo(
    () => stops.filter((stop) => !MAP_HIDDEN_STOP_TYPES.has(stop.type)),
    [stops],
  );

  const bounds: LatLngBoundsExpression | undefined = useMemo(() => {
    if (!visibleStops.length) {
      return undefined;
    }
    const latLngs = visibleStops.map((stop) => [stop.latitude, stop.longitude]) as [number, number][];
    const lats = latLngs.map(([lat]) => lat);
    const lngs = latLngs.map(([, lng]) => lng);

    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ];
  }, [visibleStops]);

  const selectedStop = useMemo(
    () => (selectedStopId !== null ? visibleStops.find((s) => s.id === selectedStopId) : undefined),
    [selectedStopId, visibleStops],
  );

  const handleFitRoute = useCallback(() => {
    if (!mapRef.current || !bounds) {
      return;
    }
    mapRef.current.invalidateSize();
    mapRef.current.fitBounds(bounds, FIT_BOUNDS_OPTIONS);
  }, [bounds]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        ref={mapRef}
        center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full rounded-lg"
        scrollWheelZoom
        aria-label="Trip route map"
      >
        <MapController bounds={bounds} selectedStop={selectedStop} />
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <RoutePolyline polyline={route.polyline} />
        {visibleStops.map((stop) => (
          <StopMarker
            key={stop.id}
            stop={stop}
            isSelected={stop.id === selectedStopId}
            onClick={() => onStopClick(stop.id)}
          />
        ))}
      </MapContainer>

      {bounds && (
        <button
          type="button"
          onClick={handleFitRoute}
          className="absolute bottom-6 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white shadow-lg hover:bg-slate-50 active:bg-slate-100"
          title="Fit route in view"
          aria-label="Fit route in view"
        >
          <LocateFixed className="h-5 w-5 text-slate-700" />
        </button>
      )}

      <div className="absolute bottom-6 left-4 z-20 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Legend
        </p>
        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

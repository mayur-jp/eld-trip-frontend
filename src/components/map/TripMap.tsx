import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import type { LatLngBoundsExpression, Map as LeafletMap } from "leaflet";

import { RoutePolyline } from "@/components/map/RoutePolyline";
import { StopMarker } from "@/components/map/StopMarker";
import { Button } from "@/components/ui/Button";
import { DEFAULT_CENTER, DEFAULT_ZOOM, STOP_ZOOM, TILE_ATTRIBUTION, TILE_URL } from "@/constants/mapConfig";
import type { TripStop, RouteInfo } from "@/types/trip";
import { StopType } from "@/types/trip";

const MAP_HIDDEN_STOP_TYPES: ReadonlySet<StopType> = new Set<StopType>([]);

interface TripMapProps {
  route: RouteInfo;
  stops: TripStop[];
  selectedStopId: number | null;
  onStopClick: (stopId: number) => void;
  onViewLogsClick: () => void;
}

export function TripMap({
  route,
  stops,
  selectedStopId,
  onStopClick,
  onViewLogsClick,
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

  useEffect(() => {
    if (!mapRef.current || selectedStopId === null) {
      return;
    }

    const selected = visibleStops.find((stop) => stop.id === selectedStopId);
    if (!selected) {
      return;
    }

    mapRef.current.setView(
      {
        lat: selected.latitude,
        lng: selected.longitude,
      },
      STOP_ZOOM,
    );
  }, [selectedStopId, visibleStops]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        ref={mapRef}
        center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        bounds={bounds}
        className="h-full w-full rounded-lg"
        scrollWheelZoom
        aria-label="Trip route map"
      >
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

      <div className="absolute bottom-4 left-4 z-20 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Legend
        </p>
        <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
          {[
            { emoji: "\u{1F7E2}", label: "Start" },
            { emoji: "\u{1F534}", label: "Drop-off" },
            { emoji: "\u{1F4E6}", label: "Pickup" },
            { emoji: "\u26FD", label: "Fuel Stop" },
            { emoji: "\u2615", label: "Rest Break" },
            { emoji: "\u{1F6CF}\uFE0F", label: "Mandatory Rest" },
            { emoji: "\u{1F504}", label: "Cycle Reset" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="text-sm">{item.emoji}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <Button variant="primary" onClick={onViewLogsClick}>
          View Daily Log Sheets →
        </Button>
      </div>
    </div>
  );
}


import { useState, useCallback } from "react";

import type { Coordinates } from "@/types/common";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/constants/mapConfig";

interface UseMapReturn {
  center: Coordinates;
  zoom: number;
  selectedStopId: string | null;
  setCenter: (center: Coordinates) => void;
  setZoom: (zoom: number) => void;
  selectStop: (stopId: string | null) => void;
  fitBounds: (coordinates: Coordinates[]) => void;
}

export function useMap(): UseMapReturn {
  const [center, setCenter] = useState<Coordinates>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const selectStop = useCallback((stopId: string | null) => {
    setSelectedStopId(stopId);
  }, []);

  const fitBounds = useCallback((coordinates: Coordinates[]) => {
    if (coordinates.length === 0) return;

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    for (const coord of coordinates) {
      minLat = Math.min(minLat, coord.lat);
      maxLat = Math.max(maxLat, coord.lat);
      minLng = Math.min(minLng, coord.lng);
      maxLng = Math.max(maxLng, coord.lng);
    }

    setCenter({
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    });
  }, []);

  return {
    center,
    zoom,
    selectedStopId,
    setCenter,
    setZoom,
    selectStop,
    fitBounds,
  };
}

import polyline from "@mapbox/polyline";
import { Polyline } from "react-leaflet";

import type { LatLngTuple } from "leaflet";

interface RoutePolylineProps {
  polyline: string;
}

export function RoutePolyline({ polyline: encoded }: RoutePolylineProps) {
  if (!encoded) {
    return null;
  }

  let coordinates: LatLngTuple[] = [];
  try {
    const decoded = polyline.decode(encoded) as number[][];
    coordinates = decoded.map(([lat, lng]) => [Number(lat), Number(lng)]);
  } catch {
    coordinates = [];
  }

  if (!coordinates.length) {
    return null;
  }

  return (
    <Polyline
      positions={coordinates}
      pathOptions={{
        color: "#1e40af",
        weight: 4,
        opacity: 0.8,
      }}
    />
  );
}


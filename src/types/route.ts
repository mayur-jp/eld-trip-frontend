import type { Coordinates } from "@/types/common";

export interface RouteSegment {
  startCoordinates: Coordinates;
  endCoordinates: Coordinates;
  distanceMiles: number;
  durationMinutes: number;
  geometry: Coordinates[];
}

export interface RouteResponse {
  totalDistanceMiles: number;
  totalDurationMinutes: number;
  segments: RouteSegment[];
  fullGeometry: Coordinates[];
}

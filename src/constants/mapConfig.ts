import type { Coordinates } from "@/types/common";

export const DEFAULT_CENTER: Coordinates = { lat: 39.8283, lng: -98.5795 };
export const DEFAULT_ZOOM = 5;
export const STOP_ZOOM = 12;
export const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

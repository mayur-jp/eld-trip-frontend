export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  label: string;
  coordinates: Coordinates;
}

export interface ApiError {
  error: string;
  detail?: string;
}

export interface GeocodeSuggestion {
  label: string;
  coordinates: Coordinates;
}

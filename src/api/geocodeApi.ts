import type { GeocodeSuggestion } from "@/types/common";
import { axiosInstance } from "@/api/axiosInstance";

interface BackendGeocodeResult {
  display_name: string;
  latitude: number;
  longitude: number;
}

interface BackendGeocodeResponse {
  results: BackendGeocodeResult[];
}

export async function searchLocations(
  query: string,
): Promise<GeocodeSuggestion[]> {
  const response = await axiosInstance.get<BackendGeocodeResponse>("/geocode/", {
    params: { q: query },
  });

  return transformGeocodeResponse(response.data);
}

function transformGeocodeResponse(
  data: BackendGeocodeResponse,
): GeocodeSuggestion[] {
  if (!data || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((item) => ({
    label: item.display_name,
    coordinates: {
      lat: item.latitude,
      lng: item.longitude,
    },
  }));
}

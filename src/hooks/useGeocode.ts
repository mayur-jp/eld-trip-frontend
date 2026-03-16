import { useState, useEffect, useRef } from "react";

import type { GeocodeSuggestion } from "@/types/common";
import { searchLocations } from "@/api/geocodeApi";

interface UseGeocodeReturn {
  suggestions: GeocodeSuggestion[];
  isSearching: boolean;
}

export function useGeocode(query: string): UseGeocodeReturn {
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  return { suggestions, isSearching };
}

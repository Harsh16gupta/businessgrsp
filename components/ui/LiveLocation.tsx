"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconCurrentLocation,
  IconMapPin,
  IconLoader,
  IconSearch,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface Location {
  id: string;
  name: string;
  address: string;
  type: 'current' | 'saved' | 'searched';
  latitude?: number;
  longitude?: number;
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation?: Location | null;
  placeholder?: string;
  className?: string;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    
    if (!response.ok) throw new Error("Reverse geocoding failed");
    
    const data = await response.json();
    return data.locality || data.city || data.principalSubdivision || data.countryName || "Current Location";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Current Location";
  }
}

async function searchLocations(query: string): Promise<Location[]> {
  if (query.length < 2) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) throw new Error("Location search failed");
    
    const data = await response.json();
    
    return data.map((item: any, index: number) => ({
      id: `search-${item.place_id}-${index}`,
      name: item.display_name?.split(",")[0] || item.name || "Location",
      address: item.display_name,
      type: 'searched' as const,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error("Location search error:", error);
    return [];
  }
}

export function LocationPicker({
  onLocationSelect,
  selectedLocation,
  placeholder = "Search location or use current location",
  className,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGeolocationSupported, setIsGeolocationSupported] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initialize with selected location
  useEffect(() => {
    if (selectedLocation?.address) {
      setSearchQuery(selectedLocation.address);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsGeolocationSupported(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLocationsAsync = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchLocations(searchQuery);
        setSuggestions(results);
      } catch (err) {
        setError("Failed to search locations");
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchLocationsAsync, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const getCurrentLocation = () => {
    if (!isGeolocationSupported) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowDropdown(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);
          
          const location: Location = {
            id: "current-location",
            name: "Current Location",
            address,
            type: 'current',
            latitude,
            longitude,
          };
          
          onLocationSelect(location);
          setSearchQuery(address);
        } catch (err) {
          setError("Failed to get location details");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        let errorMessage = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  };

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location);
    setSearchQuery(location.address);
    setShowDropdown(false);
    setError(null);
  };

  const clearSelection = () => {
    setSearchQuery("");
    setSuggestions([]);
    setError(null);
    setShowDropdown(false);
    onLocationSelect({
      id: "",
      name: "",
      address: "",
      type: 'searched',
    });
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setError(null);
    if (e.target.value.length > 0) {
      setShowDropdown(true);
    }
  };

  const displayValue = selectedLocation?.address || searchQuery;

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {displayValue && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearSelection}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Clear search"
            >
              <IconX className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getCurrentLocation}
            disabled={isLoading || !isGeolocationSupported}
            className={cn(
              "flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              selectedLocation?.type === 'current'
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
              (isLoading || !isGeolocationSupported) && "opacity-50 cursor-not-allowed"
            )}
            title="Use current location"
          >
            {isLoading ? (
              <IconLoader className="w-3 h-3 animate-spin" />
            ) : (
              <IconCurrentLocation className="w-3 h-3" />
            )}
            <span className="hidden sm:inline">Live</span>
          </motion.button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1 px-1"
        >
          {error}
        </motion.div>
      )}

      {selectedLocation?.type === 'current' && !isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-green-600 dark:text-green-400 mt-1 px-1 flex items-center gap-1"
        >
          <IconCheck className="w-3 h-3" />
          Live location active
        </motion.div>
      )}

      <AnimatePresence>
        {showDropdown && (searchQuery.length > 0 || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
          >
            {isGeolocationSupported && (
              <button
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-3 text-sm border-b border-border/50 hover:bg-accent/50 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <IconLoader className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <IconCurrentLocation className="w-4 h-4 text-blue-600" />
                )}
                <div className="flex-1 text-left">
                  <div className="font-medium">Use Current Location</div>
                  <div className="text-xs text-muted-foreground">Detect your current position</div>
                </div>
              </button>
            )}

            {suggestions.map((location, index) => (
              <button
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className="w-full flex items-center gap-3 p-3 text-sm hover:bg-accent/50 transition-colors border-b border-border/50 last:border-b-0"
              >
                <IconMapPin className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <div className="font-medium truncate">{location.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{location.address}</div>
                </div>
              </button>
            ))}

            {isSearching && (
              <div className="flex items-center justify-center p-4">
                <IconLoader className="w-4 h-4 animate-spin text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">Searching...</span>
              </div>
            )}

            {searchQuery.length >= 2 && suggestions.length === 0 && !isSearching && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No locations found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
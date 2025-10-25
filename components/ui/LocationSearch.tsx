"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { IconMapPin, IconCurrentLocation, IconX, IconCheck } from "@tabler/icons-react";

interface Location {
  id: string;
  name: string;
  address: string;
  type: 'current' | 'saved';
}

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  className?: string;
  placeholder?: string;
  selectedLocation?: Location | null;
}

export function LocationSearch({ 
  onLocationSelect, 
  className,
  placeholder = "Select your location",
  selectedLocation 
}: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Predefined exact locations - replace with your actual locations
  const exactLocations: Location[] = [
    {
      id: "1",
      name: "Connaught Place",
      address: "New Delhi, Delhi 110001",
      type: 'saved'
    },
    {
      id: "2",
      name: "Cyber City",
      address: "Gurugram, Haryana 122002",
      type: 'saved'
    },
    {
      id: "3",
      name: "Sector 62",
      address: "Noida, Uttar Pradesh 201309",
      type: 'saved'
    },
    {
      id: "4",
      name: "Rajouri Garden",
      address: "West Delhi, Delhi 110027",
      type: 'saved'
    },
    {
      id: "5",
      name: "Malviya Nagar",
      address: "South Delhi, Delhi 110017",
      type: 'saved'
    },
    {
      id: "6",
      name: "Pitampura",
      address: "North West Delhi, Delhi 110034",
      type: 'saved'
    },
    {
      id: "7",
      name: "Saket",
      address: "South Delhi, Delhi 110017",
      type: 'saved'
    },
    {
      id: "8",
      name: "Dwarka",
      address: "South West Delhi, Delhi 110075",
      type: 'saved'
    }
  ];

  const filteredLocations = exactLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location);
    setSearchQuery(location.name);
    setIsOpen(false);
    
    if (location.type === 'current') {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Here you would typically reverse geocode to get exact location name
          const currentLocation: Location = {
            id: "current",
            name: "Current Location",
            address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
            type: 'current'
          };
          onLocationSelect(currentLocation);
          setSearchQuery("Current Location");
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
          // Fallback to a default location or show error
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    onLocationSelect(null as any);
    setSearchQuery("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set initial search query if location is selected
  useEffect(() => {
    if (selectedLocation) {
      setSearchQuery(selectedLocation.name);
    }
  }, [selectedLocation]);

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <div className={cn(
          "flex items-center gap-3 px-4 py-3 bg-background border-2 rounded-xl transition-all duration-200",
          isOpen 
            ? "border-blue-500 shadow-lg shadow-blue-500/10" 
            : selectedLocation
            ? "border-green-500 shadow-sm"
            : "border-border hover:border-gray-300"
        )}>
          <IconMapPin className={cn(
            "w-5 h-5 flex-shrink-0 transition-colors",
            selectedLocation ? "text-green-600" : "text-muted-foreground"
          )} />
          
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
          />
          
          {selectedLocation && (
            <div className="flex items-center gap-1">
              <IconCheck className="w-4 h-4 text-green-600" />
              <button
                onClick={clearSelection}
                className="p-1 hover:bg-accent rounded-lg transition-colors"
              >
                <IconX className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}
          
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              isLoading 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105"
            )}
            title="Use current location"
          >
            <IconCurrentLocation className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
        </div>

        {/* Location Selection Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
            >
              {/* Current Location Option */}
              <div className="p-2 border-b border-border/40">
                <button
                  onClick={() => getCurrentLocation()}
                  disabled={isLoading}
                  className={cn(
                    "flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-left",
                    isLoading 
                      ? "bg-gray-50 cursor-not-allowed" 
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    isLoading ? "bg-gray-200" : "bg-blue-100"
                  )}>
                    <IconCurrentLocation className={cn(
                      "w-5 h-5",
                      isLoading ? "text-gray-400" : "text-blue-600"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {isLoading ? "Detecting location..." : "Use Current Location"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {isLoading ? "Please wait..." : "Detect your current location"}
                    </p>
                  </div>
                </button>
              </div>

              {/* Exact Locations List */}
              <div className="p-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {searchQuery ? "Search Results" : "Popular Locations"}
                  </p>
                </div>
                
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      className={cn(
                        "flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-left group",
                        "hover:bg-accent/50 border border-transparent hover:border-accent"
                      )}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <IconMapPin className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {location.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {location.address}
                        </p>
                      </div>
                      {selectedLocation?.id === location.id && (
                        <IconCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <IconMapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-foreground font-medium">No locations found</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Try searching with different keywords
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Location Badge */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg w-fit"
        >
          <IconCheck className="w-4 h-4 text-green-600" />
          <div>
            <span className="text-sm font-medium text-green-700">
              {selectedLocation.name}
            </span>
            <span className="text-xs text-green-600 ml-2">
              ✓ Selected
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
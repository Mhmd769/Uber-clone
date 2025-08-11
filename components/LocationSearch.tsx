import React, { useState, useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";

export type Suggestion = {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
};

type LocationSearchProps = {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  placeholder?: string;
  initialValue?: string; // <-- added optional initialValue prop
};

const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const LocationSearch = ({
  onLocationSelect,
  placeholder = "Search destination",
  initialValue = "",
}: LocationSearchProps) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sync internal input when initialValue changes externally
  useEffect(() => {
    setSearchText(initialValue);
  }, [initialValue]);

  const fetchSuggestions = useCallback(
    debounce(async (text: string) => {
      if (text.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoadingSuggestions(true);

      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          text
        )}&addressdetails=1&limit=5`;

        const response = await fetch(url, {
          headers: {
            "User-Agent": "MyRideApp/1.0 (mhmdmahdi@example.com)",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Nominatim error: ${response.status}`);
        }

        const data: Suggestion[] = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 400),
    []
  );

  useEffect(() => {
    fetchSuggestions(searchText);
  }, [searchText, fetchSuggestions]);

  const onSuggestionPress = (suggestion: Suggestion) => {
    setSearchText(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    Keyboard.dismiss();

    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);

    onLocationSelect({ latitude: lat, longitude: lon, address: suggestion.display_name });
  };

  return (
    <View style={{ position: "relative", zIndex: 100 }}>
      <TextInput
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          setShowSuggestions(true);
        }}
        placeholder={placeholder}
        style={{
          backgroundColor: "white",
          padding: 10,
          borderRadius: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
          marginBottom: 5,
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <View
          style={{
            backgroundColor: "white",
            maxHeight: 180,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          {loadingSuggestions && <ActivityIndicator size="small" color="#000" />}
          {suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.place_id}
              onPress={() => onSuggestionPress(suggestion)}
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              <Text>{suggestion.display_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default LocationSearch;

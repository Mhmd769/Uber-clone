import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert, Button } from "react-native";
import { fetchAPI } from "@/lib/fetch";

const Chat = () => {
  const [driver, setDriver] = useState({
    first_name: "",
    last_name: "",
    profile_image_url: "",
    car_image_url: "",
    car_seats: "",
    rating: "",
  });

  const handleChange = (key: string, value: string) => {
    setDriver({ ...driver, [key]: value });
    console.log(`[Input] ${key}:`, value); // log each input
  };

  const submitDriver = async () => {
    console.log("[Submit] Driver object before validation:", driver);

    // Basic required fields validation
    if (!driver.first_name || !driver.last_name || !driver.car_seats || !driver.rating) {
      Alert.alert("Error", "Please fill all required fields");
      console.log("[Validation] Missing required fields");
      return;
    }

    // Validate URLs or set placeholders
    const isValidURL = (str: string) => {
      const pattern = /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-.]*)*\/?$/;
      return pattern.test(str);
    };

    const payload = {
      first_name: driver.first_name,
      last_name: driver.last_name,
      car_seats: parseInt(driver.car_seats, 10) || 0,
      rating: parseFloat(driver.rating) || 0,
      profile_image_url: isValidURL(driver.profile_image_url)
        ? driver.profile_image_url
        : "https://via.placeholder.com/150",
      car_image_url: isValidURL(driver.car_image_url)
        ? driver.car_image_url
        : "https://via.placeholder.com/150",
    };

    console.log("[Payload] Sending to API:", payload);

    try {
      const result = await fetchAPI("/api/driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("[Response] API result:", result);

      if (result.data) {
        Alert.alert("Success", "Driver added successfully!");
        console.log("[Success] Data received from DB:", result.data);

        setDriver({
          first_name: "",
          last_name: "",
          profile_image_url: "",
          car_image_url: "",
          car_seats: "",
          rating: "",
        });
      } else {
        Alert.alert("Error", result.error || "Something went wrong");
        console.log("[Error] API returned error:", result.error);
      }
    } catch (err: any) {
      console.error("Driver submit error:", err);
      Alert.alert("Error", "Unable to add driver: " + err.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text>First Name</Text>
      <TextInput
        value={driver.first_name}
        onChangeText={(val) => handleChange("first_name", val)}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Last Name</Text>
      <TextInput
        value={driver.last_name}
        onChangeText={(val) => handleChange("last_name", val)}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Profile Image URL</Text>
      <TextInput
        value={driver.profile_image_url}
        onChangeText={(val) => handleChange("profile_image_url", val)}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Car Image URL</Text>
      <TextInput
        value={driver.car_image_url}
        onChangeText={(val) => handleChange("car_image_url", val)}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Car Seats</Text>
      <TextInput
        value={driver.car_seats}
        onChangeText={(val) => handleChange("car_seats", val)}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Rating</Text>
      <TextInput
        value={driver.rating}
        onChangeText={(val) => handleChange("rating", val)}
        keyboardType="decimal-pad"
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />

      <Button title="Add Driver" onPress={submitDriver} />
    </ScrollView>
  );
};

export default Chat;

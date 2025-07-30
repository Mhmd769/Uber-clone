import '../../global.css';
import { Text, View, Pressable } from "react-native";

export default function App() {
  return (
    <View className="flex-1 bg-gray-50 items-center justify-center px-6">
      <View className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <Text className="text-3xl font-extrabold text-blue-600 mb-3">
          Welcome to Nativewind!
        </Text>
        <Text className="text-gray-700 mb-6">
          Build beautiful, performant React Native apps with Tailwind CSS styles.
        </Text>
        <Pressable
          className="bg-blue-600 py-3 rounded-lg"
          android_ripple={{ color: "#2563eb" }}
          onPress={() => alert("Button pressed!")}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Get Started
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

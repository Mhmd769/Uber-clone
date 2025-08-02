import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      Linking.openURL(Linking.createURL("/sign-in")); // Redirect to Sign In
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      className="bg-red-500 px-4 py-2 rounded-lg mt-4"
    >
      <Text className="text-white text-center font-semibold">Sign Out</Text>
    </TouchableOpacity>
  );
};

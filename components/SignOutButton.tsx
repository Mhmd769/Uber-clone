import { icons } from "@/constants";
import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Image, Text, TouchableOpacity } from "react-native";

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
      className="justify-center items-center w-10 h-10 rounded-full bg-white"
    >
    <Image source={icons.out} className="w-5 h-5 "/>
    </TouchableOpacity>
  );
};

import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user } = useUser();

  const imageUri =
    user?.externalAccounts?.[0]?.imageUrl || user?.imageUrl || "https://placehold.co/110x110";

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} className="px-5">
        <Text className="text-2xl font-bold my-5">My Profile</Text>

        <View className="flex items-center justify-center my-5">
          <Image
            source={{ uri: imageUri }}
            className="w-[110px] h-[110px] rounded-full border-3 border-white shadow-sm"
          />
        </View>

        <View className="bg-white rounded-xl shadow-sm p-5">
          <View className="mb-4">
            <Text className="text-sm text-gray-500 mb-1">Username</Text>
            <TextInput
              value={user?.username || "Not Found"}
              editable={false}
              className="w-full p-3.5 rounded bg-gray-200 text-md"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-500 mb-1">Email</Text>
            <TextInput
              value={user?.primaryEmailAddress?.emailAddress || "Not Found"}
              editable={false}
              className="w-full p-3.5 rounded bg-gray-100 text-md"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-500 mb-1">Phone</Text>
            <TextInput
              value={user?.primaryPhoneNumber?.phoneNumber || "Not Found"}
              editable={false}
              className="w-full p-3.5 rounded bg-gray-100 text-md"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
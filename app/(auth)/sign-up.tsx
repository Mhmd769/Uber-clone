import CustomButton from "@/components/CustmoeButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";

import "../../global.css";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default", // default | pending | success | failed
    error: "",
    code: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Toast function for errors
  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({ ...verification, state: "pending", error: "" });
    } catch (err: any) {
      console.error(err);
      setVerification({
        ...verification,
        error: err?.errors?.[0]?.longMessage || "Failed to sign up.",
        state: "failed",
      });
      showErrorToast(err?.errors?.[0]?.longMessage || "Failed to sign up. Please try again.");
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setVerification({ ...verification, state: "success", error: "" });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
        showErrorToast("Incorrect verification code. Please try again.");
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err?.errors?.[0]?.longMessage || "Verification error",
        state: "failed",
      });
      showErrorToast("Incorrect verification code. Please try again.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-6" />
          <OAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            Already have an account?{" "}
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        {/* Verification Modal */}
        <ReactNativeModal
          isVisible={verification.state === "pending" || verification.state === "failed"}
          onBackdropPress={() => setVerification({ ...verification, state: "default", error: "" })}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropOpacity={0.6}
          useNativeDriver={true}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">Verification</Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="123456"
              value={verification.code}
              keyboardType="numeric"
                maxLength={6}

              onChangeText={(code) => setVerification({ ...verification, code })}
            />
            <CustomButton
              title="Verify Email"
              onPress={onVerifyPress}
              className="mt-5 bg-success-500"
              disabled={verification.code.length !== 6}
            />
          </View>
        </ReactNativeModal>

        {/* Success Modal - Browse Home */}
        <ReactNativeModal
          isVisible={verification.state === "success"}
          onBackdropPress={() => router.push("/home")}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropOpacity={0.6}
          useNativeDriver={true}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] justify-center items-center">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mb-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">Verified</Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => router.push("/home")}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>

        {/* Toast Alert for Errors */}
        <ReactNativeModal
          isVisible={showToast}
          animationIn="slideInDown"
          animationOut="slideOutUp"
          backdropOpacity={0}
          useNativeDriver={true}
          style={{ justifyContent: 'flex-start', margin: 0, marginTop: 50 }}
        >
          <View className="mx-4 mt-4 bg-red-500 px-4 py-3 rounded-lg shadow-lg">
            <View className="flex-row items-center">
              <Image 
                source={icons.close} 
                className="w-5 h-5 mr-3"
                style={{ tintColor: 'white' }}
              />
              <Text className="text-white font-JakartaSemiBold flex-1">
                {toastMessage}
              </Text>
            </View>
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
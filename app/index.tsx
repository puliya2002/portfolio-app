import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginScreen: React.FC = () => {
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormValues>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const router = useRouter();

  const handleInputChange = (field: keyof LoginFormValues, value: string) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormValues> = {};

    // Email validation
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formValues.password) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const storeUserSession = async (userData: any) => {
    try {
      // Store the entire user object
      await AsyncStorage.setItem("userSession", JSON.stringify(userData));
      // Store email separately for easy access
      await AsyncStorage.setItem("userEmail", userData.email);
      console.log("User session stored successfully");
    } catch (error) {
      console.error("Error storing user session:", error);
      Alert.alert("Error", "Failed to store session data");
    }
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Make API request to the custom Next.js login endpoint
        const response = await axios.post(
          "http://portfoliolink-six.vercel.app/api/login",
          {
            email: formValues.email,
            password: formValues.password,
          }
        );

        if (response.data.success) {
          // Store user data in AsyncStorage
          const userData = response.data.user;
          await storeUserSession(userData);
          console.log("Login success", userData);

          // Navigate to dashboard screen
          router.push("/projects");
        } else {
          setLoginError(response.data.error || "Invalid email or password");
        }
      } catch (error: any) {
        console.error("Login error:", error.response?.data || error.message);
        setLoginError(
          error.response?.data?.error ||
            "Something went wrong. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerClassName="p-4">
          <View className="items-center">
            <Image
              source={require("../assets/images/logomobile.webp")}
              style={{
                width: 158,
                height: 128,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
            <Text className="text-2xl text-gray-800">Sign In</Text>
            <Text className="text-gray-500 text-center mb-4 mt-1">
              Sign in to your account to continue
            </Text>
          </View>

          {/* Login Form */}
          <View className="px-4 space-y-4">
            {/* Email Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <TextInput
                className={`bg-gray-50 border rounded-lg p-4 text-gray-900 h-16 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formValues.email}
                onChangeText={(value) => handleInputChange("email", value)}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View className="pt-2">
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <View className="relative">
                <TextInput
                  className={`bg-gray-50 border rounded-lg p-4 text-gray-900 h-16 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  value={formValues.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                />
                <TouchableOpacity
                  className="absolute right-4 top-6"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text className="text-blue-500">
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-primary rounded-lg p-4 items-center mt-6"
              onPress={handleLogin}
            >
              {isLoading ? (
                <Text className="text-black text-lg">Loading...</Text>
              ) : (
                <Text className="text-black text-lg">Log In</Text>
              )}
            </TouchableOpacity>

            {/* Error Message */}
            {loginError && (
              <Text className="text-red-500 text-center mt-4">
                {loginError}
              </Text>
            )}

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity>
                <Text className="text-blue-500 font-medium">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

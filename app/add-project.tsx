import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AddProjectScreen() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    technologies: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title || !formData.description) {
      Alert.alert("Missing Fields", "Please fill in title and description.");
      return;
    }

    setIsLoading(true);

    try {
      // Convert technologies from comma-separated string to array
      const technologiesArray = formData.technologies
        ? formData.technologies.split(",").map((tech) => tech.trim())
        : [];

      const projectData = {
        title: formData.title,
        description: formData.description,
        link: formData.link,
        technologies: technologiesArray,
      };

      // Send POST request to add project
      const response = await axios.post(
        "http://portfoliolink-six.vercel.app/api/mobile/projects",
        {
          ...projectData,
          email: user?.email,
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Project added successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error adding project:", error);
      Alert.alert("Error", "Failed to add project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold">Add New Project</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-blue-500">Cancel</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            {/* Title Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">
                Project Title*
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-gray-900"
                placeholder="Enter project title"
                value={formData.title}
                onChangeText={(value) => handleChange("title", value)}
              />
            </View>

            {/* Description Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">
                Description*
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-gray-900 h-32"
                placeholder="Describe your project"
                multiline
                textAlignVertical="top"
                value={formData.description}
                onChangeText={(value) => handleChange("description", value)}
              />
            </View>

            {/* Link Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">
                Project URL
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-gray-900"
                placeholder="https://example.com"
                keyboardType="url"
                autoCapitalize="none"
                value={formData.link}
                onChangeText={(value) => handleChange("link", value)}
              />
            </View>

            {/* Technologies Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">
                Technologies
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-gray-900"
                placeholder="React, Node.js, MongoDB (comma separated)"
                value={formData.technologies}
                onChangeText={(value) => handleChange("technologies", value)}
              />
            </View>

            {/* Cover Photo Upload - Would require additional image picker setup */}
            {/* We're skipping this for now */}

            {/* Submit Button */}
            <TouchableOpacity
              className="bg-primary  rounded-lg p-4 items-center mt-6"
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-black text-lg font-medium">
                  Add Project
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

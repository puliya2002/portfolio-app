// components/DeleteProject.tsx
import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { AntDesign } from "@expo/vector-icons";

export default function DeleteProject({
  projectId,
  onProjectDeleted,
}: {
  projectId: string;
  onProjectDeleted: () => void;
}) {
  const { user } = useAuth();

  const handleDelete = async () => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `http://portfoliolink-six.vercel.app/api/mobile/projects/${projectId}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: {
                    email: user?.email,
                  },
                }
              );

              onProjectDeleted(); // Refresh the list after deletion
              Alert.alert("Success", "Project deleted successfully");
            } catch (error) {
              console.error("Error deleting project:", error);
              Alert.alert("Error", "Failed to delete project");
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleDelete}
      style={{  padding: 10, borderRadius: 5 }}
    >
      <Text style={{ color: "white", textAlign: "center" }}>
        <AntDesign name="delete" size={20} color="red" />
      </Text>
    </TouchableOpacity>
  );
}

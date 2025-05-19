// screens/ProjectsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import DeleteProject from "../components/DeleteProjects";
import EditProject from "../components/EditProjects";
import axios from "axios";

interface Project {
  _id: string;
  title: string;
  description: string;
  link: string;
  technologies: string[];
  coverPhoto?: string;
  screenshot?: string;
}

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      if (!user?.email) {
        console.log("Cannot fetch projects: User email not available");
        setLoading(false);
        return;
      }

      setLoading(true);
      console.log(`Attempting to fetch projects for: ${user.email}`);

      const endpoint = `http://portfoliolink-six.vercel.app/api/mobile/projects?email=${encodeURIComponent(
        user.email
      )}`;
      console.log(`Requesting from: ${endpoint}`);

      const response = await axios.get(endpoint);
      console.log("API Response:", JSON.stringify(response.data));

      if (response.data.project) {
        setProjects(response.data.project);
      } else if (response.data.projects) {
        setProjects(response.data.projects);
      } else {
        Alert.alert("Error", "No projects found in the response.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      Alert.alert("Error", "Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("User state changed:", user);
    if (user?.email) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleAddProject = () => {
    router.push("/add-project");
  };

  const handleProjectUpdated = () => {
    fetchProjects(); // Re-fetch projects after update
  };

  const renderItem = ({ item }: { item: Project }) => (
    <View
      style={{
        backgroundColor: "white",
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
        {item.title}
      </Text>
      <Text style={{ marginBottom: 8 }}>{item.description}</Text>
      {item.coverPhoto && (
        <Image
          source={{ uri: item.coverPhoto }}
          style={{ width: "100%", height: 200, marginBottom: 10 }}
        />
      )}
      {item.screenshot && (
        <Image
          source={{ uri: item.screenshot }}
          style={{ width: "100%", height: 200, marginBottom: 10 }}
        />
      )}

      {item.technologies && item.technologies.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontWeight: "500" }}>Technologies:</Text>
          <Text>{item.technologies.join(", ")}</Text>
        </View>
      )}

      {item.link && <Text style={{ marginBottom: 10 }}>Link: {item.link}</Text>}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 5,
        }}
      >
        <EditProject project={item} onProjectUpdated={handleProjectUpdated} />
        <DeleteProject
          projectId={item._id}
          onProjectDeleted={handleProjectUpdated}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>My Projects</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: "blue" }}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <>
          <FlatList
            data={projects}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={{ padding: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 50 }}>
                <Text>No projects available</Text>
                <Text style={{ color: "gray", marginTop: 10 }}>
                  Add a new project by tapping the + button
                </Text>
              </View>
            }
          />
          <TouchableOpacity
            onPress={handleAddProject}
            style={{
              position: "absolute",
              bottom: 30,
              right: 20,
              backgroundColor: "#F7DC09",
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              elevation: 5,
            }}
          >
            <Text style={{ color: "black", fontSize: 30, fontWeight: "bold" }}>
              +
            </Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

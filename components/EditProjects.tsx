// components/EditProject.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface EditProjectProps {
  project: {
    _id: string;
    title: string;
    description: string;
    link: string;
    technologies: string[];
  };
  onProjectUpdated: () => void;
}

export default function EditProject({
  project,
  onProjectUpdated,
}: EditProjectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [link, setLink] = useState(project.link || "");
  const [technologies, setTechnologies] = useState(
    project.technologies.join(", ")
  );
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    try {
      setLoading(true);

      const tech = technologies
        ? technologies.split(",").map((item) => item.trim())
        : [];

      const response = await axios.put(
        "http://portfoliolink-six.vercel.app/api/mobile/projects",
        {
          email: user?.email,
          projectId: project._id,
          title,
          description,
          link,
          technologies: tech,
        }
      );

      console.log("Update response:", response.data);
      Alert.alert("Success", "Project updated successfully");
      setModalVisible(false);
      onProjectUpdated();
    } catch (error) {
      console.error("Error updating project:", error);
      Alert.alert("Error", "Failed to update project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.editButton}>Edit</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.modalTitle}>Edit Project</Text>

              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Project Title"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Project Description"
                multiline={true}
                numberOfLines={4}
              />

              <Text style={styles.label}>Link (Optional)</Text>
              <TextInput
                style={styles.input}
                value={link}
                onChangeText={setLink}
                placeholder="https://example.com"
              />

              <Text style={styles.label}>Technologies (comma-separated)</Text>
              <TextInput
                style={styles.input}
                value={technologies}
                onChangeText={setTechnologies}
                placeholder="React, Node.js, MongoDB"
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText} className="text-white">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.saveButton,
                    loading && styles.disabledButton,
                  ]}
                  onPress={handleUpdate}
                  disabled={loading}
                >
                  <Text style={styles.buttonText} className="text-gray-900">
                    {loading ? "Updating..." : "Update Project"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  editButton: {
    color: "blue",
    fontSize: 16,
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  scrollView: {
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    borderRadius: 5,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#F7DC09",
  },
  cancelButton: {
    backgroundColor: "#afafaf",
  },
  disabledButton: {
    backgroundColor: "#85B7E5",
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
  },
});

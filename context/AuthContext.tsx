// context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface User {
  id: string;
  name: string;
  email: string;
  currentstep: number;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const checkLoginStatus = async () => {
      try {
        const userSessionJson = await AsyncStorage.getItem("userSession");
        if (userSessionJson) {
          const userData = JSON.parse(userSessionJson);
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to get user session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem("userSession", JSON.stringify(userData));
      await AsyncStorage.setItem("userEmail", userData.email);
      setUser(userData);
    } catch (error) {
      console.error("Failed to save user session:", error);
      throw new Error("Failed to save user session");
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userSession");
      await AsyncStorage.removeItem("userEmail");
      setUser(null);
      router.replace("/"); // Redirect to login screen
    } catch (error) {
      console.error("Failed to remove user session:", error);
      throw new Error("Failed to logout");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

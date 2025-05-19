// hooks/useUserSession.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  id: string;
  name: string;
  email: string;
  currentstep: number;
  [key: string]: any; // For any additional fields
}

export const useUserSession = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user session on mount
  useEffect(() => {
    const loadUserSession = async () => {
      try {
        const userSessionJson = await AsyncStorage.getItem('userSession');
        if (userSessionJson) {
          const userData = JSON.parse(userSessionJson);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserSession();
  }, []);

  // Function to get current user email
  const getUserEmail = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('userEmail');
    } catch (error) {
      console.error('Error getting user email:', error);
      return null;
    }
  };

  // Function to logout the user
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userSession');
      await AsyncStorage.removeItem('userEmail');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  // Function to update user data
  const updateUserSession = async (userData: UserData) => {
    try {
      await AsyncStorage.setItem('userSession', JSON.stringify(userData));
      await AsyncStorage.setItem('userEmail', userData.email);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Error updating user session:', error);
      return false;
    }
  };

  return {
    user,
    loading,
    getUserEmail,
    logout,
    updateUserSession,
  };
};
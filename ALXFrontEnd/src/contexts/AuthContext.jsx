import { createContext, useState, useEffect, useContext } from "react";
import {
  csrf,
  getUser,
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  googleauth,
} from "@/services/authApi";
import { handleAuthErrors } from "@/lib/errors";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("AuthToken");
        if (token) {
          const response = await getUser();
          setProfileId(response.data.username);
          setIsAuthenticated(true);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data) => {
    try {
      await csrf();
      const response = await loginApi(data);
      const { username } = response.data.user;
      localStorage.setItem("AuthToken", response.data.AuthToken);

      setIsAuthenticated(true);
      setProfileId(username);
      setUser(response.data.user);

      return response.data;
    } catch (error) {
      throw handleAuthErrors(error);
    }
  };

  const register = async (data) => {
    try {
      await csrf();
      const response = await registerApi(data);

      localStorage.setItem("AuthToken", response.data.AuthToken);

      const { username } = response.data.user;

      setIsAuthenticated(true);
      setProfileId(username);
      setUser(response.data.user);

      return response.data;
    } catch (error) {
      throw handleAuthErrors(error);
    }
  };

  const logout = async () => {
    try {
      await csrf();
      await logoutApi();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      localStorage.removeItem("AuthToken");
      setIsAuthenticated(false);
      setProfileId(null);
      setUser({});
    }
  };

  const GoogleLogin = async (data) => {
    try {
      await csrf();
      const response = await googleauth(data);
      const { username } = response.data.user;
      localStorage.setItem("AuthToken", response.data.AuthToken);

      setIsAuthenticated(true);
      setProfileId(username);
      setUser(response.data.user);

      return response.data;
    } catch (error) {
      throw handleAuthErrors(error);
    }
  };

  // Provide context value
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        profileId,
        setProfileId,
        loading,
        setLoading,
        login,
        logout,
        register,
        GoogleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};

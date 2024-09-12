import axiosClient from "@/api/axios";

export const csrf = async () => {
  await axiosClient.get("/sanctum/csrf-cookie", {
    baseURL: import.meta.env.VITE_BACKEND_URL,
  });
};

export const googleauth = async (data) => {
  return await axiosClient.post("/auth/google", data);
};

export const login = async (data) => {
  return await axiosClient.post("/login", data);
};

export const register = async (data) => {
  return await axiosClient.post("/register", data);
};

export const getUser = async () => {
  return await axiosClient.get("/user");
};

export const getUserStories = async () => {
  return await axiosClient.get("/user/stories");
};

export const updateProfile = async (data) => {
  try {
    const response = await axiosClient.post("/user/profile", data);

    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const backendErrors = error.response.data.errors;
      const formErrors = {};
      for (const key in backendErrors) {
        formErrors[key] = { message: backendErrors[key][0] };
      }
      throw formErrors;
    } else {
      console.error("Error updating password:", error);
      throw new Error("Update Profile failed, please try later");
    }
  }
};

export const UpdateProfilePassword = async (data) => {
  try {
    const response = await axiosClient.post("/user/password", data);

    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const backendErrors = error.response.data.errors;
      const formErrors = {};
      for (const key in backendErrors) {
        formErrors[key] = { message: backendErrors[key][0] };
      }
      throw formErrors;
    } else {
      console.error("Error updating password:", error);
      throw new Error("Update Password failed, please try later");
    }
  }
};

export const logout = async () => {
  return await axiosClient.post("/logout");
};

import instance from "./axios";

export const register = async (userData) => {
  try {
    const response = await instance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

export const login = async (credentials) => {
  try {
    const response = await instance.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

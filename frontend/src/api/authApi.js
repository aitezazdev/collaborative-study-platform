import instance from "./axios";

export const login = async (data) => {
  try {
    const response = await instance.post("/auth/login", data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};
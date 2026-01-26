import instance from "./axios";

export const fetchUserProfile = async () => {
  try {
    const response = await instance.get("/user/info");
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateUserProfile = async (data) => {
  try {
    const response = await instance.put("/user/update", data);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

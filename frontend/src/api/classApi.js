import instance from "./axios";

export const createClass = async (data) => {
  try {
    const response = await instance.post("/class/create", data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

export const joinClass = async (data) => {
  try {
    const response = await instance.post("/class/join", data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

export const fetchUserClasses = async () => {
  try {
    const response = await instance.get("/class/my-classes");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

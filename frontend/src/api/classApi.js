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
    throw error;
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

export const deleteClass = async (slug) => {
  try {
    const response = await instance.delete(`/class/${slug}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

export const fetchClassStudents = async (slug) => {
  try {
    const response = await instance.get(`/class/${slug}/students`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

export const updateClass = async (slug, data) => {
  try {
    const response = await instance.put(`/class/${slug}`, data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

export const fetchClassBySlug = async (slug) => {
  try {
    const response = await instance.get(`/class/${slug}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

export const fixClassSlugs = async () => {
  try {
    const response = await instance.get("/class/fix-slugs");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

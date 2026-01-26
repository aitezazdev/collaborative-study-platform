import instance from "./axios";

export const uploadSlide = async (classId, formData) => {
  try {
    const response = await instance.post(`/slide/upload/${classId}`, formData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

export const fetchSlidesForClass = async (classId) => {
  try {
    const response = await instance.get(`/slide/allSlides/${classId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

export const deleteSlide = async (slideId) => {
  try {
    const response = await instance.delete(`/slide/delete/${slideId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

export const fetchSlideById = async (slideId) => {
  try {
    const response = await instance.get(`/slide/fetchSlideById/${slideId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Server error" };
  }
};

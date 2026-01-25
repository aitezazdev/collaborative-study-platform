import instance from "./axios";

export const uploadSlide = async (classId, formData) => {
  try {
    const response = await instance.post(
      `/slide/upload/${classId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchSlidesForClass = async (classId) => {
  try {
    const response = await instance.get(`/slide/allSlides/${classId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const deleteSlide = async (slideId) => {
  try {
    const response = await instance.delete(`/slide/delete/${slideId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
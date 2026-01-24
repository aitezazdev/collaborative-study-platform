import instance from "./axios";

export const createClass = async (data) => {
  try {
    const response = await instance.post("/class/create", data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const joinClass = async (data) => {
  try {
    const response = await instance.post("/class/join", data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

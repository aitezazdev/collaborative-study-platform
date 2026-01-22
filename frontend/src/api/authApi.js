import instance from "./axios";

export const register = async (userData) => {
  const response = await instance.post("/auth/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await instance.post("/auth/login", credentials);
  return response.data;
};


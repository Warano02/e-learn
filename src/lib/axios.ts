import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_API_BASE_URL,
  withCredentials: true,
});

import axios from "axios";
export const axiosConstant = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true
});
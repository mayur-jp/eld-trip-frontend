import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL environment variable is not set");
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const serverMessage =
          (error.response.data as { error?: string })?.error ??
          "Something went wrong";
        throw new Error(serverMessage);
      }
      if (error.request) {
        throw new Error(
          "Could not connect to server. Check your internet connection.",
        );
      }
    }
    throw new Error("An unexpected error occurred.");
  },
);

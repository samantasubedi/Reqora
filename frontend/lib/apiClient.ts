import axios from "axios";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});
api.interceptors.response.use(
  async (response) => {
    if (response.data?.code == "TOKEN_REFRESHED") {
      const originalRequest = response.config;
      if (originalRequest._retry) {
        return response;
      }
      originalRequest._retry = true;
      return api.request(originalRequest);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

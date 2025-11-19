import axios from "axios";
import { authApi } from "./endpoints/auth";
import { setAuth } from "@/store/auth-slice";
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token)
  );
  failedQueue = [];
};

///Request interceptors also added auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

///Response interceptors where auth refresh is handled
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return apiClient(originalRequest);
//           })
//           .catch((error) => Promise.reject(error));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // request new access token via refresh endpoint (cookies sent)
//         // const response = await apiClient.post("/api/auth/refresh");
//         const data = await authApi.refreshToken();
//           if (data.user) {
//           dispatch(setAuth({ user: data.user, accessToken: data.accessToken,
//               refreshToken: data.refreshToken, }));
//         }
//         isRefreshing = false;
//         processQueue(null);
//         return apiClient(originalRequest);
//       } catch (error) {
//         isRefreshing = false;
//         processQueue(error, null);

//         return Promise.reject(error);
//       }
//     }

//     // network errors
//     if (!error.response) {
//       if (error.code === "ECONNABORTED") {
//         error.message = "Request timeout. Please check your connection.";
//       } else if (error.message === "Network Error") {
//         error.message = "No internet connection. Please check your network.";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default apiClient;

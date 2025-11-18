import axios from "axios";
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  withCredentials: true,
});

let isRefreshing = false;

////here we create a queue that stores falied requests with 401 while refreshing token
// let failedQueue: Array<{
//   resolve: (value?: unknown) => void;
//   reject: (reason?: any) => void;
// }> = [];
let failedQueue: any[] = [];

///here we loop through queued requests, if the fail we reject them, but instances where they suceed we resolve they retey
// const processQueue = (error: any) => {
//   failedQueue.forEach(({ resolve, reject }) => {
//     if (error) reject(error);
//     else resolve();
//   });
//   ///this one is to clear the queue
//   failedQueue = [];
// };
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
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((error) => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // request new access token via refresh endpoint (cookies sent)
        const response = await apiClient.post("/auth/refresh");
        isRefreshing = false;
        processQueue(null, response.data.accessToken);
        return apiClient(originalRequest);
      } catch (e) {
        isRefreshing = false;
        processQueue(e, null);
        // optionally redirect to login
        return Promise.reject(e);
      }
    }

    // Handle network errors
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        error.message = "Request timeout. Please check your connection.";
      } else if (error.message === "Network Error") {
        error.message = "No internet connection. Please check your network.";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

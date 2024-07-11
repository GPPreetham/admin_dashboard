import axios from "axios";

const appEndpoint = axios.create({
  // baseURL: "https://backend-loyalty-management-xy37.onrender.com/",
  baseURL: "http://localhost:3000/",
});

appEndpoint.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default appEndpoint;

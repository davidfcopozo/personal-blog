import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `http://${hostname}:3000`;
    } else {
      return `https://${hostname}`;
    }
  }
  return "http://localhost:3000";
};

const apiClient  = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
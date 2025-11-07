import axios from "axios";

const apiClient = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "http://192.168.1.195:3000", // ✅ Android Emulator
  // baseURL: "https://noncontinuable-unresistible-sherita.ngrok-free.dev/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

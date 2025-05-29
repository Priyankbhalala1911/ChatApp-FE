import { io } from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL_SOCKET || "http://localhost:8000",
  {
    // transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  }
);

socket.on("connect", () => {
  console.log("Socket connected successfully");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

export default socket;

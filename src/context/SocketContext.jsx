// frontend/src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Safe backend URL
    const URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

    // Initialize socket silently
    const newSocket = io(URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 10000,
      autoConnect: true,
    });

    // Disable all Socket.IO debug output
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("debug");
    }

    // Remove all event console logs — silent operation
    newSocket.on("connect", () => {});
    newSocket.on("disconnect", () => {});
    newSocket.io.on("reconnect_attempt", () => {});
    newSocket.io.on("reconnect", () => {});
    newSocket.io.on("reconnect_failed", () => {});
    newSocket.on("connect_error", () => {});

    // Store socket instance
    setSocket(newSocket);

    // Cleanup
    return () => {
      if (newSocket.connected) newSocket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

// Custom hook
export const useSocket = () => useContext(SocketContext);

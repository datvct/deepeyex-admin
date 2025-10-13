// src/shares/contexts/WebSocketContext.tsx
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { websocketService } from "../services/websocket.service";
import { RootState } from "../stores";

type WebSocketContextType = {
  isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
});

export const useWebSocketContext = () => useContext(WebSocketContext);

type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { doctor, accessToken, role } = useSelector((state: RootState) => state.auth);
  const [isConnected, setIsConnected] = React.useState(false);
  const hasConnectedRef = React.useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Chỉ kết nối WebSocket khi là DOCTOR và đã đăng nhập
    if (doctor && doctor.doctor_id && accessToken && role?.toUpperCase() === "DOCTOR") {
      // Chỉ connect nếu chưa connect
      if (!hasConnectedRef.current) {
        console.log("🔌 Connecting WebSocket for doctor:", doctor.doctor_id);
        websocketService.connect(doctor.doctor_id);
        hasConnectedRef.current = true;
      }

      // Check connection status periodically
      interval = setInterval(() => {
        const connected = websocketService.isConnected();
        setIsConnected(connected);
      }, 2000);
    } else {
      // Disconnect khi không phải DOCTOR hoặc chưa đăng nhập (logout)
      if (hasConnectedRef.current) {
        console.log("🔌 Disconnecting WebSocket (logout)...");
        websocketService.disconnect();
        hasConnectedRef.current = false;
        setIsConnected(false);
      }
    }

    // Cleanup: chỉ clear interval, KHÔNG disconnect WebSocket
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [doctor?.doctor_id, accessToken, role]);

  return <WebSocketContext.Provider value={{ isConnected }}>{children}</WebSocketContext.Provider>;
};

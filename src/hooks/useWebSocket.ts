// src/hooks/useWebSocket.ts
import { useEffect, useRef } from "react";
import {
  websocketService,
  WebSocketEventCallback,
  WebSocketMessage,
} from "../shares/services/websocket.service";

type UseWebSocketOptions = {
  onNewAppointment?: (message: WebSocketMessage) => void;
  onUpdateAppointment?: (message: WebSocketMessage) => void;
  onCancelAppointment?: (message: WebSocketMessage) => void;
};

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { onNewAppointment, onUpdateAppointment, onCancelAppointment } = options;

  // Use refs to avoid re-registering listeners on every render
  const newAppointmentRef = useRef(onNewAppointment);
  const updateAppointmentRef = useRef(onUpdateAppointment);
  const cancelAppointmentRef = useRef(onCancelAppointment);

  useEffect(() => {
    newAppointmentRef.current = onNewAppointment;
    updateAppointmentRef.current = onUpdateAppointment;
    cancelAppointmentRef.current = onCancelAppointment;
  }, [onNewAppointment, onUpdateAppointment, onCancelAppointment]);

  useEffect(() => {
    const handleNewAppointment: WebSocketEventCallback = (message) => {
      if (newAppointmentRef.current) {
        newAppointmentRef.current(message);
      }
    };

    const handleUpdateAppointment: WebSocketEventCallback = (message) => {
      if (updateAppointmentRef.current) {
        updateAppointmentRef.current(message);
      }
    };

    const handleCancelAppointment: WebSocketEventCallback = (message) => {
      if (cancelAppointmentRef.current) {
        cancelAppointmentRef.current(message);
      }
    };

    // Register listeners
    if (onNewAppointment) {
      websocketService.on("NEW_APPOINTMENT", handleNewAppointment);
    }
    if (onUpdateAppointment) {
      websocketService.on("UPDATE_APPOINTMENT", handleUpdateAppointment);
    }
    if (onCancelAppointment) {
      websocketService.on("CANCEL_APPOINTMENT", handleCancelAppointment);
    }

    // Cleanup listeners on unmount
    return () => {
      if (onNewAppointment) {
        websocketService.off("NEW_APPOINTMENT", handleNewAppointment);
      }
      if (onUpdateAppointment) {
        websocketService.off("UPDATE_APPOINTMENT", handleUpdateAppointment);
      }
      if (onCancelAppointment) {
        websocketService.off("CANCEL_APPOINTMENT", handleCancelAppointment);
      }
    };
  }, [onNewAppointment, onUpdateAppointment, onCancelAppointment]);

  return {
    isConnected: websocketService.isConnected(),
    send: websocketService.send.bind(websocketService),
  };
};

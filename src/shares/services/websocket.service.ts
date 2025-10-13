// src/shares/services/websocket.service.ts
import { Appointment } from "../../modules/appointments/types/appointment";

export type WebSocketMessage = {
  type: "NEW_APPOINTMENT" | "UPDATE_APPOINTMENT" | "CANCEL_APPOINTMENT";
  payload: {
    appointment: Appointment;
    message: string;
    order?: any;
  };
};

export type WebSocketEventCallback = (message: WebSocketMessage) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private listeners: Map<string, Set<WebSocketEventCallback>> = new Map();
  private doctorId: string | null = null;
  private isConnecting = false;
  private shouldReconnect = true;

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.send = this.send.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }

  connect(doctorId: string): void {
    if (this.isConnecting || (this.socket && this.socket.readyState === WebSocket.OPEN)) {
      console.log("⚠️ WebSocket đã kết nối hoặc đang kết nối");
      return;
    }

    this.isConnecting = true;
    this.doctorId = doctorId;
    this.shouldReconnect = true;

    // WebSocket URL - thay đổi nếu backend khác
    const wsUrl = `ws://localhost:8084/ws?doctor_id=${doctorId}`;

    // console.log("🔌 Đang kết nối WebSocket...");
    // console.log("📍 URL:", wsUrl);
    // console.log("👨‍⚕️ Doctor ID:", doctorId);

    try {
      this.socket = new WebSocket(wsUrl);
      console.log("🔧 WebSocket object created, readyState:", this.socket.readyState);
      // readyState: 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED

      this.socket.onopen = (event) => {
        // console.log("✅ WebSocket CONNECTED successfully!");
        // console.log("📊 Connection event:", event);
        // console.log("👨‍⚕️ Doctor ID:", doctorId);
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        console.log("📨 RAW WebSocket message received:", event.data);
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          // console.log("✅ Parsed message:", message);
          this.notifyListeners(message.type, message);
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
          console.error("📄 Raw data:", event.data);
        }
      };

      this.socket.onerror = (error) => {
        console.error("❌ WebSocket ERROR occurred!");
        console.error("📄 Error details:", error);
        console.error("🔗 URL was:", wsUrl);
        console.error("👨‍⚕️ Doctor ID was:", doctorId);
        this.isConnecting = false;
      };

      this.socket.onclose = (event) => {
        // console.log("🔌 WebSocket CLOSED");
        // console.log("📊 Close event code:", event.code);
        // console.log("📊 Close event reason:", event.reason);
        // console.log("📊 Was clean:", event.wasClean);
        this.isConnecting = false;
        this.socket = null;

        // Tự động reconnect nếu cần
        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(
            `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,
          );
          setTimeout(() => {
            if (this.doctorId) {
              this.connect(this.doctorId);
            }
          }, this.reconnectDelay);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error("❌ Max reconnection attempts reached. Please check your backend.");
        }
      };
    } catch (error) {
      console.error("💥 Failed to create WebSocket connection!");
      console.error("📄 Error:", error);
      console.error("🔗 URL was:", wsUrl);
      this.isConnecting = false;
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.doctorId = null;
    this.listeners.clear();
    console.log("WebSocket manually disconnected");
  }

  send(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected. Cannot send message.");
    }
  }

  on(eventType: string, callback: WebSocketEventCallback): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
  }

  off(eventType: string, callback: WebSocketEventCallback): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  private notifyListeners(eventType: string, message: WebSocketMessage): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach((callback) => callback(message));
    }
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();

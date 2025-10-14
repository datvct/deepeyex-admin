import { callEventEmitter } from "./callEvents";

// ⚙️ Định nghĩa các interface mô phỏng SDK
interface StringeeAuthResponse {
  r: number;
  userId?: string;
  message?: string;
}

interface StringeeState {
  code: number;
  reason?: string;
}

interface StringeeCall {
  fromNumber: string;
  toNumber: string;
  answer(callback: (res: unknown) => void): void;
  reject(callback: (res: unknown) => void): void;
  makeCall(callback: (res: unknown) => void): void;
  hangup(callback: (res: unknown) => void): void;
  mute(mute: boolean): void;
  on(event: "addremotestream", listener: (stream: MediaStream) => void): void;
  on(event: "addlocalstream", listener: (stream: MediaStream) => void): void;
  on(event: "signalingstate", listener: (state: StringeeState) => void): void;
  on(event: "mediastate", listener: (state: StringeeState) => void): void;
  on(event: "info", listener: (info: unknown) => void): void;
}

interface StringeeClient {
  connect(token: string): void;
  disconnect(): void;
  on(event: "connect", listener: () => void): void;
  on(event: "authen", listener: (res: StringeeAuthResponse) => void): void;
  on(event: "disconnect", listener: () => void): void;
  on(event: "incomingcall", listener: (call: StringeeCall) => void): void;
}

// 🔧 Biến toàn cục quản lý trạng thái
let client: StringeeClient | null = null;
let currentCall: StringeeCall | null = null;

// 🚀 Kết nối tới Stringee
export function connectToStringee(token: string): void {
  if (typeof window === "undefined" || !window.StringeeClient) {
    console.error("❌ Stringee SDK not loaded.");
    return;
  }

  client = new window.StringeeClient();
  client?.connect(token);

  client?.on("connect", () => console.log("✅ Connected to Stringee Server"));

  client?.on("authen", (res) => {
    if (res.r === 0) console.log("✅ Authenticated with Stringee", res);
    else console.error("❌ Authentication failed", res);
  });

  client?.on("disconnect", () => console.log("🔌 Disconnected from Stringee Server"));

  client?.on("incomingcall", (incomingCall) => {
    console.log("📞 Incoming call from:", incomingCall.fromNumber);
    alert(`📞 Incoming call from: ${incomingCall.fromNumber}`);
    currentCall = incomingCall;
    setupCallEvents(currentCall);

    const answer = confirm(`Incoming call from: ${incomingCall.fromNumber}. Answer?`);
    if (answer) {
      currentCall.answer((res) => console.log("Answer result", res));
      callEventEmitter.emit("incoming-call", incomingCall);
    } else {
      currentCall.reject((res) => console.log("Reject result", res));
    }
  });
}

// 🎥 Gọi video/audio
export function makeVideoCall(fromUserId: string, toUserId: string, isVideoCall: boolean): void {
  if (!client || !window.StringeeCall) {
    console.error("❌ Client not initialized or SDK missing.");
    return;
  }

  currentCall = new window.StringeeCall(client, fromUserId, toUserId, isVideoCall);
  console.log(`${isVideoCall ? "🎥" : "📞"} Calling ${toUserId}...`);
  setupCallEvents(currentCall);

  currentCall?.makeCall((res) => {
    console.log("📞 Make call result:", res);
  });
}

// 🎧 Gán sự kiện cho call
function setupCallEvents(call: StringeeCall | null): void {
  if (!call) return;

  call.on("addremotestream", (stream) => {
    console.log("📺 Remote stream added");
    const remoteVideo = document.getElementById("remoteVideo") as HTMLVideoElement | null;
    if (remoteVideo) remoteVideo.srcObject = stream;
  });

  call.on("addlocalstream", (stream) => {
    console.log("📹 Local stream added");
    const localVideo = document.getElementById("localVideo") as HTMLVideoElement | null;
    if (localVideo) localVideo.srcObject = stream;
  });

  call.on("signalingstate", (state) => console.log("🔁 Signaling state:", state));
  call.on("mediastate", (state) => console.log("📡 Media state:", state));
  call.on("info", (info) => console.log("ℹ️ Call info:", info));
}

export function hangupCall(): void {
  if (currentCall) {
    currentCall.hangup((res) => console.log("📴 Call ended", res));
  }
}

export function muteCall(mute: boolean): void {
  if (currentCall) {
    currentCall.mute(mute);
    console.log(`🔇 Call ${mute ? "muted" : "unmuted"}`);
  }
}

export function getStringeeClient(): StringeeClient | null {
  return client;
}

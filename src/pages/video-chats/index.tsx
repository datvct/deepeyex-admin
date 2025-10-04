import React, { useEffect, useRef, useState } from "react";
import {
  VideoIcon,
  PhoneOutgoing,
  Mic,
  MicOff,
  Video,
  VideoOff,
  LayoutList,
  Send,
} from "lucide-react";

// VideoChatPage.jsx
// Single-file React component (Tailwind) that implements a messaging + video call UI.
// - UI only (no signaling / no real WebRTC backend).
// - Simulates local/remote video using getUserMedia when available, but gracefully falls back.
// - Chat panel with messages, typing, emoji placeholder.
// - Controls for call: Start/End, Mute, Camera off, Toggle layout.

export default function VideoChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, from: "Alice", text: "Chào buổi sáng!", ts: new Date() },
    { id: 2, from: "You", text: "Chào Alice — sẵn sàng gọi video không?", ts: new Date() },
  ]);

  const [text, setText] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [layoutGrid, setLayoutGrid] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Try to getUserMedia for local preview (best-effort). No signaling/peer connection is created.
  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, []);

  async function startLocalPreview() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = s;
      if (localVideoRef.current) localVideoRef.current.srcObject = s;
      // mute local preview so you don't hear yourself
      if (localVideoRef.current) localVideoRef.current.muted = true;
    } catch (err) {
      console.warn("getUserMedia failed:", err);
    }
  }

  async function stopLocalPreview() {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
  }

  async function handleStartCall() {
    await startLocalPreview();
    // simulate remote video by cloning local stream into remote element (for demo)
    if (localStreamRef.current && remoteVideoRef.current) {
      // create a cloned stream (fake remote)
      const tracks = localStreamRef.current.getTracks();
      const fakeRemote = new MediaStream();
      tracks.forEach((t) => {
        // clone track if possible (some browsers support), else reuse
        fakeRemote.addTrack(t.clone ? t.clone() : t);
      });
      remoteVideoRef.current.srcObject = fakeRemote;
    }
    setIsCalling(true);
  }

  async function handleEndCall() {
    setIsCalling(false);
    setMuted(false);
    setCameraOff(false);
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    await stopLocalPreview();
  }

  function handleToggleMute() {
    setMuted((v) => {
      const newV = !v;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !newV));
      }
      return newV;
    });
  }

  function handleToggleCamera() {
    setCameraOff((v) => {
      const newV = !v;
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !newV));
      }
      return newV;
    });
  }

  function sendMessage() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const m = { id: Date.now(), from: "You", text: trimmed, ts: new Date() };
    setMessages((arr) => [...arr, m]);
    setText("");
    // fake reply after delay
    setTimeout(() => {
      setMessages((arr) => [
        ...arr,
        { id: Date.now() + 1, from: "Alice", text: "OK, em đang xem", ts: new Date() },
      ]);
    }, 1200);
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto bg-white shadow rounded-lg overflow-hidden grid grid-cols-12">
        <div className="col-span-8 p-4 border-r">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div>
                <div className="font-semibold">Alice</div>
                <div className="text-sm text-gray-500">Online</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLayoutGrid((s) => !s)}
                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
                title="Toggle layout"
              >
                <LayoutList size={16} />
                <span className="text-sm">Layout</span>
              </button>
              {!isCalling ? (
                <button
                  onClick={handleStartCall}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <PhoneOutgoing size={16} /> Start Call
                </button>
              ) : (
                <button
                  onClick={handleEndCall}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <VideoOff size={16} /> End Call
                </button>
              )}
            </div>
          </div>

          <div className={`grid gap-3 ${layoutGrid ? "grid-cols-3" : "grid-cols-1"}`}>
            <div className="relative bg-black rounded-lg overflow-hidden h-80 flex items-center justify-center">
              {cameraOff || !isCalling ? (
                <div className="text-center text-white/80">
                  {isCalling ? "Camera is off" : "No active call"}
                </div>
              ) : (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}

              {/* overlay controls */}
              <div className="absolute left-3 bottom-3 flex items-center gap-2">
                <button
                  onClick={handleToggleMute}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-md flex items-center gap-2"
                >
                  {muted ? <MicOff size={14} /> : <Mic size={14} />} {muted ? "Muted" : "Unmuted"}
                </button>
                <button
                  onClick={handleToggleCamera}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-md flex items-center gap-2"
                >
                  {cameraOff ? <VideoOff size={14} /> : <Video size={14} />}
                  {cameraOff ? "Camera Off" : "Camera On"}
                </button>
              </div>
            </div>

            {/* local preview */}
            <div className="bg-gray-100 rounded-lg overflow-hidden h-40 flex items-center justify-center">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                className="w-fit h-full object-cover"
              />
            </div>
          </div>

          {/* controls below videos */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2"
              >
                {muted ? <MicOff size={16} /> : <Mic size={16} />}
                <span className="text-sm">{muted ? "Unmute" : "Mute"}</span>
              </button>

              <button
                onClick={handleToggleCamera}
                className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2"
              >
                {cameraOff ? <VideoOff size={16} /> : <Video size={16} />}
                <span className="text-sm">{cameraOff ? "Turn Camera On" : "Turn Camera Off"}</span>
              </button>
            </div>

            <div className="text-sm text-gray-500">Call duration: 00:02:13</div>
          </div>
        </div>

        {/* Right: chat area */}
        <div className="col-span-4 p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Conversation</div>
            <div className="text-sm text-gray-500">Active</div>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-3" style={{ maxHeight: 480 }}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`${
                    m.from === "You" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
                  } rounded-lg px-4 py-2 max-w-[75%]`}
                >
                  <div className="text-xs text-white/80 mb-1">{m.from}</div>
                  <div>{m.text}</div>
                  <div className="text-xs text-white/60 mt-1 text-right">
                    {m.ts.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <div className="flex gap-2 items-center">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Viết tin nhắn..."
                className="flex-1 border rounded-md px-3 py-2 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Send size={16} />
                Gửi
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Tip: Nhấn Enter để gửi. Giao diện demo không thực hiện signaling WebRTC.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

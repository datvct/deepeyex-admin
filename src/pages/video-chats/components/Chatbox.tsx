"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Upload, message as antdMessage, Image } from "antd";
import { FaPaperPlane, FaFileAlt, FaImage, FaSmile } from "react-icons/fa";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../../shares/configs/firebase";
import { useUploadFileMutation } from "../../../modules/upload/hooks/mutations/use-upload-file.mutation";

interface Message {
  id: string;
  text?: string;
  sender: string;
  fileUrl?: string;
  fileType?: "image" | "video" | "file" | "text";
  timestamp?: Timestamp;
}

interface ChatBoxProps {
  conversationId: string;
  otherUser: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ conversationId, otherUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const uploadMutation = useUploadFileMutation({
    onError: (err) => {
      console.error("❌ Upload error:", err);
      antdMessage.error("Tải file thất bại!");
    },
    onSuccess: () => {
      antdMessage.success("Tải file thành công!");
    },
  });

  // 🟢 Realtime messages
  useEffect(() => {
    if (!conversationId) return;
    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("timestamp", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(msgs);
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    });

    return () => unsubscribe();
  }, [conversationId]);

  // 🟢 Send message
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    try {
      await addDoc(collection(db, "conversations", conversationId, "messages"), {
        text: trimmed,
        sender: auth.currentUser?.email ?? "Anonymous",
        fileType: "text",
        timestamp: serverTimestamp(),
      });
      setInput("");
    } catch (error) {
      console.error("❌ Send message error:", error);
    }
  };

  // 🟢 Upload and send file
  const handleUpload = async (file: File) => {
    try {
      const res = await uploadMutation.mutateAsync(file);

      let fileType: "image" | "video" | "file" = "file";
      if (file.type.startsWith("image/")) fileType = "image";
      else if (file.type.startsWith("video/")) fileType = "video";

      await addDoc(collection(db, "conversations", conversationId, "messages"), {
        sender: auth.currentUser?.email ?? "Anonymous",
        fileUrl: res?.data?.url,
        fileType,
        timestamp: serverTimestamp(),
      });

      return false;
    } catch (error) {
      console.error("❌ Upload & send file error:", error);
      antdMessage.error("Gửi file thất bại!");
      return false;
    }
  };

  // 🟢 Render content
  const renderMessageContent = (msg: Message) => {
    switch (msg.fileType) {
      case "image":
        return (
          <Image
            src={msg.fileUrl}
            alt="sent-img"
            className="max-w-[200px] max-h-[200px] rounded-lg mt-1 object-cover shadow-sm"
          />
        );
      case "video":
        return (
          <video controls src={msg.fileUrl} className="max-w-[250px] rounded-lg mt-1 shadow-sm" />
        );
      case "file":
        return (
          <a
            href={msg.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 underline mt-1"
          >
            <FaFileAlt /> Tải file
          </a>
        );
      default:
        return (
          msg.text && (
            <div
              className={`p-2 rounded-2xl max-w-[70%] break-words ${
                msg.sender === auth.currentUser?.email
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          )
        );
    }
  };

  // 🟢 Add emoji
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-full bg-white border rounded-xl shadow-md">
      {/* 🔹 Chat list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ maxHeight: "450px" }}
      >
        {messages.map((msg) => {
          const isMe = msg.sender === auth.currentUser?.email;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {renderMessageContent(msg)}
            </div>
          );
        })}
      </div>

      {/* 🔹 Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-16 left-4">
          <EmojiPicker onEmojiClick={onEmojiClick} height={300} />
        </div>
      )}

      {/* 🔹 Input */}
      <div className="flex items-center p-2 border-t bg-gray-50 gap-2 relative">
        <Button
          icon={<FaSmile />}
          onClick={() => setShowEmoji((prev) => !prev)}
          className="rounded-full"
        />

        <Upload
          beforeUpload={handleUpload}
          showUploadList={false}
          accept="image/*,video/*,.pdf,.doc,.zip"
        >
          <Button
            icon={uploadMutation.isPending ? <span className="animate-spin">⏳</span> : <FaImage />}
            disabled={uploadMutation.isPending}
            className="rounded-full"
          />
        </Upload>

        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-grow rounded-lg"
        />

        <Button
          type="primary"
          icon={<FaPaperPlane />}
          onClick={sendMessage}
          disabled={!input.trim()}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default ChatBox;

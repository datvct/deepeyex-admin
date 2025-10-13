"use client";
import React, { useState, useEffect } from "react";
import { Tabs, List, Avatar, Button, Card, message, Spin } from "antd";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { collection, onSnapshot, query, where, doc, setDoc, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../shares/configs/firebase";
import ChatHeader from "./components/VideoCallRoom";
import ChatBox from "./components/Chatbox";

interface Conversation {
  id: string;
  participants: string[];
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  lastMessage?: string;
  appointmentId?: string;
}

const VideoChatPage = () => {
  const [isCheckingMic, setIsCheckingMic] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null); // dùng cho tab lịch sử tư vấn

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("online");
  const [showInfo, setShowInfo] = useState(false);

  const patientEmail = "nguyenlegiabao810@gmail.com";
  const doctorEmail = "baon00382xxx@gmail.com";

  // 🔹 Tạo hội thoại mẫu nếu chưa có
  useEffect(() => {
    const setupConversation = async () => {
      try {
        const q = query(
          collection(db, "conversations"),
          where("participants", "array-contains", patientEmail),
        );
        const snapshot = await getDocs(q);
        const exists = snapshot.docs.find(
          (d) =>
            d.data().participants.includes(patientEmail) &&
            d.data().participants.includes(doctorEmail),
        );

        if (!exists) {
          const convId = "conversation-" + Date.now();
          const conversationRef = doc(db, "conversations", convId);
          await setDoc(conversationRef, {
            participants: [patientEmail, doctorEmail],
            createdAt: new Date(),
            lastMessage: "Xin chào bác sĩ!",
            appointmentId: "appt-" + Date.now(),
          });
          console.log("✅ Đã tạo cuộc hội thoại mẫu giữa 2 email");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tạo conversation mẫu:", err);
      }
    };
    setupConversation();
  }, []);

  // 🔹 Lấy danh sách hội thoại realtime
  useEffect(() => {
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", patientEmail),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Conversation[];
      setConversations(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleJoinRoom = (item: Conversation) => {
    const other = item.participants?.find((p: string) => p !== patientEmail) || "Người dùng khác";
    message.success(`Đang mở chat với ${other}`);
    setSelectedChat(item);
    setShowInfo(false); // Ẩn info khi chuyển cuộc chat
  };

  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      setIsCheckingMic(true);

      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const interval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        let values = 0;
        for (let i = 0; i < dataArray.length; i++) values += dataArray[i];
        const average = values / dataArray.length;
        setMicLevel((prev) => prev * 0.8 + average * 0.2); // làm mượt
      }, 60);

      // Dừng sau 5 giây
      setTimeout(() => {
        clearInterval(interval);
        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();
        setIsCheckingMic(false);
        toast.success("✅ Micro hoạt động bình thường!");
      }, 5000);
    } catch (err) {
      console.error("❌ Lỗi khi kiểm tra micro:", err);
      message.error("Không thể truy cập micro. Hãy kiểm tra quyền trình duyệt!");
    }
  };

  return (
    <div className="aspect-1.85:1 px-4">
      <Card className="h-full rounded-2xl shadow-md overflow-hidden">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={[
            {
              key: "online",
              label: "🎥 Phòng tư vấn trực tuyến",
              children: (
                <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-100 rounded-xl p-6">
                  <ChatHeader userId="7d050ea8-a88d-4b67-9f30-d131f8ab8d0c" />
                </div>
              ),
            },

            {
              key: "history",
              label: "💬 Lịch sử tư vấn",
              children: (
                <div className="flex h-[30vh] md:h-[75vh] xl:h-[60vh]">
                  {/* Sidebar hội thoại */}
                  <div className="w-1/4 border-r bg-white flex flex-col">
                    <div className="p-4 text-lg font-semibold border-b">Danh sách hội thoại</div>
                    {loading ? (
                      <div className="flex-1 flex justify-center items-center">
                        <Spin size="large" />
                      </div>
                    ) : conversations.length > 0 ? (
                      <List
                        className="overflow-y-auto flex-1"
                        itemLayout="horizontal"
                        dataSource={conversations}
                        renderItem={(item) => {
                          const myEmail = patientEmail;
                          const other =
                            item.participants?.find((p: string) => p !== myEmail) ||
                            "Người dùng khác";
                          const isActive = selectedChat?.id === item.id;

                          return (
                            <List.Item
                              className={`cursor-pointer px-4 py-3 hover:bg-gray-100 transition ${
                                isActive ? "bg-blue-50 border-l-4 border-blue-500" : ""
                              }`}
                              onClick={() => handleJoinRoom(item)}
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${other}`}
                                  />
                                }
                                title={<span className="font-semibold">{other}</span>}
                                description={item.lastMessage || "Chưa có tin nhắn"}
                              />
                            </List.Item>
                          );
                        }}
                      />
                    ) : (
                      <div className="text-center text-gray-400 mt-10">
                        Không có cuộc hội thoại nào.
                      </div>
                    )}
                  </div>

                  {/* Chat + Info */}
                  <div className="flex-1 flex bg-gray-50">
                    {selectedChat ? (
                      <>
                        {/* Khu vực chat */}
                        <div className={`flex flex-col w-${showInfo ? "2/3" : "full"} border-r`}>
                          {/* Header */}
                          <div className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                                  selectedChat.participants.find(
                                    (p: string) => p !== patientEmail,
                                  ) || "User"
                                }`}
                                size={48}
                              />
                              <div>
                                <p className="font-semibold text-lg text-gray-800">
                                  {selectedChat.participants.find(
                                    (p: string) => p !== patientEmail,
                                  ) || "Người dùng khác"}
                                </p>
                                <p className="text-xs text-green-600">Đang hoạt động</p>
                              </div>
                            </div>

                            {/* Icon Info */}
                            <Button
                              type="text"
                              icon={<AiOutlineInfoCircle size={22} />}
                              onClick={() => setShowInfo(!showInfo)}
                            />
                          </div>

                          {/* ChatBox */}
                          <div className="flex-1 overflow-y-auto bg-gray-50">
                            <ChatBox
                              conversationId={selectedChat.id}
                              otherUser={
                                selectedChat.participants.find((p: string) => p !== patientEmail) ||
                                "Người dùng khác"
                              }
                            />
                          </div>
                        </div>

                        {/* Khu vực thông tin bên phải */}
                        {showInfo && (
                          <div className="w-1/3 bg-white p-4 flex flex-col border-l shadow-inner">
                            <h3 className="text-lg font-semibold mb-4">Thông tin hội thoại</h3>

                            <div className="flex items-center gap-3 mb-4">
                              <Avatar
                                size={60}
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                                  selectedChat.participants.find(
                                    (p: string) => p !== patientEmail,
                                  ) || "User"
                                }`}
                              />
                              <div>
                                <p className="font-semibold text-base">
                                  {selectedChat.participants.find(
                                    (p: string) => p !== patientEmail,
                                  ) || "Người dùng khác"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {selectedChat.participants.join(", ")}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Ngày tạo: </span>
                                {new Date(
                                  (selectedChat.createdAt?.seconds ??
                                    Math.floor(Date.now() / 1000)) * 1000,
                                ).toLocaleString()}
                              </p>
                              <p>
                                <span className="font-medium">Mã cuộc hẹn: </span>
                                {selectedChat.appointmentId || "Không có"}
                              </p>
                              <p>
                                <span className="font-medium">Tin nhắn cuối: </span>
                                {selectedChat.lastMessage || "Không có"}
                              </p>
                            </div>

                            <div className="mt-5 border-t pt-3 text-center">
                              <Button type="default" danger>
                                Xóa cuộc hội thoại
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col justify-center items-center w-full text-gray-400 text-lg">
                        💬 Hãy chọn một cuộc hội thoại để bắt đầu
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default VideoChatPage;

"use client";
import React, { useState, useEffect } from "react";
import { Tabs, List, Avatar, Button, Card, message, Spin } from "antd";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../shares/configs/firebase";
import ChatHeader from "./components/VideoCallRoom";
import ChatBox from "./components/Chatbox";
import { RootState, useAppSelector } from "../../shares/stores";
import { useGetAppointmentsOnline } from "../../modules/appointments/hooks/queries/use-get-appointments-online";
import { Appointment } from "../../modules/appointments/types/appointment";

interface Conversation {
  id: string;
  participants: string[];
  doctorInfo: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  patientInfo: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  lastAppointmentId?: string;
  lastMessage?: string;
  createdAt?: { seconds: number; nanoseconds: number };
  updatedAt?: { seconds: number; nanoseconds: number };
}

const Consultation = () => {
  const [isCheckingMic, setIsCheckingMic] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null); // dùng cho tab lịch sử tư vấn

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("online");
  const [showInfo, setShowInfo] = useState(false);

  const user_id = useAppSelector((state: RootState) => state.auth.doctor?.doctor_id);
  const user_id1 = useAppSelector((state: RootState) => state.auth.userId);
  const auth = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user_id) return;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user_id),
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Conversation[];
        setConversations(data);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Lỗi khi lấy danh sách hội thoại:", error);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [user_id]);

  const handleJoinRoom = (item: Conversation) => {
    const isPatient = auth?.role === "patient";
    const other = isPatient ? item.doctorInfo : item.patientInfo;

    message.success(`Đang mở chat với ${other.name}`);
    setSelectedChat(item);
    setShowInfo(false);
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

  const { data, isLoading, isError } = useGetAppointmentsOnline({
    doctor_id: user_id || "",
  });

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
                <div className="flex flex-col gap-5">
                  {/** Gọi API lấy danh sách lịch tư vấn online */}
                  {(() => {
                    if (isLoading) {
                      return (
                        <div className="flex justify-center items-center h-40">
                          <Spin size="large" />
                        </div>
                      );
                    }

                    if (isError || !data?.data?.length) {
                      return (
                        <div className="text-center text-gray-400 mt-6">
                          Không có lịch tư vấn trực tuyến nào.
                        </div>
                      );
                    }

                    return (
                      <>
                        {data.data.map((appointment: Appointment) => (
                          <div
                            key={appointment.appointment_id}
                            className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer space-x-4"
                          >
                            {/* Thông tin bác sĩ */}
                            <div className="flex items-center gap-4">
                              {/* Avatar */}
                              <Avatar
                                src={
                                  appointment.patient.image ||
                                  `https://api.dicebear.com/7.x/initials/svg?seed=${appointment.patient.full_name}`
                                }
                                className="w-12 h-12"
                              />

                              {/* Info */}
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-800 text-base">
                                  {appointment.patient.full_name || "Bác sĩ"}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {new Date(appointment.time_slots[0].start_time).toLocaleString()}
                                </span>
                                <span className="mt-1 px-2 py-1 w-max rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {appointment.status === "PENDING_ONLINE"
                                    ? "Đang chờ"
                                    : appointment.status === "CONFIRMED_ONLINE"
                                    ? "Đã xác nhận"
                                    : "Hoàn tất"}
                                </span>
                              </div>
                            </div>

                            {/* Nút gọi video */}
                            <div>
                              <ChatHeader userId={appointment.patient.user_id} />
                            </div>
                          </div>
                        ))}
                      </>
                    );
                  })()}
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
                          const isPatient = auth?.role === "patient";
                          const other = isPatient ? item.doctorInfo : item.patientInfo;
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
                                    src={
                                      other.avatar ||
                                      `https://api.dicebear.com/7.x/initials/svg?seed=${other.name}`
                                    }
                                  />
                                }
                                title={<span className="font-semibold">{other.name}</span>}
                                description={
                                  item.lastMessage ? (
                                    item.lastMessage
                                  ) : (
                                    <span className="text-gray-400 italic">Chưa có tin nhắn</span>
                                  )
                                }
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
                                src={
                                  (auth?.role === "patient"
                                    ? selectedChat.doctorInfo.avatar
                                    : selectedChat.patientInfo.avatar) ||
                                  `https://api.dicebear.com/7.x/initials/svg?seed=${
                                    auth?.role === "patient"
                                      ? selectedChat.doctorInfo.name
                                      : selectedChat.patientInfo.name
                                  }`
                                }
                                size={48}
                              />
                              <div>
                                <p className="font-semibold text-lg text-gray-800">
                                  {auth?.role === "patient"
                                    ? selectedChat.doctorInfo.name
                                    : selectedChat.patientInfo.name}
                                </p>
                                <p className="text-xs text-green-600">Đang hoạt động</p>
                              </div>
                            </div>

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
                                user_id === selectedChat.doctorInfo.id
                                  ? selectedChat.patientInfo
                                  : selectedChat.doctorInfo
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
                                src={
                                  auth?.role === "patient"
                                    ? selectedChat.doctorInfo.avatar
                                    : selectedChat.patientInfo.avatar
                                }
                              />
                              <div>
                                <p className="font-semibold text-base">
                                  {auth?.role === "patient"
                                    ? selectedChat.doctorInfo.name
                                    : selectedChat.patientInfo.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {selectedChat.participants.join(", ")}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Ngày tạo: </span>
                                {selectedChat.createdAt
                                  ? new Date(selectedChat.createdAt.seconds * 1000).toLocaleString()
                                  : "Không rõ"}
                              </p>
                              <p>
                                <span className="font-medium">Mã cuộc hẹn cuối: </span>
                                {selectedChat.lastAppointmentId || "Không có"}
                              </p>
                              <p>
                                <span className="font-medium">Tin nhắn cuối: </span>
                                {selectedChat.lastMessage || "Không có"}
                              </p>
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

export default Consultation;

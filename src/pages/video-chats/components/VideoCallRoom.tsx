"use client";
import { useState, useRef, useEffect } from "react";
import { ImPhoneHangUp } from "react-icons/im";
import { FaVolumeMute } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../shares/stores";
import { callEventEmitter } from "../../../shares/utils/callEvents";
import { hangupCall, makeVideoCall, muteCall } from "../../../shares/utils/stringee";
import { Button } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import React from "react";

interface ChatHeaderProps {
  userId?: string;
}

interface IncomingCall {
  fromNumber: string;
  toNumber: string;
  callId: string;
  isVideo: boolean;
}

const ChatHeader = ({ userId }: ChatHeaderProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [mute, setMute] = useState(true);
  const userSenderId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = (incomingCall: IncomingCall) => {
      console.log("📞 Received call in component!", incomingCall);
      setOpenModal(true);
    };

    callEventEmitter.on("incoming-call", handler);

    return () => {
      callEventEmitter.off("incoming-call", handler); // cleanup
    };
  }, [setOpenModal]);

  const handleCall = (isCallVideo: boolean) => {
    console.log("user2:" + userId);
    console.log("user1:" + userSenderId?.toString());
    setOpenModal(true);
    if (userId != "0") makeVideoCall(userSenderId?.toString() || "", userId || "", isCallVideo);
  };

  const hangup = () => {
    hangupCall();
    setOpenModal(false);
  };

  const muteFunction = () => {
    setMute(!mute);
    muteCall(mute);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <div className="flex items-center justify-between space-x-3 border-b border-white">
      <div className="flex items-center flex-row justify-between w-full">
        {/* Các nút chức năng */}
        <div className="flex gap-2.5">
          <Button
            className="!bg-gradient-to-tr from-[#1250dc] to-[#306de4] rounded-full flex items-center justify-center !text-white"
            onClick={() => handleCall(true)}
            icon={<VideoCameraOutlined size={20} color="white" className="!text-white" />}
          >
            {t("videoChat.call.joinVideoCall")}
          </Button>
        </div>
      </div>
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1a1a1a] p-6 rounded-lg w-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-semibold">{t("videoChat.call.videoCall")}</h2>
              <button onClick={handleCancel} className="text-white text-2xl hover:text-red-500">
                ×
              </button>
            </div>

            <div className="flex gap-4 justify-center">
              <video
                id="localVideo"
                muted
                playsInline
                autoPlay
                className="w-48 h-36 bg-black rounded-lg"
              />
              <video
                id="remoteVideo"
                playsInline
                autoPlay
                className="w-48 h-36 bg-black rounded-lg"
              />
            </div>

            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={hangup}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                <ImPhoneHangUp />
              </button>
              <button
                onClick={muteFunction}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                <FaVolumeMute />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;

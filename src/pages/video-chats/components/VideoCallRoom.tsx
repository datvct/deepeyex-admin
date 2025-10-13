"use client";
import { useState, useRef, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import { ImPhoneHangUp } from "react-icons/im";
import { FaVolumeMute } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../shares/stores";
import { callEventEmitter } from "../../../shares/utils/callEvents";
import { hangupCall, makeVideoCall, muteCall } from "../../../shares/utils/stringee";

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
    <div className="flex items-center justify-between space-x-3 mb-4 border-b border-white pb-4">
      <div className="flex items-center flex-row justify-between w-full">
        <div className="flex items-center gap-3">
          {/* <Image
            src={avatar ? avatar : Images.AvatarDefault}
            alt={name ? name : "Avatar"}
            className="w-[3.125rem] h-[3.125rem] rounded-[30px] object-cover"
            width={50}
            height={50}
          /> */}
          <div>
            {/* <h2 className="text-lg font-bold">{name}</h2> */}
            {/* <p className="text-sm text-gray-400">
              {isUserOnline ? (
                <>
                  <span className="inline-block w-[12px] h-[12px] rounded-full bg-green-500 mr-1" />
                  <span>Online</span>
                </>
              ) : (
                ""
              )}
            </p> */}
          </div>
        </div>
        {/* Các nút chức năng */}
        <div className="flex gap-2.5">
          <button
            className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center"
            onClick={() => handleCall(false)}
          >
            <FaPhoneAlt size={20} color="white" className="text-white" />
          </button>
          <button
            className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center"
            onClick={() => handleCall(true)}
          >
            <IoMdVideocam size={20} color="white" className="text-white" />
          </button>
        </div>
      </div>
      {/* <div className="flex gap-4 mt-4">
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
        <button onClick={hangup}>Hang up</button>
      </div> */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1a1a1a] p-6 rounded-lg w-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-semibold">Video Call</h2>
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

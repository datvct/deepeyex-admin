import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Layout, Menu, MenuProps, Dropdown, Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaFilePrescription,
  FaHome,
  FaHospital,
  FaHospitalUser,
  FaPills,
  FaUser,
  FaStethoscope,
  FaRobot,
} from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { ChevronLeft, ChevronRight, Globe, LogOut, VideotapeIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { persistor, RootState, useAppDispatch } from "../stores";
import { clearTokens } from "../stores/authSlice";

const { Sider } = Layout;

interface CustomMenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  url?: string;
  children?: CustomMenuItem[];
}

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  const currentPath = location.pathname;

  const { role } = useSelector((state: RootState) => state.auth);
  const fullMenuItems: CustomMenuItem[] = [
    {
      key: "dashboard",
      label: t("sidebar.dashboard"),
      icon: <FaHome className="w-5 h-5" />,
      url: "/",
    },
    {
      key: "users",
      label: t("sidebar.users"),
      icon: <FaUser className="w-5 h-5" />,
      url: "/users",
    },
    {
      key: "hospitals",
      label: t("sidebar.hospitals"),
      icon: <FaHospital className="w-5 h-5" />,
      url: "/hospitals",
    },
    {
      key: "doctors",
      label: t("sidebar.doctors"),
      icon: <FaUserDoctor className="w-5 h-5" />,
      url: "/doctors",
    },
    {
      key: "patients",
      label: t("sidebar.patients"),
      icon: <FaHospitalUser className="w-5 h-5" />,
      url: "/patients",
    },
    {
      key: "drugs",
      label: t("sidebar.drugs"),
      icon: <FaPills className="w-5 h-5" />,
      url: "/drugs",
    },
    {
      key: "orders",
      label: t("sidebar.orders"),
      icon: <FaFilePrescription className="w-5 h-5" />,
      url: "/orders",
    },
    {
      key: "timeslots",
      label: t("sidebar.timeslots"),
      icon: <FaCalendarAlt className="w-5 h-5" />,
      url: "/timeslots",
    },
    {
      key: "appointments",
      label: t("sidebar.appointments"),
      icon: <FaCalendarCheck className="w-5 h-5" />,
      url: "/appointments",
    },
    {
      key: "video-chat",
      label: t("sidebar.videoChat"),
      icon: <VideotapeIcon className="w-5 h-5" />,
      url: "/video-chat",
    },
    {
      key: "schedule",
      label: t("sidebar.schedule"),
      icon: <FaCalendarCheck className="w-5 h-5" />,
      url: "/schedule",
    },
    {
      key: "generate-time-slot",
      label: t("sidebar.generateTimeSlot"),
      icon: <FaCalendarAlt className="w-5 h-5" />,
      url: "/generate-time-slot",
    },
    {
      key: "services",
      label: t("sidebar.services"),
      icon: <FaPills className="w-5 h-5" />,
      url: "/services",
    },
    {
      key: "doctor-consultation",
      label: t("sidebar.doctorConsultation"),
      icon: <FaStethoscope className="w-5 h-5" />,
      url: "/doctor-consultation",
    },
    {
      key: "ai-diagnosis",
      label: t("sidebar.aiDiagnosis"),
      icon: <FaRobot className="w-5 h-5" />,
      url: "/ai-diagnosis",
    },
  ];

  const menuItems = useMemo(() => {
    if (role === "admin")
      return fullMenuItems.filter((item) => !["generate-time-slot", "schedule"].includes(item.key));

    if (role === "doctor") {
      return fullMenuItems.filter((item) =>
        [
          "appointments",
          "timeslots",
          "video-chat",
          "dashboard",
          "schedule",
          "services",
          "doctor-consultation",
          "ai-diagnosis",
        ].includes(item.key),
      );
    }
    if (role === "hospital") {
      return fullMenuItems.filter((item) =>
        ["generate-time-slot", "dashboard", "services"].includes(item.key),
      );
    }

    return [];
  }, [role, t]);

  useEffect(() => {
    const pathSegments = currentPath.split("/").filter(Boolean);
    const key = pathSegments.length > 0 ? pathSegments[0] : "dashboard";
    setSelectedKey([key]);
  }, [currentPath]);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 1450);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = useCallback(() => setIsCollapsed((prev) => !prev), []);

  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      const target = menuItems.find((item) => item.key === key);
      if (target?.url) navigate(target.url);
    },
    [navigate, menuItems],
  );

  const transformedMenuItems = useMemo(() => {
    const transform = (items: CustomMenuItem[]): MenuProps["items"] =>
      items.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
        children: item.children ? transform(item.children) : undefined,
      })) as MenuProps["items"];
    return transform(menuItems);
  }, [menuItems]);

  const changeLanguage = (lang: "vi" | "en") => {
    i18n.changeLanguage(lang);
    setIsLangModalVisible(false);
  };

  const settingsItems: MenuProps["items"] = [
    {
      key: "change-language",
      icon: <Globe size={18} />,
      label: <span>{t("sidebar.changeLanguage")}</span>,
      onClick: () => setIsLangModalVisible(true),
    },
    {
      key: "logout",
      icon: <LogOut size={18} className="text-red-500" />,
      label: <span className="text-red-500">{t("sidebar.logout")}</span>,
      onClick: () => {
        dispatch(clearTokens());
        persistor.purge();
        navigate("/login");
      },
    },
  ];

  return (
    <>
      <Sider
        className="!bg-[#f5f6f9] fixed top-0 left-0 h-screen border-r border-gray-200 transition-all duration-300 flex flex-col"
        width={230}
        collapsed={isCollapsed}
        collapsedWidth={80}
      >
        {/* Nút toggle */}
        <div
          className="absolute -right-1 top-9 text-white p-1 bg-blue-400 rounded-full z-20 cursor-pointer hover:scale-125 transition-all duration-200"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight size={16} color="white" />
          ) : (
            <ChevronLeft size={16} color="white" />
          )}
        </div>

        {/* Logo */}
        <div className="border-[0.5px] border-gray-200 bg-white rounded-lg drop-shadow-md shadow-gray-200 flex-1 flex flex-col h-full">
          <div className="drop-shadow-sm shadow-gray-200 sticky top-0 z-10 bg-white">
            <div className="flex flex-row items-center justify-center py-3 px-4 w-full relative">
              <img
                src={"/logo.jpg"}
                alt="Logo"
                className={`${
                  isCollapsed ? "translate-x-0" : "-translate-x-3"
                } w-10 h-10 rounded-full transition-all duration-200 cursor-pointer`}
                onClick={() => navigate("/")}
              />
              <div
                className={`ml-3 text-center font-semibold text-xl text-[#141414d1] transition-all duration-100 cursor-pointer ${
                  isCollapsed ? "opacity-0 absolute translate-x-10" : "opacity-100 translate-x-0"
                }`}
                onClick={() => navigate("/")}
              >
                Deepeyex
              </div>
            </div>
            <hr className="border-t border-[#8c8c8c48]" />
          </div>

          <Menu
            theme="light"
            defaultSelectedKeys={["dashboard"]}
            selectedKeys={selectedKey}
            mode="inline"
            inlineCollapsed={isCollapsed}
            items={transformedMenuItems}
            onClick={handleMenuClick}
            className="border-e-0 !p-2 flex-1"
          />

          <div className="p-2 flex justify-center mb-3">
            <Dropdown menu={{ items: settingsItems }} placement="topCenter" arrow>
              <div className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-all">
                <IoIosSettings className="w-5 h-5 text-gray-600" />
                {!isCollapsed && (
                  <span className="text-sm font-medium mt-1" onClick={(e) => e.stopPropagation()}>
                    {t("sidebar.settings")}
                  </span>
                )}
              </div>
            </Dropdown>
          </div>
        </div>
      </Sider>

      <Modal
        title={t("sidebar.changeLanguage")}
        open={isLangModalVisible}
        footer={null}
        onCancel={() => setIsLangModalVisible(false)}
      >
        <div className="flex justify-around items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
            alt="Vietnamese"
            className="w-16 h-16 cursor-pointer hover:scale-110 transition-all duration-200"
            onClick={() => changeLanguage("vi")}
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
            alt="English"
            className="w-16 h-16 cursor-pointer hover:scale-110 transition-all duration-200"
            onClick={() => changeLanguage("en")}
          />
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Layout, Menu, MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaHospital, FaHospitalUser, FaUser } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { ChevronLeft, ChevronRight } from "lucide-react";

import logo from "../../assets/logo.jpg";

const { Sider } = Layout;

interface CustomMenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  url?: string;
  children?: CustomMenuItem[];
}

const menuItems: CustomMenuItem[] = [
  {
    key: "dashboard",
    label: "Trang chủ",
    icon: <FaHome className="w-5 h-5" />,
    url: "/",
  },
  {
    key: "users",
    label: "Quản lý người dùng",
    icon: <FaUser className="w-5 h-5" />,
    url: "/users",
  },
  {
    key: "hospitals",
    label: "Quản lý bệnh viện",
    icon: <FaHospital className="w-5 h-5" />,
    url: "/hospitals",
  },
  {
    key: "doctors",
    label: "Quản lý bác sĩ",
    icon: <FaUserDoctor className="w-5 h-5" />,
    url: "/doctors",
  },
  {
    key: "patients",
    label: "Quản lý bệnh nhân",
    icon: <FaHospitalUser className="w-5 h-5" />,
    url: "/patients",
  },
  {
    key: "settings",
    label: "Cài đặt",
    icon: <IoIosSettings className="w-5 h-5" />,
    url: "/setting",
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentPath = location.pathname;

  useEffect(() => {
    const pathSegments = currentPath.split("/").filter(Boolean);
    const key = pathSegments.length > 0 ? pathSegments[0] : "dashboard";
    setSelectedKey([key]);
  }, [currentPath]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1450);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const transformedMenuItems = useMemo(() => {
    const transform = (items: CustomMenuItem[]): MenuProps["items"] =>
      items.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
        children: item.children ? transform(item.children) : undefined,
      })) as MenuProps["items"];

    return transform(menuItems);
  }, []);

  /** Click menu item -> điều hướng */
  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      const target = menuItems.find((item) => item.key === key);
      if (target?.url) {
        navigate(target.url);
      }
    },
    [navigate],
  );

  return (
    <Sider
      className="!bg-[#f5f6f9] fixed top-0 left-0 h-screen border-r border-gray-200 transition-all duration-300"
      width={230}
      collapsed={isCollapsed}
      collapsedWidth={80}
    >
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

      <div className="border-[0.5px] border-gray-200  bg-white rounded-lg drop-shadow-md shadow-gray-200 h-full ">
        <div className="drop-shadow-sm shadow-gray-200 sticky top-0 z-10 bg-white">
          <div className="flex flex-row items-center justify-center py-3 px-4 w-full relative">
            <img
              src={logo}
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
          className="border-e-0 !p-2"
        />
      </div>
    </Sider>
  );
};

export default Sidebar;

import logo from "../../assets/logo.jpg";

import { Tooltip } from "antd";
import type { JSX } from "react";
import React from "react";
import { FaHome, FaHospital, FaHospitalUser, FaUser } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

interface SidebarIconProps {
  icon: JSX.Element;
  tooltip: string;
  to: string;
  active: boolean;
}

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="w-20 h-screen bg-white text-white flex flex-col items-center py-5 space-y-6 fixed border-r border-blue-50">
      <header className="flex items-center justify-center p-2 cursor-pointer">
        <Link to={"/"} className="font-bold text-xl text-white">
          <img src={logo} alt="Logo" className="w-full h-full" />
        </Link>
      </header>
      <main className="flex flex-col justify-between w-full h-full">
        <div id="menu">
          <SidebarIcon
            icon={<FaHome className="w-auto h-6 hover:text-[#000]" color="#64748b" />}
            tooltip="Trang Chủ"
            to="/"
            active={location.pathname === "/"}
          />
          <SidebarIcon
            icon={<FaUser className="w-6 h-6 hover:text-[#000]" color="#64748b" />}
            tooltip="Quản lý người dùng"
            to="/users"
            active={location.pathname === "/users"}
          />

          <SidebarIcon
            icon={<FaHospital className="w-6 h-6 hover:text-[#000]" color="#64748b" />}
            tooltip="Quản lý bệnh viện"
            to="/hospitals"
            active={location.pathname === "/hospitals"}
          />

          <SidebarIcon
            icon={<FaUserDoctor className="w-6 h-6 hover:text-[#000]" color="#64748b" />}
            tooltip="Quản lý bác sĩ"
            to="/doctors"
            active={location.pathname === "/doctors"}
          />
          <SidebarIcon
            icon={<FaHospitalUser className="w-6 h-6 hover:text-[#000]" color="#64748b" />}
            tooltip="Quản lý bệnh nhân"
            to="/patients"
            active={location.pathname === "/patients"}
          />
        </div>
        <SidebarIcon
          icon={<IoIosSettings className="w-6 h-6 hover:text-[#000]" color="#64748b" />}
          tooltip="Settings"
          to="/"
          active={location.pathname === "/setting"}
        />
      </main>
    </aside>
  );
};

const SidebarIcon: React.FC<SidebarIconProps> = ({ icon, tooltip, to, active }) => (
  <Tooltip title={tooltip} placement="right">
    <Link to={to} className="flex items-center justify-center">
      <div
        className={`p-2 rounded-lg cursor-pointer transition-all ${
          active ? "bg-[#f1f5f9]" : "hover:bg-gray-200"
        }`}
      >
        {icon}
      </div>
    </Link>
  </Tooltip>
);
export default Sidebar;

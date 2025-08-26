import {
  HomeIcon,
  UserIcon,
  CogIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import type { JSX } from "react";
import { Link, useLocation } from "react-router";
import { Tooltip } from "antd";

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
          <img src="/logo.jpg" alt="Logo" className="w-full h-full" />
        </Link>
      </header>
      <main className="flex flex-col justify-between w-full h-full">
        <div id="menu">
          <SidebarIcon
            icon={
              <HomeIcon
                className="w-auto h-6 hover:text-[#000]"
                color="#64748b"
              />
            }
            tooltip="Trang Chủ"
            to="/"
            active={location.pathname === "/"}
          />
          <SidebarIcon
            icon={
              <UserIcon className="w-6 h-6 hover:text-[#000]" color="#64748b" />
            }
            tooltip="Quản lý người dùng"
            to="/users"
            active={location.pathname === "/users"}
          />

          <SidebarIcon
            icon={
              <StarIcon className="w-6 h-6 hover:text-[#000]" color="#64748b" />
            }
            tooltip="Review"
            to="/reviews"
            active={location.pathname === "/reviews"}
          />
        </div>
        <SidebarIcon
          icon={
            <CogIcon className="w-6 h-6 hover:text-[#000]" color="#64748b" />
          }
          tooltip="Settings"
          to="/"
          active={location.pathname === "/setting"}
        />
      </main>
    </aside>
  );
};

const SidebarIcon: React.FC<SidebarIconProps> = ({
  icon,
  tooltip,
  to,
  active,
}) => (
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

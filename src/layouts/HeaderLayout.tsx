import React from "react";
import { Layout, Dropdown, AutoComplete, Tooltip, type MenuProps } from "antd";
import { LogOut, UserCog, UserPen, LockKeyhole, RefreshCw } from "lucide-react";
import Breadcrumbs from "../shares/components/Breadcrumbs";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const HeaderLayout = () => {
  const navigate = useNavigate();

  // Menu dropdown cho tài khoản
  const accountItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserPen size={18} />,
      label: <span>Thông tin tài khoản</span>,
      onClick: () => navigate("/profile"),
    },
    {
      key: "change-password",
      icon: <LockKeyhole size={18} />,
      label: <span>Đổi mật khẩu</span>,
      onClick: () => navigate("/change-password"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={18} className="text-red-500" />,
      label: <span className="text-red-500">Đăng xuất</span>,
      onClick: () => {
        console.log("Đăng xuất");
      },
    },
  ];

  return (
    <Header className="!bg-white !h-fit p-2 rounded-lg shadow-md sticky top-0 z-50 !px-5">
      <div className="flex justify-between items-center">
        <Breadcrumbs />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Tooltip title="Làm mới trang" placement="bottom">
              <div
                onClick={() => window.location.reload()}
                className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <RefreshCw className="w-5 h-5 text-gray-600 hover:text-blue-500" />
              </div>
            </Tooltip>

            <Dropdown menu={{ items: accountItems }} placement="bottomRight" arrow>
              <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded-md transition-all">
                <UserCog className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Admin</span>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default HeaderLayout;

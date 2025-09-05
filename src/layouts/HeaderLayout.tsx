import { Dropdown, type MenuProps } from "antd";
import { FaRegUserCircle } from "react-icons/fa";
import React from "react";
import Breadcrumbs from "../shares/components/Breadcrumbs";

const HeaderLayout = () => {
  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Đăng xuất",
      // onClick: logout,
    },
  ];

  return (
    <header className="flex justify-between px-3 py-2">
      <Breadcrumbs />

      <div className="flex gap-3 items-center">
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <div className="flex items-center gap-2 cursor-pointer">
            <FaRegUserCircle  className="w-10 h-10 text-gray-500 hover:text-black" />
            <span className="font-medium">Admin</span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default HeaderLayout;

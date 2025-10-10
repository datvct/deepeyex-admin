import React from "react";
import { Layout, Dropdown, Tooltip, type MenuProps } from "antd";
import { LogOut, UserCog, UserPen, LockKeyhole, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../shares/components/Breadcrumbs";
import { persistor, RootState, useAppDispatch } from "../shares/stores";
import { clearTokens } from "../shares/stores/authSlice";
import { useSelector } from "react-redux";

const { Header } = Layout;

const HeaderLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { doctor } = useSelector((state: RootState) => state.auth);
  // Menu dropdown cho tài khoản
  const accountItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserPen size={18} />,
      label: <span>{t("header.profile")}</span>,
      onClick: () => navigate("/profile"),
    },
    {
      key: "change-password",
      icon: <LockKeyhole size={18} />,
      label: <span>{t("header.changePassword")}</span>,
      onClick: () => navigate("/change-password"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={18} className="text-red-500" />,
      label: <span className="text-red-500">{t("header.logout")}</span>,
      onClick: () => {
        dispatch(clearTokens());
        persistor.purge();
        navigate("/login");
      },
    },
  ];

  return (
    <Header className="!bg-white !h-fit p-2 rounded-lg shadow-md sticky top-0 z-50 !px-5">
      <div className="flex justify-between items-center">
        <Breadcrumbs />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Tooltip title={t("header.refresh")} placement="bottom">
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
                <span className="font-medium">{doctor?.full_name}</span>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default HeaderLayout;

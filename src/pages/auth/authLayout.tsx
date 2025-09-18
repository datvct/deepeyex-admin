import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../shares/stores";

export default function AuthLayout() {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

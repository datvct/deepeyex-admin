import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../shares/stores";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // role nào được phép vào
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { role } = useSelector((state: RootState) => state.auth);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

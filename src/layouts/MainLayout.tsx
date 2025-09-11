import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import HeaderLayout from "./HeaderLayout";
import React from "react";
import Sidebar from "../shares/components/SideBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{ zIndex: 9999 }}
      />

      <main className="flex h-screen overflow-hidden">
        <Sidebar />

        <section className="flex-1 flex flex-col overflow-y-auto p-2 pt-0">
          <HeaderLayout />
          <div className="flex-1 px-2 pt-2">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}

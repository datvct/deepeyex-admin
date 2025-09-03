import { Outlet } from "react-router";
import Sidebar from "../shared/components/SideBar";
import { ToastContainer } from "react-toastify";
import HeaderLayout from "./HeaderLayout";

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

      <main className="flex">
        <Sidebar />
        <section className="flex-1 py-5 pl-20">
          <HeaderLayout />
          <Outlet />
        </section>
      </main>
    </div>
  );
}

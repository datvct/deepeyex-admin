import { Navigate, Route, Routes } from "react-router-dom";
import history from ".";
import { HistoryRouter } from "./history-router";
import MainLayout from "../layouts/MainLayout";
import { Paths } from "../constants/path-routers";
import LoginPage from "../pages/auth";
import UserPage from "../pages/users";
import DoctorsPage from "../pages/doctors";
import HospitalsPage from "../pages/hospitals";
import PatientsPage from "../pages/patients";
import DrugsPage from "../pages/drugs";
import OrdersPage from "../pages/orders";
import TimeSlotsPage from "../pages/time-slots";
import AppointmentsPage from "../pages/apppointments";
import DashboardPage from "../pages/dashboard";
import AuthLayout from "../pages/auth/authLayout";
import VideoChatPage from "../pages/video-chats";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../shares/constants/roles";
import Forbidden403 from "../shares/components/Forbidden403";
import WeeklyScheduleWithModal from "../pages/schedule";
import React from "react";
import HospitalScheduleManager from "../pages/generate-time-slots";
import ServicesPage from "../pages/services";
import DoctorConsultationPage from "../pages/doctor-consultation";
import AIDiagnosisPage from "../pages/ai-diagnosis";

export const Navigator = () => {
  return (
    <HistoryRouter history={history}>
      <Routes>
        <Route path={Paths.LOGIN.DETAIL.PATH} element={<LoginPage />} />
        {/*  <Route
          path={Paths.RESET_PASSWORD.DETAIL.PATH}
          element={<ResetPasswordPage />}
        /> */}
        <Route element={<AuthLayout />}>
          <Route element={<MainLayout />}>
            <Route
              path={Paths.DASHBOARD.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.HOSPITAL]}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.USERS.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <UserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.DOCTORS.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <DoctorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.HOSPITALS.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <HospitalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.PATIENTS.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <PatientsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.DRUGS.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR]}>
                  <DrugsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.ORDERS.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR]}>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.TIMESLOTS.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR]}>
                  <TimeSlotsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.APPOINTMENTS.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR]}>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.VIDEOCHAT.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR]}>
                  <VideoChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.SCHEDULE.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.DOCTOR]}>
                  <WeeklyScheduleWithModal />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.GENERATE_TIME_SLOT.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.HOSPITAL]}>
                  <HospitalScheduleManager />
                </ProtectedRoute>
              }
            />
            <Route path={Paths.SERVICES.DETAIL.PATH} element={<ServicesPage />} />
            <Route
              path={Paths.DOCTOR_CONSULTATION.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.DOCTOR]}>
                  <DoctorConsultationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={Paths.AI_DIAGNOSIS.DETAIL.PATH}
              element={
                <ProtectedRoute roles={[ROLES.DOCTOR]}>
                  <AIDiagnosisPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
        <Route path="/403" element={<Forbidden403 />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HistoryRouter>
  );
};

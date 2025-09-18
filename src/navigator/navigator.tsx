import React from "react";
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
            <Route path={Paths.DASHBOARD.DETAIL.PATH} element={<DashboardPage />} />
            <Route path={Paths.USERS.DETAIL.PATH} element={<UserPage />} />
            <Route path={Paths.DOCTORS.DETAIL.PATH} element={<DoctorsPage />} />
            <Route path={Paths.HOSPITALS.DETAIL.PATH} element={<HospitalsPage />} />
            <Route path={Paths.PATIENTS.DETAIL.PATH} element={<PatientsPage />} />
            <Route path={Paths.DRUGS.DETAIL.PATH} element={<DrugsPage />} />
            <Route path={Paths.ORDERS.DETAIL.PATH} element={<OrdersPage />} />
            <Route path={Paths.TIMESLOTS.DETAIL.PATH} element={<TimeSlotsPage />} />
            <Route path={Paths.APPOINTMENTS.DETAIL.PATH} element={<AppointmentsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HistoryRouter>
  );
};

import React from "react";
import { Route, Routes } from "react-router-dom";
import history from ".";
import { HistoryRouter } from "./history-router";
import MainLayout from "../layouts/MainLayout";
import { Paths } from "../constants/path-routers";
import LoginPage from "../pages/auth";
import DashboardPage from "../pages/dashboard";
import UserPage from "../pages/users";
import DoctorsPage from "../pages/doctors";
import HospitalsPage from "../pages/hospitals";
import PatientsPage from "../pages/patients";

export const Navigator = () => {
  return (
    <HistoryRouter history={history}>
      <Routes>
        <Route path={Paths.LOGIN.DETAIL.PATH} element={<LoginPage />} />
        {/*  <Route
          path={Paths.RESET_PASSWORD.DETAIL.PATH}
          element={<ResetPasswordPage />}
        /> */}

        <Route element={<MainLayout />}>
          <Route
            path={Paths.DASHBOARD.DETAIL.PATH}
            element={<DashboardPage />}
          />
          <Route path={Paths.USERS.DETAIL.PATH} element={<UserPage />} />
          <Route path={Paths.DOCTORS.DETAIL.PATH} element={<DoctorsPage />} />
          <Route
            path={Paths.HOSPITALS.DETAIL.PATH}
            element={<HospitalsPage />}
          />
          <Route path={Paths.PATIENTS.DETAIL.PATH} element={<PatientsPage />} />
        </Route>
      </Routes>
    </HistoryRouter>
  );
};

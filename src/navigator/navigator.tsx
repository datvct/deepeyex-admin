import React from "react";
import { Route, Routes } from "react-router-dom";
import history from ".";
import { HistoryRouter } from "./history-router";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../modules/dashboard/page";
import { Paths } from "../constants/path-routers";
import UserPage from "../modules/users/page";
import DoctorsPage from "../modules/doctors/page";
import HospitalsPage from "../modules/hospitals/page";
import PatientsPage from "../modules/patients/page";
import LoginPage from "../modules/auth/page";

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

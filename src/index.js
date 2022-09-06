import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { PatientsTable, Main } from "./scenes";
import { ThemeProvider } from "@primer/react";
import { AddPatient } from "./pages/AddPatient";
import { AddDoctor } from "./pages/AddDoctor";
import { Doctors } from "./pages/Doctors";
import { Patients } from "./pages/Patients";
import { AddVisit } from "./pages/AddVisit";
import { Visits } from "./pages/Visits";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <BrowserRouter>
      <Main>
        <Routes>
          <Route path="/" element={<PatientsTable />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="add-doctor" element={<AddDoctor />} />
          <Route path="edit-doctor/:id" element={<AddDoctor />} />
          <Route path="add-patient" element={<AddPatient />} />
          <Route path="edit-patient/:id" element={<AddPatient />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/visits" element={<Visits />} />
          <Route path="add-visit" element={<AddVisit />} />
          <Route path="edit-visit/:id" element={<AddVisit />} />
        </Routes>
      </Main>
    </BrowserRouter>
  </ThemeProvider>
);

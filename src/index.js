import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { PatientsTable, Main } from "./scenes";
import { ThemeProvider } from "@primer/react";
// import { AddPatient, AddDoctor } from "./pages";
import { AddPatient } from "./pages/AddPatient";
import { AddDoctor } from "./pages/AddDoctor";
import { Doctors } from "./pages/Doctors";

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
          <Route path="invoices" element={<div>Hello 2</div>} />
        </Routes>
      </Main>
    </BrowserRouter>
  </ThemeProvider>
);

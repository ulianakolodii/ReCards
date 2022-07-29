import React, { useState } from "react";
import DoctorsAddForm from "../DoctorsAddForm/DoctorsAddForm";



const DoctorsList = (props) => {
  return (
      <div className="doctorsList">
        <DoctorsAddForm></DoctorsAddForm>
      <ul>
        <li>Перший лікар</li>
        <li>Другий лікар</li>
        <li>Третій Лікар</li>
        <li>Четвертий лікар</li>
      </ul>
    </div>
  );
};
export default DoctorsList;

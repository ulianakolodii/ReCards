import React, { useState } from "react";
import Input from "../Input/Input";
import classes from "./style.module.css";

const DoctorsAddForm = ({ create }) => {
  const [doctor, setDoctor] = useState({
    Surname: "",
    Name: "",
    FathersName: "",
    Additional: "",
  });


  const addNewDoctor = (e) => {
    e.preventDefault();
    const newDoctor = {
      ...doctor,
      id: Date.now(),
    };
    create(newDoctor);
    setDoctor({
        Surname: "",
        Name: "",
        FathersName: "",
        Additional: "",
    });
    };
    
    return (
      <div>
        <form className={classes.mainForm}>
          <h1>Додати лікаря:</h1>
          <h3>Прізвище</h3>
          <Input defaultValue={doctor.Surname} placeholder="Введіть прізвище лікаря"></Input>
          <h3>Ім'я</h3>
          <Input defaultValue={doctor.Name} placeholder="Введіть ім'я лікаря"></Input>
          <h3>По-батькові</h3>
          <Input defaultValue={doctor.FathersName} placeholder="Введіть по-батькові лікаря"></Input>
          <h3>Додаткова інформація</h3>
          <Input defaultValue={doctor.Additional} placeholder="Введіть додаткову інформацію"></Input>
          <button type="submit" onClick={addNewDoctor}>
            Додати
          </button>
        </form>
      </div>
    );
  };

export default DoctorsAddForm;
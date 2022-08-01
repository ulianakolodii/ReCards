import React, { useState } from "react";
import Input from "../Input/Input";
import classes from "./style.module.css";
import { addDoctor, deleteDoctor, getAllDoctors } from "../../utils";

const DoctorsAddForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fathersName, setFathersName] = useState("");

  const handleSubmit = (event) => {
    addDoctor({ firstName, lastName, fathersName }).then((result) => {
      console.log("result", result);
    });
    event.preventDefault();
  };
  const handleDelete = () => {
    console.log("ad", deleteDoctor, deleteDoctor(0));
    getAllDoctors().then((result) => {
      console.log("result", result);
    });
  };

  return (
    <div>
      <button type="button" onClick={handleDelete}>
        Delete 0
      </button>
      <form className={classes.mainForm} onSubmit={handleSubmit}>
        <h1>Додати лікаря:</h1>
        <h3>Прізвище</h3>
        <Input
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Введіть прізвище лікаря"
        ></Input>
        <h3>Ім'я</h3>
        <Input
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="Введіть ім'я лікаря"
        ></Input>
        <h3>По-батькові</h3>
        <Input
          value={fathersName}
          onChange={(event) => setFathersName(event.target.value)}
          placeholder="Введіть по-батькові лікаря"
        ></Input>
        <button type="submit">Додати</button>
      </form>
    </div>
  );
};

export default DoctorsAddForm;

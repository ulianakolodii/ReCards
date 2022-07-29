import React, { useState } from "react";
import InputMainForm from "../InputMainForm/InputMainForm";
import DatePicker from "react-date-picker";
import classes from "./style.module.css";

const MainForm = ({ create }) => {
  const [client, setClient] = useState({
    Surname: "",
    Name: "",
    FathersName: "",
    BirthDate: "",
    Enlistee: "",
    Displaced: "",
    Other: "",
    Doctor: "",
    DoctorDate: "",
    DoctorTime: "",
    Additional: "",
  });


  const addNewClient = (e) => {
    e.preventDefault();
    const newClient = {
      ...client,
      id: Date.now(),
    };
    create(newClient);
    setClient({
      Surname: "",
      Name: "",
      FathersName: "",
      BirthDate: "",
      Enlistee: "",
      Displaced: "",
      Other: "",
      Doctor: "",
      DoctorDate: "",
      DoctorTime: "",
      Additional: "",
    });
    };
    
    const [value, onChange] = useState(new Date());
    return (
      <div>
        <form className={classes.mainForm}>
          <h1>Форма реєстрації пацієнта</h1>
          <h3>Прізвище</h3>
          <InputMainForm defaultValue={client.Surname} placeholder="Введіть прізвище пацієнта"></InputMainForm>
          <h3>Ім'я</h3>
          <InputMainForm defaultValue={client.Name} placeholder="Введіть ім'я пацієнта"></InputMainForm>
          <h3>По-батькові</h3>
          <InputMainForm defaultValue={client.FathersName} placeholder="Введіть по-батькові пацієнта"></InputMainForm>
          <h3>Дата народження</h3>
          <DatePicker onChange={onChange} value={value} />
          <label className={classes.checkBoxContainer}>
            <h3>Військовослужбовець</h3>
            <input type="checkbox" defaultValue={client.Enlistee} />
          </label>
          <label className={classes.checkBoxContainer}>
            <h3>Внутрішньо переміщена особа</h3>
            <input type="checkbox" defaultValue={client.Displaced} />
          </label>
          <label className={classes.checkBoxContainer}>
            <h3>Інше</h3>
            <input type="checkbox" defaultValue={client.Other} />
          </label>
          <h3>Лікар, який здійснює прийом</h3>
          <select value={client.Doctor} defaultValue="Оберіть лікаря">
            <option>Лікар 1</option>
            <option>Лікар 2</option>
            <option>Лікар 3</option>
            <option>Лікар 4</option>
          </select>
          <h3>Дата</h3>
          <h3>Час</h3>
          <h3>Додаткова інформація</h3>
          <InputMainForm defaultValue={client.Additional} placeholder="Введіть додаткову інформацію"></InputMainForm>
          <button type="submit" onClick={addNewClient}>
            Зареєструвати
          </button>
        </form>
      </div>
    );
  };

export default MainForm;
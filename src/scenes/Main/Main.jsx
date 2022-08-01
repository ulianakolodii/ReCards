import React from "react";
import { NavLink } from "react-router-dom";
import { Header } from "../../components";
import { ReactComponent as PacientIcon } from "../../assets/icons/bed.svg";
import { ReactComponent as DoctorIcon } from "../../assets/icons/user-doctor-solid.svg";
import style from "./style.module.css";

const changeActiveColor = ({ isActive }) => ({
  backgroundColor: isActive ? "var(--sidbar-hover-bg)" : "inherit",
});

export const Main = ({ children }) => {
  return (
    <div className={style.main}>
      <Header>
        <NavLink to="/">
          <img src="../../../logo.png" alt="logo" />
        </NavLink>
        <ul>
          <li>
            <NavLink to="/add-pacient" style={changeActiveColor}>
              Пацієнти
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-doctor" style={changeActiveColor}>
              Лікарі
            </NavLink>
          </li>
        </ul>
      </Header>
      <div className={style.container}>{children}</div>
    </div>
  );
};

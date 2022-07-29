import React from "react";
import { NavLink } from "react-router-dom";
import { Sidebar } from "../../components";
import { ReactComponent as PacientIcon } from "../../assets/icons/bed.svg";
import style from "./style.module.css";

const changeActiveColor = ({ isActive }) => ({
  backgroundColor: isActive ? "var(--sidbar-hover-bg)" : "inherit",
});

export const Main = ({ children }) => {
  return (
    <div className={style.main}>
      <Sidebar>
        {/* <img src="../../logo.png" alt="logo" /> */}
        <ul>
          <li>
            <NavLink to="/add-pacient" style={changeActiveColor}>
              <PacientIcon />
              Пацієнти
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-doctor" style={changeActiveColor}>
              Лікарі
            </NavLink>
          </li>
        </ul>
      </Sidebar>
      {children}
    </div>
  );
};

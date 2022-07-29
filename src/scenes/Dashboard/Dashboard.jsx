import React from "react";
import { NavLink } from "react-router-dom";
import { Sidebar } from "../../components";
import style from "./style.module.css";

const changeActiveColor = ({ isActive }) => ({
  backgroundColor: isActive ? "var(--sidbar-hover-bg)" : "inherit",
});

export const Dashboard = ({ children }) => {
  return (
    <div className={style.dashboard}>
      {/* <Sidebar>
        <img src="../../logo.png" alt="logo" />
        <ul>
          <li>
            <NavLink to="/" style={changeActiveColor}>
              Головна
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-pacient" style={changeActiveColor}>
              Додати паціента
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-doctor" style={changeActiveColor}>
              Додати лікаря
            </NavLink>
          </li>
        </ul>
      </Sidebar> */}
      <div>{children}</div>
    </div>
  );
};

import React from "react";
import style from "./style.module.css";

export const Sidebar = ({ children }) => {
  return <div className={style.sidebar}>{children}</div>;
};

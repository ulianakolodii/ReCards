import React from "react";
import style from "./style.module.css";

export const Header = ({ children }) => {
  return <div className={style.header}>{children}</div>;
};

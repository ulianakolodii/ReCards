import React from "react";
import style from "./style.module.css";

export const Tag = ({ children }) => {
  return <div className={style.tag}>{children}</div>;
};

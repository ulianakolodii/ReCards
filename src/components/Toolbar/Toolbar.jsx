import React from "react";
import style from "./style.module.css";

export const Toolbar = ({ children, title, ...rest }) => {
  return (
    <div className={style.toolbar} {...rest}>
      <div>
        <h3>{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};

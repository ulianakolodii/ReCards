import React from "react";
import style from "./style.module.css";

export const Button = ({
  children,
  type = "button",
  variant = "toolbar",
  ...rest
}) => {
  return (
    <button className={style[variant]} type={type} {...rest}>
      {children}
    </button>
  );
};

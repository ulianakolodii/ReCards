import React from "react";
import classes from "./style.module.css";

const Input = (props) => {
  return <input type="text" className={classes.inputMainForm} {...props} />;
};

export default Input;

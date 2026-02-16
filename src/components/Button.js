import React from "react";
import PropTypes from "prop-types";
import styles from "@/styles/components/button.module.css";

const Button = ({ children, size = "medium" }) => {
  return (
    <button className={`${styles.button} ${styles[size]}`}>{children}</button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default Button;

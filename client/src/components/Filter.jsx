import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/Filter.module.scss";

const cx = classNames.bind(styles);
const Filter = ({
  firstTitle,
  secondTitle,
  ActiveFirstTitle,
  setActiveFirstTitle,
  ActiveSecondTitle,
  setActiveSecondTitle,
}) => {
  return (
    <div className={cx("filter")}>
      {firstTitle && (
        <span
          className={cx("filter-tag", ActiveFirstTitle && "active")}
          onClick={() => {
            setActiveFirstTitle(!ActiveFirstTitle);
            secondTitle && setActiveSecondTitle(false);
          }}
        >
          {firstTitle}
        </span>
      )}

      {secondTitle && (
        <span
          className={cx("filter-tag", ActiveSecondTitle && "active")}
          onClick={() => {
            setActiveSecondTitle(!ActiveSecondTitle);
            firstTitle && setActiveFirstTitle(false);
          }}
        >
          {secondTitle}
        </span>
      )}
    </div>
  );
};

export default Filter;

import React from "react";
import Tracking from "../Tracking";
import classNames from "classnames/bind";
import styles from "../../assets/css/driver/TrackingTab.module.scss";
import { useParams } from "react-router-dom";

const cx = classNames.bind(styles);
const TrackingTab = () => {
  const { id } = useParams();

  return (
    <div className={cx("tab-wrapper")}>
      <div className={cx("block")}>
        <div className={cx("map")}>
          {/* Khi có id thì show bản đồ, không thì show danh sách xe */}
          {id ? (
            <Tracking />
          ) : (
            <span>Chon mot chuyen trong lich cua ban de xem map</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingTab;

import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/ScheduleDetail.module.scss";
const cx = classNames.bind(styles);

const RouteDetail = ({ routeDetail, setRouteDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(routeDetail || {});

  useEffect(() => {
    setData(routeDetail || {});
  }, [routeDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Updated route:", data);
  };

  return (
    <div className={cx("ScheduleDetailWrapper")}>
      <h4>Route Detail</h4>

      <div className={cx("row")}>
        <span className={cx("label")}>Route ID:</span>
        <span className={cx("value")}>{data.routeId}</span>
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Bus Number:</span>
        {isEditing ? (
          <input
            type="text"
            name="busNumber"
            value={data.busNumber || ""}
            onChange={handleChange}
          />
        ) : (
          <span className={cx("value")}>{data.busNumber}</span>
        )}
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Driver:</span>
        {isEditing ? (
          <input
            type="text"
            name="driverName"
            value={data.driverName || ""}
            onChange={handleChange}
          />
        ) : (
          <span className={cx("value")}>{data.driverName}</span>
        )}
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Time:</span>
        {isEditing ? (
          <>
            <input
              type="text"
              name="startTime"
              value={data.startTime || ""}
              onChange={handleChange}
              placeholder="Start"
            />
            <input
              type="text"
              name="endTime"
              value={data.endTime || ""}
              onChange={handleChange}
              placeholder="End"
            />
          </>
        ) : (
          <span className={cx("value")}>
            {data.startTime} - {data.endTime}
          </span>
        )}
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Students:</span>
        <div className={cx("studentList")}>
          {data.students?.map((s, index) => (
            <div key={index} className={cx("studentItem")}>
              {s.name} ({s.class})
            </div>
          )) || <span>N/A</span>}
        </div>
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Status:</span>
        {isEditing ? (
          <select name="status" value={data.status} onChange={handleChange}>
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Tạm ngưng">Tạm ngưng</option>
          </select>
        ) : (
          <span className={cx("value")}>{data.status}</span>
        )}
      </div>

      <div className={cx("btnGroup")}>
        {isEditing ? (
          <>
            <button
              className={cx("cancelBtn")}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button className={cx("saveBtn")} onClick={handleSave}>
              Save
            </button>
          </>
        ) : (
          <button className={cx("editBtn")} onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default RouteDetail;

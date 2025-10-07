import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/parent/Notification.module.scss";

const cx = classNames.bind(styles);

const NotificationTab = () => {
  // dữ liệu mẫu
  const [notifications] = useState([
    {
      id: 1,
      title: "Xe BUS001 sắp đến điểm đón",
      time: "07:15",
      content: "Xe buýt BUS001 sẽ đến Cổng A trong 5 phút nữa.",
    },
    {
      id: 2,
      title: "Xe BUS002 trễ giờ",
      time: "07:25",
      content: "Xe buýt BUS002 bị kẹt xe, dự kiến trễ 10 phút.",
    },
    {
      id: 3,
      title: "Học sinh đã lên xe",
      time: "07:05",
      content: "Nguyễn Văn B đã lên xe BUS001.",
    },
  ]);

  const [selected, setSelected] = useState(null);

  return (
    <div className={cx("tab-wrapper")}>
      <div className={cx("left-block")}>
        <h3>Thông báo</h3>
        <ul className={cx("list")}>
          {notifications.map((n) => (
            <li
              key={n.id}
              className={cx("item", { active: selected?.id === n.id })}
              onClick={() => setSelected(n)}
            >
              <div className={cx("title")}>{n.title}</div>
              <div className={cx("time")}>{n.time}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className={cx("right-block")}>
        {selected ? (
          <div className={cx("detail")}>
            <h3>{selected.title}</h3>
            <span className={cx("time")}>{selected.time}</span>
            <p>{selected.content}</p>
          </div>
        ) : (
          <div className={cx("placeholder")}>
            <p>Chọn một thông báo để xem chi tiết</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationTab;

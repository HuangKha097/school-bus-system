import classNames from "classnames/bind";
import styles from "../../assets/css/driver/MyScheduleTab.module.scss";

import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
const MyScheduleTab = ({ buses, route }) => {
    const navigate = useNavigate();

    console.log("Prop 'route' trong MyScheduleTab:", route);

    const routeCoords = {
        lat: route?.latitude,
        lng: route?.longitude,
    };

    return (
        <div className={cx("schedule-wrapper")}>
            <h2>Lịch trình của tôi</h2>
            <table className={cx("schedule-table")}>
                <thead>
                    <tr>
                        <th>Chuyến</th>
                        <th>Tuyến đường</th>
                        <th>Student</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {buses?.map((trip) => (
                        <tr
                            key={trip._id}
                            onClick={() =>
                                navigate(`/tracking/${trip.busNumber}`, {
                                    state: { endAddress: routeCoords },
                                })
                            }
                            className={cx("clickable-row")}
                        >
                            <td>{trip.routeNumber}</td>
                            <td>{route?.name || "N/A"}</td>
                            <td>{trip.students?.length}</td>
                            <td>{trip.busStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyScheduleTab;

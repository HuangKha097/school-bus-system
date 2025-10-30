import classNames from "classnames/bind";
import styles from "../../assets/css/driver/MyScheduleTab.module.scss";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const cx = classNames.bind(styles);

const MyScheduleTab = ({ buses, routes }) => {
    const navigate = useNavigate();

    const handleClickBus = (trip) => {
        if (trip.busStatus !== "Đang chạy") {
            toast.error(
                `Xe ${trip.busNumber} hiện đang ở trạng thái "${trip.busStatus}". Chỉ xe "Đang chạy" mới có thể theo dõi.`
            );
            return;
        }

        const routeCoords = {
            lat: routes[trip.routeNumber]?.latitude,
            lng: routes[trip.routeNumber]?.longitude,
        };

        navigate(`/tracking/${trip.busNumber}`, {
            state: { endAddress: routeCoords },
        });
    };

    return (
        <div className={cx("schedule-wrapper")}>
            <h2>Lịch trình của tôi</h2>
            <table className={cx("schedule-table")}>
                <thead>
                    <tr>
                        <th>Chuyến</th>
                        <th>Số xe</th>
                        <th>Tuyến đường</th>
                        <th>Học sinh</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {buses?.map((trip) => {
                        const routeData = routes[trip.routeNumber];
                        return (
                            <tr
                                key={trip._id}
                                onClick={() => handleClickBus(trip)}
                                className={cx("clickable-row", {
                                    inactive: trip.busStatus !== "Đang chạy",
                                })}
                            >
                                <td>{trip.routeNumber}</td>
                                <td>{trip.busNumber}</td>
                                <td>
                                    {routeData?.name || "Không tìm thấy tuyến"}
                                </td>
                                <td>{trip.students?.length || 0}</td>
                                <td>{trip.busStatus}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default MyScheduleTab;

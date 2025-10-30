import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/ScheduleDetail.module.scss";

import * as BusController from "../../../controller/BusController";
import * as RouteController from "../../../controller/RouteController";

import toast, { Toaster } from "react-hot-toast";

const cx = classNames.bind(styles);

const RouteDetail = ({ routeDetail, setRouteDetail }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState(routeDetail || {});
    const [buses, setBuses] = useState([]);
    const [busesChoose, setBusesChoose] = useState([]);
    console.log("detail rout: ", routeDetail);

    // Cập nhật khi chọn route khác
    useEffect(() => {
        setData(routeDetail || {});
        setBusesChoose(routeDetail?.buses?.map((b) => b.busNumber) || []);
    }, [routeDetail]);

    // Lấy danh sách bus
    useEffect(() => {
        (async () => {
            try {
                const response = await BusController.fetchAllBuses();
                console.log(response);

                setBuses(response || []);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    // Gửi update lên server
    const handleUpdateRoute = async () => {
        try {
            const updatePayload = {
                routeNumber: data.routeNumber,
                time: data.time,
                buses: busesChoose, // gửi danh sách busNumber
            };

            console.log("Sending to server:", updatePayload);
            const res = await RouteController.updateRoute(updatePayload);

            if (res?.success) {
                for (const busNumber of busesChoose) {
                    await BusController.updateBus({
                        busNumber,
                        routeNumber: data.routeNumber,
                    });
                }
                setRouteDetail(res.data);
                setData(res.data);
                setBusesChoose(res.data.buses?.map((b) => b.busNumber) || []);
                toast.success("Cập nhật tuyến xe buýt thành công");
            } else {
                toast.error(res?.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi cập nhật");
        }
    };
    const handleRemoveBus = async (index) => {
        // Lấy bus bị xoá và danh sách còn lại
        const removedBus = busesChoose[index];
        const updated = busesChoose.filter((_, i) => i !== index);
        setBusesChoose(updated);

        try {
            const updatePayload = {
                routeNumber: data.routeNumber,
                time: data.time,
                buses: updated, // gửi danh sách bus còn lại
            };

            // Cập nhật route (xoá bus khỏi tuyến)
            const res = await RouteController.updateRoute(updatePayload);

            if (res?.success) {
                //  Xoá route khỏi bus bị gỡ
                await BusController.updateBus({
                    busNumber: removedBus,
                    routeNumber: null, // hoặc "" tùy backend
                });

                // Cập nhật lại thông tin cho các bus còn lại
                for (const busNumber of updated) {
                    await BusController.updateBus({
                        busNumber,
                        routeNumber: data.routeNumber,
                    });
                }

                toast.success(`Đã xoá xe ${removedBus} khỏi tuyến!`);
            } else {
                toast.error("Cập nhật thất bại");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi cập nhật tuyến xe");
        }
    };

    const handleSave = () => {
        handleUpdateRoute();
        setIsEditing(false);
    };

    return (
        <div className={cx("ScheduleDetailWrapper")}>
            {routeDetail?._id ? (
                <>
                    {" "}
                    <h4>Route Detail</h4>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Route ID:</span>
                        <span className={cx("value")}>{data.routeNumber}</span>
                    </div>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Route Name:</span>
                        <span className={cx("value")}>{data.name}</span>
                    </div>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Bus Number:</span>
                        {isEditing && (
                            <select
                                value=""
                                onChange={(e) => {
                                    const selectedBus = e.target.value;
                                    if (
                                        selectedBus &&
                                        !busesChoose.includes(selectedBus)
                                    ) {
                                        setBusesChoose((prev) => [
                                            ...prev,
                                            selectedBus,
                                        ]);
                                    }
                                }}
                            >
                                <option value="">-- Chọn xe buýt --</option>
                                {buses.map((bus, index) => (
                                    <option key={index} value={bus.busNumber}>
                                        {bus.busNumber}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className={cx("bus-list")}>
                        {busesChoose.length > 0 ? (
                            busesChoose.map((bus, index) => (
                                <span
                                    key={index}
                                    className={cx("buses-choose")}
                                >
                                    {bus}
                                    {isEditing && (
                                        <div
                                            className={cx("remove")}
                                            onClick={() =>
                                                handleRemoveBus(index)
                                            }
                                        >
                                            &times;
                                        </div>
                                    )}
                                </span>
                            ))
                        ) : (
                            <span>Không có bus nào</span>
                        )}
                    </div>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Time:</span>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    name="time"
                                    value={data.time || ""}
                                    onChange={handleChange}
                                    placeholder="06:30"
                                />
                            </>
                        ) : (
                            <span className={cx("value")}>{data.time}</span>
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
                                <button
                                    className={cx("saveBtn")}
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            routeDetail && (
                                <button
                                    className={cx("editBtn")}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                            )
                        )}
                    </div>
                </>
            ) : (
                <p>Choose one from the list to see details.</p>
            )}
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default RouteDetail;

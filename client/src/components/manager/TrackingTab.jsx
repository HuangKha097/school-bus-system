import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/manager/BusTab.module.scss";
import ListTracking from "../manager/LiveTracking/ListTracking";
import Tracking from "../Tracking";
import { useParams } from "react-router-dom";
import Filter from "../Filter.jsx";
import { useNavigate } from "react-router-dom";

// CHI SHOW NHUNG XE DANG CHAY VA CLICK VAO THI HIEN RA MAP TRACKING
const cx = classNames.bind(styles);
const TrackingTab = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // /tracking/:id
    const [endAddress, setEndAddress] = useState("");
    return (
        <div className={cx("tab-wrapper")}>
            <div className={cx("left-block")}>
                {!id ? (
                    <>
                        {" "}
                        <label htmlFor="search" className={cx("search")}>
                            <input
                                type="text"
                                name="search"
                                placeholder="Find Bus"
                            />
                        </label>
                        <div className={cx("filter-wrapper")}>
                            <Filter
                                firstTitle={"By route"}
                                secondTitle={"By bus number"}
                            />
                        </div>{" "}
                    </>
                ) : (
                    <button
                        className={cx("back-btn")}
                        onClick={() => navigate("/tracking")}
                    >
                        Back to list
                    </button>
                )}
                <div className={cx("bus-list")}>
                    {id ? (
                        <Tracking busId={id} endAddress={endAddress} />
                    ) : (
                        <ListTracking setEndAddress={setEndAddress} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackingTab;

import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Tracking from "../Tracking";

const DriverTrackingWrapper = () => {
    const { id } = useParams();

    const location = useLocation();
    const endAddress = location.state?.endAddress;

    return <Tracking busId={id} endAddress={endAddress} />;
};

export default DriverTrackingWrapper;

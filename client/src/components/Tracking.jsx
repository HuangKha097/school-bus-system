import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import classNames from "classnames/bind";
import styles from "../assets/css/common/Tracking.module.scss";
import { busStationsWithCoordinates } from "../service/BusService.js";

const cx = classNames.bind(styles);

// Icon xe buýt hiển thị trên bản đồ
const busIcon = L.icon({
  iconUrl: "/bus-icon-tracking.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Cấu hình icon mặc định của Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Tracking({ endAddress }) {
  const [route, setRoute] = useState([]); // Tuyến đường đi
  const [position, setPosition] = useState(null); // Vị trí hiện tại của xe
  const [traveledPath, setTraveledPath] = useState([]); // Đường đãa đi qua
  const [time, setTime] = useState(0); // Thời gian dự kiến
  const [start, setStart] = useState(null); // Tọa độ điểm xuất phát
  const [end, setEnd] = useState(null); // Tọa độ điểm đến

  // Địa chỉ xuất phát mặc định
  const startAddress = "Đại học Sài Gòn, Quận 5, TP.HCM";

  // Gọi API để lấy tuyến đườmng từ OSRM
  useEffect(() => {
    const fetchRoute = async () => {
      const startCoords = findCoordinates(startAddress);
      const endCoords = findCoordinates(endAddress);

      if (!startCoords || !endCoords) {
        console.error("Không tìm thấy tọa độ start hoặc end");
        return;
      }

      setStart(startCoords);
      setEnd(endCoords);

      const osrmUrl =
        import.meta.env.VITE_OSRM_URL || "https://router.project-osrm.org";
      const url = `${osrmUrl}/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;

      try {
        const res = await axios.get(url);
        const coords = res.data.routes[0].geometry.coordinates.map((c) => [
          c[1],
          c[0],
        ]);

        const distance = res.data.routes[0].distance; // đơn vị mét
        const totalTime = distance / 5; // tốc độ giả định 5 m/s ~ 18km/h

        setRoute(coords);
        setPosition(coords[0]);
        setTraveledPath([coords[0]]);
        setTime(totalTime / 60); // chuyển sang phút
      } catch (err) {
        console.error("Lỗi khi lấy route từ OSRM:", err);
      }
    };

    fetchRoute();
  }, [endAddress]);

  // Hàm tìm tọa độ của một địa chỉ trong danh sách trạm xe buýt
  function findCoordinates(address) {
    const found = busStationsWithCoordinates.find(
      (s) =>
        address.includes(s.name) ||
        address.includes(s.address) ||
        s.name.includes(address)
    );
    if (found) return [found.lat, found.lon];

    // Tọa độ mặc định của Đại học Sài Gòn
    if (address.includes("Đại học Sài Gòn")) return [10.7581, 106.6822];

    console.warn("Không tìm thấy tọa độ:", address);
    return null;
  }

  // Hàm tính toán và định dạng thời gian
  function caculatorTime(time) {
    const hour = Math.floor(time / 60);
    const minute = Math.round(time % 60);
    return hour > 1
      ? `Thời gian dự kiến: ${hour}h${minute}ph`
      : `Thời gian dự kiến: ${minute}ph`;
  }

  // Hiệu ứng mô phỏng di chuyển xe buýt theo tuyến đường
  useEffect(() => {
    if (route.length === 0) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < route.length) {
        setPosition(route[i]);
        setTraveledPath((prev) => [...prev, route[i]]);
      } else {
        clearInterval(interval);
      }
    }, 1500); // mỗi 1.5s di chuyển đến 1 điểm

    return () => clearInterval(interval);
  }, [route]);

  return (
    <div className={cx("container")}>
      {start ? (
        <MapContainer center={start} zoom={13} className={cx("map")}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marker xe buýt đang di chuyển */}
          {position && (
            <Marker position={position} icon={busIcon}>
              <Popup>{caculatorTime(time)}</Popup>
            </Marker>
          )}

          {/* Tuyến đường tổng */}
          {route.length > 0 && <Polyline positions={route} color="blue" />}

          {/* Đường xe đã đi */}
          {traveledPath.length > 1 && (
            <Polyline positions={traveledPath} color="red" />
          )}
        </MapContainer>
      ) : (
        <p>Đang tải bản đồ...</p>
      )}
    </div>
  );
}

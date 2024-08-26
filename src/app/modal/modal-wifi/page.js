import React, { useState } from "react";
import MapTooltip from "../../components/MapTooltip";

const WifiModal = ({ wifis, onClose, searchType, searchQuery }) => {
  const [mapPosition, setMapPosition] = useState({
    latitude: null,
    longitude: null,
    show: false,
    x: 0,
    y: 0,
  });

  if (!wifis || wifis.length === 0) return null;

  const getHeaderRegion = () => {
    const firstWifi = wifis[0];
    const address =
      firstWifi.소재지도로명주소 || firstWifi.소재지지번주소 || "";
    const addressParts = address.split(" ");
    return `${addressParts[0] || "정보 없음"} ${addressParts[1] || ""}`;
  };

  const headerText =
    searchType === "query"
      ? `${searchQuery} 검색 결과`
      : `${getHeaderRegion()} WiFi 정보`;

  const handleMouseEnter = (latitude, longitude, event) => {
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      const { clientX, clientY } = event;
      setMapPosition({
        latitude,
        longitude,
        show: true,
        x: clientX + 10,
        y: clientY + 10,
      });
    } else {
      setMapPosition((prev) => ({ ...prev, show: false }));
    }
  };

  const handleMouseLeave = () => {
    setMapPosition({
      latitude: null,
      longitude: null,
      show: false,
      x: 0,
      y: 0,
    });
  };

  const handleBackgroundClick = (event) => {
    if (event.target.className === "modal") {
      onClose();
    }
  };

  const handleRowClick = (latitude, longitude) => {
    if (latitude && longitude) {
      const kakaoMapUrl = `https://map.kakao.com/link/map/${latitude},${longitude}`;
      window.open(kakaoMapUrl, "_blank");
    }
  };

  return (
    <div
      id="wifiModal"
      className="modal"
      style={{ display: "block" }}
      onClick={handleBackgroundClick}
    >
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modal-header">
          <h2>{headerText}</h2>
        </div>
        <div id="wifiModalResultSection">
          <section className="main">
            <div className="table-container">
              <table className="list">
                <thead>
                  <tr>
                    <th>설치 장소명</th>
                    <th>WiFi SSID</th>
                    <th>도로명 주소</th>
                    <th>지번 주소</th>
                  </tr>
                </thead>
                <tbody>
                  {wifis.map((wifi, index) => {
                    const latitude =
                      wifi.WGS84위도 !== "null"
                        ? parseFloat(wifi.WGS84위도)
                        : null;
                    const longitude =
                      wifi.WGS84경도 !== "null"
                        ? parseFloat(wifi.WGS84경도)
                        : null;

                    return (
                      <tr
                        key={index}
                        onMouseEnter={(e) =>
                          handleMouseEnter(latitude, longitude, e)
                        }
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleRowClick(latitude, longitude)}
                        style={{
                          cursor: latitude && longitude ? "pointer" : "default",
                        }}
                      >
                        <td>{wifi.설치장소명}</td>
                        <td>{wifi.WIFISSID}</td>
                        <td>{wifi.소재지도로명주소}</td>
                        <td>{wifi.소재지지번주소}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      {mapPosition.show && mapPosition.latitude && mapPosition.longitude && (
        <MapTooltip
          position={{ x: mapPosition.x, y: mapPosition.y }}
          coordinates={{
            lat: mapPosition.latitude,
            lng: mapPosition.longitude,
          }}
          isVisible={mapPosition.show}
        />
      )}
    </div>
  );
};

export default WifiModal;

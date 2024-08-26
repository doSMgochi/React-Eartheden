import React, { useState } from "react";
import MapTooltip from "../../components/MapTooltip";

const RestroomModal = ({ restrooms, onClose, searchType, searchQuery }) => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    coordinates: null,
    position: { x: 0, y: 0 },
  });

  if (!restrooms || restrooms.length === 0) return null;

  // 헤더 지역 정보
  const getHeaderRegion = () => {
    const firstRestroom = restrooms[0];
    const address =
      firstRestroom.소재지도로명주소 || firstRestroom.소재지지번주소 || "";
    const addressParts = address.split(" ");
    return `${addressParts[0] || "정보 없음"} ${addressParts[1] || ""}`;
  };

  // 헤더 텍스트 결정
  const headerText =
    searchType === "query"
      ? `${searchQuery} 검색 결과`
      : `${getHeaderRegion()} 화장실 정보`;

  const handleMouseEnter = (latitude, longitude, event) => {
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      const { clientX: x, clientY: y } = event;
      setTooltip({
        visible: true,
        coordinates: { lat: latitude, lng: longitude },
        position: { x: x + 10, y: y + 10 },
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({
      ...tooltip,
      visible: false,
    });
  };

  const handleBackgroundClick = (event) => {
    if (event.target.className === "modal") {
      onClose();
    }
  };

  const handleRowClick = (coordinates) => {
    if (coordinates.lat && coordinates.lng) {
      const kakaoMapUrl = `https://map.kakao.com/link/map/${coordinates.lat},${coordinates.lng}`;
      window.open(kakaoMapUrl, "_blank");
    }
  };

  return (
    <div
      id="restroomModal"
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
        <div id="restroomModalResultSection">
          <section className="main">
            <div className="table-container">
              <table className="list">
                <thead>
                  <tr>
                    <th>화장실명</th>
                    <th>도로명 주소</th>
                    <th>지번 주소</th>
                  </tr>
                </thead>
                <tbody>
                  {restrooms.map((restroom, index) => {
                    const latitude =
                      restroom.WGS84위도 !== "null"
                        ? parseFloat(restroom.WGS84위도)
                        : null;
                    const longitude =
                      restroom.WGS84경도 !== "null"
                        ? parseFloat(restroom.WGS84경도)
                        : null;

                    return (
                      <tr
                        key={index}
                        onMouseEnter={(e) =>
                          handleMouseEnter(latitude, longitude, e)
                        }
                        onMouseLeave={handleMouseLeave}
                        onClick={() =>
                          handleRowClick({ lat: latitude, lng: longitude })
                        }
                        style={{
                          cursor: latitude && longitude ? "pointer" : "default",
                        }}
                      >
                        <td>{restroom.화장실명}</td>
                        <td>{restroom.소재지도로명주소 || ""}</td>
                        <td>{restroom.소재지지번주소 || ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      {tooltip.visible && tooltip.coordinates && (
        <MapTooltip
          position={tooltip.position}
          coordinates={tooltip.coordinates}
          isVisible={tooltip.visible}
        />
      )}
    </div>
  );
};

export default RestroomModal;

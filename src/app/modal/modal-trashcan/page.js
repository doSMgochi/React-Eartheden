import React, { useState } from "react";
import MapTooltip from "../../components/MapTooltip";

const TrashcanModal = ({ trashcans, onClose, searchType, searchQuery }) => {
  const [mapPosition, setMapPosition] = useState({
    latitude: null,
    longitude: null,
    show: false,
    x: 0,
    y: 0,
  });

  if (!trashcans || trashcans.length === 0) return null;

  const getHeaderRegion = () => {
    const firstTrashcan = trashcans[0];
    const region = firstTrashcan.region || "";
    const regionParts = region.split(" ");
    return `${regionParts[0] || "No information"} ${regionParts[1] || ""}`;
  };

  const headerText =
    searchType === "query"
      ? `${searchQuery} 검색 결과`
      : `${getHeaderRegion()} 쓰레기통 정보`;

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
      id="trashcanModal"
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
        <div id="trashcanModalResultSection">
          <section className="main">
            <div className="table-container">
              <table className="list">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {trashcans.map((trashcan, index) => {
                    const latitude =
                      trashcan.위도 !== "null"
                        ? parseFloat(trashcan.위도)
                        : null;
                    const longitude =
                      trashcan.경도 !== "null"
                        ? parseFloat(trashcan.경도)
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
                        <td>{trashcan.위치}</td>
                        <td>{trashcan["쓰레기통 종류"] || "General"}</td>
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

export default TrashcanModal;

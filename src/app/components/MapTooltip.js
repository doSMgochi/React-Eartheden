import React, { useEffect, useState } from "react";

const MapTooltip = ({ position, coordinates, isVisible }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
    if (!apiKey) {
      console.error("카카오 API 오류");
      return;
    }

    const existingScript = document.querySelector(
      `script[src*="dapi.kakao.com"]`
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
          console.error("맵 요소 없음");
          return;
        }

        // 기존 지도와 마커 제거
        if (mapInstance) {
          const mapContainerChildren = mapContainer.children;
          while (mapContainerChildren.length > 0) {
            mapContainer.removeChild(mapContainerChildren[0]);
          }
        }

        const mapOption = {
          center: new window.kakao.maps.LatLng(
            coordinates.lat,
            coordinates.lng
          ),
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            coordinates.lat,
            coordinates.lng
          ),
        });
        marker.setMap(map);

        setMapInstance(map);
        setMapLoaded(true);
      });
    };
    script.onerror = () => {
      console.error("카카오 API 로드 실패");
    };
    document.head.appendChild(script);

    return () => {
      // 클린업 함수에서 지도 콘텐츠 제거
      const mapContainer = document.getElementById("map");
      if (mapContainer) {
        const mapContainerChildren = mapContainer.children;
        while (mapContainerChildren.length > 0) {
          mapContainer.removeChild(mapContainerChildren[0]);
        }
      }
    };
  }, [coordinates]);

  if (!isVisible || !coordinates) return null;

  return (
    <div
      id="map"
      style={{
        width: "250px",
        height: "250px",
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 1000,
        border: "1px solid black",
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        borderRadius: "8px",
      }}
    ></div>
  );
};

export default MapTooltip;

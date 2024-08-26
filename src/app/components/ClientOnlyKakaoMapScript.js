"use client";

import { useEffect } from "react";

const ClientOnlyKakaoMapScript = () => {
  useEffect(() => {
    const loadKakaoMapScript = () => {
      const existingScript = document.getElementById("kakao-map-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "kakao-map-script";
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}`;
        script.async = true;
        document.head.appendChild(script);
      }
    };

    loadKakaoMapScript();
  }, []);

  return null;
};

export default ClientOnlyKakaoMapScript;

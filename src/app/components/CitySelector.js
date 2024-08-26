import React, { useEffect, useRef } from "react";
import CityOptions from "./CityOptions.js";

const CitySelector = ({
  selectedCity,
  isCitySelectOpen,
  toggleCitySelect,
  handleCitySelect,
}) => {
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        if (isCitySelectOpen) {
          toggleCitySelect();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCitySelectOpen, toggleCitySelect]);

  return (
    <div className="custom-select-wrapper" ref={selectRef}>
      <div className={`custom-select ${isCitySelectOpen ? "open" : ""}`}>
        <div className="custom-select-trigger" onClick={toggleCitySelect}>
          <span>{selectedCity || "특별시/광역시/도 선택"}</span>
          <div className="arrow"></div>
        </div>
        {isCitySelectOpen && (
          <div className="custom-options">
            {CityOptions.map((city) => (
              <span
                key={city}
                className="custom-option"
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </span>
            ))}
          </div>
        )}
      </div>
      <select
        id="restroomCitySelect"
        style={{ display: "none" }}
        value={selectedCity}
        onChange={(e) => handleCitySelect(e.target.value)}
      >
        <option value="">특별시/광역시/도 선택</option>
        {CityOptions.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CitySelector;

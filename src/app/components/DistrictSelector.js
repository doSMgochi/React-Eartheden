import React, { useEffect, useRef } from "react";

const DistrictSelector = ({
  selectedDistrict,
  districtOptions,
  isDistrictSelectOpen,
  toggleDistrictSelect,
  handleDistrictSelect,
}) => {
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        if (isDistrictSelectOpen) {
          toggleDistrictSelect();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDistrictSelectOpen, toggleDistrictSelect]);

  return (
    <div className="custom-select-wrapper" ref={selectRef}>
      <div className={`custom-select ${isDistrictSelectOpen ? "open" : ""}`}>
        <div className="custom-select-trigger" onClick={toggleDistrictSelect}>
          <span>{selectedDistrict || "시/군/구 선택"}</span>
          <div className="arrow"></div>
        </div>
        {isDistrictSelectOpen && (
          <div className="custom-options">
            {districtOptions.map((district, index) => (
              <span
                key={index}
                className="custom-option"
                onClick={() => handleDistrictSelect(district)}
              >
                {district}
              </span>
            ))}
          </div>
        )}
      </div>
      <select
        id="districtSelect"
        style={{ display: "none" }}
        value={selectedDistrict}
        onChange={(e) => handleDistrictSelect(e.target.value)}
      >
        <option value="">시/군/구 선택</option>
        {districtOptions.map((district, index) => (
          <option key={index} value={district}>
            {district}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DistrictSelector;

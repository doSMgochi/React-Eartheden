"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi } from "@fortawesome/free-solid-svg-icons";
import WifiModal from "../../modal/modal-wifi/page.js";
import CityMap from "../../components/CityMap.js";
import { getDistrictsByCity } from "../../components/DistrictData.js";
import WifiFiles from "../../components/WifiFiles.js";
import CitySelector from "../../components/CitySelector.js";
import DistrictSelector from "../../components/DistrictSelector.js";
import SearchInput from "../../components/SearchInput.js";

const WifiSearchSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [wifis, setWifis] = useState([]);
  const [isCitySelectOpen, setIsCitySelectOpen] = useState(false);
  const [isDistrictSelectOpen, setIsDistrictSelectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWifis, setFilteredWifis] = useState([]);
  const [searchType, setSearchType] = useState("");

  useEffect(() => {
    fetchWifiData();
  }, []);

  const fetchWifiData = async () => {
    try {
      const promises = WifiFiles.map((file) =>
        fetch(`/json/${file}`).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      const mergedData = results.flat();
      setWifis(mergedData);
    } catch (error) {
      console.error("JSON 데이터를 불러오는데 실패하였습니다.", error);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    const districts = getDistrictsByCity(city);
    setDistrictOptions(districts);
    setSelectedDistrict("");
    setIsCitySelectOpen(false);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setIsDistrictSelectOpen(false);
  };

  const handleSearch = () => {
    if (!selectedCity) {
      alert("특별시/광역시/도를 선택하세요.");
      return;
    }

    if (!selectedDistrict) {
      alert("시/군/구를 선택하세요.");
      return;
    }

    setSearchType("location");
    const filtered = wifis.filter((wifi) => {
      const roadAddress = wifi.소재지도로명주소 || "";
      const parcelAddress = wifi.소재지지번주소 || "";
      const fullCityName = CityMap[selectedCity] || selectedCity;

      const cityMatch =
        roadAddress.includes(selectedCity) ||
        roadAddress.includes(fullCityName) ||
        parcelAddress.includes(selectedCity) ||
        parcelAddress.includes(fullCityName);

      const districtMatch =
        selectedDistrict &&
        (roadAddress.includes(selectedDistrict) ||
          parcelAddress.includes(selectedDistrict));

      return cityMatch && districtMatch;
    });

    if (filtered.length > 0) {
      setFilteredWifis(filtered);
      setShowModal(true);
    } else {
      alert("해당 지역에 와이파이가 없습니다.");
    }
  };

  const handleInputSearch = () => {
    if (!searchQuery.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }

    setSearchType("query");
    const filtered = wifis.filter((wifi) => {
      const location = wifi.설치장소명 || "";
      const roadAddress = wifi.소재지도로명주소 || "";
      const parcelAddress = wifi.소재지지번주소 || "";
      const region = `${wifi.설치시도명} ${wifi.설치시군구명}` || "";

      return (
        location.includes(searchQuery) ||
        roadAddress.includes(searchQuery) ||
        parcelAddress.includes(searchQuery) ||
        region.includes(searchQuery)
      );
    });

    if (filtered.length > 0) {
      setFilteredWifis(filtered);
      setShowModal(true);
    } else {
      alert("검색 결과가 없습니다.");
    }
  };

  const toggleCitySelect = () => {
    setIsCitySelectOpen(!isCitySelectOpen);
    setIsDistrictSelectOpen(false);
  };

  const toggleDistrictSelect = () => {
    setIsDistrictSelectOpen(!isDistrictSelectOpen);
    setIsCitySelectOpen(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="background wifi">
      <div className="overlay" onClick={closeModal}></div>
      <section className="search wifi">
        <h2>
          <FontAwesomeIcon icon={faWifi} className="default-icon" /> Wifi
        </h2>
        <h6>공용 와이파이 검색</h6>

        <CitySelector
          selectedCity={selectedCity}
          isCitySelectOpen={isCitySelectOpen}
          toggleCitySelect={toggleCitySelect}
          handleCitySelect={handleCitySelect}
        />

        <DistrictSelector
          selectedDistrict={selectedDistrict}
          districtOptions={districtOptions}
          isDistrictSelectOpen={isDistrictSelectOpen}
          toggleDistrictSelect={toggleDistrictSelect}
          handleDistrictSelect={handleDistrictSelect}
        />

        <button id="wifiCityDistrictSearchButton" onClick={handleSearch}>
          지역 검색
        </button>

        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleInputSearch={handleInputSearch}
        />
      </section>

      {showModal && (
        <WifiModal
          wifis={filteredWifis}
          onClose={closeModal}
          searchType={searchType}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

export default WifiSearchSection;

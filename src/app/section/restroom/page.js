"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRestroom } from "@fortawesome/free-solid-svg-icons";
import RestroomModal from "../../modal/modal-restroom/page.js";
import CityMap from "../../components/CityMap.js";
import { getDistrictsByCity } from "../../components/DistrictData.js";
import RestroomFiles from "../../components/RestroomFiles.js";
import CitySelector from "../../components/CitySelector.js";
import DistrictSelector from "../../components/DistrictSelector.js";
import SearchInput from "../../components/SearchInput.js";

const RestroomSearchSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [restrooms, setRestrooms] = useState([]);
  const [isCitySelectOpen, setIsCitySelectOpen] = useState(false);
  const [isDistrictSelectOpen, setIsDistrictSelectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestrooms, setFilteredRestrooms] = useState([]);
  const [searchType, setSearchType] = useState("");

  useEffect(() => {
    fetchRestroomData();
  }, []);

  const fetchRestroomData = async () => {
    try {
      const promises = RestroomFiles.map((file) =>
        fetch(`/json/${file}`).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      const mergedData = results.flat();
      setRestrooms(mergedData);
    } catch (error) {
      console.error("JSON 데이터 불러오기 실패", error);
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
    const filtered = restrooms.filter((restroom) => {
      const roadAddress = restroom.소재지도로명주소 || "";
      const parcelAddress = restroom.소재지지번주소 || "";

      const roadAddressParts = roadAddress.split(" ");
      const parcelAddressParts = parcelAddress.split(" ");

      const fullCityName = CityMap[selectedCity] || selectedCity;

      const cityMatch =
        roadAddressParts[0].includes(selectedCity) ||
        roadAddressParts[0].includes(fullCityName) ||
        parcelAddressParts[0].includes(selectedCity) ||
        parcelAddressParts[0].includes(fullCityName);

      const districtMatch =
        (roadAddressParts[1] &&
          roadAddressParts[1].includes(selectedDistrict)) ||
        (parcelAddressParts[1] &&
          parcelAddressParts[1].includes(selectedDistrict));

      return cityMatch && districtMatch;
    });

    if (filtered.length > 0) {
      setFilteredRestrooms(filtered);
      setShowModal(true);
    } else {
      alert("해당 지역에 화장실이 없습니다.");
    }
  };

  const handleInputSearch = () => {
    if (!searchQuery.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }

    setSearchType("query");
    const filtered = restrooms.filter((restroom) => {
      const roadAddress = restroom.소재지도로명주소 || "";
      const parcelAddress = restroom.소재지지번주소 || "";
      const restroomName = restroom.화장실명 || "";

      return (
        roadAddress.includes(searchQuery) ||
        parcelAddress.includes(searchQuery) ||
        restroomName.includes(searchQuery)
      );
    });

    if (filtered.length > 0) {
      setFilteredRestrooms(filtered);
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
    <div className="background restroom">
      <div className="overlay" onClick={closeModal}></div>
      <section className="search restroom">
        <h2>
          <FontAwesomeIcon icon={faRestroom} className="default-icon" />{" "}
          Restroom
        </h2>
        <h6>공중화장실 검색</h6>

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

        <button id="restroomCityDistrictSearchButton" onClick={handleSearch}>
          지역 검색
        </button>

        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleInputSearch={handleInputSearch}
        />
      </section>

      {showModal && (
        <RestroomModal
          restrooms={filteredRestrooms}
          onClose={closeModal}
          searchType={searchType}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

export default RestroomSearchSection;

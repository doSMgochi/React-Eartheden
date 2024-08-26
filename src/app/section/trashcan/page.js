"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import TrashcanModal from "../../modal/modal-trashcan/page.js";
import { getDistrictsByCity } from "../../components/DistrictData.js";
import TrashCanFiles from "../../components/TrashCanFiles.js";
import CitySelector from "../../components/CitySelector.js";
import DistrictSelector from "../../components/DistrictSelector.js";
import SearchInput from "../../components/SearchInput.js";

const TrashCanSearchSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [trashCans, setTrashCans] = useState([]);
  const [isCitySelectOpen, setIsCitySelectOpen] = useState(false);
  const [isDistrictSelectOpen, setIsDistrictSelectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrashCans, setFilteredTrashCans] = useState([]);
  const [searchType, setSearchType] = useState("");

  useEffect(() => {
    fetchTrashCanData();
  }, []);

  const fetchTrashCanData = async () => {
    try {
      const promises = TrashCanFiles.map((file) =>
        fetch(`/json/${file}`).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      const mergedData = results.flat();
      setTrashCans(mergedData);
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
    const filtered = trashCans.filter((trashCan) => {
      const region = trashCan.region || "";
      const [city, district] = region ? region.split(" ") : ["", ""];
      const location = trashCan.위치 || "";

      const cityMatch = selectedCity && city.includes(selectedCity);
      const districtMatch =
        selectedDistrict && district.includes(selectedDistrict);

      return cityMatch && districtMatch;
    });

    if (filtered.length > 0) {
      setFilteredTrashCans(filtered);
      setShowModal(true);
    } else {
      alert("해당 지역에 쓰레기통이 없습니다.");
    }
  };

  const handleInputSearch = () => {
    if (!searchQuery.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }

    setSearchType("query");
    const filtered = trashCans.filter((trashCan) => {
      const location = trashCan.위치 || "";
      const region = trashCan.region || "";

      return location.includes(searchQuery) || region.includes(searchQuery);
    });

    if (filtered.length > 0) {
      setFilteredTrashCans(filtered);
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
    <div className="background trash-can">
      <div className="overlay" onClick={closeModal}></div>
      <section className="search trash-can">
        <h2>
          <FontAwesomeIcon icon={faTrashCan} className="default-icon" /> Trash
          Can
        </h2>
        <h6>공공쓰레기통 검색</h6>

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

        <button id="trashcanCityDistrictSearchButton" onClick={handleSearch}>
          지역 검색
        </button>

        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleInputSearch={handleInputSearch}
        />
      </section>

      {showModal && (
        <TrashcanModal
          trashcans={filteredTrashCans}
          onClose={closeModal}
          searchType={searchType}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

export default TrashCanSearchSection;

import React from "react";

const SearchInput = ({ searchQuery, setSearchQuery, handleInputSearch }) => {
  return (
    <div className="mg-10">
      <input
        type="text"
        id="restroomSearchInput"
        placeholder="위치를 검색하세요"
        autoComplete="off"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button id="restroomSearchButton" onClick={handleInputSearch}>
        검색
      </button>
    </div>
  );
};

export default SearchInput;

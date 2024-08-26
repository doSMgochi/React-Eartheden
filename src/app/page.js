import RestroomSearchSection from "./section/restroom/page";
import TrashCanSearchSection from "./section/trashcan/page";
import WifiSearchSection from "./section/wifi/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <>
      <div className="snap-container" id="snapContainer">
        <RestroomSearchSection />
        <TrashCanSearchSection />
        <WifiSearchSection />
      </div>
      <FontAwesomeIcon
        icon={faCaretDown}
        id="scrollIcon"
        style={{ width: "30px" }}
      />
    </>
  );
};
export default Home;

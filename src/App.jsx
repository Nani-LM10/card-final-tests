import "./common_scss/App.scss";
import CardEditScreen from "./Screens/cardEditScreen/CardEditScreen";
import AppLoader from "./components/loader/AppLoader";
import useCachedApiData from "./utils/useCachedApiData";
import { API_URL } from "./constants/apiConstants";
import { useEffect, useState } from "react";
import NoticePopup from "./components/modal/noticepopup";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { data, loading } = useCachedApiData(API_URL);

  return (
    <>
      <NoticePopup />
      <CardEditScreen
        appData={data}
        isMobile={isMobile}
        appDataLoading={loading}
      />
    </>
  );
}

export default App;

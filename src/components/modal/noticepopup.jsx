import React, { useEffect, useState } from "react";
import "./noticepopup.scss";
const NoticePopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if user already visited
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      // If not, show popup and set flag
      setShowPopup(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  if (!showPopup) return null;

  return (
    <div className = "notice-modal-overlay">
      <div className = "notice-modal-content">
      <button className="notice-close-btn" onClick={() => setShowPopup(false)}>
          <img src={"static_img\\cross.png"} alt="cross" />
        </button>
        <h3 className = "notice-title" >Disclaimer</h3>
        <p className = "notice-message" >All assets used in the Card Creator are the property of EA Sports. This tool is intended solely for community purposes.</p>
        <button onClick={() => setShowPopup(false)} className="notice-button">
          I Understand
        </button>
      </div>
    </div>
  );
};



export default NoticePopup;

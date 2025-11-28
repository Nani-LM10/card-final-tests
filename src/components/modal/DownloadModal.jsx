import "./DownloadModal.scss";
import React from "react";

const DownloadModal = React.memo(({ isVisible, setShowHideFun, children }) => {
  if (!isVisible) return null;

  return (
    <div className="download-modal-overlay">
      <div className="download-modal-content">
        <button className="download-close-btn" onClick={setShowHideFun}>
          <img src={"static_img\\cross.png"} alt="cross" />
        </button>
        {children}
      </div>
    </div>
  );
});

export default DownloadModal;

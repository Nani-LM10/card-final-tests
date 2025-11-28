import "./Modal.scss";
import React from "react";

const Modal = React.memo(({ isVisible, setShowHideFun, children }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={setShowHideFun}>
          <img src={"static_img\\cross.png"} alt="cross" />
        </button>
        {children}
      </div>
    </div>
  );
});

export default Modal;

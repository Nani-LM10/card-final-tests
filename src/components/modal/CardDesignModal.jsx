import React, { useState } from "react";

import IterateMultipleCardGrid from "./IterateMultipleCardGrid";

import { forceCheck } from "react-lazyload";

const CardDesignModal = React.memo(
  ({ cardData, setFormData, setShowHideFun }) => {
    const [gridFor, setgridFor] = useState("main");

    const handlefetchCardApiBtn = (val) => {
      console.log("handlefetchCardApiBtn", val);
      setgridFor(val);
      setTimeout(() => {
        forceCheck();
      }, 0);
    };

    const fileInputRef = React.useRef(null);

    const handleUploadClick = () => {
      fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PNG, JPG, JPEG, and GIF files are allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log("event.target.result", event.target.result);
        setFormData((prev) => ({
          ...prev,
          cardImg: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
      e.target.value = "";
      setShowHideFun();
    };

    return (
      <>
        <h2
          style={{
            marginLeft: gridFor != "main" ? "2.5rem" : "",
          }}
        >
          Select Card
        </h2>

        {gridFor === "main" && (
          <>
            <div className="button-div">
              <button
                onClick={handleUploadClick}
                className="btn-100 btn-txt-n-img upload-btn"
              >
                <p>Upload image (PNG)</p>

                <img src={"static_img\\upload_icon.png"} alt="upload btn" />
              </button>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            <div className="button-div-wrapper">
              <button
                className="wrapped-btn"
                onClick={() => handlefetchCardApiBtn("OC")}
              >
                <p>Official Cards</p>
              </button>
              <button
                className="wrapped-btn"
                onClick={() => handlefetchCardApiBtn("CCS")}
              >
                <p>Concept Cards</p>
              </button>
              <button
                className="wrapped-btn"
                onClick={() => handlefetchCardApiBtn("OVC")}
              >
                <p>Other Version Cards</p>
              </button>
            </div>
          </>
        )}

        {gridFor === "OC" && cardData?.officialCards && (
          <IterateMultipleCardGrid
            cardsData={cardData?.officialCards}
            setFormData={setFormData}
            setShowHideFun={setShowHideFun}
            appDataProp={"cardImg"}
            gridFor={gridFor}
            setgridFor={setgridFor}
          />
        )}

        {gridFor === "CCS" && cardData?.conceptCards && (
          <IterateMultipleCardGrid
            cardsData={cardData?.conceptCards}
            setFormData={setFormData}
            setShowHideFun={setShowHideFun}
            appDataProp={"cardImg"}
            gridFor={gridFor}
            setgridFor={setgridFor}
          />
        )}

        {gridFor === "OVC" && cardData?.otherVersionCards && (
          <IterateMultipleCardGrid
            cardsData={cardData?.otherVersionCards}
            setFormData={setFormData}
            setShowHideFun={setShowHideFun}
            appDataProp={"cardImg"}
            gridFor={gridFor}
            setgridFor={setgridFor}
          />
        )}
      </>
    );
  }
);

export default CardDesignModal;

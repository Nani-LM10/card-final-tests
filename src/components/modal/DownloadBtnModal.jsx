import React from "react";
import "./DownloadBtnModal.scss";
import DownloadImgTypeComponent from "../imageComponent/DownloadImgTypeComponent";

const DownloadBtnModal = React.memo(
  ({ handleDownload, formData, position, gifLoading, zoomLevel, zoomCardLevel }) => {
    const [selectedType, setSelectedType] = React.useState("cardImg");

    const handleSelect = (type) => {
      console.log(`🟢 User selected card type: ${type}`);
      setSelectedType(type);
    };

    // ✅ Dynamic logo detection (works for concept cards too)
    const hasLeagueLogo =
      !formData?.isConceptCard &&
      typeof formData?.leagueLogo === "string" &&
      formData.leagueLogo.trim() !== "" &&
      !formData.leagueLogo.toLowerCase().includes("undefined");

    // Always include nationFlagImg and clauLogo
    const logos = [
      formData?.nationFlagImg,
      formData?.clauLogo,
      hasLeagueLogo ? formData?.leagueLogo : null,
    ].filter(
      (logo) => typeof logo === "string" && logo.trim() !== "" && !logo.toLowerCase().includes("undefined")
    );

    const logoCount = logos.length;

    const cardTypeLabel =
      logoCount === 2
        ? "Two-Logo Card"
        : logoCount === 3
        ? "Three-Logo Card"
        : "Standard Card";

    console.log("🟣 Detected logo count:", logoCount);
    console.log("Card Type (from DownloadBtnModal):", cardTypeLabel);

    return (
      <>
        <h2>Download Card</h2>

        <div className="card-type-selection">
          {/* Static card preview */}
          <div
            className={`card-type-option ${selectedType === "cardImg" ? "selected" : ""}`}
            onClick={() => handleSelect("cardImg")}
            style={{ cursor: "pointer" }}
          >
            <DownloadImgTypeComponent
              formData={formData}
              ImgType="cardImg"
              position={position}
              zoomLevel={zoomLevel}
              zoomCardLevel={zoomCardLevel}
              logoCount={logoCount} // pass logoCount here
            />
          </div>

          {/* Animated card preview (if available) */}
          {formData?.hasAnimated && (
            <div
              className={`card-type-option ${selectedType === "animatedImg" ? "selected" : ""}`}
              onClick={() => handleSelect("animatedImg")}
              style={{ cursor: "pointer" }}
            >
              <DownloadImgTypeComponent
                formData={formData}
                ImgType="animatedImg"
                position={position}
                zoomLevel={zoomLevel}
                zoomCardLevel={zoomCardLevel}
                logoCount={logoCount} // pass logoCount here too
              />
            </div>
          )}
        </div>

        <button
          className="download-btn"
          onClick={() => {
            console.log(`⬇️ Downloading: ${selectedType}`);
            console.log(`🧩 Card type: ${cardTypeLabel}`);
            handleDownload(selectedType);
          }}
          disabled={gifLoading}
        >
          {gifLoading ? "Processing…" : "Download"}
        </button>
      </>
    );
  }
);

export default DownloadBtnModal;

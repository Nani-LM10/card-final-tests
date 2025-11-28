import React from "react";

import "./FeatureCardinputComponent.scss";
import '../modal/DownloadBtnModal.scss' // 🔄 NEW: Import styles for download buttons
import LazyLoad from "react-lazyload";

const FeatureCardinputComponent = React.memo(
  ({
    formData,
    handleFormDataChange,
    handleColorPaletModalVisiblity,
    handleIsCardDesignModalVisiblity,
    handleIsPlayerPickerModalVisiblity,
    handleIsDownloadBtnModalVisiblity,
    handleIsClubCardModalVisiblity,
    handleIsLeagueCardModalVisiblity,
    handleIsNationCardModalVisiblity,
    handleIsRankModalVisiblity,
    isMobile,
    zoomIn,
    zoomOut,
    zoomInCard,
    zoomOutCard,
    // 🔄 NEW: Props for download buttons on main screen
    handleDownload,
    pngLoading,
    gifLoading,
  }) => {
    return (
      <>
        {isMobile && (
          <div className="button-div">
            <button
              className="btn-65 btn-txt-n-img"
              onClick={handleIsCardDesignModalVisiblity}
            >
              <p>Card Design</p>
              <LazyLoad height={0} offset={100} once>
                <img src={formData.cardImg} alt="card-img" />
              </LazyLoad>
            </button>
            <div className="btn-35 zoom-btn">
              <span>Zoom</span>
              <button onClick={zoomInCard}>+</button>
              <button onClick={zoomOutCard}>−</button>
            </div>
          </div>
        )}

        {isMobile && (
          <div className="button-div">
            <button
              className="btn-65 btn-txt-n-img"
              onClick={handleIsPlayerPickerModalVisiblity}
            >
              <p>Player image</p>
              <LazyLoad height={0} offset={100} once>
                <img
                  src={formData.playerImg}
                  alt="player-img"
                  loading="lazy"
                  className="btn-txt-n-img-img"
                />
              </LazyLoad>
            </button>
            <div className="btn-35 zoom-btn">
              <span>Zoom</span>
              <button onClick={zoomIn}>+</button>
              <button onClick={zoomOut}>−</button>
            </div>
          </div>
        )}

        <div className="feature-box">
          <p className="heading-p">Name</p>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              handleFormDataChange("name", e.target.value.toUpperCase())
            }
          />
        </div>
        <div className="field-grp">
          <div className="feature-box">
            <p className="heading-p">OVR</p>
            <input
              type="text"
              value={formData.ovr}
              onChange={(e) => handleFormDataChange("ovr", e.target.value)}
              onInput={(e) => {
                let input = e.target.value.replace(/[^0-9]/g, "");

                if (input === "") {
                  e.target.value = "";
                } else {
                  let number = parseInt(input, 10);

                  if (number > 200) {
                    number = parseInt(input.slice(0, 2), 10);
                  }

                  e.target.value = number.toString();
                }
              }}
            />
          </div>
          <div className="feature-box">
            <p className="heading-p">Position</p>
            <input
              type="text"
              onInput={(e) => {
                e.target.value = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z]/g, "")
                  .slice(0, 4);
              }}
              value={formData.position}
              onChange={(e) => handleFormDataChange("position", e.target.value)}
            />
          </div>
        </div>

        {isMobile ? (
          <div className="field-grp grid-template">
            <div
              className="swatch"
              onClick={() =>
                handleColorPaletModalVisiblity({
                  color: formData?.ovrColor,
                  modalFor: "ovrColor",
                })
              }
            >
              <div
                style={{
                  backgroundColor: `rgba(${formData?.ovrColor?.r}, ${formData?.ovrColor?.g}, ${formData?.ovrColor?.b}, ${formData?.ovrColor?.a})`,
                }}
                className="swatch-color"
              />
            </div>
            <div
              className="swatch"
              onClick={() =>
                handleColorPaletModalVisiblity({
                  color: formData?.nameColor,
                  modalFor: "positionColor",
                })
              }
            >
              <div
                style={{
                  backgroundColor: `rgba(${formData?.positionColor?.r}, ${formData?.positionColor?.g}, ${formData?.positionColor?.b}, ${formData?.positionColor?.a})`,
                }}
                className="swatch-color"
              />
            </div>
            <div
              className="swatch"
              onClick={() =>
                handleColorPaletModalVisiblity({
                  color: formData?.nameColor,
                  modalFor: "nameColor",
                })
              }
            >
              <div
                style={{
                  backgroundColor: `rgba(${formData?.nameColor?.r}, ${formData?.nameColor?.g}, ${formData?.nameColor?.b}, ${formData?.nameColor?.a})`,
                }}
                className="swatch-color"
              />
            </div>
          </div>
        ) : (
          <div className="field-grp grid-template">
            <div className="feature-box">
              <p className="heading-p">OVR</p>

              <div
                className="swatch"
                onClick={() =>
                  handleColorPaletModalVisiblity({
                    color: formData?.ovrColor,
                    modalFor: "ovrColor",
                  })
                }
              >
                <div
                  style={{
                    backgroundColor: `rgba(${formData?.ovrColor?.r}, ${formData?.ovrColor?.g}, ${formData?.ovrColor?.b}, ${formData?.ovrColor?.a})`,
                  }}
                  className="swatch-color"
                />
              </div>
            </div>
            <div className="feature-box">
              <p className="heading-p">Position</p>
              <div
                className="swatch"
                onClick={() =>
                  handleColorPaletModalVisiblity({
                    color: formData?.nameColor,
                    modalFor: "positionColor",
                  })
                }
              >
                <div
                  style={{
                    backgroundColor: `rgba(${formData?.positionColor?.r}, ${formData?.positionColor?.g}, ${formData?.positionColor?.b}, ${formData?.positionColor?.a})`,
                  }}
                  className="swatch-color"
                />
              </div>
            </div>
            <div className="feature-box">
              <p className="heading-p">Name</p>
              <div
                className="swatch"
                onClick={() =>
                  handleColorPaletModalVisiblity({
                    color: formData?.nameColor,
                    modalFor: "nameColor",
                  })
                }
              >
                <div
                  style={{
                    backgroundColor: `rgba(${formData?.nameColor?.r}, ${formData?.nameColor?.g}, ${formData?.nameColor?.b}, ${formData?.nameColor?.a})`,
                  }}
                  className="swatch-color"
                />
              </div>
            </div>
          </div>
        )}

        {isMobile && (
          <div className="responsive-grid-div">
            <div
              className="button-div"
              onClick={handleIsNationCardModalVisiblity}
            >
              <button className="btn-100 btn-txt-n-img flagbtn">
                <div className="btn-txt-container">
                  <p className="heading-p">Nation</p>
                  <p className="hide-on-mobile">{formData.nationName}</p>
                </div>

                <img
                  src={formData.nationFlagImg}
                  alt="card-img"
                  className="flagu"
                />
              </button>
            </div>

            {!formData?.isConceptCard && (
              <div
                className="button-div"
                onClick={handleIsLeagueCardModalVisiblity}
              >
                <button className="btn-100 btn-txt-n-img flagbtn">
                  <div className="btn-txt-container">
                    <p className="heading-p">League</p>
                    <p className="hide-on-mobile">{formData.leagueName}</p>
                  </div>

                  {formData.leagueLogo && (
                    <img
                      src={formData.leagueLogo}
                      className="flagu"
                      alt="card-img"
                    />
                  )}
                </button>
              </div>
            )}

            <div
              className="button-div"
              onClick={handleIsClubCardModalVisiblity}
            >
              <button className="btn-100 btn-txt-n-img flagbtn">
                <div className="btn-txt-container">
                  <p className="heading-p">Club</p>
                  <p className="hide-on-mobile">{formData.clubName}</p>
                </div>

                <img src={formData.clauLogo} alt="card-img" className="flagu" />
              </button>
            </div>
          </div>
        )}

        <div className="button-div" onClick={handleIsRankModalVisiblity}>
          <button className="btn-100 btn-txt-n-img">
            <p>Rank</p>
            <LazyLoad height={0} offset={100} once>
              <img
                src={"rank_img/" + formData.rank}
                alt="card-img"
                loading="lazy"
              />
            </LazyLoad>
          </button>
        </div>

        <div className="feature-box">
          <p className="heading-p">Training Level</p>
          <input
            type="text"
            value={formData.rank === "d1.png" ? "0" : formData.trainingLevel}
            onChange={(e) =>
              handleFormDataChange("trainingLevel", e.target.value)
            }
            onInput={(e) => {
              let input = e.target.value.replace(/[^0-9]/g, "");

              if (input === "") {
                e.target.value = "";
              } else {
                let number = parseInt(input, 10);

                if (number > 30) {
                  number = parseInt(input.slice(0, 2), 10);
                }

                e.target.value = number.toString();
              }
            }}
            disabled={formData.rank === "d1.png"}
          />
        </div>
        {/* 🔄 CHANGED: Always show two side-by-side download buttons on mobile - no initial state */}
        {isMobile && (
          <div className="download-btn-div">
            <div className="download-buttons-container">
              {/* Left button - Download PNG */}
              <button
                className="download-btn download-btn-png"
                onClick={() => handleDownload("PNG")}
                disabled={pngLoading || gifLoading}
              >
                {pngLoading ? "Processing..." : "Download PNG"}
              </button>

              {/* Right button - Download GIF */}
              <button
                className="download-btn download-btn-gif"
                onClick={() => handleDownload("GIF")}
                disabled={pngLoading || gifLoading || !formData?.hasAnimated}
                
              >
                {gifLoading ? "Processing..." : "Download GIF"}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
);

export default FeatureCardinputComponent;


import React from "react";
import { useState, useEffect } from "react";

const DownloadImgTypeComponent = React.memo(
  ({ formData, ImgType, position, zoomLevel, zoomCardLevel, logoCount }) => {
    const imgSrc = formData?.[ImgType];

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 🧭 Define breakpoints with dynamic divisors and offsets
    let factors = { xDiv: 2, yDiv: 2, leftOffset: -19.5, topOffset: 5.5 };

    if (windowWidth <= 480 && windowWidth >= 381) {
      factors = { xDiv: 2.1333333, yDiv: 2.1333333, leftOffset: -32, topOffset: -5.5 };
    } else if (windowWidth < 369) {
      factors = { xDiv: 2.85, yDiv: 2.85, leftOffset: -39, topOffset: -13.5 };
    }
    else if (windowWidth <= 380 && windowWidth >= 369) {
       factors = { xDiv: 2.85, yDiv: 2.85, leftOffset: -41, topOffset: -17 };
    }else if (windowWidth <= 767) {
      factors = { xDiv: 2.1333333, yDiv: 2.1333333, leftOffset: -31, topOffset: -5.5 };
    } else if (windowWidth <= 1200) {
      factors = { xDiv: 2.1333333, yDiv: 2.1333333, leftOffset: -20, topOffset: 5.5 };
    }
    else if (windowWidth > 1200) {
      factors = { xDiv: 4, yDiv: 4, leftOffset: -20, topOffset: 5 };
    }
    

    return (
      <div className="Card-type-select">
        <div className="card-player-img-container">
          {/* main card image */}
          <img
            src={imgSrc}
            alt="Card"
            className="card-comp"
            loading="lazy"
            style={{
              transform: `scale(${zoomCardLevel})`,
              transition: "transform 0.1s ease-in-out",
            }}
          />
          {/* player image */}
          <img
            src={formData.playerImg}
            alt="Player"
            className="player-comp-img"
            loading="lazy"
            style={{
              left: `${position.x / factors.xDiv + factors.leftOffset}px`,
              top: `${position.y / factors.yDiv + factors.topOffset}px`,
              transform: `scale(${zoomLevel})`,
              transition:
                "transform 0.1s ease-in-out, left 0.2s ease, top 0.2s ease",
            }}
          />

          {/* name and numbers */}
          <div className="ovr-position-container">
            <p
              className="ovr-text-in-card"
              style={{
                color: `rgba(${formData?.ovrColor?.r}, ${formData?.ovrColor?.g}, ${formData?.ovrColor?.b}, ${formData?.ovrColor?.a})`,
              }}
            >
              {formData?.ovr}
            </p>
            <p
              className="position-text-in-card"
              style={{
                color: `rgba(${formData?.positionColor?.r}, ${formData?.positionColor?.g}, ${formData?.positionColor?.b}, ${formData?.positionColor?.a})`,
              }}
            >
              {formData?.position}
            </p>
          </div>

          <p
            className="trainingLevel-in-card-sm"
            style={{
              display:
                formData?.trainingLevel == 0 || formData.rank === "d1.png"
                  ? "none"
                  : "block",
            }}
          >
            {formData?.trainingLevel}
          </p>

          <p
            className="player-name-in-card"
            style={{
              color: `rgba(${formData?.nameColor?.r}, ${formData?.nameColor?.g}, ${formData?.nameColor?.b}, ${formData?.nameColor?.a})`,
            }}
          >
            {formData?.name}
          </p>

          {/* Flag container with dynamic spacing */}
          <div className={`flag-main-container-sm-scr logo-count-${logoCount}`}>
            <img
              src={formData.nationFlagImg}
              alt="flag1"
              className="flag-common-css-sm-scr"
              loading="lazy"
            />

            {/* Show league logo only if it exists and it's not a concept card */}
            {!formData?.isConceptCard && formData.leagueLogo && (
              <img
                src={formData.leagueLogo}
                alt="flag2"
                className="flag-common-css-sm-scr"
                loading="lazy"
              />
            )}

            <img
              src={formData.clauLogo}
              alt="flag3"
              className="flag-common-css-sm-scr"
              loading="lazy"
            />
          </div>

          {/* Rank */}
          {formData.rank !== "d1.png" && (
            <img
              src={"rank_img/" + formData.rank}
              alt="rank"
              className="rank-img-sm"
              loading="lazy"
            />
          )}
        </div>
      </div>
    );
  }
);

export default DownloadImgTypeComponent;

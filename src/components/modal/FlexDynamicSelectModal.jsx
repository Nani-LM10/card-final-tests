import React, { useState, useCallback, useEffect } from "react";

import debounce from "lodash.debounce";

import SearchCardSmCard from "../imageComponent/SearchCardSmCard";
import {
  convertHexToRbgaObj,
  normalizeCharacters,
} from "../../utils/commonFunctions";

const FlexDynamicSelectModal = React.memo(
  ({
    cardObjList,
    cardObjList2,
    handleFormDataChange,
    setShowHideFun,
    modaltype,
    setFormData,
    setSearchedPlayerName,
    header,
  }) => {
    const [searchTerms, setSearchTerms] = useState([]);
    const [iconRenders, setIconRenders] = useState([]);

    useEffect(() => {
      if (modaltype !== "playerImg") return;

      fetch("https://my-node-worker.eafcmobileforum.workers.dev/api/icon-renders")
        .then((res) => res.json())
        .then((data) => {
          console.log("ICON RAW:", data);

          let flat = [];

          if (Array.isArray(data)) {
            flat = data.flat(3);
          } else if (typeof data === "object") {
            flat = Object.values(data).flat(3);
          }

          console.log("ICON FLATTENED:", flat);
          setIconRenders(flat);
        })
        .catch((err) => console.error("Icon Fetch Error:", err));
    }, [modaltype]);
    useEffect(() => {
      if (modaltype === "playerImg") {
        setSearchTerms([
          ...(cardObjList || []),
          ...(cardObjList2 || []),
          ...(iconRenders || []),
        ]);
      } else {
        setSearchTerms(cardObjList || []);
      }
    }, [modaltype, cardObjList, cardObjList2, iconRenders]);

    const fileInputRef = React.useRef(null);

    function wixToStaticUrl(url) {
      if (!url || typeof url !== "string") return "";
      if (!url.startsWith("wix:image://")) return url;

      const cleaned = url.replace("wix:image://v1/", "");
      const fileId = cleaned.split("/")[0];
      return `https://static.wixstatic.com/media/${fileId}`;
    }

    const handleCardCLick = useCallback(
      (imgUrl) => {
        handleFormDataChange(modaltype, imgUrl);
        setShowHideFun();
      },
      [handleFormDataChange, modaltype, setShowHideFun]
    );

    const handleCardClickPlayer = useCallback(
      (imgUrl) => {
        handleFormDataChange(modaltype, imgUrl);
        setShowHideFun();
      },
      [handleFormDataChange, modaltype, setShowHideFun]
    );

    const handleCardCLickNLC = useCallback(
      (imgUrl, imgName) => {
        handleFormDataChange(modaltype, imgUrl);

        if (modaltype === "nationFlagImg") {
          handleFormDataChange("nationName", imgName);
        } else if (modaltype === "leagueLogo") {
          handleFormDataChange("leagueName", imgName);
        } else if (modaltype === "clauLogo") {
          handleFormDataChange("clubName", imgName);
        }

        setShowHideFun();
      },
      [handleFormDataChange, modaltype, setShowHideFun]
    );

    const debouncedChangeHandler = useCallback(
      debounce((val) => {
        setSearchTerms(val);
      }, 400),
      []
    );

    const searchedCardHandler = useCallback(
      (e) => {
        const val = e.target.value.toLowerCase();
        const normalizedVal = normalizeCharacters(val);

        let results = [];

        if (modaltype === "playerImg") {
          const f1 = cardObjList?.filter((card) =>
            normalizeCharacters(
              (card.render || card.renders || "").toLowerCase()
            ).includes(normalizedVal)
          );

          const f2 = cardObjList2?.filter((card) =>
            normalizeCharacters((card.name || "").toLowerCase()).includes(
              normalizedVal
            )
          );

          const f3 = iconRenders?.filter((card) =>
            normalizeCharacters((card.renders || "").toLowerCase()).includes(
              normalizedVal
            )
          );

          results = [...(f1 || []), ...(f2 || []), ...(f3 || [])];
        } else if (modaltype === "nationFlagImg") {
          results = cardObjList?.filter((c) =>
            normalizeCharacters(c.nation.toLowerCase()).includes(normalizedVal)
          );
        } else if (modaltype === "leagueLogo") {
          results = cardObjList?.filter((c) =>
            normalizeCharacters(c.leagueName.toLowerCase()).includes(
              normalizedVal
            )
          );
        } else if (modaltype === "clauLogo") {
          results = cardObjList?.filter((c) =>
            normalizeCharacters(c.club.toLowerCase()).includes(normalizedVal)
          );
        } else if (modaltype === "readyCards") {
          results = cardObjList?.filter((c) =>
            normalizeCharacters(c.name.toLowerCase()).includes(normalizedVal)
          );
        }

        debouncedChangeHandler(results);
      },
      [cardObjList, cardObjList2, iconRenders, modaltype]
    );

    const handleUploadClick = useCallback(() => {
      if (fileInputRef.current) fileInputRef.current.click();
    }, []);

    const handleSelectCardCLick = useCallback(
      (card) => {
        setFormData((prev) => ({
          ...prev,
          nationName: "",
          leagueName: "",
          clubName: "",
          cardImg: card?.cardImageUrl,
          playerImg: card?.headshotUrl,
          name: card?.name,
          clauLogo: card?.clubLogoUrl,
          nationFlagImg: card?.nationFlagUrl,
          leagueLogo: card?.leagueCrestUrl,
          ovr: card?.ovr,
          position: card?.position,
          nameColor: card?.nameFontHex
            ? convertHexToRbgaObj(card?.nameFontHex)
            : { r: 255, g: 255, b: 255, a: 1 },
          ovrColor: card?.ovrFontHex
            ? convertHexToRbgaObj(card?.ovrFontHex)
            : { r: 255, g: 255, b: 255, a: 1 },
          positionColor: card?.posFontHex
            ? convertHexToRbgaObj(card?.posFontHex)
            : { r: 255, g: 255, b: 255, a: 1 },
          isConceptCard: card?.cardType === "ICON" ? true : false,
          hasAnimated: false,
        }));
        setSearchedPlayerName(card?.name ? card?.name : "Search");
        setShowHideFun();
      },
      [setFormData, setShowHideFun]
    );

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
        handleFormDataChange(modaltype, event.target.result);
        setShowHideFun();
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    };

    return (
      <>
        <h2>{header}</h2>
        <div className="modal-feature-box">
          <input
            type="text"
            placeholder="search..."
            onChange={searchedCardHandler}
          />
        </div>

        {modaltype !== "readyCards" && (
          <div className="modal-feature-box">
            <button onClick={handleUploadClick} className="upload-btn">
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
        )}

        {modaltype === "playerImg" && (
          <div className="player-images-modal-wrapper">
            {searchTerms
              ?.filter((card) => {
                const rawUrl = card.image || card.headshotUrl;
                const imgSrc = rawUrl ? wixToStaticUrl(rawUrl) : null;
                return (
                  imgSrc && typeof imgSrc === "string" && imgSrc.trim() !== ""
                );
              })
              .map((card) => {
                const rawUrl = card.image || card.headshotUrl;
                const imgSrc = wixToStaticUrl(rawUrl);

                return (
                  <div className="player-image-item" key={card._id || card.id}>
                    <div
                      className="player-image-box"
                      onClick={() => handleCardClickPlayer(imgSrc)}
                    >
                      <img src={imgSrc} className="player-image-img" alt="" />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        {modaltype === "nationFlagImg" && (
          <div className="multiple-cards-div-2">
            {searchTerms.map((card) => (
              <div
                className="wrapped-cardObj-card "
                key={card?._id}
                onClick={() =>
                  handleCardCLickNLC(card.nationImage, card.nation)
                }
              >
                <img
                  src={card.nationImage}
                  alt="card"
                  className="wrapped-cardObj-card-img"
                />
                <p>{card.nation}</p>
              </div>
            ))}
          </div>
        )}

        {modaltype === "leagueLogo" && (
          <div className="multiple-cards-div-2">
            {searchTerms.map((card) => (
              <div
                className="wrapped-cardObj-card "
                key={card?._id}
                onClick={() =>
                  handleCardCLickNLC(card.leagueImage, card.leagueName)
                }
              >
                <img
                  src={card.leagueImage}
                  alt="card"
                  className="wrapped-cardObj-card-img"
                />
                <p>{card.leagueName}</p>
              </div>
            ))}
          </div>
        )}

        {modaltype === "clauLogo" && (
          <div className="multiple-cards-div-2">
            {searchTerms.map((card) => (
              <div
                className="wrapped-cardObj-card "
                key={card?._id}
                onClick={() => handleCardCLickNLC(card.clubImage, card.club)}
              >
                <img
                  src={card.clubImage}
                  alt="card"
                  className="wrapped-cardObj-card-img"
                />
                <p>{card.club}</p>
              </div>
            ))}
          </div>
        )}

        {modaltype === "rank" && (
          <div className="multiple-cards-div-2">
            {cardObjList.map((card, index) => (
              <div
                className="wrapped-cardObj-card "
                key={index}
                onClick={() => handleCardCLick(card)}
              >
                <img
                  src={"rank_img\\" + card}
                  alt="card"
                  className="wrapped-cardObj-card-img"
                />
              </div>
            ))}
          </div>
        )}

        {modaltype === "readyCards" && (
          <div className="search-multiple-cards-div-2">
            {searchTerms?.map((card) => (
              <div
                className="search-wrapped-cardObj-card"
                key={card?.id}
                onClick={() => handleSelectCardCLick(card)}
              >
                <SearchCardSmCard cardObj={card} />
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
);

export default FlexDynamicSelectModal;

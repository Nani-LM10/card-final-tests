import React, { useCallback, useState, useRef, useEffect } from "react";

import "./CardEditScreen.scss";

import FeatureCardinputComponent from "../../components/featureCardInputComponent/FeatureCardinputComponent";
import DownloadModal from "../../components/modal/DownloadModal";
import ImageComponent from "../../components/imageComponent/ImageComponent";
import Modal from "../../components/modal/Modal";
import ColorPickerModal from "../../components/modal/ColorPickerModal";
import CardDesignModal from "../../components/modal/CardDesignModal";
import FlexDynamicSelectModal from "../../components/modal/FlexDynamicSelectModal";
import DownloadBtnModal from "../../components/modal/DownloadBtnModal";
import AppLoader from "../../components/loader/AppLoader";
import playerApiData from "../../utils/getReadyCardData";
import FeatureCardinputComponentLeft from "../../components/featureCardInputComponent/FeatureCardinputComponentLeft";

import { PLAYER_API_URL } from "../../constants/apiConstants";
// import { PLAYER_APIURL_WIX } from "../../constants/apiConstants";
// import { wixToStaticUrl } from "./urlConverter";

import LazyLoad, { forceCheck } from "react-lazyload";
import GIF from "gif.js.optimized";
import { parseGIF, decompressFrames } from "gifuct-js";
import { convertRgbaObjToHex } from "../../utils/commonFunctions";
import IterateMultipleCardGrid from "../../components/modal/IterateMultipleCardGrid";

function CardEditScreen({ appData, isMobile, appDataLoading }) {
  const { readyCarddata, loading } = playerApiData(PLAYER_API_URL);

  const defaultFormData = {
    cardImg:
      "https://static.wixstatic.com/media/a7f17b_3fb05da0442d421abf4bb19d312c180a~mv2.png",
    animatedImg:
      "https://static.wixstatic.com/media/a7f17b_11e3fbdaef1c4c8ca2b5f03883c18f64~mv2.gif",
    playerImg:
      "https://static.wixstatic.com/media/54a672_2bc87c86f424443d999ac81b5875d6c2~mv2.png",
    name: "MESSI",
    ovr: 107,
    position: "ST",
    nameColor: { r: 245, g: 207, b: 243, a: 1 },
    ovrColor: { r: 237, g: 217, b: 212, a: 1 },
    positionColor: { r: 237, g: 217, b: 212, a: 1 },
    nationName: "Argentina",
    nationFlagImg:
      "https://static.wixstatic.com/media/a7f17b_2de7eb8cb53a426fbe02af8713de65c0~mv2.png",
    leagueName: "Major Soccer League",
    leagueLogo:
      "https://static.wixstatic.com/media/a7f17b_abf5597d40a44ca9b0478676346f2e8f~mv2.png",
    clubName: "Inter Miami CF",
    clauLogo:
      "https://static.wixstatic.com/media/54a672_43f78d2d6be14670a8bd066055930ff5~mv2.png",
    trainingLevel: 0,
    rank: "d1.png",
    isConceptCard: false,
    hasAnimated: true,
  };

  const [formData, setFormData] = useState(() => {
    if (typeof window === "undefined") return defaultFormData;
    try {
      const stored = window.localStorage.getItem("cardCreatorFormData");
      if (!stored) return defaultFormData;
      const parsed = JSON.parse(stored);
      return { ...defaultFormData, ...parsed };
    } catch (error) {
      console.warn("Failed to parse stored form data:", error);
      return defaultFormData;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        "cardCreatorFormData",
        JSON.stringify(formData)
      );
    } catch (error) {
      console.warn("Failed to persist form data:", error);
    }
  }, [formData]);

  const handleFormDataChange = useCallback((field, value) => {
    console.log("handleFormDataChange");
    console.log(field, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const [isColorPaletModalVisible, setIsColorPaletModalVisible] =
    useState(false);

  const [isCardDesignModalVisible, setIsCardDesignModalVisible] =
    useState(false);

  const [isPlayerPickerModalVisible, setIsPlayerPickerModalVisible] =
    useState(false);

  const [isClubModalVisible, setIsClubModalVisible] = useState(false);

  const [isLeagueModalVisible, setIsLeagueModalVisible] = useState(false);

  const [isNationModalVisible, setIsNationModalVisible] = useState(false);

  const [isRankModalVisible, setIsRankModalVisible] = useState(false);

  const [isDownloadBtnModalVisible, setIsDownloadBtnModalVisible] =
    useState(false);

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastPosCategory = useRef(null);

  useEffect(() => {
    const MOBILE_POS = { x: 24.94, y: 28.49 };

    const DESKTOP_POS = {
      x: 2.137481689453125,
      y: 0.7750186920166016,
    };
    const TABLET_POS = {
      x: 0.3436279296875,
      y: -0.4752388000488281,
    };
    const SMALL_TABLET_POS = {
      x: 24.912521362304688,
      y: 23.88470458984375,
    };
    const SMALL_POS = {
      x: 60.05278015136719,
      y: 62.467140197753906,
    };
    const SMALLEST_POS = {
      x: 54.29095458984375,
      y: 53.72844123840332,
    };

    const getCategory = (w) => {
      if (w <= 380 && w >= 370) return "small";
      if (w <= 369) return "smallest";
      if (w <= 768 && w > 381) return "small_tab";
      if (w < 1201 && w > 769) return "tablet";
      return isMobile ? "mobile" : "desktop";
    };

    const applyPosIfCategoryChanged = () => {
      const width = window.innerWidth;
      const category = getCategory(width);

      // Only change position if category changed (avoids resetting on tiny resize)
      if (lastPosCategory.current !== category) {
        lastPosCategory.current = category;
        if (category === "small") setPosition(SMALL_POS);
        else if (category === "smallest") setPosition(SMALLEST_POS);
        else if (category === "small_tab") setPosition(SMALL_TABLET_POS);
        else if (category === "mobile") setPosition(MOBILE_POS);
        else if (category === "tablet") setPosition(TABLET_POS);
        else setPosition(DESKTOP_POS);
      }
    };

    // Apply immediately on mount / when isMobile changes
    applyPosIfCategoryChanged();

    // Update when the window resizes (keeps position correct if user rotates or resizes)
    const onResize = () => applyPosIfCategoryChanged();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile, setPosition]); // keep setPosition in deps

  useEffect;

  const [SearchedPlayerName, setSearchedPlayerName] = useState(formData.name);

  const [commonColor, setcommonColor] = useState({
    modalFor: "ovrColor",
    color: { r: 255, g: 235, b: 255, a: 1 },
  });

  const handleIsDownloadBtnModalVisiblity = useCallback(() => {
    setIsDownloadBtnModalVisible((prev) => !prev), [];
    setTimeout(() => {
      forceCheck();
    }, 0);
  });

  const handleIsSearchModalVisiblity = useCallback(
    () => setIsSearchModalVisible((prev) => !prev),
    []
  );

  const handleIsCardDesignModalVisiblity = useCallback(() => {
    setIsCardDesignModalVisible((prev) => !prev), [];
    setTimeout(() => {
      forceCheck();
    }, 0);
  });

  const handleIsPlayerPickerModalVisiblity = useCallback(
    () => setIsPlayerPickerModalVisible((prev) => !prev),
    []
  );

  const handleIsClubCardModalVisiblity = useCallback(
    () => setIsClubModalVisible((prev) => !prev),
    []
  );

  const handleIsLeagueCardModalVisiblity = useCallback(
    () => setIsLeagueModalVisible((prev) => !prev),
    []
  );

  const handleIsNationCardModalVisiblity = useCallback(
    () => setIsNationModalVisible((prev) => !prev),
    []
  );

  const handleIsRankModalVisiblity = useCallback(
    () => setIsRankModalVisible((prev) => !prev),
    []
  );

  const handleColorPaletModalVisiblity = useCallback((obj) => {
    setIsColorPaletModalVisible((prev) => !prev);

    if (obj && obj.color && obj.modalFor) {
      setcommonColor(obj);
    }
  }, []);

  // 🔄 CHANGED: Separate loading states for PNG and GIF downloads
  // This allows individual "Processing..." states for each download button
  const [pngLoading, setPngLoading] = useState(false);
  const [gifLoading, setGifLoading] = useState(false);
  const canvasRef = useRef(null);
  const divRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // 🔍 Zoom in/out handlers
  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3)); // max zoom 3x
  });

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 1)); // min zoom 1x
  });

  const [zoomCardLevel, setZoomCardLevel] = useState(1);

  // 🔍 Zoom in/out handlers
  const zoomInCard = useCallback(() => {
    setZoomCardLevel((prev) => Math.min(prev + 0.01, 2)); // max zoom 3x
  });

  const zoomOutCard = useCallback(() => {
    setZoomCardLevel((prev) => Math.max(prev - 0.01, 1)); // min zoom 1x
  });

  // Utility to load an image into a promise
  const loadImage = (src) =>
    new Promise((res, rej) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = src;
    });

  function drawCircularHeadshot(
    ctx,
    headshotImg,
    hsX,
    hsY,
    hsSize,
    position,
    isMobile,
    currentZoomLevel = 1
  ) {
    ctx.save();

    const width = window.innerWidth;
    const isSmallMobile = width <= 380 && width >= 369;

    const effectiveMobile = isSmallMobile ? false : isMobile;

    const scaleFactor = 1.081;
    let actualWidth =
      (hsSize + (isMobile || isSmallMobile ? 200 : 200)) * scaleFactor;
    let actualHeight =
      (hsSize + (isMobile || isSmallMobile ? 200 : 200)) * scaleFactor;

    // Apply player zoom (CSS `transform: scale(...)` on the player image)
    actualWidth = actualWidth * currentZoomLevel;
    actualHeight = actualHeight * currentZoomLevel;

    let actualX, actualY;

    // Dynamic measurement of DOM elements to ensure universal compatibility
    // This avoids hardcoded breakpoints and works for all screen sizes/zoom levels
    let renderedCardWidth = 480; // Default fallback
    let offsetX = 0;
    let offsetY = 0;

    if (divRef.current) {
      const container = divRef.current.querySelector(
        "#card-player-img-container"
      );
      const card = divRef.current.querySelector("#card-comp");

      if (container && card) {
        const containerRect = container.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        renderedCardWidth = cardRect.width;
        // Calculate offset of card within the container
        offsetX = cardRect.left - containerRect.left;
        offsetY = cardRect.top - containerRect.top;
      }
    }

    // Fallback/Correction for small mobile screens if dynamic measurement fails or returns 0 offset
    // The CSS defines a fixed 180px card in a ~336px container for widths <= 380px.
    // If we didn't detect an offset, we force it here to ensure correct alignment.
    // if (width <= 380  {
    //   const expectedContainer = width <= 369 ? 320 : 336;
    //   const expectedCard = 180;
    //   renderedCardWidth = expectedCard;
    //   offsetX = (expectedContainer - expectedCard) / 2 - 100;
    //   offsetY = (expectedContainer - expectedCard) / 2;
    // }

    if (width <= 380 && width >= 369) {
      offsetX = 60;
      offsetY = 63;
    }

    if (width < 369) {
      offsetX = 54;
      offsetY = 54;
    }

    // Safety check to avoid division by zero
    if (renderedCardWidth === 0) renderedCardWidth = 480;

    // Calculate scale factor (Canvas is 768px fixed)
    const coordinateScaleFactor = 768 / renderedCardWidth;

    // Apply scale to the position coordinates
    // Subtract offset first to make position relative to card top-left
    actualX = (position.x - offsetX) * coordinateScaleFactor;
    actualY = (position.y - offsetY) * coordinateScaleFactor;

    // Adjust for any specific offsets if needed (based on testing, pure scaling should be close)
    // The previous code had some magic numbers that effectively zeroed out hsX/hsY.
    // We might need a small tweak if the DOM image has some default offset not captured in 'position',
    // but 'position' is applied as 'left/top' so it should be absolute.

    // Debugging log
    console.log({
      width,
      isSmallMobile,
      isMobile,
      effectiveMobile,
      actualX,
      actualY,
    });

    // Draw circular clipped headshot scaled around its TOP-CENTER (to match CSS transform origin 50% 0%)
    // Center X is still the center of the unscaled image
    const centerX = actualX + actualWidth / currentZoomLevel / 2;

    // For top-center scaling, the top Y remains fixed at actualY.
    // The center Y of the SCALED image moves down.
    const scaledCenterY = actualY + actualHeight / 2;

    const radius = (actualWidth / currentZoomLevel / 2) * currentZoomLevel;

    ctx.save();
    ctx.beginPath();
    // Clip circle should follow the scaled image center
    ctx.arc(centerX, scaledCenterY, radius, 0, Math.PI * 2);
    ctx.clip();

    // Calculate top-left for drawing
    // X: Centered horizontally (same as before) -> CenterX - HalfScaledWidth
    const drawX = centerX - actualWidth / 2;
    // Y: Top aligned (origin 0%) -> actualY
    const drawY = actualY;

    ctx.drawImage(headshotImg, drawX, drawY, actualWidth, actualHeight);
    ctx.restore();
  }

  // ✅ Main generator function
  const generateAndDownload = async (
    type,
    setLoading,
    currentZoomLevel = zoomLevel,
    currentZoomCardLevel = zoomCardLevel
  ) => {
    try {
      if (setLoading) setLoading(true);

      const cardUrl =
        type === "STATIC" ? formData.cardImg : formData.animatedImg;

      // Fetch card
      const res = await fetch(cardUrl);
      const buffer = await res.arrayBuffer();

      // ✅ Safe image loader as async function
      const safeLoadImage = async (src) => {
        if (!src || typeof src !== "string") return null;

        const sanitizedSrc = src.trim();
        if (
          sanitizedSrc === "" ||
          sanitizedSrc === "undefined" ||
          sanitizedSrc === "null"
        ) {
          return null;
        }

        const isDataUrl = sanitizedSrc.startsWith("data:image/");
        const hasValidExtension = /\.(png|jpg|jpeg|webp|gif)$/i.test(
          sanitizedSrc
        );

        if (!isDataUrl && !hasValidExtension) {
          return null;
        }

        try {
          const img = await loadImage(sanitizedSrc);
          return img;
        } catch (err) {
          console.warn(`Failed to load image: ${sanitizedSrc}, err`, err);
          return null;
        }
      };

      console.log("League logo value:", formData.leagueLogo);

      const [headshotImg, flagImg, leagueImg, clubImg, rankImg] =
        await Promise.all([
          safeLoadImage(formData.playerImg),
          safeLoadImage(formData.nationFlagImg),
          safeLoadImage(formData.leagueLogo),
          safeLoadImage(formData.clauLogo),
          safeLoadImage(formData.rank ? "rank_img/" + formData.rank : null),
        ]);

      // ✅ Canvas setup
      const width = 768;
      const height = 768;
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // ✅ Headshot + text layout
      const hsSize = width * 0.669;
      const hsX = (width - hsSize) / 2;
      const hsY = height * 0.09;
      const ovrX = width * 0.065 + 115;
      const ovrY = height * 0.115 + 78;
      const posY = ovrY + 78;
      const nameY = hsY + hsSize - 2;

      // ✅ Logo sizing
      const iconSize = 70;
      const gap = 88;
      const iconY = 565;
      const gapIcon = 124;

      // ✅ Detect logo type (2-logo vs 3-logo)
      const hasLeagueLogo =
        !formData?.isConceptCard &&
        typeof formData?.leagueLogo === "string" &&
        formData.leagueLogo.trim() !== "" &&
        !formData.leagueLogo.toLowerCase().includes("undefined");

      const isThreeLogoCard = hasLeagueLogo;
      const isTwoLogoCard = !hasLeagueLogo;

      console.log(
        "Detected card type:",
        isThreeLogoCard ? "3 logos" : "2 logos"
      );

      console.log({
        flag: !!flagImg,
        league: !!leagueImg,
        club: !!clubImg,
        rank: !!rankImg,
      });

      // ✅ Overlay drawing
      // ✅ Overlay drawing
      const drawOverlays = () => {
        // Player image
        drawCircularHeadshot(
          ctx,
          headshotImg,
          hsX,
          hsY,
          hsSize,
          position,
          isMobile
        );

        // === LINKED TEXT GROUP ANCHOR ===
        const textGroupX = ovrX + position.x * 0.1; // both move slightly with headshot drag
        const textGroupY = ovrY + position.y * 0.05;

// === Draw OVR ===
ctx.font = "105px 'CruyffFont', sans-serif";
ctx.fillStyle = convertRgbaObjToHex(formData.ovrColor);

const ovrText = String(formData.ovr);
const posText = formData.position;

let ovrXShift = 0;

// ⭐ Rule 1: If POSITION has 3 letters → shift RIGHT
if (posText.length === 3) {
  ovrXShift = 11;
}

// ⭐ Rule 2: If screen <= 380px → pull LEFT slightly
if (window.innerWidth <= 380) {
  ovrXShift -= 9;   // mobile correction (tweak 6–12 if needed)
}

// ✅ Draw OVR
ctx.fillText(ovrText, textGroupX + ovrXShift, textGroupY);

// ✅ Measure OVR width
const ovrWidth = ctx.measureText(ovrText).width;


// === Draw Position ===
ctx.font = "70px 'CruyffFont', sans-serif";
ctx.fillStyle = convertRgbaObjToHex(formData.positionColor);

const posWidth = ctx.measureText(posText).width;

// ✅ Default vertical gap
let posOffsetY = 75;



const posX =
  (textGroupX + ovrXShift) + (ovrWidth / 2) - (posWidth / 2);

const posY = textGroupY + posOffsetY;

// ✅ Draw Position
ctx.fillText(posText, posX, posY);




        // Player name
        ctx.font = "65px 'CruyffFont', sans-serif";
        ctx.fillStyle = convertRgbaObjToHex(formData.nameColor);
        const nameW = ctx.measureText(formData.name).width;
        ctx.fillText(
          formData.name.toUpperCase(),
          (width - nameW) / 2,
          nameY - 25
        );

        // ✅ Dynamic logo layout
        const availableLogos = [];
        availableLogos.push(flagImg);
        if (isThreeLogoCard && leagueImg) availableLogos.push(leagueImg);
        availableLogos.push(clubImg);

        const validLogos = availableLogos.filter(Boolean);
        const numLogos = validLogos.length;

        if (numLogos === 3) {
          const totalW = numLogos * iconSize + (numLogos - 1) * gap;
          const startX = (width - totalW) / 2;
          validLogos.forEach((img, i) => {
            const x = startX + i * (iconSize + gap);
            ctx.drawImage(img, x, iconY, iconSize, iconSize);
          });
        } else if (numLogos === 2) {
          const totalW = numLogos * iconSize + (numLogos - 1) * gapIcon;
          const startX = (width - totalW) / 2;
          validLogos.forEach((img, i) => {
            const x = startX + i * (iconSize + gapIcon);
            ctx.drawImage(img, x, iconY, iconSize, iconSize);
          });
        }

        // ✅ Rank
        if (formData.rank !== "d1.png" && rankImg) {
          const rankSize = 121;
          const rankX = (width - rankSize) / 2;
          const rankY = height - rankSize - height * 0.02 + 2;
          ctx.drawImage(rankImg, rankX, rankY, rankSize, rankSize);

          // Training Level
          if (!(formData?.trainingLevel == 0 || formData.rank === "d1.png")) {
            ctx.font = "52px 'CruyffFont', sans-serif";
            ctx.fillStyle = "#ffffff";
            const trainlvlW = ctx.measureText(formData.trainingLevel).width;
            const trainlvlH = 32;
            ctx.fillText(
              formData.trainingLevel,
              rankX + (rankSize - trainlvlW) / 2 - 1,
              rankY + rankSize / 2 + trainlvlH / 3 + 10
            );
          }
        }
      };

      // Generate clean filename
      function makeFileName(ext) {
        const name = (formData.name || "player").toString().trim();
        

        const clean = `card_downloaded_${name}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/_+/g, "_")
          .replace(/^_+|_+$/g, "");

        return `${clean}.${ext}`;
      }

      // ✅ Static Image Branch
      if (type === "STATIC") {
        const img = await loadImage(cardUrl);
        ctx.clearRect(0, 0, width, height);

        const cardDrawW = Math.round(width * currentZoomCardLevel);
        const cardDrawH = Math.round(height * currentZoomCardLevel);
        const cardDx = Math.round((width - cardDrawW) / 2);
        const cardDy = Math.round((height - cardDrawH) / 2);
        ctx.drawImage(img, cardDx, cardDy, cardDrawW, cardDrawH);

        drawOverlays();

        const dataURL = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = makeFileName("png"); // <-- HERE
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        if (setLoading) setLoading(false);
        return;
      }

      // ✅ GIF Branch
      const parsed = parseGIF(buffer);
      const frames = decompressFrames(parsed, true);

      const encoder = new GIF({
        workers: 2,
        quality: 10,
        width,
        height,
        workerScript: "gif.worker.js",
      });

      const bufferCanvas = document.createElement("canvas");
      bufferCanvas.width = frames[0].dims.width;
      bufferCanvas.height = frames[0].dims.height;
      const bufferCtx = bufferCanvas.getContext("2d");

      frames.forEach((frame) => {
        const imgData = ctx.createImageData(
          frame.dims.width,
          frame.dims.height
        );
        imgData.data.set(frame.patch);

        if (frame.disposalType === 2) {
          bufferCtx.clearRect(0, 0, frame.dims.width, frame.dims.height);
        }

        bufferCtx.putImageData(imgData, frame.dims.left, frame.dims.top);

        ctx.clearRect(0, 0, width, height);

        // Draw animated frame scaled around center (match STATIC behaviour)
        const cardDrawW = Math.round(width * currentZoomCardLevel);
        const cardDrawH = Math.round(height * currentZoomCardLevel);
        const cardDx = Math.round((width - cardDrawW) / 2);
        const cardDy = Math.round((height - cardDrawH) / 2);

        ctx.drawImage(bufferCanvas, cardDx, cardDy, cardDrawW, cardDrawH);

        drawOverlays();
        encoder.addFrame(ctx, { copy: true, delay: frame.delay });
      });

      encoder.on("finished", (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = makeFileName("gif"); // <-- HERE
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (setLoading) setLoading(false);
      });

      encoder.render();
    } catch (err) {
      console.error("Error generating card:", err);
      // 🔄 CHANGED: Use passed setLoading callback instead of hardcoded setGifLoading
      if (setLoading) setLoading(false);
    }
  };

  // 🔄 CHANGED: Updated handleDownload to support individual button loading states
  // Now accepts download type and sets appropriate loading state
  const handleDownload = async (downloadType) => {
    if (downloadType === "PNG") {
      // Download PNG and show "Processing..." on PNG button
      await generateAndDownload(
        "STATIC",
        setPngLoading,
        zoomLevel,
        zoomCardLevel
      );
    } else if (downloadType === "GIF") {
      // Download GIF and show "Processing..." on GIF button
      console.log("Downloaded animated");
      await generateAndDownload(
        "ANIMATED",
        setGifLoading,
        zoomLevel,
        zoomCardLevel
      );
    }
  };

  const rankImgs = ["d1.png", "d2.png", "d3.png", "d4.png", "d5.png", "d6.png"];

  return (
    <div id="main-container">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="hiddenImg">
        <img src={formData?.cardImg} alt="img" />
      </div>

      {!isMobile && (
        <FeatureCardinputComponentLeft
          formData={formData}
          handleIsCardDesignModalVisiblity={handleIsCardDesignModalVisiblity}
          handleIsPlayerPickerModalVisiblity={
            handleIsPlayerPickerModalVisiblity
          }
          handleIsNationCardModalVisiblity={handleIsNationCardModalVisiblity}
          handleIsLeagueCardModalVisiblity={handleIsLeagueCardModalVisiblity}
          handleIsClubCardModalVisiblity={handleIsClubCardModalVisiblity}
          handleIsDownloadBtnModalVisiblity={handleIsDownloadBtnModalVisiblity}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          zoomInCard={zoomInCard}
          zoomOutCard={zoomOutCard}
          // 🔄 NEW: Pass download-related props for download buttons on main screen
          handleDownload={handleDownload}
          pngLoading={pngLoading}
          gifLoading={gifLoading}
        />
      )}

      {isMobile && <div className="card-creator-txt">Card Creator</div>}

      <LazyLoad
        height={300}
        offset={100}
        className={isMobile ? "ImgComponentCss" : ""}
      >
        <ImageComponent
          formData={formData}
          handleIsSearchModalVisiblity={handleIsSearchModalVisiblity}
          SearchedPlayerName={SearchedPlayerName}
          position={position}
          setPosition={setPosition}
          zoomLevel={zoomLevel}
          zoomCardLevel={zoomCardLevel}
          ref={divRef}
          isMobile={isMobile}
        />
      </LazyLoad>

      <div className="feature-card-input-div">
        <FeatureCardinputComponent
          formData={formData}
          handleFormDataChange={handleFormDataChange}
          handleColorPaletModalVisiblity={handleColorPaletModalVisiblity}
          handleIsCardDesignModalVisiblity={handleIsCardDesignModalVisiblity}
          handleIsPlayerPickerModalVisiblity={
            handleIsPlayerPickerModalVisiblity
          }
          handleIsDownloadBtnModalVisiblity={handleIsDownloadBtnModalVisiblity}
          handleIsClubCardModalVisiblity={handleIsClubCardModalVisiblity}
          handleIsLeagueCardModalVisiblity={handleIsLeagueCardModalVisiblity}
          handleIsNationCardModalVisiblity={handleIsNationCardModalVisiblity}
          handleIsRankModalVisiblity={handleIsRankModalVisiblity}
          isMobile={isMobile}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          zoomInCard={zoomInCard}
          zoomOutCard={zoomOutCard}
          // 🔄 NEW: Pass download-related props for mobile version too
          handleDownload={handleDownload}
          pngLoading={pngLoading}
          gifLoading={gifLoading}
        />
      </div>

      {/* card selecter modal */}
      <Modal
        isVisible={isCardDesignModalVisible}
        setShowHideFun={handleIsCardDesignModalVisiblity}
      >
        {appDataLoading ? (
          <AppLoader />
        ) : (
          <CardDesignModal
            cardData={appData}
            setFormData={setFormData}
            setShowHideFun={handleIsCardDesignModalVisiblity}
          />
        )}
      </Modal>

      {/* color picker modal */}
      <Modal
        isVisible={isColorPaletModalVisible}
        setShowHideFun={handleColorPaletModalVisiblity}
      >
        <ColorPickerModal
          color={formData[commonColor.modalFor]}
          handleColorChange={handleFormDataChange}
          handleChangeFor={commonColor.modalFor}
          handleColorPaletModalVisiblity={handleColorPaletModalVisiblity}
        />
      </Modal>

      {/* flex column dynamic modal - player*/}
      <Modal
        isVisible={isPlayerPickerModalVisible}
        setShowHideFun={handleIsPlayerPickerModalVisiblity}
      >
        {appDataLoading ? (
          <AppLoader />
        ) : (
          <FlexDynamicSelectModal
            cardObjList={appData?.playerRenders}
            cardObjList2={readyCarddata}
            handleFormDataChange={handleFormDataChange}
            setShowHideFun={handleIsPlayerPickerModalVisiblity}
            modaltype={"playerImg"}
            header={"Player image"}
          />
        )}
      </Modal>

      {/* flex column dynamic modal - club*/}
      <Modal
        isVisible={isClubModalVisible}
        setShowHideFun={handleIsClubCardModalVisiblity}
      >
        {appDataLoading ? (
          <AppLoader />
        ) : (
          <FlexDynamicSelectModal
            cardObjList={appData?.clubs}
            handleFormDataChange={handleFormDataChange}
            setShowHideFun={handleIsClubCardModalVisiblity}
            modaltype={"clauLogo"}
            modalTypeName={"clubName"}
            header={"Club"}
          />
        )}
      </Modal>

      {/* flex column dynamic modal - nation*/}
      <Modal
        isVisible={isNationModalVisible}
        setShowHideFun={handleIsNationCardModalVisiblity}
      >
        {appDataLoading ? (
          <AppLoader />
        ) : (
          <FlexDynamicSelectModal
            cardObjList={appData?.nations}
            handleFormDataChange={handleFormDataChange}
            setShowHideFun={handleIsNationCardModalVisiblity}
            modaltype={"nationFlagImg"}
            modalTypeName={"nationName"}
            header={"Nation"}
          />
        )}
      </Modal>

      {/* flex column dynamic modal - league*/}
      <Modal
        isVisible={isLeagueModalVisible}
        setShowHideFun={handleIsLeagueCardModalVisiblity}
      >
        {appDataLoading ? (
          <AppLoader />
        ) : (
          <FlexDynamicSelectModal
            cardObjList={appData?.leagues}
            handleFormDataChange={handleFormDataChange}
            setShowHideFun={handleIsLeagueCardModalVisiblity}
            modaltype={"leagueLogo"}
            modalTypeName={"leagueName"}
            header={"League"}
          />
        )}
      </Modal>

      {/* flex column dynamic modal - search*/}
      <Modal
        isVisible={isSearchModalVisible}
        setShowHideFun={handleIsSearchModalVisiblity}
      >
        {appDataLoading ? (
          <AppLoader />
        ) : (
          <FlexDynamicSelectModal
            cardObjList={readyCarddata}
            handleFormDataChange={handleFormDataChange}
            setShowHideFun={handleIsSearchModalVisiblity}
            modaltype={"readyCards"}
            setFormData={setFormData}
            setSearchedPlayerName={setSearchedPlayerName}
            header={"Search Card"}
          />
        )}
      </Modal>

      {/* Rank modal*/}
      <Modal
        isVisible={isRankModalVisible}
        setShowHideFun={handleIsRankModalVisiblity}
      >
        {appDataLoading ? (
          <AppLoader />
        ) : (
          <IterateMultipleCardGrid
            cardsData={rankImgs}
            setFormData={setFormData}
            setShowHideFun={handleIsRankModalVisiblity}
            appDataProp={"rank"}
            gridFor={"rank"}
            header={"Select Rank"}
          />
        )}
      </Modal>

      {/* Download button download */}
      <DownloadModal
        isVisible={isDownloadBtnModalVisible}
        setShowHideFun={handleIsDownloadBtnModalVisiblity}
      >
        <DownloadBtnModal
          handleDownload={handleDownload}
          formData={formData}
          position={position}
          pngLoading={pngLoading}
          gifLoading={gifLoading}
          zoomLevel={zoomLevel}
          zoomCardLevel={zoomCardLevel}
        />
      </DownloadModal>
    </div>
  );
}

export default CardEditScreen;

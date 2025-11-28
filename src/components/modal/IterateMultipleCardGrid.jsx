import React from "react";
import { convertHexToRbgaObj } from "../../utils/commonFunctions";

const IterateMultipleCardGrid = React.memo(
  ({
    cardsData,
    setFormData,
    setShowHideFun,
    appDataProp,
    gridFor,
    header,
    setgridFor,
  }) => {
    const handleCardCLick = (cardObj) => {
      if (gridFor === "rank") {
        setFormData((prev) => ({
          ...prev,
          [appDataProp]: cardObj,
        }));
      } else {
        console.log("cardObj - ", cardObj);
        setFormData((prev) => ({
          ...prev,
          [appDataProp]: cardObj?.image,
          animatedImg: !!cardObj?.hasAnimated ? cardObj?.animatedcard : "",
          isConceptCard: cardObj?.cardType === "Icon",
          hasAnimated: !!cardObj?.hasAnimated,
          nameColor: cardObj?.nameColor
            ? convertHexToRbgaObj(cardObj?.nameColor)
            : { r: 255, g: 255, b: 255, a: 1 },
          ovrColor: cardObj?.ovrColor
            ? convertHexToRbgaObj(cardObj?.ovrColor)
            : { r: 255, g: 255, b: 255, a: 1 },
          positionColor: cardObj?.posColor
            ? convertHexToRbgaObj(cardObj?.posColor)
            : { r: 255, g: 255, b: 255, a: 1 },
        }));
      }

      setShowHideFun();
    };
    console.log("IterateMultipleCardGrid cardsData-", cardsData);
    if (!cardsData || cardsData.length === 0) {
      return <div>No cards available</div>;
    }

    return (
      <>
        <button
          className="back-btn"
          //   style={{ right: window.innerWidth > 700 ? "28.5rem" : "" }}
        >
          <img
            onClick={() => setgridFor("main")}
            src={"static_img\\back.png"}
            alt="back"
            style={{
              display: gridFor === "rank" ? "none" : "block",
            }}
          />
        </button>

        <h2>{gridFor === "rank" ? header : ""}</h2>
        <div className="multiple-cards-div">
          {gridFor === "rank"
            ? cardsData.map((card, idx) => (
                <div
                  className="wrapped-card"
                  key={idx}
                  onClick={() => handleCardCLick(card)}
                >
                  <img
                    src={"rank_img\\" + card}
                    alt="Card"
                    className="wrapper-card-img"
                  />
                </div>
              ))
            : cardsData.map((card) => {
                const items = [];
                const mainImg = card?.image;
                const hasAnimated = card?.hasAnimated && card?.animatedcard;

                if (mainImg) {
                  items.push(
                    <div
                      className="wrapped-card"
                      key={card?._id + "-main"}
                      onClick={() => handleCardCLick(card)}
                    >
                      <img
                        src={mainImg}
                        alt="Card"
                        className="wrapper-card-img"
                      />
                    </div>
                  );
                }

                // if (hasAnimated) {
                //     items.push(
                //         <div
                //             className="wrapped-card"
                //             key={card?._id + '-animated'}
                //             onClick={() => handleCardCLick(card)}
                //         >
                //             <LazyLoad
                //                 height={144}
                //                 offset={150}
                //                 scrollContainer=".multiple-cards-div"
                //                 placeholder={<>loading...</>}
                //             >
                //                 <img src={card.animatedcard} alt="Animated Card" className="wrapper-card-img" />
                //             </LazyLoad>
                //         </div>
                //     );
                // }

                return items;
              })}
        </div>
      </>
    );
  }
);

export default IterateMultipleCardGrid;

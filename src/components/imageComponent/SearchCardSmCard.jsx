
function SearchCardSmCard({ cardObj }) {
    return (
        <div className='search-wrapped-cardObj-sm'>
            {/* main images */}
            <img src={cardObj.cardImageUrl} alt="card" className="search-wrapped-cardObj-sm-card-img" />
            <img src={cardObj.headshotUrl} alt="headimg" className="search-wrapped-cardObj-sm-player-img" />

            {/* name, numbers */}
            <div className='search-ovr-position-container-sm'>
                <p className='search-ovr-text-in-card-sm'
                    style={{ color: cardObj?.ovrFontHex }}
                >
                    {cardObj?.ovr}
                </p>
                <p className='search-position-text-in-card-sm'
                    style={{ color: cardObj?.posFontHex }}
                >
                    {cardObj?.position}
                </p>
            </div>

            {/* name */}
            <p className='search-player-name-in-card-sm'
                style={{ color: cardObj?.nameFontHex }}
            >
                {cardObj?.name}
            </p>

            <div className='search-flag-main-container-sm'>
                <img src={cardObj?.nationFlagUrl} alt="flag1" className='search-flag-common-css-sm' />
                {cardObj?.cardType !== 'ICON' && < img src={cardObj?.leagueCrestUrl} alt="flag2" className='search-flag-common-css-sm' />}

                <img src={cardObj?.clubLogoUrl} alt="flag3" className='search-flag-common-css-sm' />
            </div>
        </div>
    )
}

export default SearchCardSmCard
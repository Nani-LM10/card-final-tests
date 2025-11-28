import LazyLoad from 'react-lazyload'
import '../modal/DownloadBtnModal.scss' // 🔄 NEW: Import styles for download buttons

function FeatureCardinputComponentLeft({
  formData, handleIsCardDesignModalVisiblity,
  handleIsPlayerPickerModalVisiblity, handleIsNationCardModalVisiblity,
  handleIsLeagueCardModalVisiblity, handleIsClubCardModalVisiblity,
  handleIsDownloadBtnModalVisiblity, zoomIn, zoomOut, zoomInCard, zoomOutCard,
  // 🔄 NEW: Props for download buttons on main screen
  handleDownload,
  pngLoading,
  gifLoading
}) {
  return (
    <div className='feature-card-input-div'>

      <div className='button-div'>
        <button className='btn-100 btn-txt-n-img' onClick={handleIsCardDesignModalVisiblity}>
          <p >Card Design</p>
          <LazyLoad height={0} offset={100} once>
            <img src={formData.cardImg} alt="card-img" />
          </LazyLoad>
        </button>
        <div className='btn-35 zoom-btn'>
          <span>Zoom</span>
          <button onClick={zoomInCard}>+</button>
          <button onClick={zoomOutCard}>−</button>
        </div>
      </div>

      <div className='button-div'>
        <button className='btn-100 btn-txt-n-img' onClick={handleIsPlayerPickerModalVisiblity}>
          <p>Player image</p>
          <LazyLoad height={0} offset={100} once>
            <img src={formData.playerImg} alt="player-img" loading="lazy" className='btn-txt-n-img-img' />
          </LazyLoad>
        </button>
        <div className='btn-35 zoom-btn'>
          <span>Zoom</span>
          <button onClick={zoomIn}>+</button>
          <button onClick={zoomOut}>−</button>
        </div>
      </div>


      <div className='responsive-grid-div'>

        <div className='button-div' onClick={handleIsNationCardModalVisiblity}>
          <button className='btn-100 btn-txt-n-img'>
            <div className='btn-txt-container'>
              <p className='heading-p'>Nation</p>
              {(formData.nationName && formData.nationName !== '') && (<p className='hide-on-mobile'>{formData.nationName}</p>)}
            </div>
            <LazyLoad height={0} offset={100} once>
              <img src={formData.nationFlagImg} alt="card-img" loading="lazy" />
            </LazyLoad>
          </button>
        </div>

        {!formData?.isConceptCard && <div className='button-div' onClick={handleIsLeagueCardModalVisiblity}>
          <button className='btn-100 btn-txt-n-img'>
            <div className='btn-txt-container'>
              <p className='heading-p'>League</p>
              {(formData.leagueName && formData.leagueName !== '') && (<p className='hide-on-mobile'>{formData.leagueName}</p>)}
            </div>
            <LazyLoad height={0} offset={100} once>
              {formData.leagueLogo && (<img src={formData.leagueLogo} alt="card-img" loading="lazy" />)}
            </LazyLoad>
          </button>
        </div>}


        <div className='button-div' onClick={handleIsClubCardModalVisiblity}>
          <button className='btn-100 btn-txt-n-img'>
            <div className='btn-txt-container'>
              <p className='heading-p'>Club</p>
              {(formData.clubName && formData.clubName !== '') && (<p className='hide-on-mobile'>{formData.clubName}</p>)}
            </div>
            <LazyLoad height={0} offset={100} once>
              <img src={formData.clauLogo} alt="card-img" loading="lazy" />
            </LazyLoad>
          </button>
        </div>

      </div>
      {/* 🔄 CHANGED: Always show two side-by-side download buttons - no initial state */}
      <div className='download-btn-div'>
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

    </div >
  )
}

export default FeatureCardinputComponentLeft

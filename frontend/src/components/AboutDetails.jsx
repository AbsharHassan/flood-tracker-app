const AboutDetails = ({ isDarkMode }) => {
  return (
    <div
      className={`h-full py-4 ${
        isDarkMode ? 'text-slate-400' : 'text-slate-500'
      } `}
    >
      <h2 className="text-center tracking-wide h-[25px]">
        Methodology & Techniques
      </h2>
      <hr
        className={`mt-2 ${
          isDarkMode ? 'border-slate-700' : 'border-slate-400'
        }`}
      />
      <div
        className={`w-full h-calc-minus-65 pt-4 ${
          isDarkMode ? 'opacity-60' : 'opacity-90'
        } `}
      >
        This application is powered by the Google Earth Engine Javascript API
        running on the backend in NodeJS with ExpressJs. A flood detection
        algorithm is used in accordance with the best practices recommended by
        UN-Spider flood mapping.
        <br />
        <br />
        A data processing pipeline is created to automate the process of
        detecting floods and analyzing the damage. Data mining is carried out to
        bring up relevant satellite radar imagery from the SAR data that is
        obtained from the Sentinel-1 satellite. Computer vision techniques such
        as mosaicking and speckle filtering are applied in order to help detect
        floods.
        <br />
        <br />
        The Google Earth Engine API is used to train a classifier to classify
        different types of landcover with high accuracy. The classification is
        done on satellite images in the optical wavelength from the Sentinel-2
        satellite. In this way, machine learning is used to identify different
        landcovers. This is used in conjunction with the aforementioned computer
        vision techniques to detect and quanitfy the damage caused by the floods
        on different land types. This algorithim also highlights the main roads
        affected by the flooding.
        <br />
        <br />
        The application provides flood tracking from 2022 onwards. Although the
        results of the algorithms developed for this application are in great
        agreement with ground realities, there may still be some discrepancies.
      </div>
    </div>
  )
}

export default AboutDetails

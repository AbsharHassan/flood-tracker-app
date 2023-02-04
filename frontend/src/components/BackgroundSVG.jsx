const BackgroundSVG = () => {
  return (
    <div className="fixed inset-x-0 top-0 overflow-hidden -z-20 transform-gpu blur-xl sm:blur-3xl">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
          fillOpacity="0.5"
          d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
          className="shape-fill"
        />
        <defs>
          <linearGradient
            id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
            x1="1155.49"
            x2="-78.208"
            y1=".177"
            y2="474.645"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="rgb(30 30 125 / 0.6 )"></stop>
            <stop
              offset="1"
              stopColor="rgb(30 30 125 / 0.6 )"
            ></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default BackgroundSVG

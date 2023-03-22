import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const MapLegend = () => {
  const { selectedFloodData } = useSelector((state) => state.apiData)
  const { isDarkMode } = useSelector((state) => state.sidebar)

  const [maxValue, setMaxValue] = useState(selectedFloodData.results.maxFlood)

  useEffect(() => {
    setMaxValue(selectedFloodData.results.maxFlood)
  }, [selectedFloodData])

  return (
    <div
      className={`flex flex-col ml-2 rounded-lg sm:ml-2 sm:flex-col sm:mb-3  backdrop-blur-2xl  ${
        isDarkMode
          ? 'bg-themeCardColorDark/50 text-slate-300 card-shadow'
          : 'bg-themeCardColorLight/60 text-slate-700 border border-themeBorderColorLight'
      }`}
      title="Map legend"
    >
      <div className="h-full p-1 pt-2 font-medium text-center sm:w-full ">
        % Land Flooded
      </div>
      <div className="flex flex-col items-center w-full mt-2 mb-3 sm:flex-row justify-evenly">
        {[0.4, 0.6, 0.8, 1, 1.2].map((number) => {
          return (
            <div
              className="flex flex-col w-10 mx-2 text-center sm:space-y-3 "
              key={number}
            >
              <div
                className="h-[20px] rounded-sm font-bold flex items-center justify-center"
                style={{
                  backgroundColor: `rgb(51 170 255 / ${number})`,
                  color: `rgb(${255 - 220 * number} ${255 - 220 * number} ${
                    255 - 220 * number
                  })`,
                }}
              >
                <div className="hidden">
                  {'>'}
                  {((Math.round(maxValue * 10) / 10) * (number - 0.2)).toFixed(
                    1
                  )}
                  %
                </div>
              </div>
              <div className="mb-1 sm:mb-0">
                {'>'}
                {((Math.round(maxValue * 10) / 10) * (number - 0.2)).toFixed(1)}
                %
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MapLegend

//[0.2, 0.4, 0.6, 0.8, 1
//[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]

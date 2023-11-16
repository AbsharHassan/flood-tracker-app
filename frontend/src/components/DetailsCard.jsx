import { useSelector } from 'react-redux'
import { TiArrowUpThick } from 'react-icons/ti'

const DetailsCard = ({
  icon: Icon,
  title,
  value,
  units,
  color,
  difference,
  differenceUnit,
}) => {
  const { isDarkMode } = useSelector((state) => state.sidebar)
  return (
    <div className="flex justify-center w-full px-2 sm:px-2 xl:px-3">
      <div
        className={`w-full h-[110px] sm:h-[120px] rounded-sm px-3 sm:px-5 relative ${
          isDarkMode
            ? 'bg-themeCardColorDark border border-themeBorderColorDark'
            : 'bg-themeCardColorLight border border-themeBorderColorLight'
        }`}
      >
        <span
          className={`absolute right-4 top-3 text-lg sm:text-3xl xs:text-xl p-2 rounded-full ${
            isDarkMode ? 'bg-[#1d2d42]' : 'bg-[#eff2f7]'
          }`}
        >
          <Icon />
        </span>
        <div
          className={`flex flex-col justify-evenly h-full ${
            isDarkMode ? 'text-[#9599ad]' : 'text-slate-500'
          }`}
        >
          <div className=" uppercase text-[9px] text-clip xxs:text-[10.5px] xxs:whitespace-nowrap xs:text-xs md:text ">
            {title}
          </div>
          <div className="flex items-center text-sm text-[8px] font-medium mb-1">
            <span
              className={`mr-1 text-sm xxs:text-lg xs:text-lg sm:text-xl md:text-2xl xl:text-2xl font-bold ${color}`}
            >
              {!isNaN(value) ? Math.abs(value) : 'N/A'}
            </span>
            <span className="text-base xs:text-xl">-</span>
            <span className="ml-1 mt-0.5 font-bold text-[10px] xs:text-sm">
              {units}
            </span>
          </div>
          <div className="w-full flex items-baseline ">
            <div
              className={`h-[15.75px] px-1 rounded flex items-center ${
                difference.polarity
                  ? 'bg-[#2cb57e2e] text-[#2cb57e]'
                  : 'bg-[#f56e502e] text-[#f56e50]'
              }`}
            >
              {!isNaN(difference.value) && (
                <i className="h-full flex items-center bg-yellow-400/0">
                  <TiArrowUpThick
                    className={`text-[11px] duration-200 ${
                      difference.polarity ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </i>
              )}

              <div className="h-full ml-1 pt-[0.25px] text-[11px] flex items-center bg-green-500/0">
                {!isNaN(difference.value) ? Math.abs(difference.value) : 'N/A'}
                {!isNaN(difference.value) && differenceUnit}
              </div>
            </div>
            <span className="ml-2 text-[9.5px] sm:text-xs uppercase font-medium whitespace-nowrap">
              since last month
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

DetailsCard.defaultProps = {
  differenceUnit: '%',
}
export default DetailsCard

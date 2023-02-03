import { TiArrowUpThick } from 'react-icons/ti'

const DetailsCardV2 = ({
  icon: Icon,
  title,
  value,
  units,
  color,
  difference,
  differenceUnit,
}) => {
  return (
    //bg-[#121e2d]
    <>
      <div className="flex justify-center w-full px-1 sm:px-2 xl:px-3">
        <div className="w-full details-card h-[90px]  sm:h-[120px] rounded-sm p-2  sm:p-5 relative">
          <span className="absolute right-3 top-3 text-lg sm:text-3xl xs:text-xl   p-2 bg-[#1d2d42] rounded-full">
            <Icon />
          </span>
          <div className="flex flex-col justify-between h-full text-[#9599ad]">
            <div className="font-medium uppercase text-[9px] text-clip xxs:text-[10.5px] xxs:whitespace-nowrap xs:text-xs md:text ">
              {title}
            </div>
            <div className="flex items-center text-sm text-[8px] font-medium">
              <span
                className={`mr-1 text-sm xxs:text-lg xs:text-lg sm:text-xl xl:text-3xl ${color}`}
              >
                {Math.abs(value)}
              </span>{' '}
              <span className="text-base xs:text-xl">-</span>{' '}
              <span className="ml-1 mt-0.5  font-bold text-[10px] xs:text-sm">
                {units}
              </span>
            </div>
            <div className="w-full flex items-baseline ">
              <div
                className={`max-h-4 mt-1.5 py-0.5 px-1  rounded-sm  flex items-baseline ${
                  difference.polarity
                    ? 'bg-[#2cb57e2e] text-[#2cb57e]'
                    : 'bg-[#f56e502e] text-[#f56e50]'
                }`}
              >
                {!isNaN(difference.value) && (
                  <div className="h-full relative">
                    <TiArrowUpThick
                      className={`text-[10.5px] duration-200 ${
                        difference.polarity ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </div>
                )}

                <div className="ml-1 h-full text-[10.5px] flex items-center">
                  {!isNaN(difference.value)
                    ? Math.abs(difference.value)
                    : 'N/A'}
                  {!isNaN(difference.value) && differenceUnit}
                </div>
              </div>
              <div className="ml-2 text-[9.5px] sm:text-xs uppercase font-medium whitespace-nowrap">
                since last month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center w-full px-2 xl:px-3">
        <div className="w-full details-card  h-[138px] rounded-sm p-5 relative">
          <span className="absolute right-3 top-3 text-lg xxs:text-3xl sm:text-5xl xs:text-4xl md:text-4xl xl:text-3xl p-2 bg-[#1d2d42] rounded-full">
            <Icon />
          </span>
          <div className="flex flex-col justify-between h-full text-[#9599ad]">
            <div className=" uppercase text-[9px] text-clip xxs:text-[9.5px] xxs:whitespace-nowrap xs:text-sm md:text ">
              {title}
            </div>
            <div className="flex items-center text-sm text-[8px] font-medium">
              <span
                className={`mr-1 text-sm xxs:text-base xs:text-lg sm:text-xl xl:text-3xl ${color}`}
              >
                {Math.abs(value)}
              </span>{' '}
              <span className="text-xl">-</span>{' '}
              <span className="ml-1 font-bold text-sm">{units}</span>
            </div>
            <div className="w-full flex items-baseline">
              <div
                className={`max-h-4 mt-1.5 py-0.5 px-1  rounded-sm  flex items-center ${
                  difference.polarity
                    ? 'bg-[#2cb57e2e] text-[#2cb57e]'
                    : 'bg-[#f56e502e] text-[#f56e50]'
                }`}
              >
                <TiArrowUpThick
                  className={`text-[10.5px] mt-[0.25px] duration-200 ${
                    difference.polarity ? 'rotate-180' : 'rotate-0'
                  }`}
                />
                &nbsp;
                <div className="text-[10.5px]">{difference.value}%</div>
              </div>
              <div className="ml-2 text-xs uppercase font-medium">
                since last month
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="flex justify-center w-full px-2 xl:px-6">
        <div className="w-full md:min-h-[95px]  max-h-[105px] min-h-[70px] bg-[#ffffff11] bg-clip-padding backdrop-blur-3xl rounded flex justify-start xs:justify-evenly items-stretch shadow-2xl details-card px-2">
          <div className="flex items-center mr-2 text-lg xxs:text-3xl sm:text-5xl xs:text-4xl md:text-4xl xl:text-5xl">
            <Icon />
          </div>
          <div className="flex flex-col justify-center sm:text-xs text-[10px] sm:font-medium text-slate-300">
            <div className="text-[9px] text-clip xxs:text-[9.5px] xxs:whitespace-nowrap xs:text-sm md:text-xs">
              {title}
            </div>
            <div className="flex items-baseline text-sm text-[8px] font-medium">
              <span
                className={`mr-1 text-sm xxs:text-base xs:text-lg sm:text-xl xl:text-3xl ${color}`}
              >
                {Math.abs(value)}
              </span>{' '}
              - <span className="ml-1">{units}</span>
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}
//space-x-3 lg:space-x-5 xl:space-x-8

DetailsCardV2.defaultProps = {
  differenceUnit: '%',
}
export default DetailsCardV2

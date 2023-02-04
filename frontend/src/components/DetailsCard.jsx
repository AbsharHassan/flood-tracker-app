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
    </>
  )
}

DetailsCard.defaultProps = {
  differenceUnit: '%',
}
export default DetailsCard

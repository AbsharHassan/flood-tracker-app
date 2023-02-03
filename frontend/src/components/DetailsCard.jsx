import React from 'react'

const DetailsCard = ({ icon: Icon, title, value, units, color }) => {
  return (
    <div className="flex justify-center w-full px-2 xl:px-6">
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
    </div>
  )
}
//space-x-3 lg:space-x-5 xl:space-x-8
export default DetailsCard

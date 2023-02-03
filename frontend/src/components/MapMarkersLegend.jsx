import React from 'react'
import { AiFillWarning, AiFillStop } from 'react-icons/ai'

const MapMarkersLegend = () => {
  return (
    <div className="px-1 sm:px-4 sm:w-40 whitespace-nowrap py-1 text-[10px]  sm:py-2 mt-2 ml-2 rounded-lg bg-black/30 backdrop-blur-2xl details-card text-slate-300">
      <div className="mb-1 sm:mb-3 text-[12px] sm:text-[15px] text-center">
        Key
      </div>
      {/* <div className="grid grid-cols-2 mb-2">
        <div className=" flex items-center -mr-3">
          <AiFillWarning className="text-xl text-yellow-600 mb-4" />
        </div>
        <div className="h-full  flex items-start justify-start mb-4 pt-1">
          Road Affected
        </div>
        <div className=" flex items-center justify-start">
          <AiFillWarning className="text-xl text-transparent bg-sky-400 rounded-md mb-4" />
        </div>
        <div className="h-full flex items-start justify-start  mb-4 pt-1">
          Flood Water Pixel
        </div>
      </div> */}
      <div className="w-full flex flex-col space-y-2 sm:space-y-4 mb-1 sm:mb-2">
        <div className="w-full flex justify-center items-center space-x-2 ">
          <div className="basis-1/4 flex items-center ">
            <AiFillWarning className="text-lg sm:text-xl text-yellow-600 " />
          </div>
          <div className=" basis-3/4 h-full  flex items-center justify-start ">
            Road Affected
          </div>
        </div>
        <div className="w-full flex justify-center items-center space-x-2 ">
          <div className="basis-1/4 flex items-center ">
            <AiFillWarning className="text-lg sm:text-xl text-transparent bg-sky-400 rounded-md " />
          </div>
          <div className=" basis-3/4 h-full   flex items-center justify-start ">
            Flood Water Pixel
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col">
        <div className="flex items-center justify-around p-1 mb-3 space-x-3 rounded-md">
          <AiFillWarning className="text-xl text-yellow-600" />
          <div>- </div>
          <div>Road Affected</div>
        </div>
        <div className="flex items-center justify-around p-1 mb-3 space-x-3 rounded-md">
          <div className="bg-sky-300 w-[17px] h-[17px] rounded mr-0.5 ml-1"></div>
          <div>- </div>
          <div>Flood Water Pixel</div>
        </div>
      </div> */}
    </div>
  )
}

export default MapMarkersLegend

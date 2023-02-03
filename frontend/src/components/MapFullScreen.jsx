import React from 'react'
import { HiOutlineArrowsExpand } from 'react-icons/hi'

const MapFullScreen = ({ map, maps }) => {
  return (
    <div className="flex items-center justify-center w-10 h-10 mt-2 mr-2">
      <button
        className="p-2 text-xl font-black duration-300 bg-[#1f263d] rounded-md  text-slate-300 hover:text-white hover:bg-black"
        onClick={() => {
          //   map.setOptions({
          //     fullscreenControl: false,
          //   })
          map.setZoom(null)
        }}
        title="Fullscreen"
      >
        <HiOutlineArrowsExpand />
      </button>
    </div>
  )
}

export default MapFullScreen

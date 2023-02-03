import { HiPlus, HiMinus } from 'react-icons/hi'

const MapZoom = ({ map }) => {
  return (
    <div className="flex flex-col items-center justify-between h-20 mb-3 mr-2 w-9">
      <button
        className="p-2 text-xl font-black duration-300 bg-[#1f263d] rounded-md  text-slate-300 hover:text-white hover:bg-black"
        onClick={() => {
          map.setZoom(map.getZoom() + 1)
        }}
        title="Zoom in"
      >
        <HiPlus />
      </button>
      <button
        className="p-2 text-xl font-black duration-300 bg-[#1f263d] rounded-md  text-slate-300 hover:text-white hover:bg-black"
        onClick={() => {
          map.setZoom(map.getZoom() - 1)
        }}
        title="Zoom out"
      >
        <HiMinus />
      </button>
    </div>
  )
}

export default MapZoom

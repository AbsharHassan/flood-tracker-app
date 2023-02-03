import { useSelector, useDispatch } from 'react-redux'
import {
  setShowInfoWindow,
  setSelectedMarkerCoords,
} from '../features/map/mapSlice'

import { MdPlayArrow } from 'react-icons/md'
import { HiX } from 'react-icons/hi'

const MapMarkerDetails = ({ lat, lng }) => {
  const dispatch = useDispatch()

  const { showInfoWindow, selectedMarkerCoords } = useSelector(
    (state) => state.map
  )
  return (
    <div className="info-window bg-[#1978c833] p-1  backdrop-blur-sm hover:cursor-default">
      <div className="w-full flex justify-end text-slate-300 text-base">
        <HiX
          className="hover:cursor-pointer"
          onClick={() => {
            dispatch(setShowInfoWindow(false))
            dispatch(setSelectedMarkerCoords({}))
          }}
        />
      </div>
      <div className="w-full flex text-slate-200 items-center justify-center">
        Milat Jahan Road
      </div>
    </div>
  )
}

export default MapMarkerDetails

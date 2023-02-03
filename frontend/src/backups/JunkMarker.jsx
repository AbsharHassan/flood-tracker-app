import { useSelector, useDispatch } from 'react-redux'
import {
  setMap,
  clearOverlay,
  setIsInfoWindowOpen,
  setOverlay,
  setShowOverlay,
} from '../features/map/mapSlice'

const JunkMarker = ({ lat, lng }) => {
  const dispatch = useDispatch()
  const { map, overlay, isInfoWindowOpen } = useSelector((state) => state.map)

  return (
    <div
      className="z-50 w-48 h-48 bg-red-900 cursor-default"
      onClick={() => {
        dispatch(setIsInfoWindowOpen(!isInfoWindowOpen))
      }}
    >
      JunkMarker
    </div>
  )
}

export default JunkMarker

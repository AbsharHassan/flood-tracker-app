import { useSelector, useDispatch } from 'react-redux'
import {
  setShowInfoWindow,
  setSelectedMarkerCoords,
} from '../features/map/mapSlice'

import { AiFillWarning } from 'react-icons/ai'
import MapMarkerDetails from './MapMarkerDetails'

const TestMarker = ({ lat, lng, size }) => {
  const dispatch = useDispatch()

  const { showInfoWindow, selectedMarkerCoords } = useSelector(
    (state) => state.map
  )
  return (
    <>
      <div className="test-marker text-yellow-600">
        <AiFillWarning style={{ fontSize: size }} />
      </div>
    </>
  )
}

export default TestMarker

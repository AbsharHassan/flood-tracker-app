import { AiFillWarning } from 'react-icons/ai'

const RoadMarker = ({ size }) => {
  return (
    <div className="test-marker text-yellow-600">
      <AiFillWarning style={{ fontSize: size }} />
    </div>
  )
}

export default RoadMarker

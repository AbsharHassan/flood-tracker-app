import React from 'react'
import { AiOutlineLoading } from 'react-icons/ai'

const MapSpinner = ({ lat, lng }) => {
  return (
    <div className="map-spinner-container">
      <AiOutlineLoading className="map-spinner-icon" />
    </div>
  )
}

export default MapSpinner

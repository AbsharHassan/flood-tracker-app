import React, { useEffect } from 'react'
import { TbRoadOff } from 'react-icons/tb'
import { CgDanger } from 'react-icons/cg'
import { AiFillWarning, AiFillStop } from 'react-icons/ai'

const TestMarker = ({ lat, lng, size }) => {
  useEffect(() => {
    // console.log('test marker has been called')
  })
  // return <div className="test-marker">&#215;</div>
  return (
    <div className="text-yellow-600 test-marker hover:cursor-pointer bg-red-700 relative">
      {/* <TbRoadOff /> */}
      {/* <CgDanger /> */}
      <AiFillWarning className={`${size}`} />
      {/* <AiFillStop /> */}
      <div className="absolute w-48 h-48 bg-green-500 top-0 left-0">menu</div>
    </div>
  )
}

export default TestMarker

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Box, Slider } from '@mui/material'
import { AiFillWarning, AiFillStop } from 'react-icons/ai'
import { TiRefresh } from 'react-icons/ti'

import { toggleShowRoads, toggleOverlayDisplay } from '../features/map/mapSlice'

const MapMarkersLegend = () => {
  const dispatch = useDispatch()

  const { overlay, showRoads, showOverlay } = useSelector((state) => state.map)

  const [roadSwitch, setRoadSwitch] = useState(showRoads)
  const [overlaySwitch, setOverlaySwitch] = useState(showOverlay)
  const [floodPixelOpacity, setFloodPixelOpacity] = useState(50)

  const handleFloodPixelOpacityChange = (e, newValue) => {
    setFloodPixelOpacity(newValue)
    overlay?.setOpacity(newValue / 100)
  }

  useEffect(() => {
    setRoadSwitch(showRoads)
  }, [showRoads])

  useEffect(() => {
    setOverlaySwitch(showOverlay)
  }, [showOverlay])

  useEffect(() => {
    setFloodPixelOpacity(100)
  }, [overlay])

  return (
    <div className="px-2 sm:px-2  whitespace-nowrap py-1 text-[10px]  sm:py-1 mt-2 ml-2 rounded-lg bg-black/30 backdrop-blur-2xl details-card text-slate-300">
      {/* <div className="mb-1 sm:mb-3 text-[12px] sm:text-[15px] text-center">
        Key
      </div> */}

      <div className="w-full flex flex-col space-y-2 sm:space-y-2 mb-1 sm:mb-1">
        <div className="w-full flex items-center  ">
          <div className="w-5 flex items-center ">
            <AiFillWarning className="text-lg sm:text-xl text-yellow-600 " />
          </div>
          <div className="ml-2 w-[65px] h-full  flex items-center justify-start ">
            Road Affected
          </div>
          <div>
            <Switch
              // onChange={() => setPixelsSwitch((v) => !v)}
              // onChange={() => dispatch(toggleOverlayDisplay())}
              onChange={() => dispatch(toggleShowRoads())}
              value={roadSwitch}
              checked={roadSwitch}
              size="small"
              disableRipple
              sx={{
                '&.MuiSwitch-root': {
                  // width: '100px',
                },
                '& .MuiSwitch-track': {
                  transition: 'all 0.1s',
                  backgroundColor: 'rgb(55 65 81)',
                  opacity: '1',
                },
                '& .MuiButtonBase-root': {
                  '&.Mui-checked': {
                    transition: 'all 0.1s',
                    color: '#1976d2',
                  },
                  transition: 'all 0.1s',
                  color: 'rgb(107 114 128)',
                },

                // '& .Mui-disabled': {
                //   '& .MuiSwitch-track': {
                //     backgroundColor: 'red',
                //     opacity: '1',
                //   },
                // },
              }}
            />
          </div>
        </div>
        <div className="w-full flex items-center  ">
          <div className="w-5 flex items-center ">
            <AiFillWarning className="text-lg sm:text-xl text-transparent bg-sky-400 rounded-md " />
          </div>
          <div className=" ml-2 w-[65px] h-full   flex items-center justify-start ">
            Flood Pixels
          </div>
          <div>
            <Switch
              onChange={() => dispatch(toggleOverlayDisplay())}
              value={overlaySwitch}
              checked={overlaySwitch}
              size="small"
              disableRipple
              sx={{
                '&.MuiSwitch-root': {
                  // width: '100px',
                },
                '& .MuiSwitch-track': {
                  transition: 'all 0.1s',
                  backgroundColor: 'rgb(55 65 81)',
                  opacity: '1',
                },
                '& .MuiButtonBase-root': {
                  '&.Mui-checked': {
                    transition: 'all 0.1s',
                    color: '#1976d2',
                  },
                  transition: 'all 0.1s',
                  color: 'rgb(107 114 128)',
                },

                // '& .Mui-disabled': {
                //   '& .MuiSwitch-track': {
                //     backgroundColor: 'red',
                //     opacity: '1',
                //   },
                // },
              }}
            />
          </div>
        </div>
        <div className="max-h-3 w-full flex items-center justify-between pt-0 pr-[2.5px] bg-red-600/0  ">
          <Box
            width="90px"
            marginTop="6px"
          >
            <Slider
              disabled={overlay && overlaySwitch ? false : true}
              value={floodPixelOpacity}
              onChange={handleFloodPixelOpacityChange}
              size="small"
              defaultValue={100}
              sx={{
                '& .MuiSlider-thumb': {
                  boxShadow: 'none !important',
                },
                '&.Mui-disabled': {
                  color: 'rgb(107 114 128)',
                },
              }}
            />
          </Box>
          <i className="bg-purple-700/0 h-full">
            <TiRefresh className="text-[#1976d2] text-3xl" />
          </i>
        </div>
        <div className="w-full flex justify-center"></div>
      </div>
    </div>
  )
}

export default MapMarkersLegend

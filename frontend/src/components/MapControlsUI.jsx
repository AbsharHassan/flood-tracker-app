import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Box, Slider } from '@mui/material'

import { toggleShowRoads, toggleOverlayDisplay } from '../features/map/mapSlice'
import { selectDistrict } from '../features/apiData/apiDataSlice'

import { AiFillWarning } from 'react-icons/ai'
import { TiRefresh } from 'react-icons/ti'

const MapControlsUI = () => {
  const dispatch = useDispatch()

  const { overlay, showRoads, showOverlay } = useSelector((state) => state.map)
  const { isDarkMode } = useSelector((state) => state.sidebar)

  const [roadSwitch, setRoadSwitch] = useState(showRoads)
  const [overlaySwitch, setOverlaySwitch] = useState(showOverlay)
  const [floodPixelOpacity, setFloodPixelOpacity] = useState(50)

  let resetIconRef = useRef()

  const handleFloodPixelOpacityChange = (e, newValue) => {
    setFloodPixelOpacity(newValue)
    overlay?.setOpacity(newValue / 100)
  }

  const handleResetRequest = () => {
    dispatch(selectDistrict(null))
    if (!resetIconRef.current.classList.contains('reset-spinner')) {
      resetIconRef.current.classList.add('reset-spinner')
      setTimeout(() => {
        resetIconRef.current.classList.remove('reset-spinner')
      }, 1500)
    }
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
    <div
      className={`pl-2 pr-0 whitespace-nowrap py-1 text-[10px]  sm:py-1 mt-2 ml-2 rounded-lg  backdrop-blur-2xl ${
        isDarkMode
          ? 'bg-themeCardColorDark/50 text-slate-300 card-shadow'
          : 'bg-themeCardColorLight/20 text-slate-700 border border-themeBorderColorLight'
      }`}
    >
      <div className="w-full flex flex-col space-y-2 sm:space-y-2 mb-1 sm:mb-1">
        <div className="w-full flex items-center  ">
          <div className="w-5 flex items-center ">
            <AiFillWarning className="text-lg sm:text-xl text-yellow-600 " />
          </div>
          <div className="ml-2 w-[65px] h-full  flex items-center justify-start ">
            Road Affected
          </div>
          <div
            className={` rounded-full ml-2 ${
              isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
            }`}
          >
            <Switch
              onChange={() => dispatch(toggleShowRoads())}
              value={roadSwitch}
              checked={roadSwitch}
              size="small"
              disableRipple
              sx={{
                '&.MuiSwitch-root': {},
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
          <div
            className={` rounded-full ml-2 ${
              isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
            }`}
          >
            <Switch
              onChange={() => dispatch(toggleOverlayDisplay())}
              value={overlaySwitch}
              checked={overlaySwitch}
              size="small"
              disableRipple
              sx={{
                '&.MuiSwitch-root': {},
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
              }}
            />
          </div>
        </div>
        <div className="max-h-3 w-full flex items-center justify-between  pr-[8px] bg-red-600/0  ">
          <Box
            width="90px"
            marginTop="6px"
            backgroundColor={`${
              isDarkMode ? 'rgb(30 41 59)' : 'rgb(226 232 240)'
            }`}
            height="17px"
            paddingLeft="5px"
            paddingRight="11px"
            borderRadius={9999}
          >
            <Slider
              disabled={overlay && overlaySwitch ? false : true}
              value={floodPixelOpacity}
              onChange={handleFloodPixelOpacityChange}
              size="small"
              defaultValue={100}
              sx={{
                '&.MuiSlider-root': {
                  padding: '0px',
                },
                '& .MuiSlider-thumb': {
                  boxShadow: 'none !important',
                },
                '&.Mui-disabled': {
                  color: 'rgb(107 114 128)',
                },
              }}
            />
          </Box>
          <div
            className={`mt-[6.5px] h-[18px] w-[40px] ml-[11px] rounded-full  hover:cursor-pointer flex items-center justify-center ${
              isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
            }`}
            onClick={handleResetRequest}
          >
            <span ref={resetIconRef}>
              <TiRefresh className="text-[#1976d2] text-2xl mb-[2px]" />
            </span>
          </div>
        </div>
        <div className="w-full flex justify-center"></div>
      </div>
    </div>
  )
}

export default MapControlsUI

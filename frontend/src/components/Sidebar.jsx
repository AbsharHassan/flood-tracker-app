import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSidebar } from '../features/sidebar/sidebarSlice'
import { selectDistrict } from '../features/apiData/apiDataSlice'
import {
  toggleOverlayDisplay,
  setMapTheme,
  toggleShowRoads,
} from '../features/map/mapSlice'
import SearchBar from './SearchBar'
import Box from '@mui/material/Box'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Switch from '@mui/material/Switch'
import Slider from '@mui/material/Slider'
import { BsArrowBarLeft } from 'react-icons/bs'
import { HiX } from 'react-icons/hi'
import { RiDashboardFill, RiPaletteFill, RiMap2Fill } from 'react-icons/ri'
import { AiFillControl, AiFillInfoCircle } from 'react-icons/ai'
import { TbMapPins } from 'react-icons/tb'
import { IoWater } from 'react-icons/io5'
import { TiRefresh } from 'react-icons/ti'
import DateSelector from './DateSelector'

const Sidebar = () => {
  const location = useLocation()
  const dispatch = useDispatch()

  const { isDarkMode, sidebarIsOpen } = useSelector((state) => state.sidebar)
  const { showOverlay, mapTheme, showRoads, overlay } = useSelector(
    (state) => state.map
  )
  const { user } = useSelector((state) => state.auth)

  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false)
  const [isSearchPopperOpen, setIsSearchPopperOpen] = useState(false)
  const [overlaySwitch, setOverlaySwitch] = useState(showOverlay)

  const [roadSwitch, setRoadSwitch] = useState(showRoads)
  const [floodPixelOpacity, setFloodPixelOpacity] = useState(100)
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [innerHeight] = useState(window.innerHeight)
  const [isScreenLg, setIsScreenLg] = useState(
    window.innerWidth > 1024 ? true : false
  )
  const [isScreenRectangular, setIsScreenRectangular] = useState(
    window.innerWidth > window.innerHeight ? true : false
  )
  const [menuLinks] = useState([
    {
      title: 'Dashboard',
      icon: <RiDashboardFill />,
      path: '/',
    },
    {
      title: 'Control Panel',
      icon: <AiFillControl />,
      path: user ? '/control-panel' : '/login',
    },
    {
      title: 'About',
      icon: <AiFillInfoCircle />,
      path: '/about',
    },
  ])

  const handleResetRequest = () => {
    dispatch(selectDistrict(null))
    if (sidebarIsOpen) {
      resetIconRefOpen.current.classList.add('reset-spinner')
      setTimeout(() => {
        resetIconRefOpen.current.classList.remove('reset-spinner')
      }, 1500)
    } else {
      resetIconRefClosed.current.classList.add('reset-spinner')
      setTimeout(() => {
        resetIconRefClosed.current.classList.remove('reset-spinner')
      }, 1500)
    }
  }

  const handleDateDialogState = (value) => {
    setIsDateDialogOpen(value)
  }

  const handleSearchPopperState = (value) => {
    setIsSearchPopperOpen(value)
  }

  const handleFloodPixelOpacityChange = (e, newValue) => {
    setFloodPixelOpacity(newValue)
    overlay?.setOpacity(newValue / 100)
  }

  let desktopSidebarRef = useRef()
  let resetIconRefOpen = useRef()
  let resetIconRefClosed = useRef()

  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    let closeHandler = (e) => {
      if (
        sidebarIsOpen &&
        innerWidth < 1024 &&
        !isDateDialogOpen &&
        !isSearchPopperOpen
      ) {
        if (!desktopSidebarRef.current.contains(e.target)) {
          dispatch(toggleSidebar())
        }
      }
    }

    document.addEventListener('mousedown', closeHandler)

    return () => {
      document.removeEventListener('mousedown', closeHandler)
    }
  }, [
    sidebarIsOpen,
    innerWidth,
    dispatch,
    isDateDialogOpen,
    isSearchPopperOpen,
  ])

  useEffect(() => {
    if (innerWidth > 1024) {
      setIsScreenLg(true)
    } else {
      setIsScreenLg(false)
    }

    if (innerWidth > innerHeight) {
      setIsScreenRectangular(true)
    } else {
      setIsScreenRectangular(false)
    }
  }, [innerWidth, innerHeight])

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
    <>
      <aside
        key="desktop-sidemenu"
        ref={desktopSidebarRef}
        className={`${
          isScreenLg
            ? `hidden lg:block duration-200 border-r border-[#162436] bg-clip-padding bg-[#121e2d] backdrop-blur-md fixed left-0 top-0 h-full  ${
                sidebarIsOpen ? 'w-48' : 'w-[70px]'
              }`
            : `lg:hidden fixed top-0 right-0 duration-1000 overflow-y-scroll h-[100vh] text-white ${
                isDarkMode ? 'bg-black/60' : 'bg-black/[0.85]'
              } ${
                sidebarIsOpen ? 'w-72 sm:w-72 px-2 ' : 'w-0 '
              }  backdrop-blur-sm `
        } sidebar z-[60] `}
      >
        {isScreenLg && (
          <div
            className={`flex items-center h-[50px] border-b border-themeBorderColorDark overflow-x-hidden ${
              sidebarIsOpen ? 'pl-4' : 'justify-center'
            }`}
          >
            <Link to="/">
              <h1
                className={`text-lg font-semibold tracking-tighter text-center md:text-2xl text-slate-300`}
              >
                {sidebarIsOpen ? (
                  <span
                    className={`${
                      sidebarIsOpen ? 'scale-0' : ' opacity-0 w-0'
                    } duration-200 whitespace-nowrap `}
                  >
                    Flood <span className="text-gradient">Tracker</span>
                  </span>
                ) : (
                  <span
                    className={`${
                      sidebarIsOpen ? ' opacity-0 w-0' : ''
                    } duration-200`}
                  >
                    F <span className="text-gradient">T</span>
                  </span>
                )}
              </h1>
            </Link>
          </div>
        )}

        <div className={`${isScreenLg ? 'sidebar-links-div' : ''}`}>
          <div
            className={`${
              isScreenLg
                ? 'pr-2.5 pt-2 flex items-center justify-end'
                : 'w-full h-[50px] text-white flex items-center pl-2 text-xl'
            } `}
          >
            <span
              onClick={() => {
                dispatch(toggleSidebar())
              }}
              className={`${
                isScreenLg
                  ? `${sidebarIsOpen ? '' : '-translate-x-[13px]'}`
                  : ''
              }`}
            >
              {isScreenLg ? (
                <BsArrowBarLeft
                  className={`text-xl duration-200 cursor-pointer text-slate-500 hover:text-slate-300 ${
                    sidebarIsOpen ? '' : 'rotate-180'
                  }`}
                />
              ) : (
                <HiX className="cursor-pointer" />
              )}
            </span>
          </div>

          <SearchBar
            isScreenLg={isScreenLg}
            handleSearchPopperState={handleSearchPopperState}
            location={location}
          />

          <ul
            className={` ${
              sidebarIsOpen ? 'px-1 pt-3' : 'px-0 pt-4'
            } duration-200`}
          >
            {menuLinks.map((item) => (
              <Link
                to={item.path}
                key={item.title}
                onClick={() => {
                  if (!isScreenLg) dispatch(toggleSidebar())
                }}
              >
                <li
                  className={`text-slate-400 text-xs flex items-center gap-x-3 cursor-pointer hover:bg-sky-900/50 mb-3 hover:text-slate-300 duration-200 py-2 overflow-hidden whitespace-nowrap ${
                    sidebarIsOpen
                      ? 'gap-x-3 px-2 rounded-md'
                      : 'gap-x-0 pl-[9px] rounded-sm'
                  } duration-200
                  ${
                    location.pathname === item.path
                      ? 'bg-sky-900/30'
                      : 'bg-transparent'
                  }
                  
                  `}
                >
                  <span
                    className={`${
                      sidebarIsOpen ? 'text-lg' : 'text-xl translate-x-3.5'
                    } duration-200 `}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`text-sm  ${
                      sidebarIsOpen ? '' : 'opacity-0 w-0'
                    } duration-200`}
                  >
                    {item.title}
                  </span>
                </li>
              </Link>
            ))}
          </ul>

          <hr
            className={` mx-4 ${
              sidebarIsOpen ? '' : 'scale-0'
            }   bg-[#23344b] h-[1px] border-none`}
          />
        </div>

        <div
          className={`pt-2 pb-4 flex flex-col justify-evenly ${
            sidebarIsOpen
              ? `${
                  isScreenLg && isScreenRectangular ? 'sidebar-tools-div' : ''
                }`
              : 'space-y-4 h-96 pl-3.5'
          } duration-200`}
        >
          <div
            className={` text-slate-500 px-3 font-bold text-xs whitespace-nowrap overflow-hidden ${
              sidebarIsOpen ? 'scale-x-100' : 'scale-x-0'
            } duration-200`}
          >
            Map & Data Options
          </div>

          <div
            className={`text-slate-400 text-[10px] font-bold flex items-center justify-between cursor-pointer ${
              sidebarIsOpen
                ? 'mt-2 pl-3 pr-1 rounded-md hover:hover:bg-sky-900/50 '
                : 'mt-6 px-0 ml-[1px]'
            } duration-200`}
            onClick={() => {
              if (sidebarIsOpen) {
                handleResetRequest()
              }
            }}
          >
            <div className="whitespace-nowrap ">
              <div
                className={`${
                  sidebarIsOpen
                    ? 'text-slate-400'
                    : 'text-transparent w-0 scale-0 h-0'
                } transition-all duration-200`}
              >
                {/* RESET SELECTIONS */}
                <span className="uppercase"> Reset Selections</span>
              </div>

              <div
                ref={resetIconRefClosed}
                onClick={() => {
                  if (!sidebarIsOpen) {
                    handleResetRequest()
                  }
                }}
                className={`${
                  sidebarIsOpen
                    ? 'text-transparent w-0 scale-0 h-0'
                    : 'text-slate-400 text-2xl hover:cursor-pointer hover:text-sky-500/60'
                } transition-all duration-200 text-4xl`}
              >
                <TiRefresh />
              </div>
            </div>
            <div
              ref={resetIconRefOpen}
              className={`${
                sidebarIsOpen
                  ? 'scale-100 pr-1 pb-0.5'
                  : 'scale-0 -translate-x-40'
              } duration-300 text-4xl text-[#1976d2]`}
            >
              <TiRefresh />
            </div>
          </div>

          <div
            className={` ${
              sidebarIsOpen ? 'mt-4 px-2 pb-0' : 'mt-6 px-0'
            } duration-200`}
            onClick={() => {
              if (!sidebarIsOpen) dispatch(toggleSidebar())
            }}
          >
            <DateSelector
              isScreenLg={isScreenLg}
              sidebarIsOpen={sidebarIsOpen}
              innerWidth={innerWidth}
              handleDateDialogState={handleDateDialogState}
            />
          </div>

          <div
            className={` text-slate-400 text-[10px] font-bold flex items-center justify-between ${
              sidebarIsOpen ? 'mt-7 pl-3 pr-1' : 'mt-6 px-2 ml-[1px]'
            } duration-200`}
          >
            <div className="whitespace-nowrap ">
              <div
                className={`${
                  sidebarIsOpen
                    ? 'text-slate-400'
                    : 'text-transparent w-0 scale-0 h-0'
                } transition-all duration-200`}
              >
                {/* MAP THEME */}
                <span className="uppercase">Map Theme</span>
              </div>
              <div
                onClick={() => {
                  if (!sidebarIsOpen) dispatch(toggleSidebar())
                }}
                className={`${
                  sidebarIsOpen
                    ? 'text-transparent w-0 scale-0 h-0'
                    : 'text-slate-400 text-xl hover:cursor-pointer hover:text-sky-500/60'
                } transition-all duration-200`}
              >
                <RiMap2Fill />
              </div>
            </div>
            <div
              className={`${
                sidebarIsOpen ? 'scale-100' : 'scale-0 -translate-x-40'
              } duration-300`}
            >
              <ToggleButtonGroup
                color="primary"
                value={mapTheme}
                exclusive
                onChange={(e, newTheme) => {
                  if (newTheme !== null) {
                    dispatch(setMapTheme(newTheme))
                  }
                }}
                aria-label="Platform"
                sx={{
                  '&.MuiToggleButtonGroup-root': {
                    '& .MuiButtonBase-root': {
                      color: 'rgb(148 163 184)',
                      fontSize: '10px',
                      padding: '5px',
                      borderColor: 'transparent',
                      fontWeight: '500',
                      backgroundColor: 'rgb(33 33 33)',
                      ':hover': {
                        backgroundColor: 'rgb(20 20 20)',
                        color: 'rgb(168 183 204)',
                      },
                      '&.Mui-selected': {
                        color: '#1976d2',
                        backgroundColor: '#225ad355',
                      },
                    },
                  },
                }}
              >
                <ToggleButton
                  value="dark"
                  disableRipple
                >
                  Dark
                </ToggleButton>
                <ToggleButton
                  value="light"
                  disableRipple
                >
                  Light
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>

          <div
            className={` text-slate-400 text-[10px] font-bold flex items-center justify-between ${
              sidebarIsOpen ? 'mt-5 pl-3 pr-1' : 'mt-5 px-1.5'
            } duration-200`}
          >
            <div className="whitespace-nowrap">
              <div
                className={`${
                  sidebarIsOpen
                    ? 'text-slate-400'
                    : 'text-transparent w-0 scale-0 h-0'
                } transition-all duration-200`}
              >
                ROADS AFFECTED
                <span></span>
              </div>
              <div
                className={`${
                  sidebarIsOpen
                    ? 'text-transparent w-0 scale-0 h-0'
                    : 'text-slate-400 text-2xl hover:cursor-pointer hover:text-sky-500/60'
                } transition-all duration-200`}
                onClick={() => {
                  dispatch(toggleShowRoads())
                  dispatch(toggleSidebar())
                }}
              >
                <TbMapPins />
              </div>
            </div>

            <div
              className={`${
                sidebarIsOpen ? 'scale-100' : 'scale-0 -translate-x-40'
              } duration-300 `}
            >
              <Switch
                onChange={() => dispatch(toggleShowRoads())}
                value={roadSwitch}
                checked={roadSwitch}
                disableRipple
                sx={{
                  '&.MuiSwitch-root': {
                    // width: '100px',
                  },
                  '& .MuiSwitch-track': {
                    transition: 'all 0.1s',
                    backgroundColor: sidebarIsOpen
                      ? 'rgb(55 65 81)'
                      : 'rgb(55 65 81 / 0)',
                    opacity: '1',
                  },
                  '& .MuiButtonBase-root': {
                    '&.Mui-checked': {
                      transition: 'all 0.1s',
                      color: sidebarIsOpen ? '#1976d2' : '#1976d200',
                    },
                    transition: 'all 0.1s',
                    color: sidebarIsOpen
                      ? 'rgb(107 114 128)'
                      : 'rgb(107 114 128 / 0)',
                  },
                }}
              />
            </div>
          </div>

          <div
            className={` text-slate-400 text-[10px] font-bold flex items-center justify-between ${
              sidebarIsOpen ? 'mt-4 pl-3 pr-1' : 'mt-4 px-1.5'
            } duration-200 `}
          >
            <div className="whitespace-nowrap ">
              <div
                className={`${
                  sidebarIsOpen
                    ? 'text-slate-400'
                    : 'text-transparent w-0 scale-0 h-0'
                } transition-all duration-200`}
              >
                FLOOD PIXELS
              </div>
              <div
                className={`${
                  sidebarIsOpen
                    ? 'text-transparent w-0 scale-0 h-0'
                    : 'text-slate-400 text-2xl hover:cursor-pointer hover:text-sky-500/60'
                } transition-all duration-200`}
                onClick={() => {
                  dispatch(toggleSidebar())
                }}
              >
                <IoWater />
              </div>
            </div>
            <div
              className={`${
                sidebarIsOpen ? 'scale-100' : 'scale-0 -translate-x-40'
              } duration-300 `}
            >
              <Switch
                onChange={() => dispatch(toggleOverlayDisplay())}
                value={overlaySwitch}
                checked={overlaySwitch}
                disableRipple
                sx={{
                  '&.MuiSwitch-root': {},
                  '& .MuiSwitch-track': {
                    transition: 'all 0.1s',
                    backgroundColor: sidebarIsOpen
                      ? 'rgb(55 65 81)'
                      : 'rgb(55 65 81 / 0)',
                    opacity: '1',
                  },
                  '& .MuiButtonBase-root': {
                    '&.Mui-checked': {
                      transition: 'all 0.1s',
                      color: sidebarIsOpen ? '#1976d2' : '#1976d200',
                    },
                    transition: 'all 0.1s',
                    color: sidebarIsOpen
                      ? 'rgb(107 114 128)'
                      : 'rgb(107 114 128 / 0)',
                  },
                }}
              />
            </div>
          </div>

          <div
            className={` text-slate-400 text-[10px] font-bold flex items-center justify-between ${
              sidebarIsOpen ? 'mt-3 pl-3 pr-1' : 'mt-4 px-1.5'
            } duration-200 `}
          >
            <div className="whitespace-nowrap ">
              <div
                className={`${
                  sidebarIsOpen
                    ? 'text-slate-400'
                    : 'text-transparent w-0 scale-0 h-0'
                } transition-all duration-200`}
              >
                FLOOD PIXELS OPACITY
              </div>
              <div
                className={`${
                  sidebarIsOpen
                    ? 'text-transparent w-0 scale-0 h-0'
                    : 'text-slate-400 text-2xl hover:cursor-pointer hover:text-sky-500/60'
                } transition-all duration-200`}
                onClick={() => {
                  dispatch(toggleSidebar())
                }}
              >
                <RiPaletteFill />
              </div>
            </div>
            <div
              className={`${
                sidebarIsOpen ? 'scale-100' : 'scale-0 -translate-x-40'
              } duration-300 `}
            >
              <Box
                width={50}
                className="pl-1 pr-4 pt-1 "
              >
                <Slider
                  disabled={overlay && overlaySwitch ? false : true}
                  value={floodPixelOpacity}
                  onChange={handleFloodPixelOpacityChange}
                  size="small"
                  defaultValue={floodPixelOpacity}
                  className="text-red-500"
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
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

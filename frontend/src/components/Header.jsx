import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, BrowserRouter as Router, useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { toggleSidebar } from '../features/sidebar/sidebarSlice'
import { logoutUser } from '../features/auth/authSlice'
import { HiSearch, HiMenu, HiX } from 'react-icons/hi'
import { MdDarkMode } from 'react-icons/md'
import { FaMoon } from 'react-icons/fa'
import { BsFillSunFill } from 'react-icons/bs'
import { BiLogOut } from 'react-icons/bi'

const Header = ({ extraTitle }) => {
  const dispatch = useDispatch()
  const location = useLocation()

  const [isFocused, setIsFocused] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)

  // const [sidebarOpen, setSidebarOpen] = useState(false)
  // const sidebarOpen = useSelector((state) => state.sidebar.isOpen)

  const handleLogout = async () => {
    dispatch(logoutUser())
  }

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
    if (innerWidth < 640) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }, [innerWidth])

  return (
    <nav className="fixed h-[50px] top-0 left-0 right-0 z-50 flex items-center justify-between py-2  px-4 border-b sm:pr-7 sm:pl-4 border-blue-600/20 bg-opacity-80 bg-clip-padding backdrop-blur-md navbar">
      <div className="flex items-baseline">
        <Link to="/">
          <h1 className="text-lg font-semibold tracking-tighter text-center md:text-2xl text-slate-300 ">
            Flood <span className="text-gradient">Tracker</span>
          </h1>
        </Link>
        <span className="text-slate-300 text-[11px]  sm:text-sm font-semibold tracking-tighter">
          {extraTitle && (
            <span className="mx-0.5 sm:mx-1.5 text-[10px] sm:text-xl ">-</span>
          )}
          {extraTitle}
        </span>
      </div>

      <div className="flex items-center justify-between space-x-4  ">
        {location.pathname === '/control-panel' && (
          <div>
            <button
              className="pt-[5px]"
              onClick={handleLogout}
            >
              <BiLogOut className="text-slate-300 text-xl" />
            </button>
          </div>
        )}

        <div>
          <div
            className="flex items-center w-14 h-5 bg-[#225ad3] rounded-full relative cursor-pointer"
            onClick={() => {
              setDarkMode((v) => !v)
            }}
          >
            <div
              className={`absolute w-7 h-7 rounded-full bg-slate-800 bg-black border-[2px] border-[#225ad380] flex items-center justify-center  transition-all duration-2000 ${
                darkMode ? 'translate-x-full' : 'translate-x-0'
              }`}
            >
              <BsFillSunFill
                className={`${
                  darkMode ? 'w-0 text-transparent' : 'text-yellow-400'
                } transition-all duration-200`}
              />
              <FaMoon
                className={`${
                  darkMode ? 'text-slate-400' : 'text-transparent w-0'
                } transition-all duration-200`}
              />
            </div>
          </div>
        </div>

        <div
          className="mr-2 h-8 text-xl lg:hidden px-2 rounded-md bg-slate-600/50 border-[2px] border-transparent flex items-center text-slate-400 hover:text-slate-200 transition-colors duration-500 hover:cursor-pointer"
          onClick={() => {
            // setSidebarOpen(true)
            dispatch(toggleSidebar())
            // document.body.style.overflow = 'hidden'
          }}
        >
          <HiMenu />
        </div>
      </div>
    </nav>
  )
}

export default Header

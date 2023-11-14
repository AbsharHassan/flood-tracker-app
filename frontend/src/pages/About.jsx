import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import TechSection from '../components/TechSection'
import AboutDetails from '../components/AboutDetails'

const About = () => {
  const { sidebarIsOpen, isDarkMode } = useSelector((state) => state.sidebar)

  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [innerHeight, setInnerHeight] = useState(window.innerWidth)
  const [isScreenLg, setIsScreenLg] = useState(innerWidth > 1024 ? true : false)

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
    if (innerWidth >= 1024) {
      setIsScreenLg(true)
    } else {
      setIsScreenLg(false)
    }
  }, [innerWidth])

  return (
    <motion.div
      className={`flex flex-col h-full`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />
      <div
        className={`flex main-view pt-[50px] ${
          isScreenLg ? `${sidebarIsOpen ? 'pl-48' : 'pl-[70px]'}` : 'pl-0'
        }  duration-200 `}
      >
        <Sidebar />
        <div className="w-full md:grow pt-6">
          <div
            style={{
              height: `${isScreenLg ? `${window.innerHeight - 76}px` : 'auto'}`,
            }}
            // ref={mapAndChartViewRef}
            className="flex-col-reverse w-full px-3 pb-6 md:space-y-0 md:grid md:grid-cols-8 flex overflow-y-hidden min-h-[500px]"
          >
            <div className="col-start-1 col-end-4 px-2 pt-5 md:pt-0 md:pr-3 xl:pl-3 h-[500px] md:h-full  text-white ">
              <div
                className={`rounded-sm md:my-0 w-full px-3 h-full ${
                  isDarkMode
                    ? 'bg-themeCardColorDark border border-themeBorderColorDark'
                    : 'bg-themeCardColorLight border border-themeBorderColorLight'
                }`}
              >
                <TechSection
                  isScreenLg={isScreenLg}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
            <div className="col-start-4 col-end-9 px-2 md:pl-3 xl:pr-3 min-h-[500px] md:h-full">
              <div
                className={`w-full rounded-sm border h-full px-3 text-white ${
                  isDarkMode
                    ? 'border-themeBorderColorDark bg-themeBgColorDark'
                    : 'border-themeBorderColorLight bg-themeCardColorLight'
                }`}
              >
                <AboutDetails isDarkMode={isDarkMode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default About

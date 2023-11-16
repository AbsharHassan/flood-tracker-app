import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import gsap from 'gsap'

import Loader from '../components/Loader'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import SelectedDistrict from '../components/SelectedDistrict'
import DetailsOverview from '../components/DetailsOverview'
import Charts from '../components/Charts'
import Map from '../components/Map'

import Footer from '../components/Footer'

const Dashboard = () => {
  const styles = window.getComputedStyle(document.documentElement)
  const headerHeight = parseInt(styles.getPropertyValue('--navbar-height'), 10)
  const overviewViewHeight = parseInt(
    styles.getPropertyValue('--overview-view-height'),
    10
  )
  const selectedDistrictHeight = parseInt(
    styles.getPropertyValue('--selected-district-height'),
    10
  )

  const { isDarkMode } = useSelector((state) => state.sidebar)
  const { isLoadingMainData, isLoadingTotalFlooded } = useSelector(
    (state) => state.apiData
  )
  const { sidebarIsOpen } = useSelector((state) => state.sidebar)

  const [isFetchingApiData, setIsFetchingApiData] = useState(true)
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [innerHeight, setInnerHeight] = useState(window.innerWidth)
  const [isScreenLg, setIsScreenLg] = useState(innerWidth > 1024 ? true : false)
  const [chartsResizeReRender, setChartsResizeReRender] = useState(0)

  let dashboardRef = useRef()
  let loaderRef = useRef()
  let mapAndChartViewRef = useRef()

  let initialLoader = useRef(true)

  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth)
      setInnerHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setIsFetchingApiData(isLoadingMainData || isLoadingTotalFlooded)
  }, [isLoadingMainData, isLoadingTotalFlooded])

  useEffect(() => {
    if (mapAndChartViewRef.current) {
      mapAndChartViewRef.current.style.height = `${
        window.innerHeight -
        (headerHeight + selectedDistrictHeight + overviewViewHeight + 10)
      }px`
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapAndChartViewRef])

  useEffect(() => {
    if (innerWidth >= 1024) {
      setIsScreenLg(true)

      if (mapAndChartViewRef.current) {
        mapAndChartViewRef.current.style.height = `${
          window.innerHeight -
          (headerHeight + selectedDistrictHeight + overviewViewHeight + 18)
        }px`
      }
    } else {
      setIsScreenLg(false)
    }

    if (innerWidth <= 768) {
      if (mapAndChartViewRef.current) {
        mapAndChartViewRef.current.style.height = `auto`
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerWidth])

  useEffect(() => {
    if (innerWidth > 640) {
      setChartsResizeReRender(chartsResizeReRender + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerHeight])

  useEffect(() => {
    if (isFetchingApiData) {
      if (loaderRef.current) {
        loaderRef.current.style.zIndex = '3000'
      }
      if (initialLoader.current) {
        document.body.style.overflow = 'hidden'
      }
    }

    gsap.to(loaderRef.current, {
      opacity: isFetchingApiData ? (initialLoader.current ? 1 : 0.7) : 0,
      duration: 0.5,
      onComplete: () => {
        if (!isFetchingApiData) {
          loaderRef.current.style.zIndex = '-3000'
          document.body.style.overflow = 'visible'
        }
      },
    })
  }, [isFetchingApiData])

  useEffect(() => {
    initialLoader.current = false
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Loader
        ref={loaderRef}
        isDarkMode={isDarkMode}
      />

      <div
        className={`flex flex-col h-full `}
        ref={dashboardRef}
      >
        <Header />
        <div
          className={`flex main-view pt-[50px] ${
            isScreenLg ? `${sidebarIsOpen ? 'pl-48' : 'pl-[70px]'}` : 'pl-0'
          }  duration-200 `}
        >
          <Sidebar />
          <div className="w-full md:grow ">
            <SelectedDistrict />
            <DetailsOverview />
            <div
              style={{
                height: `${
                  isScreenLg
                    ? `${
                        window.innerHeight -
                        (headerHeight +
                          selectedDistrictHeight +
                          overviewViewHeight +
                          18)
                      }px`
                    : 'auto'
                }`,
              }}
              ref={mapAndChartViewRef}
              className="flex-col-reverse w-full px-3 pb-6 md:space-y-0 md:grid md:grid-cols-8 flex overflow-y-hidden min-h-[500px]"
            >
              <div className="col-start-1 col-end-4 px-2 pt-5 md:pt-0 md:pr-3 xl:pl-3 h-[500px] md:h-full  ">
                <div
                  className={`rounded-sm  md:my-0  h-full w-full px-3 ${
                    isDarkMode
                      ? 'bg-themeCardColorDark border border-themeBorderColorDark'
                      : 'bg-themeCardColorLight border border-themeBorderColorLight'
                  }`}
                >
                  <Charts key={chartsResizeReRender + isDarkMode} />
                </div>
              </div>
              <div className="col-start-4 col-end-9 px-2 md:pl-3 xl:pr-3 ">
                <div
                  className={`w-full rounded-sm border  h-[500px] md:h-full  ${
                    isDarkMode
                      ? 'border-themeBorderColorDark bg-themeBgColorDark'
                      : 'border-themeBorderColorLight bg-themeCardColorLight'
                  }`}
                >
                  <Map />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard

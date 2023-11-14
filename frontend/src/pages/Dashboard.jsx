import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import gsap from 'gsap'

import { SwitchTransition, CSSTransition } from 'react-transition-group'
import Loader from '../components/Loader'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import SelectedDistrict from '../components/SelectedDistrict'
import DetailsOverview from '../components/DetailsOverview'
import Charts from '../components/Charts'
import Map from '../components/Map'

import { motion } from 'framer-motion'
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
  const { isFetchingApiData, geoFormattedPolygons } = useSelector(
    (state) => state.apiData
  )
  const { isAuthLoading } = useSelector((state) => state.auth)
  const { sidebarIsOpen } = useSelector((state) => state.sidebar)

  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [innerHeight, setInnerHeight] = useState(window.innerWidth)
  const [isScreenLg, setIsScreenLg] = useState(innerWidth > 1024 ? true : false)
  const [someRerenderCounter, setSomeRerenderCounter] = useState(0)
  const [mountLoader, setMountLoader] = useState(true)

  let dashboardRef = useRef()
  let loaderRef = useRef()
  let mapAndChartViewRef = useRef()

  let initialLoader = useRef(true)

  // useEffect(() => {
  //   setLoadingData(isLoadingPolygons || isLoadingPolygons || isAuthLoading)
  // }, [isLoadingPolygons, isLoadingFloodData, isAuthLoading])

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
    console.log('dashboard re mounted')
  }, [])

  useEffect(() => {
    if (mapAndChartViewRef.current) {
      mapAndChartViewRef.current.style.height = `${
        window.innerHeight -
        (headerHeight + selectedDistrictHeight + overviewViewHeight + 10)
      }px`
    }
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
  }, [innerWidth])

  useEffect(() => {
    if (innerWidth > 640) {
      setSomeRerenderCounter(someRerenderCounter + 1)
    }
  }, [innerHeight])

  useEffect(() => {
    console.log(isFetchingApiData)
  }, [isFetchingApiData])

  useEffect(() => {
    console.log('yeah fetching data')
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
      // opacity: isFetchingApiData ? 1 : 0,
      duration: 0.3,
      onComplete: () => {
        if (!isFetchingApiData) {
          // initialLoader.current = false
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
      {/* <SwitchTransition key={geoFormattedPolygons ? false : true}> */}

      {/* {mountLoader && (
        <Loader
          ref={loaderRef}
          isDarkMode={isDarkMode}
        />
      )} */}

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
                  <Charts key={someRerenderCounter + isDarkMode} />
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
            {/* <div className="w-full h-28 bg-red-600 text-white z-[30000]">
              Footer
            </div> */}
            <Footer />
          </div>
        </div>
      </div>

      {/* <SwitchTransition>
        <CSSTransition
          key={isFetchingApiData}
          classNames="loading"
          timeout={500}
          appear={false}
        >
          {isFetchingApiData ? (
            <Loader isDarkMode={isDarkMode} />
          ) : (
            <div
              className={`flex flex-col h-full `}
              ref={dashboardRef}
            >
              <Header />
              <div
                className={`flex main-view pt-[50px] ${
                  isScreenLg
                    ? `${sidebarIsOpen ? 'pl-48' : 'pl-[70px]'}`
                    : 'pl-0'
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
                        <Charts key={someRerenderCounter + isDarkMode} />
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
                </div>
              </div>
            </div>
          )}
        </CSSTransition>
      </SwitchTransition> */}
    </motion.div>
  )
}

export default Dashboard

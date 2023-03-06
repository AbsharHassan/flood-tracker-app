import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { SwitchTransition, CSSTransition } from 'react-transition-group'
import Loader from '../components/Loader'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import SelectedDistrict from '../components/SelectedDistrict'
import DetailsOverview from '../components/DetailsOverview'
import Charts from '../components/Charts'
import Map from '../components/Map'

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

  const { isLoadingPolygons, isLoadingFloodData, geoFormattedPolygons } =
    useSelector((state) => state.apiData)
  const { isAuthLoading } = useSelector((state) => state.auth)
  const { sidebarIsOpen } = useSelector((state) => state.sidebar)

  const [loadingData, setLoadingData] = useState(
    isLoadingPolygons || isLoadingFloodData
  )
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [innerHeight, setInnerHeight] = useState(window.innerWidth)
  const [isScreenLg, setIsScreenLg] = useState(innerWidth > 1024 ? true : false)
  const [someRerenderCounter, setSomeRerenderCounter] = useState(0)

  let mapAndChartViewRef = useRef()

  // useEffect(() => {
  //   setLoadingData(isLoadingPolygons || isLoadingPolygons || isAuthLoading)
  // }, [isLoadingPolygons, isLoadingFloodData, isAuthLoading])

  useEffect(() => {
    setLoadingData(isLoadingFloodData || isAuthLoading)
  }, [isLoadingFloodData, isAuthLoading])

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
    if (mapAndChartViewRef.current) {
      mapAndChartViewRef.current.style.height = `${
        window.innerHeight -
        (headerHeight + selectedDistrictHeight + overviewViewHeight + 10)
      }px`

      console.log(mapAndChartViewRef.current.style)
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
    console.log('yeah something tochabge')
    setSomeRerenderCounter(someRerenderCounter + 1)
  }, [innerHeight])

  return (
    <>
      {/* <SwitchTransition key={geoFormattedPolygons ? false : true}> */}

      <SwitchTransition>
        <CSSTransition
          key={loadingData}
          classNames="loading"
          timeout={500}
          appear={false}
        >
          {loadingData ? (
            <Loader />
          ) : (
            <div className="flex flex-col">
              <Header />
              <div
                className={`flex main-view pt-[50px] ${
                  isScreenLg ? `${sidebarIsOpen ? 'pl-48' : 'pl-10'}` : 'pl-0'
                }  duration-500`}
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
                      <div className="rounded-sm  md:my-0 bg-themeCardColor border border-themeBorderColor h-full w-full px-3 ">
                        <Charts key={someRerenderCounter} />
                      </div>
                    </div>
                    <div className="col-start-4 col-end-9 px-2 md:pl-3 xl:pr-3 ">
                      {/* <div className="w-full rounded-sm bg-themeCardColor border border-themeBorderColor min-h-[500px] bg-[#0e1824]"> */}
                      <div className="w-full rounded-sm border border-themeBorderColor h-[500px] md:h-full bg-themeBgColor ">
                        <Map />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CSSTransition>
      </SwitchTransition>
    </>
  )
}

export default Dashboard

import { useState, useEffect } from 'react'
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
  const { isLoadingPolygons, isLoadingFloodData, geoFormattedPolygons } =
    useSelector((state) => state.apiData)
  const { isAuthLoading } = useSelector((state) => state.auth)
  const { sidebarIsOpen } = useSelector((state) => state.sidebar)

  const [loadingData, setLoadingData] = useState(
    isLoadingPolygons || isLoadingFloodData
  )
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [isScreenLg, setIsScreenLg] = useState(innerWidth > 1024 ? true : false)

  useEffect(() => {
    setLoadingData(isLoadingPolygons || isLoadingPolygons || isAuthLoading)
  }, [isLoadingPolygons, isLoadingFloodData, isAuthLoading])

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
    if (innerWidth > 1024) {
      setIsScreenLg(true)
    } else {
      setIsScreenLg(false)
    }
  }, [innerWidth])

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
                  <div className="flex flex-col-reverse w-full px-1 pt-1 md:space-y-0 md:grid md:grid-cols-8">
                    <div className="col-start-1 col-end-4 px-2 md:pr-3 xl:pl-3">
                      <div className="rounded-sm my-8 md:my-0 details-card h-[500px]  w-full px-3">
                        <Charts />
                      </div>
                    </div>
                    <div className="col-start-4 col-end-9 px-2 md:pl-3 xl:pr-3">
                      <div className="w-full rounded-sm details-card min-h-[500px]">
                        <Map
                        //   center={{
                        //     lat: 30.3753,
                        //     lng: 69.3451,
                        //   }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CSSTransition>
      </SwitchTransition>
      {/* <div className="flex flex-col">
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
            <div className="flex flex-col-reverse w-full px-1 pt-1 md:space-y-0 md:grid md:grid-cols-8">
              <div className="col-start-1 col-end-4 px-2 md:pr-3 xl:pl-3">
                <div className="rounded-sm my-8 md:my-0 details-card h-[500px]  w-full px-3">
                  <Charts />
                </div>
              </div>
              <div className="col-start-4 col-end-9 px-2 md:pl-3 xl:pr-3">
                <div className="w-full rounded-sm details-card min-h-[500px]">
                  <Map
                        //   center={{
                        //     lat: 30.3753,
                        //     lng: 69.3451,
                        //   }}
                        />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default Dashboard

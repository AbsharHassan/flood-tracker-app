import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import {
  CSSTransition,
  SwitchTransition,
  TransitionGroup,
} from 'react-transition-group'
import axios from 'axios'

import { getApiKey } from './features/map/mapSlice'
import { checkAdmin, persistLogin } from './features/auth/authSlice'
import { getFloodData, getPolygons } from './features/apiData/apiDataSlice'

import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import ControlPanel from './pages/ControlPanel'

import ProtectedRoutes from './components/ProtectedRoutes'
// import ProtectLogin from './components/ProtectLogin'
import Map from './components/Map'
import Header from './components/Header'
import Loader from './components/Loader'
import Sidebar from './components/Sidebar'
import SelectedDistrict from './components/SelectedDistrict'
import Charts from './components/Charts'
import DetailsOverview from './components/DetailsOverview'
import Login from './pages/Login'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import { ProvinceData, FloodData } from './Data'
import FlashMessage from './components/FlashMessage'
// import ProtectedRegisterRoute from './components/ProtectedControlPanelRoute'
// import ProtectedControlPanelRoute from './components/ProtectedControlPanelRoute'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()
  const {
    districtNames,
    isLoading,
    isLoadingPolygons,
    isLoadingFloodData,
    dataDate,
    rawData,
    geoFormattedApiData,
    maxFlood,
  } = useSelector((state) => state.apiData)

  useEffect(() => {
    console.log(districtNames)
  }, [districtNames])

  // const { sidebarIsOpen } = useSelector((state) => state.sidebar)

  // const { registerAllowed, user } = useSelector((state) => state.auth)

  // const [loadingData, setLoadingData] = useState(true)
  // // const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  // // const [isScreenLg, setIsScreenLg] = useState(innerWidth > 1024 ? true : false)
  // const [mapData, setMapData] = useState([])
  // const [barChartData, setBarChartData] = useState({
  //   labels: ProvinceData.map((entry) => entry.province),
  //   datasets: [
  //     {
  //       label: 'Percentage of Land Flooded',
  //       data: ProvinceData.map((entry) => entry.flooded),
  //       backgroundColor: [
  //         '#00ffff88',
  //         'aqua',
  //         '#00ffff22',
  //         '#00ffffaa',
  //         '#00ffff44',
  //       ],
  //     },
  //   ],
  // })
  // const [barChartOptions, setBarChartOptions] = useState({
  //   indexAxis: 'y',
  //   elements: {
  //     bar: {
  //       borderWidth: 2,
  //     },
  //   },
  // })
  // const [lineChartData, setLineChartData] = useState({
  //   labels: FloodData.map((entry) => entry.month),
  //   datasets: [
  //     {
  //       label: 'Percentage Flooding by Month',
  //       data: FloodData.map((entry) => entry.flooding),
  //       backgroundColor: ['aqua'],
  //     },
  //   ],
  // })

  useEffect(() => {
    // console.log('some stupid change happened')
  })

  useEffect(() => {
    console.log(process.env.NODE_ENV)
  }, [])

  // useEffect(() => {
  //   dispatch(checkAdmin())
  // }, [user, dispatch])

  // useEffect(() => {
  //   // console.log('i was rerendered for some bullshit reason')
  // })

  // useEffect(() => {
  //   const something = sessionStorage.getItem('user')
  //   // console.log(JSON.parse(something))
  // }, [])

  // useEffect(() => {
  //   setLoadingData(isLoadingPolygons || isLoadingPolygons)
  //   // console.log(loadingData)
  // }, [isLoadingPolygons, isLoadingFloodData])

  // useEffect(() => {
  //   const handleResize = () => {
  //     setInnerWidth(window.innerWidth)
  //   }
  //   window.addEventListener('resize', handleResize)

  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (innerWidth > 1024) {
  //     setIsScreenLg(true)
  //   } else {
  //     setIsScreenLg(false)
  //   }
  // }, [innerWidth])

  // useEffect(() => {
  //   // console.log(location)
  // }, [location])

  useEffect(() => {
    // const fetchData = async () => {
    //   setLoadingData(true)
    //   console.log('fetching data...')
    //   await axios
    //     .get('http://127.0.0.1:5000/api/')
    //     .then((response) => {
    //       setMapData(response.data.districts)
    //       console.log(response.data.districts)
    //       // console.log('api data loaded')
    //       setLoadingData(false)
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // }
    dispatch(getApiKey())
    dispatch(checkAdmin())
    dispatch(persistLogin())
    // dispatch(getPolygons())
    dispatch(getFloodData())

    // fetchData()
  }, [])

  // useEffect(() => {
  //   console.log(location)
  // })

  // useEffect(() => {
  //   console.log(rawData)
  // }, [rawData])

  // useEffect(() => {
  //   console.log(geoFormattedApiData)
  // }, [geoFormattedApiData])

  // useEffect(() => {
  //   console.log(maxFlood)
  // }, [maxFlood])

  // useEffect(() => {
  //   setLoadingData(isLoading)
  // }, [isLoading])

  return (
    <>
      {/* <Login /> */}

      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          timeout={500}
          classNames="routing"
          appear={true}
        >
          <Routes location={location}>
            <Route
              path="/"
              element={<Dashboard />}
            />
            <Route
              path="/login"
              element={<Login />}
            />

            <Route element={<ProtectedRoutes />}>
              <Route
                path="/register"
                element={<Register />}
              />
              <Route
                path="/control-panel"
                element={<ControlPanel />}
              />
            </Route>

            {/* <Route
              path="/register"
              element={<ProtectedRegisterRoute />}
            >
              <Route
                path="/register"
                element={<Register />}
              />
            </Route>
            <Route
              path="/control-panel"
              element={<ProtectedControlPanelRoute />}
            >
              <Route
                path="/control-panel"
                element={<ControlPanel />}
              />
            </Route> */}

            {/* <Route element={<ProtectedRoutes registerLink={true} />}>
              <Route
                path="/register"
                element={<Register />}
              />
            </Route>
            <Route element={<ProtectedRoutes controlLink={true} />}>
              <Route
                path="/control-panel"
                element={<ControlPanel />}
              />
            </Route> */}
          </Routes>
        </CSSTransition>
      </SwitchTransition>

      <div className="fixed inset-x-0 top-0 overflow-hidden -z-20 transform-gpu blur-xl sm:blur-3xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity="0.5"
            d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
            className="shape-fill"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="rgb(30 30 125 / 0.6 )"></stop>
              <stop
                offset="1"
                stopColor="rgb(30 30 125 / 0.6 )"
              ></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  )
}

export default App

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useAxios from '../utils/useAxios'
import {
  toggleRegisterAllowed,
  deleteUser,
  reset,
  refresh,
  testFunc,
  logoutUser,
} from '../features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton'
import ControlPanelButton from '../components/ControlPanelButton'
import axios from 'axios'

const ControlPanel = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const privAxios = useAxios()

  const { isAuthLoading, user, isAuthSuccess, isAuthError, authMessage } =
    useSelector((state) => state.auth)

  const [password, setPassword] = useState('')
  const [isApiProcessing, setIsApiProcessing] = useState(false)
  const [redBorder, setRedBorder] = useState(false)
  const [logoutReq, setLogoutReq] = useState(true)
  const [randomCounter, setRandomCounter] = useState(0)
  const [analysisDatePoints, setAnalysisDatePoints] = useState([
    ['2022-01-01', '2022-01-31'],
    ['2022-02-01', '2022-02-28'],
    ['2022-03-01', '2022-03-31'],
    ['2022-04-01', '2022-04-30'],
    ['2022-05-01', '2022-05-31'],
    ['2022-06-01', '2022-06-30'],
    ['2022-07-01', '2022-07-31'],
    ['2022-08-01', '2022-08-31'],
    ['2022-09-01', '2022-09-30'],
    ['2022-10-01', '2022-10-31'],
    ['2022-11-01', '2022-11-30'],
    ['2022-12-01', '2022-12-31'],
  ])
  const [reAnalysisDatePoints, setReAnalysisDatePoints] = useState([])
  const [polygonsNeedUpdate, setPolygonsNeedUpdate] = useState(false)
  const { sidebarIsOpen } = useSelector((state) => state.sidebar)

  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
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
    if (innerWidth > 1024) {
      setIsScreenLg(true)
    } else {
      setIsScreenLg(false)
    }
  }, [innerWidth])

  const getAllFloodDataEntries = async () => {
    setIsApiProcessing(true)
    try {
      const response = await axios.get(
        'https://flood-tracker-app-api.onrender.com/api/flood-data'
      )
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    setIsApiProcessing(false)
  }

  const handleFloodAnalysis = async () => {
    setIsApiProcessing(true)
    const tempHoldingArray = []
    for (let index = 0; index < analysisDatePoints.length; index++) {
      const afterStartDate = analysisDatePoints[index][0]
      const afterEndDate = analysisDatePoints[index][1]
      try {
        const response = await privAxios.post(
          'flood-data/ee-api/landcover-statistics',
          {
            afterStartDate: analysisDatePoints[index][0],
            afterEndDate: analysisDatePoints[index][1],
            update: false,
          }
        )
        if (response.data.nullCounts > 0) {
          tempHoldingArray.push([afterStartDate, afterEndDate])
          setRandomCounter(randomCounter + 1)
          setReAnalysisDatePoints([
            ...reAnalysisDatePoints,
            [afterStartDate, afterEndDate],
          ])
        }
      } catch (error) {
        console.log(error)
        break
      }
    }

    setIsApiProcessing(false)
    return tempHoldingArray
  }

  const updateMissingFloodAnalysis = async () => {
    setIsApiProcessing(true)
    const tempHoldingArray = []
    if (reAnalysisDatePoints.length) {
      for (let index = 0; index < reAnalysisDatePoints.length; index++) {
        const afterStartDate = reAnalysisDatePoints[index][0]
        const afterEndDate = reAnalysisDatePoints[index][1]
        try {
          const response = await privAxios.post(
            'flood-data/ee-api/landcover-statistics',
            {
              afterStartDate: reAnalysisDatePoints[index][0],
              afterEndDate: reAnalysisDatePoints[index][1],
              update: true,
            }
          )
          if (response.data.nullCounts > 0) {
            console.log('yeah null answer')
            if (
              reAnalysisDatePoints.find(
                (entry) => entry === [afterStartDate, afterEndDate]
              )
            ) {
              console.log('already exists in here so nvm')
            } else {
              tempHoldingArray.push([afterStartDate, afterEndDate])
            }
          } else if (response.data.nullCounts === 0) {
          }
        } catch (error) {
          console.log(error)
          break
        }
      }
    }
    setIsApiProcessing(false)
    return tempHoldingArray
  }

  const deleteAllFloodData = async () => {
    setIsApiProcessing(true)
    try {
      const response = await privAxios.delete('flood-data/delete')
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    setIsApiProcessing(false)
  }

  const getAllPolygonsEntries = async () => {
    setIsApiProcessing(true)
    try {
      const response = await axios.get('/api/geometry/polygons')
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    setIsApiProcessing(false)
  }

  const createAllPolygons = async () => {
    setIsApiProcessing(true)
    try {
      const response = await privAxios.post('geometry/ee-api/create-polygons', {
        update: false,
      })
      console.log(response)
      if (response.data.nullCounts > 0) {
        setPolygonsNeedUpdate(true)
      } else {
        setPolygonsNeedUpdate(false)
      }
    } catch (error) {
      console.log(error)
    }
    setIsApiProcessing(false)
  }

  const updateAllPolygons = async () => {
    setIsApiProcessing(true)
    try {
      const response = await privAxios.post('geometry/ee-api/create-polygons', {
        update: true,
      })
      console.log(response)
      if (response.data.nullCounts > 0) {
        setPolygonsNeedUpdate(true)
      } else {
        setPolygonsNeedUpdate(false)
      }
    } catch (error) {
      console.log(error)
    }
    setIsApiProcessing(false)
  }

  const deleteAllPolygons = async () => {
    setIsApiProcessing(true)
    try {
      const response = await privAxios.delete('geometry/delete')
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    setIsApiProcessing(false)
  }

  const handleDeleteSubmit = async (e) => {
    e.preventDefault()

    setLogoutReq(false)

    setRedBorder(false)

    dispatch(deleteUser({ email: user.email, password }))
  }

  const checkNullEntries = async () => {
    const response = await privAxios.get('flood-data/check-null')

    setReAnalysisDatePoints(response.data)
  }

  useEffect(() => {
    dispatch(toggleRegisterAllowed(false))
    console.log('RENDERED CONTROL PANEL')
    checkNullEntries()
  }, [])

  // useEffect(() => {
  //   console.log(reAnalysisDatePoints)
  // }, [reAnalysisDatePoints])

  // useEffect(() => {
  //   console.log(logoutReq)
  //   console.log(isAuthError);
  //   console.log(isAu);
  //   console.log(isAuthError);

  //   if (isAuthError) {
  //     console.log(authMessage)
  //     setRedBorder(true)
  //   }

  //   if (isAuthSuccess) {
  //     dispatch(toggleRegisterAllowed(true))
  //     navigate('/login')
  //   }

  //   dispatch(reset())
  // }, [isAuthSuccess, isAuthError, authMessage, navigate, dispatch])

  return (
    <>
      <div className="flex flex-col">
        <Header extraTitle="Control Panel" />
        <div
          className={`flex main-view pt-[50px] ${
            isScreenLg ? `${sidebarIsOpen ? 'pl-48' : 'pl-10'}` : 'pl-0'
          }  duration-500`}
        >
          <Sidebar />
          <div className="w-full md:grow p-6 space-y-10 sm:space-y-0 sm:flex sm:space-x-10 text-slate-300">
            <div className="rounded details-card p-3 basis-1/2 sm:flex flex-col items-center justify-center">
              <div className=" text-center text-3xl font-semibold uppercase">
                Flood Data
              </div>
              <div className="mt-6 w-full">
                <ControlPanelButton
                  label="SHOW ALL ENTRIES"
                  // isLoading={isApiProcessing}
                  handleClick={getAllFloodDataEntries}
                />
              </div>

              <div className="mt-6 w-full">
                <ControlPanelButton
                  label="ANALYZE (CREATE)"
                  isLoading={isApiProcessing}
                  handleClick={async () => {
                    const unFinishedArray = await handleFloodAnalysis()
                    setReAnalysisDatePoints(unFinishedArray)
                  }}
                />
              </div>
              <div className="mt-6 w-full">
                <ControlPanelButton
                  label="RE-ANAZLYZE (UPDATE)"
                  isLoading={isApiProcessing}
                  handleClick={async () => {
                    const unFinishedArray = await updateMissingFloodAnalysis()
                    setReAnalysisDatePoints(unFinishedArray)
                  }}
                />
              </div>
              <div className="mt-6 w-full">
                <ControlPanelButton
                  label="DELETE ALL"
                  isLoading={isApiProcessing}
                  handleClick={deleteAllFloodData}
                />
              </div>
            </div>
            <div className="rounded details-card p-3 basis-1/2 sm:flex flex-col items-center justify-center">
              <div className="text-center text-3xl font-semibold uppercase">
                Geometries
              </div>
              <div className="mt-6 w-full">
                <ControlPanelButton
                  label="SHOW ALL ENTRIES"
                  // isLoading={isApiProcessing}
                  handleClick={getAllPolygonsEntries}
                />
              </div>

              <div className="mt-6 w-full">
                <ControlPanelButton
                  label="CREATE"
                  isLoading={isApiProcessing}
                  handleClick={createAllPolygons}
                />
              </div>

              <div className="mt-6 w-full">
                <ControlPanelButton
                  label="UPDATE"
                  disabled={!polygonsNeedUpdate}
                  isLoading={isApiProcessing}
                  handleClick={async () => {}}
                />
              </div>
              <div className="mt-6 w-full">
                <ControlPanelButton
                  label="DELETE ALL"
                  isLoading={isApiProcessing}
                  handleClick={deleteAllPolygons}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="p-3 flex items-center justify-between text-white text-2xl">
        <div>ControlPanel</div>
        <Link to="/">Home</Link>
      </div>

      <div className="mt-6">
        <ControlPanelButton
          label="SHOW ALL ENTRIES"
          isLoading={isApiProcessing}
          handleClick={async () => {
            console.log('this was clicked')
            const unFinishedArray = await handleFloodAnalysis()
            // console.log(unFinishedArray)
            setReAnalysisDatePoints(unFinishedArray)
          }}
        />
      </div>

      <div className="mt-6">
        <SubmitButton
          label="Analyze"
          isLoading={isApiProcessing}
          handleClick={async () => {
            const unFinishedArray = await handleFloodAnalysis()
            // console.log(unFinishedArray)
            setReAnalysisDatePoints(unFinishedArray)
          }}
        />
      </div>

      <div className="mt-6">
        <SubmitButton
          label="Update"
          isLoading={isApiProcessing}
          handleClick={async () => {
            const unFinishedArray = await updateMissingFloodAnalysis()
            // console.log(unFinishedArray)
            setReAnalysisDatePoints(unFinishedArray)
          }}
        />
      </div>
      <div className="mt-6">
        <SubmitButton
          label="show"
          // isLoading={isApiProcessing}
          handleClick={() => {
            console.log(reAnalysisDatePoints)
          }}
        />
      </div> */}

      {/* <div>
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={password}
          redBorder={redBorder}
          handleOnChange={(e) => {
            setPassword(e.target.value)
          }}
        />

        <SubmitButton
          label="Delete"
          isLoading={isAuthLoading}
          handleClick={handleDeleteSubmit}
        />
      </div>
      <div>
        <button
          className="bg-white p-3"
          onClick={() => {
            dispatch(refresh())
          }}
        >
          refresh
        </button>
        <button
          className="m-4 bg-red-900"
          // onClick={async () => {
          //   // dispatch(testFunc())
          //   const response = await privAxios.get('testo')
          //   console.log(response)
          // }}
          onClick={handlePrivRouteCall}
        >
          testo
        </button>
        <button
          className="m-4 bg-green-900"
          // onClick={async () => {
          //   // dispatch(testFunc())
          //   const response = await privAxios.get('testo')
          //   console.log(response)
          // }}
          onClick={handlePrivRouteCall2}
        >
          random
        </button>
      </div>
      <div className="w-full flex items-center justify-center">
        <button
          className="bg-slate-600 p-4"
          onClick={() => {
            dispatch(logoutUser())
          }}
        >
          logout
        </button>
      </div> */}
    </>
  )
}

export default ControlPanel

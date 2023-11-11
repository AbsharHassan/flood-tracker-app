import { useEffect, useState, useRef } from 'react'
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
import dayjs from 'dayjs'

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

  let startDateRef = useRef(null)
  let endDateRef = useRef(null)

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
      const response = await axios.get('/api/flood-data')
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

  const validateFormDates = (startDateString, endDateString) => {
    const parsedStartDate = dayjs(startDateString)
    const parsedEndDate = dayjs(endDateString)

    // check date formats
    if (
      !(
        parsedStartDate.isValid() &&
        parsedStartDate.format('YYYY-MM-DD') === startDateString
      ) &&
      !(
        parsedEndDate.isValid() &&
        parsedEndDate.format('YYYY-MM-DD') === endDateString
      )
    ) {
      console.log('invalid date format, enter in the format YYYY-MM-DD')
      return false
    }

    // check if dates are in the correct ranges
    const minDate = dayjs('2022-01-01')
    const maxDate = dayjs() // current date
    if (
      !(
        parsedStartDate.isAfter(minDate) &&
        parsedEndDate.isBefore(maxDate) &&
        parsedEndDate.isAfter(parsedStartDate)
      )
    ) {
      console.log(
        'start date must be before end date and they must fall within the 2022-01-01 and present date'
      )
      return false
    }

    // check if the dates are of the same month
    if (parsedStartDate.month !== parsedEndDate.month) {
      console.log('currently, both dates must be of the same month')
      return false
    }

    // check if start date is the first of a month
    if (parsedStartDate.date() !== 1) {
      console.log('currently, start date must be the 1st of a month')
      return false
    }

    // check if end date is the last date of a month
    const lastDayOfMonth = parsedEndDate.endOf('month')
    if (!parsedEndDate.isSame(lastDayOfMonth, 'day')) {
      console.log('currently, the end date must be the last date of the month')
      return false
    }

    return true
  }

  const handleAnalysisSubmit = async (e) => {
    e.preventDefault()
    setIsApiProcessing(true)

    console.log(startDateRef.current.value)
    console.log(endDateRef.current.value)

    if (
      validateFormDates(startDateRef.current.value, endDateRef.current.value)
    ) {
      console.log('tests passed')
    } else {
      console.log('tests failed')
    }
    // const tempHoldingArray = []

    //   const afterStartDate = analysisDatePoints[index][0]
    //   const afterEndDate = analysisDatePoints[index][1]
    //   try {
    //     const response = await privAxios.post(
    //       'flood-data/ee-api/landcover-statistics',
    //       {
    //         afterStartDate: analysisDatePoints[index][0],
    //         afterEndDate: analysisDatePoints[index][1],
    //         update: false,
    //       }
    //     )
    //     if (response.data.nullCounts > 0) {
    //       tempHoldingArray.push([afterStartDate, afterEndDate])
    //       setRandomCounter(randomCounter + 1)
    //       setReAnalysisDatePoints([
    //         ...reAnalysisDatePoints,
    //         [afterStartDate, afterEndDate],
    //       ])
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }

    setIsApiProcessing(false)
  }

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
          <div className="w-full p-16 text-slate-300">
            <div className="w-full h-full rounded bg-themeBorderColorDark border border-themeBorderColorDark p-3 sm:flex flex-col items-center justify-center">
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
              <div className="mt-6 p-10 border border-slate-600 rounded">
                <form
                  className="flex flex-col items-center justify-center space-y-2"
                  onSubmit={handleAnalysisSubmit}
                >
                  <label className="flex space-x-4">
                    <span>Start Date</span>
                    <input
                      ref={startDateRef}
                      type="date"
                    />
                  </label>
                  <label className="flex space-x-4">
                    <span>End Date</span>
                    <input
                      ref={endDateRef}
                      type="date"
                    />
                  </label>
                  <ControlPanelButton
                    type={'submit'}
                    label="ANALYZE (CREATE)"
                    isLoading={isApiProcessing}
                    // handleClick={async () => {
                    //   const unFinishedArray = await handleFloodAnalysis()
                    //   setReAnalysisDatePoints(unFinishedArray)
                    // }}
                  />
                </form>
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
          </div>
        </div>
      </div>
    </>
  )
}

export default ControlPanel

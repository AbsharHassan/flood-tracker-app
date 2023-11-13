import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useAxios from '../utils/useAxios'
import axios from 'axios'
import dayjs from 'dayjs'

import { toggleRegisterAllowed } from '../features/auth/authSlice'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import ControlPanelButton from '../components/ControlPanelButton'

const ControlPanel = () => {
  const dispatch = useDispatch()
  const privAxios = useAxios()

  const [isApiProcessing, setIsApiProcessing] = useState(false)
  const { sidebarIsOpen } = useSelector((state) => state.sidebar)

  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [isScreenLg, setIsScreenLg] = useState(innerWidth > 1024 ? true : false)

  let startDateRef = useRef(null)
  let endDateRef = useRef(null)
  let updateRef = useRef(null)
  let deleteRef = useRef(null)

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

  const checkNullEntries = async () => {
    const response = await privAxios.get('flood-data/check-null')

    console.log(response)
  }

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
    const minDate = dayjs('2021-12-31')
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

    if (
      validateFormDates(startDateRef.current.value, endDateRef.current.value)
    ) {
      try {
        const response = await privAxios.post(
          'flood-data/ee-api/landcover-statistics',
          {
            afterStartDate: startDateRef.current.value,
            afterEndDate: endDateRef.current.value,
            update: updateRef.current.checked,
          }
        )
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('tests failed')
    }

    setIsApiProcessing(false)
  }

  const handleDelete = async (e) => {
    e.preventDefault()

    setIsApiProcessing(true)

    if (deleteRef.current.checked) {
      try {
        const response = await privAxios.delete('flood-data/delete')
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    } else {
      if (
        validateFormDates(startDateRef.current.value, endDateRef.current.value)
      ) {
        try {
          const response = await privAxios.delete(
            `flood-data/delete/${startDateRef.current.value}`
          )
          console.log(response)
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log('tests failed')
      }
    }

    setIsApiProcessing(false)
  }

  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)

    dispatch(toggleRegisterAllowed(false))
    checkNullEntries()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (innerWidth > 1024) {
      setIsScreenLg(true)
    } else {
      setIsScreenLg(false)
    }
  }, [innerWidth])

  return (
    <div className="flex flex-col">
      <Header extraTitle="Control Panel" />
      <div
        className={`flex main-view pt-[50px] ${
          isScreenLg ? `${sidebarIsOpen ? 'pl-48' : 'pl-10'}` : 'pl-0'
        }  duration-500`}
      >
        <Sidebar />
        <div className="w-full h-full  p-6 text-slate-300">
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
              <form className="flex flex-col items-center justify-center space-y-5">
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
                <label>
                  Update?
                  <input
                    ref={updateRef}
                    type="checkbox"
                    className="ml-2.5"
                  />
                </label>
                <ControlPanelButton
                  type={'button'}
                  label="ANALYZE"
                  isLoading={isApiProcessing}
                  handleClick={handleAnalysisSubmit}
                />
                <label className="block mt-6">
                  Delete all?
                  <input
                    ref={deleteRef}
                    type="checkbox"
                    className="ml-2.5"
                  />
                </label>
                <ControlPanelButton
                  label="DELETE"
                  isLoading={isApiProcessing}
                  handleClick={handleDelete}
                />
              </form>
            </div>
            <div className="mt-6 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel

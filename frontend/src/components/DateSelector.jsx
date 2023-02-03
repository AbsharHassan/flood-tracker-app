import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { GoCalendar } from 'react-icons/go'
import { TextField } from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

import { setSelectedPeriod } from '../features/apiData/apiDataSlice'

const DateSelector = ({
  isScreenLg,
  sidebarIsOpen,
  innerWidth,
  handleDateDialogState,
}) => {
  dayjs.extend(isBetween)

  const dispatch = useDispatch()

  const { selectedPeriod } = useSelector((state) => state.apiData)

  const [periodDates, setPeriodDates] = useState([
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
  const [dateValue, setDateValue] = useState(
    dayjs(periodDates[selectedPeriod][0])
  )

  useEffect(() => {
    // console.log(dateValue.toISOString().split('T')[0])
    // console.log(dayjs(dateValue).isBetween('2023-01-01', '2023-01-30'))

    periodDates.map((dateArray, index) => {
      if (dayjs(dateValue).isBetween(dateArray[0], dateArray[1])) {
        // console.log(dateArray[0] + ' - ' + dateArray[1])
        dispatch(setSelectedPeriod(index))
      }
    })
  }, [dateValue])

  //   useEffect(() => {
  //     console.log(dayjs('2022-08-01'))
  //   })

  return (
    <>
      {isScreenLg ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            disableFuture={true}
            minDate={'2022/01/01'}
            // views={['day', 'month']}
            views={['day']}
            // openTo="month"
            showDaysOutsideCurrentMonth={true}
            value={dateValue}
            onChange={(newDateValue) => {
              setDateValue(newDateValue)
            }}
            components={{
              OpenPickerIcon: GoCalendar,
            }}
            PopperProps={{
              sx: {
                '& .MuiPaper-root': {
                  // maxHeight: '200px',
                  // marginLeft: '75px',
                  marginTop: '5px',
                  backgroundColor: 'rgb(25 120 200 / 0.2)',
                  boxShadow: '0px 0px 10px 3px rgba(34, 76, 143, 0.5)',
                  color: 'rgb(148 163 184)',
                  backdropFilter: 'blur(7px)',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  border: '2px solid rgb(0 130 255 / 0.3)',
                },
                '& .MuiButtonBase-root': {
                  transition: 'color 0.2s',
                  color: 'rgb(148 163 184)',
                  ':hover': {
                    color: 'rgb(203 213 225)',
                  },
                  // '&.MuiPickersCalendarHeader-switchViewButton': {
                  //   color: 'red',
                  // },
                },
                '& .MuiDayPicker-header': {
                  '& .MuiTypography-root': {
                    color: 'rgb(148 163 184)',
                  },
                },
                '& .MuiDayPicker-monthContainer': {
                  backgroundColor: '',
                  '& .MuiButtonBase-root': {
                    backgroundColor: 'black',
                    color: 'rgb(148 163 184)',
                    ':hover': {
                      backgroundColor: 'rgb(33 33 33)',
                    },
                  },
                  '& .Mui-selected': {
                    backgroundColor: 'rgb(0 130 200)',
                    color: 'black',
                    fontWeight: '900',
                    ':hover': {
                      backgroundColor: 'rgb(0 130 255)',
                    },
                  },
                  '& .MuiPickersDay-dayOutsideMonth': {
                    color: 'rgb(71 85 105)',
                  },
                },
                '& .MuiMonthPicker-root': {
                  color: 'rgb(148 163 184)',
                  '& .Mui-selected': {
                    backgroundColor: 'rgb(25 118 210 / 0.7)',
                    color: 'black',
                    fontWeight: '900',
                  },
                },
                '& .MuiPickersArrowSwitcher-root': {
                  '& .Mui-disabled': {
                    color: 'rgb(71 85 105)',
                  },
                },
              },
              hidden: innerWidth < 1024 ? true : false,
            }}
            InputProps={{
              hidden: true,
              sx: {
                '&.MuiInputBase-root': {
                  padding: `${sidebarIsOpen ? '' : '0px'}`,
                  marginLeft: `${sidebarIsOpen ? '' : '-1px'}`,
                  transition: 'all 0.3s',
                  cursor: `${sidebarIsOpen ? 'text' : 'pointer'}`,
                },
                '& .MuiInputBase-input': {
                  width: `${sidebarIsOpen ? '100%' : '0'}`,
                  color: `${
                    sidebarIsOpen ? 'rgb(148 163 184)' : 'rgb(148 163 184 / 0)'
                  }`,
                  fontSize: '15px',
                  padding: `${sidebarIsOpen ? '8px 14px' : '0px'}`,
                  transition: 'all 0.3s',
                },
                '& .MuiButtonBase-root': {
                  transition: 'all ease-in 0.3s',
                  color: `${
                    sidebarIsOpen ? 'rgb(148 163 184)' : 'rgb(203 213 225)'
                  }`,
                  fontSize: `${sidebarIsOpen ? '19px' : '21px'}`,
                  padding: `${sidebarIsOpen ? '' : '0px'}`,
                  marginRight: `${sidebarIsOpen ? '0px' : '0px'}`,
                  ':hover': {
                    color: 'rgb(2 132 199 / 0.8)',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  width: `${sidebarIsOpen ? '100%' : '0'}`,
                  border: `${
                    sidebarIsOpen ? '2px solid rgb(148 163 184 / 0.3)' : '0px'
                  }`,
                  transition: 'all ease-in 0.3s',
                  borderRadius: '12px',
                },
                '& .MuiOutlinedInput-notchedOutline:hover': {},
                '&.MuiOutlinedInput-root:hover': {
                  '&:hover fieldset': {
                    borderColor: `${
                      sidebarIsOpen ? 'rgb(2 132 199 / 0.5)' : ''
                    }`,
                  },
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                sx={{
                  '&.MuiFormControl-root': {},
                  '& .MuiInputLabel-root': {
                    width: `${sidebarIsOpen ? '100%' : '0px'}`,
                    display: `${sidebarIsOpen ? 'block' : 'none'}`,
                    color: 'rgb(100 116 139)',
                    fontSize: '13px',
                    fontWeight: '1000',
                    transition: 'all 0.3s',
                    // left: '8px',
                    top: '-2px',
                    '&.Mui-focused': {
                      color: '#1976d2',
                      fontSize: '13px',
                      fontWeight: '1000',

                      //   left: '9px',
                      top: '-2px',
                      backgroundColor: 'transparent',
                    },
                    marginTop: '3.75px',
                  },
                  '& .MuiFormLabel-root': {},
                }}
              />
            )}
          />
        </LocalizationProvider>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            // onOpen={() => setIsDateDialogOpen(true)}
            // onClose={() => setIsDateDialogOpen(false)}
            onOpen={() => handleDateDialogState(true)}
            onClose={() => handleDateDialogState(false)}
            label="Select Date"
            disableFuture={true}
            minDate={'2022/01/01'}
            // views={['day', 'month']}
            views={['day']}
            showDaysOutsideCurrentMonth={true}
            value={dateValue}
            onChange={(newDateValue) => {
              setDateValue(newDateValue)
            }}
            components={{
              OpenPickerIcon: GoCalendar,
            }}
            className=" w-full"
            DialogProps={{
              sx: {
                '& .MuiDialogContent-root': {
                  overflowX: 'hidden',
                },
                '& .MuiPaper-root': {
                  // maxHeight: '200px',
                  // marginLeft: '75px',
                  // marginTop: '5px',

                  backgroundColor: 'rgb(25 120 200 / 0.2)',
                  boxShadow: '0px 0px 10px 3px rgba(34, 76, 143, 0.5)',
                  color: 'rgb(148 163 184)',
                  backdropFilter: 'blur(7px)',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  border: '2px solid rgb(0 130 255 / 0.3)',

                  '& .MuiTypography-root': {
                    color: 'inherit',
                  },
                },
                '& .MuiButtonBase-root': {
                  transition: 'color 0.2s',
                  color: 'rgb(148 163 184)',
                  ':hover': {
                    color: 'rgb(203 213 225)',
                  },
                  // '&.MuiPickersCalendarHeader-switchViewButton': {
                  //   color: 'red',
                  // },
                },
                '& .MuiDayPicker-header': {
                  '& .MuiTypography-root': {
                    color: 'rgb(148 163 184)',
                  },
                },
                '& .MuiDayPicker-monthContainer': {
                  backgroundColor: '',
                  '& .MuiButtonBase-root': {
                    backgroundColor: 'black',
                    color: 'rgb(148 163 184)',
                    ':hover': {
                      backgroundColor: 'rgb(33 33 33)',
                    },
                  },
                  '& .Mui-selected': {
                    backgroundColor: 'rgb(0 130 200)',
                    color: 'black',
                    fontWeight: '900',
                    ':hover': {
                      backgroundColor: 'rgb(0 130 255)',
                    },
                  },
                  '& .MuiPickersDay-dayOutsideMonth': {
                    color: 'rgb(81 95 115)',
                  },
                },
                '& .MuiMonthPicker-root': {
                  color: 'rgb(148 163 184)',
                  '& .Mui-selected': {
                    backgroundColor: 'rgb(25 118 210 / 0.7)',
                    color: 'black',
                    fontWeight: '900',
                  },
                },
                '& .MuiPickersArrowSwitcher-root': {
                  '& .Mui-disabled': {
                    color: 'rgb(71 85 105)',
                  },
                },
              },
              // hidden: true,
            }}
            InputProps={{
              hidden: true,
              sx: {
                '&.MuiInputBase-root': {
                  padding: `${sidebarIsOpen ? '' : '0px'}`,
                  marginLeft: `${sidebarIsOpen ? '' : '-1px'}`,
                  transition: 'all 0.3s',
                  cursor: `${sidebarIsOpen ? 'text' : 'pointer'}`,
                },
                '& .MuiInputBase-input': {
                  width: `${sidebarIsOpen ? '100%' : '0'}`,
                  color: `${
                    sidebarIsOpen ? 'rgb(148 163 184)' : 'rgb(203 213 225)'
                  }`,
                  padding: `${sidebarIsOpen ? '8px 14px' : '0px'}`,
                  transition: 'all 0.3s',
                },
                '& .MuiButtonBase-root': {
                  transition: 'all ease-in 0.3s',
                  color: `${
                    sidebarIsOpen ? 'rgb(148 163 184)' : 'rgb(203 213 225)'
                  }`,
                  fontSize: `${sidebarIsOpen ? '19px' : '21px'}`,
                  padding: `${sidebarIsOpen ? '' : '0px'}`,
                  marginRight: `${sidebarIsOpen ? '0px' : '0px'}`,
                  ':hover': {
                    color: 'rgb(2 132 199 / 0.8)',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  width: `${sidebarIsOpen ? '100%' : '0'}`,
                  border: `${
                    sidebarIsOpen ? '2px solid rgb(148 163 184 / 0.3)' : '0px'
                  }`,
                  transition: 'all ease-in 0.3s',
                  borderRadius: '12px',
                },
                '& .MuiOutlinedInput-notchedOutline:hover': {},
                '&.MuiOutlinedInput-root:hover': {
                  '&:hover fieldset': {
                    borderColor: `${
                      sidebarIsOpen ? 'rgb(2 132 199 / 0.5)' : ''
                    }`,
                  },
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                sx={{
                  '&.MuiFormControl-root': {},
                  '& .MuiInputLabel-root': {
                    // width: `${sidebarIsOpen ? '100%' : '0px'}`,
                    minWidth: '100%',
                    display: `${sidebarIsOpen ? 'block' : 'none'}`,
                    color: 'rgb(148 163 184)',
                    fontSize: '11px',
                    transition: 'all 0.3s',
                    left: '9px',
                    top: '-1px',
                    '&.Mui-focused': {
                      color: '#1976d2',
                      fontSize: '12px',
                      fontWeight: '600',
                      left: '9px',
                      top: '-1px',
                      backgroundColor: 'transparent',
                    },
                    marginTop: '3.75px',
                  },
                  '& .MuiFormLabel-root': {},
                }}
              />
            )}
          />
        </LocalizationProvider>
      )}
    </>
  )
}

export default DateSelector

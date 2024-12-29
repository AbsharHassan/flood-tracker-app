import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { GoCalendar } from 'react-icons/go'
import { TextField } from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

import { getFloodData } from '../features/apiData/apiDataSlice'

const DateSelector = ({
  isScreenLg,
  sidebarIsOpen,
  innerWidth,
  handleDateDialogState,
}) => {
  const dispatch = useDispatch()

  const { defaultDateValue } = useSelector((state) => state.apiData)

  const [dateValue, setDateValue] = useState(
    dayjs(defaultDateValue).format('YYYY-MM-DD')
  )
  const [showError, setShowError] = useState(false)

  const handleDateChange = (newDateValue) => {
    setDateValue(newDateValue)

    const parsedStartDate = dayjs(newDateValue).date(1)
    const minDate = dayjs('2021-12-31')
    const maxDate = dayjs('2023-11-01')
    if (
      parsedStartDate.isValid() &&
      parsedStartDate.isAfter(minDate) &&
      parsedStartDate.isBefore(maxDate) &&
      parsedStartDate.date() === 1
    ) {
      setShowError(false)
      dispatch(getFloodData(parsedStartDate.format('YYYY-MM-DD')))
    } else {
      setShowError(true)
    }
  }

  return (
    <>
      {isScreenLg ? (
        <div className="relative">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              disableFuture={true}
              minDate={'2022/01/01'}
              maxDate={dayjs().subtract(1, 'month').format('YYYY-MM-DD')}
              views={['year', 'month']}
              showDaysOutsideCurrentMonth={true}
              value={dateValue}
              onChange={handleDateChange}
              components={{
                OpenPickerIcon: GoCalendar,
              }}
              inputFormat="MMM YYYY"
              PopperProps={{
                sx: {
                  style: { transform: 'translateX(50px)' },
                  '& .MuiPaper-root': {
                    maxHeight: '300px',
                    marginLeft: '75px',
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
                      sidebarIsOpen
                        ? 'rgb(148 163 184)'
                        : 'rgb(148 163 184 / 0)'
                    }`,
                    fontSize: '15px',
                    padding: `${sidebarIsOpen ? '8px 14px' : '0px'}`,
                    transition: 'all 0.3s',
                  },
                  '& .MuiButtonBase-root': {
                    transition: 'all ease-in 0.3s',
                    color: `${
                      !showError
                        ? sidebarIsOpen
                          ? 'rgb(148 163 184)'
                          : 'rgb(203 213 225)'
                        : 'red'
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
                      sidebarIsOpen
                        ? !showError
                          ? '2px solid rgb(148 163 184 / 0.3)'
                          : '2px solid rgb(255 0 0 / 0.6)'
                        : '0px'
                    }`,
                    transition: 'all ease-in 0.3s',
                    borderRadius: '12px',
                  },
                  '& .MuiOutlinedInput-notchedOutline:hover': {},
                  '&.MuiOutlinedInput-root:hover': {
                    '&:hover fieldset': {
                      borderColor: `${
                        sidebarIsOpen
                          ? !showError
                            ? 'rgb(2 132 199 / 0.5)'
                            : 'red'
                          : ''
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
                      color: !showError ? 'rgb(100 116 139)' : 'red',
                      left: '4px',
                      fontSize: '13px',
                      fontWeight: '1000',
                      transition: 'all 0.3s',
                      top: '-2px',
                      '&.Mui-focused': {
                        color: !showError ? '#1976d2' : 'red',
                        fontSize: '13px',
                        fontWeight: '1000',

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
          <div
            className={`absolute w-full text-center text-xs font-semibold text-red-600 transition-opacity duration-300 ${
              showError && sidebarIsOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Incorrect date format
          </div>
        </div>
      ) : (
        <div className="relative">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              onOpen={() => handleDateDialogState(true)}
              onClose={() => handleDateDialogState(false)}
              label="Select Date"
              disableFuture={true}
              minDate={'2022/01/01'}
              maxDate={dayjs().subtract(1, 'month').format('YYYY-MM-DD')}
              views={['year', 'month']}
              inputFormat="MMM YYYY"
              showDaysOutsideCurrentMonth={true}
              value={dateValue}
              onChange={handleDateChange}
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
          <div
            className={`absolute w-full text-center text-xs font-semibold text-red-600 transition-opacity duration-300 ${
              showError && sidebarIsOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Incorrect date format
          </div>
        </div>
      )}
    </>
  )
}

export default DateSelector

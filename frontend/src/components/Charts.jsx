import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import LineChart from './LineChart'
import BarChart from './BarChart'

import { FloodData, DistrictData } from '../Data'
import dayjs from 'dayjs'

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'

//// GENERAL
// Bar Chart for top 10 districts by %age flooding
// Line Chart for overall flooding for each month
// Bar Chart for flooding percentage for each province

//// DISTRICT
// Bar Chart for land classification distribution post flood
// Line Chart for district flooding for each month

const Charts = () => {
  const { totalFloodedArray, selectedFloodData } = useSelector(
    (state) => state.apiData
  )
  const { isDarkMode } = useSelector((state) => state.sidebar)

  const [selectedYear, setSelectedYear] = useState(2022)

  const filterDataByYear = (selectedYear) => {
    const filteredData = totalFloodedArray.filter(
      (d) => dayjs(d.after_START).year() === selectedYear
    )
    return {
      labels: filteredData.map((d) => dayjs(d.after_START).format('MMM')),
      datasets: [
        {
          label: 'Total Flooded',
          data: filteredData.map((d) => {
            return d.totalFlooded > 1 ? d.totalFlooded : 1
          }),
          // backgroundColor: 'rgba(54, 162, 235, 0.2)',
          // borderColor: 'rgba(54, 162, 235, 1)',
          // borderWidth: 1,
        },
      ],
    }
  }

  useEffect(() => {
    // const data = totalFloodedArray.map((monthObj) => {
    //   if (isNaN(monthObj.results.totalFlooded)) return 2
    //   return monthObj.results.totalFlooded
    // })

    setLineChartData(filterDataByYear(selectedYear))

    // setLineChartData({
    //   labels: FloodData.map((entry) => entry.month),
    //   datasets: [
    //     {
    //       label: '% Flooding by Month (2022)',
    //       data: data,
    //     },
    //   ],
    // })
  }, [totalFloodedArray, selectedYear])

  useEffect(() => {
    if (selectedFloodData) {
      let apiData = [...selectedFloodData.resultsArray]

      apiData.sort((a, b) => {
        return b.results.after.floodWater - a.results.after.floodWater
      })

      const truncatedArray = apiData.slice(0, 10)

      const floodValuesArray = truncatedArray.map((districtObj) => {
        return districtObj.results.after.floodWater
      })

      setBarChartData({
        labels: truncatedArray.map((districtObj) => {
          return districtObj.name.split(' ')[0]
        }),
        datasets: [
          {
            label: '% of Land Flooded',
            // data: truncatedArray.map((districtObj) => {
            //   return districtObj.results.after.floodWater
            // }),
            data: floodValuesArray,
            maxBarThickness: 15,
            minBarLength: 35,
            backgroundColor: (data) => {
              const maxValue = Math.max(...data.dataset.data)
              const opacity =
                data.dataset.data[data.dataIndex] / maxValue - 0.25
              return `${
                isDarkMode
                  ? `rgb(51 170 255 / ${opacity})`
                  : `rgb(51 170 255 / ${opacity})`
              }`
            },
          },
        ],
      })
    }
  }, [selectedFloodData])

  const [barChartData, setBarChartData] = useState({
    // labels: DistrictData.map((entry) => entry.district),
    labels: null,
    datasets: [
      {
        label: '% of Land Flooded',
        // data: DistrictData.map((entry) => entry.flooded),
        data: null,
        maxBarThickness: 15,
        minBarLength: 35,
        backgroundColor: [
          '#33aaff22',
          // '#33aaffaa',
          // '#33aaffaa',
          // '#33aaffaa',
          // '#33aaffaa',
        ],
      },
    ],
  })
  const [barChartOptions, setBarChartOptions] = useState({
    indexAxis: 'y',
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          color: isDarkMode ? 'rgb(203 213 225 / 0.75)' : 'rgb(91 105 125)',
          font: {
            size: 10,
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? 'rgb(203 213 225 / 0.75)' : 'rgb(91 105 125)',
          font: {
            size: 10,
          },
          callback: function (value, index, ticks) {
            return value + '%'
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          // This more specific font property overrides the global property
          font: {
            // size: 14,
          },
          color: isDarkMode ? 'rgb(203 213 225 / 0.75)' : 'rgb(91 105 125)',
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
        borderColor: 'transparent',
      },
    },
  })
  const [lineChartData, setLineChartData] = useState({
    // labels: FloodData.map((entry) => entry.month),
    labels: null,

    datasets: [
      {
        label: '% Flooding by Month (2022)',
        // data: FloodData.map((entry) => entry.flooding),
        data: null,
      },
    ],
  })
  const [lineChartOptions, setLinerChartOptions] = useState({
    legend: {
      borderWidth: 0, // Set the borderWidth to 0 to remove the border
    },
    maintainAspectRatio: false,
    tension: 0.25,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? 'rgb(203 213 225 / 0.75)' : 'rgb(91 105 125)',
          font: {
            size: 10,
          },
          callback: function (value, index, ticks) {
            return value + '%'
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? 'rgb(203 213 225 / 0.75)' : 'rgb(91 105 125)',
          font: {
            size: 10,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        borderWidth: 0, // Set the border width to 0 to remove the border
        labels: {
          // This more specific font property overrides the global property
          font: {
            // size: 14,
          },
          color: isDarkMode ? 'rgb(203 213 225 / 0.75)' : 'rgb(91 105 125)',
        },
      },
    },
    elements: {
      line: {
        borderColor: 'transparent',
        backgroundColor: isDarkMode ? '#33aaff44' : 'rgb(56 189 248 / 0.4)',
        fill: true,
      },
      point: {
        pointBackgroundColor: isDarkMode ? 'aqua' : 'rgb(3 105 161)',
      },
    },
  })
  return (
    <div className="flex flex-col justify-between h-full w-full py-5 space-y-2">
      <div className="basis-1/2 w-full h-[95%] relative">
        <div className="absolute right-5 top-[6px] text-xs text-slate-400">
          {/* Year:{' '}
          <select
            className="ml-1 bg-blue-50 bg-opacity-20 border-2 border-blue-300 border-opacity-30 text-gray-400 
            hover:text-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 
            shadow-md hover:shadow-lg transition duration-200 ease-in-out 
            rounded-lg p-2 hover:bg-opacity-30 cursor-pointer"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value)
            }}
          >
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select> */}

          {/* <FormControl
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 120,
            }}
            size="small"
          >
            <InputLabel
              id="demo-simple-select-label"
              sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              Year
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedYear}
              label="Year"
              onChange={(e) => {
                setSelectedYear(e.target.value)
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(0 130 255 / 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(2 132 199 / 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(2 132 199 / 0.8)',
                },
                '& .MuiSelect-select': {
                  backgroundColor: 'rgb(25 120 200 / 0.2)',
                  color: 'rgb(148 163 184)',
                  fontSize: '0.8rem',
                  padding: '5px',
                },
                '& .MuiMenu-paper': {
                  backgroundColor: 'rgb(25 120 200 / 0.2)',
                  color: 'rgb(148 163 184)',
                  boxShadow: '0px 0px 10px 3px rgba(34, 76, 143, 0.5)',
                  backdropFilter: 'blur(7px)',
                },
                // Add more custom styles as needed
              }}
            >
              <MenuItem value={2022}>2022</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
            </Select>
          </FormControl> */}

          {/* // border: '2px solid rgb(71 85 105)', // Example border styling
              // borderRadius: '4px', // Border radius
              // transition: 'border ease 300ms',
              // '&:hover': {
              //   borderColor: '#33aaff55', // Border color on hover
              // },
              // // '&.Mui-focused': {
              // //   borderColor: '#33aaff55', // Border color when focused
              // // },
              // '*': {
              //   outline: 'none',
              // }, */}

          <FormControl
            size="small"
            sx={{
              minWidth: 80,
              outline: 'none',

              color: 'rgb(148 163 184)',

              '.MuiInput-underline:after': {
                // Styles the line when the input is focused
                borderBottomColor: '#33aaff99',
              },
              '.MuiInput-underline:before': {
                // Styles the line in normal state
                borderBottomColor: 'rgb(71 85 105)',
                transition: 'border ease-out 200ms',
              },
              // Add styles for hover state
              '.MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottomColor: '#33aaff55', // Color on hover
              },
            }}
            variant="standard"
          >
            <Select
              displayEmpty
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value)
              }}
              renderValue={
                selectedYear !== '' ? undefined : () => <em>Year</em>
              }
              sx={{
                '.MuiSelect-root': {
                  outline: 'none',
                },

                '.MuiSelect-select': {
                  outline: 'none',
                  padding: '2px 10px',
                  minHeight: '30px',
                  color: 'rgb(148 163 184)',
                },

                '.MuiSelect-standard': {
                  outline: 'none',
                  backgroundColor: 'transparent',
                  outlineColor: 'green',
                },

                '.MuiSelect-iconStandard': {
                  transition: 'transform ease 300ms',
                  color: 'rgb(148 163 184)',
                },
              }}
              // Styling the popper
              MenuProps={{
                PaperProps: {
                  sx: {
                    marginTop: '5px',

                    // style: { transform: 'translateY(15px)' },
                    // transform: 'translateY(15px)',
                    backgroundColor: 'rgb(25 120 200 / 0.3)',
                    boxShadow: '0px 0px 10px 3px rgba(34, 76, 143, 0.5)',
                    color: 'white',
                    backdropFilter: 'blur(7px)',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    border: '2px solid rgb(0 130 255 / 0.3)',
                    // Add more styling as needed
                  },
                },
              }}
              // MenuProps={{
              //   PaperProps: {
              //     sx: {
              //       style: { transform: 'translateX(50px)' },
              //       '& .MuiPaper-root': {
              //         maxHeight: '300px',
              //         marginLeft: '75px',
              //         marginTop: '5px',
              //         backgroundColor: 'rgb(25 120 200 / 0.2)',
              //         boxShadow: '0px 0px 10px 3px rgba(34, 76, 143, 0.5)',
              //         color: 'rgb(148 163 184)',
              //         backdropFilter: 'blur(7px)',
              //         overflow: 'hidden',
              //         borderRadius: '12px',
              //         border: '2px solid rgb(0 130 255 / 0.3)',
              //       },
              //       // Include other styles as required
              //     },
              //   },
              // }}
            >
              <MenuItem value={2022}>2022</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
            </Select>
          </FormControl>
        </div>
        <LineChart
          // height={220}
          chartData={lineChartData}
          chartOptions={lineChartOptions}
        />
      </div>
      <div className="basis-1/2 w-full h-[95%]">
        <BarChart
          // height={250}
          chartData={barChartData}
          chartOptions={barChartOptions}
        />
      </div>
    </div>
  )
}

export default Charts

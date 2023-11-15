import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import LineChart from './LineChart'
import BarChart from './BarChart'
import dayjs from 'dayjs'
import { Select, MenuItem, FormControl } from '@mui/material'

const Charts = () => {
  const { totalFloodedArray, selectedFloodData } = useSelector(
    (state) => state.apiData
  )
  const { isDarkMode } = useSelector((state) => state.sidebar)

  const [yearArray, setYearArray] = useState([2022, 2023])
  const [selectedYear, setSelectedYear] = useState(2022)

  const filterDataByYear = (selectedYear) => {
    const filteredData = totalFloodedArray.filter(
      (d) => dayjs(d.after_START).year() === selectedYear
    )
    return {
      labels: filteredData.map((d) => dayjs(d.after_START).format('MMM')),
      datasets: [
        {
          label: '% Flooding by Month',
          data: filteredData.map((d) => {
            return d.totalFlooded > 1 ? d.totalFlooded : 1
          }),
        },
      ],
    }
  }

  useEffect(() => {
    if (totalFloodedArray.length) {
      let tempYearArray = []
      // eslint-disable-next-line array-callback-return
      totalFloodedArray.map((floodObj) => {
        if (
          !tempYearArray.find((year) => {
            return year === dayjs(floodObj.after_START).year()
          })
        ) {
          tempYearArray.push(dayjs(floodObj.after_START).year())
        }
      })

      setYearArray(tempYearArray)
    }
  }, [totalFloodedArray])

  useEffect(() => {
    setLineChartData(filterDataByYear(selectedYear))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalFloodedArray, selectedYear])

  useEffect(() => {
    if (
      selectedFloodData &&
      selectedFloodData.resultsArray &&
      selectedFloodData.resultsArray.length
    ) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFloodData])

  const [barChartData, setBarChartData] = useState({
    labels: null,
    datasets: [
      {
        label: '% of Land Flooded',
        data: null,
        maxBarThickness: 15,
        minBarLength: 35,
        backgroundColor: ['#33aaff22'],
      },
    ],
  })

  const [barChartOptions] = useState({
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
    labels: null,

    datasets: [
      {
        label: '% Flooding by Month',
        data: null,
      },
    ],
  })

  const [lineChartOptions] = useState({
    legend: {
      display: true,
      position: 'top',
      align: 'start', // Aligns the legend to the start (left) of the top position
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
    layout: {
      padding: {
        top: 10,
      },
    },
    plugins: {
      legend: {
        borderWidth: 0,
        display: true,
        position: 'top',
        align: 'center',
        marginBottom: '20px',
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
        <div className="absolute right-0 top-[-10px] text-xs text-slate-400">
          <FormControl
            size="small"
            sx={{
              padding: 0,
              maxWidth: 60,
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
                  margin: '0px',
                  padding: '2px 8px',
                  minHeight: '30px',
                  color: 'rgb(148 163 184)',
                  fontSize: '12px',
                },

                '.MuiSelect-standard': {
                  outline: 'none',
                  backgroundColor: 'transparent',
                  outlineColor: 'green',
                },

                '.MuiSelect-iconStandard': {
                  fontSize: '14px',
                  transition: 'transform ease 300ms',
                  color: 'rgb(148 163 184)',
                },
              }}
              // Styling the popper
              MenuProps={{
                PaperProps: {
                  sx: {
                    marginTop: '5px',
                    backgroundColor: 'rgb(25 120 200 / 0.3)',
                    boxShadow: '0px 0px 10px 3px rgba(34, 76, 143, 0.5)',
                    color: 'white',
                    backdropFilter: 'blur(7px)',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    border: '2px solid rgb(0 130 255 / 0.3)',
                  },
                },
              }}
            >
              {yearArray.map((year) => (
                <MenuItem
                  key={year}
                  value={year}
                >
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <LineChart
          chartData={lineChartData}
          chartOptions={lineChartOptions}
        />
      </div>
      <div className="basis-1/2 w-full h-[95%]">
        <BarChart
          chartData={barChartData}
          chartOptions={barChartOptions}
        />
      </div>
    </div>
  )
}

export default Charts

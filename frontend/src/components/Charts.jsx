import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import LineChart from './LineChart'
import BarChart from './BarChart'

import { FloodData, DistrictData } from '../Data'

//// GENERAL
// Bar Chart for top 10 districts by %age flooding
// Line Chart for overall flooding for each month
// Bar Chart for flooding percentage for each province

//// DISTRICT
// Bar Chart for land classification distribution post flood
// Line Chart for district flooding for each month

const Charts = () => {
  const { completeFloodData, selectedFloodData } = useSelector(
    (state) => state.apiData
  )
  const { isDarkMode } = useSelector((state) => state.sidebar)

  useEffect(() => {
    const data = completeFloodData.map((monthObj) => {
      if (isNaN(monthObj.results.totalFlooded)) return 2
      return monthObj.results.totalFlooded
    })

    setLineChartData({
      labels: FloodData.map((entry) => entry.month),
      datasets: [
        {
          label: '% Flooding by Month (2022)',
          data: data,
        },
      ],
    })
  }, [completeFloodData])

  useEffect(() => {
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
            const opacity = data.dataset.data[data.dataIndex] / maxValue - 0.25
            return `${
              isDarkMode
                ? `rgb(51 170 255 / ${opacity})`
                : `rgb(51 170 255 / ${opacity})`
            }`
          },
        },
      ],
    })
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
      <div className="basis-1/2 w-full h-[95%]">
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

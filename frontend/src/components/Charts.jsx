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

  useEffect(() => {
    const data = completeFloodData.map((monthObj) => {
      if (isNaN(monthObj.results.totalFlooded)) return 2
      return monthObj.results.totalFlooded
    })

    setLineChartData({
      labels: FloodData.map((entry) => entry.month),
      datasets: [
        {
          label: 'Percentage Flooding by Month (2022)',
          data: data,
        },
      ],
    })
  }, [completeFloodData])

  useEffect(() => {
    let apiData = [...selectedFloodData.results.resultsArray]

    apiData.sort((a, b) => {
      return b.results.after.floodWater - a.results.after.floodWater
    })

    const truncatedArray = apiData.slice(0, 10)

    setBarChartData({
      labels: truncatedArray.map((districtObj) => {
        return districtObj.name.split(' ')[0]
      }),
      datasets: [
        {
          label: 'Percentage of Land Flooded',
          data: truncatedArray.map((districtObj) => {
            return districtObj.results.after.floodWater
          }),
          maxBarThickness: 15,
          minBarLength: 35,
          backgroundColor: [
            '#33aaffaa',
            '#33aaffaa',
            '#33aaffaa',
            '#33aaffaa',
            '#33aaffaa',
          ],
        },
      ],
    })
  }, [selectedFloodData])

  const [barChartData, setBarChartData] = useState({
    // labels: DistrictData.map((entry) => entry.district),
    labels: null,
    datasets: [
      {
        label: 'Percentage of Land Flooded',
        // data: DistrictData.map((entry) => entry.flooded),
        data: null,
        maxBarThickness: 15,
        minBarLength: 35,
        backgroundColor: [
          '#33aaffaa',
          '#33aaffaa',
          '#33aaffaa',
          '#33aaffaa',
          '#33aaffaa',
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
          color: 'rgb(203 213 225 / 0.75)',
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
          color: 'rgb(203 213 225)',
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
          color: 'rgb(203 213 225 / 0.75)',
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
  })
  const [lineChartData, setLineChartData] = useState({
    // labels: FloodData.map((entry) => entry.month),
    labels: null,

    datasets: [
      {
        label: 'Percentage Flooding by Month (2022)',
        // data: FloodData.map((entry) => entry.flooding),
        data: null,
      },
    ],
  })
  const [lineChartOptions, setLinerChartOptions] = useState({
    maintainAspectRatio: false,
    tension: 0.25,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(203 213 225 / 0.75)',
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
          color: 'rgb(203 213 225 / 0.75)',
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
        labels: {
          // This more specific font property overrides the global property
          font: {
            // size: 14,
          },
          color: 'rgb(203 213 225 / 0.75)',
        },
      },
    },
    elements: {
      line: {
        // borderColor: 'red',
        // backgroundColor: 'red',
        fill: true,
      },
      point: {
        pointBackgroundColor: 'aqua',
      },
    },
  })
  return (
    <div className="flex flex-col w-full py-5 space-y-2">
      <div className="w-full max-h-[250px]">
        <LineChart
          height={220}
          chartData={lineChartData}
          chartOptions={lineChartOptions}
        />
      </div>
      <div className="w-full max-h-[250px]">
        <BarChart
          height={250}
          chartData={barChartData}
          chartOptions={barChartOptions}
        />
      </div>
    </div>
  )
}

export default Charts

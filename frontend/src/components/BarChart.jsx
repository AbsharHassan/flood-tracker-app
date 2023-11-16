import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'

const BarChart = ({ chartData, chartOptions, height }) => {
  return (
    <Bar
      style={{ height: height }}
      data={chartData}
      options={chartOptions}
    />
  )
}

export default BarChart

import { Bar } from 'react-chartjs-2'

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

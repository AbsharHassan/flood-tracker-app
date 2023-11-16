import { Line } from 'react-chartjs-2'

const LineChart = ({ chartData, chartOptions, height }) => {
  return (
    <Line
      style={{ height: height }}
      data={chartData}
      options={chartOptions}
    />
  )
}

export default LineChart

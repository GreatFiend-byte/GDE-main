const ReportChart = ({ data }) => {
  // Encontrar el valor máximo para calcular las alturas relativas
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="report-chart-container">
      <div className="chart-placeholder">
        <div className="bar-chart">
          {data.map((item, index) => (
            <div key={index} className="bar" style={{ height: `${(item.value / maxValue) * 100}%` }}>
              <span className="bar-label">{item.label}</span>
              <span className="bar-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReportChart

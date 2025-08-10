const ReportTable = ({ headers, data, type, onDownload }) => {
  // Renderizar celdas según el tipo de tabla
  const renderCell = (item, index) => {
    if (type === "exams") {
      return (
        <tr key={index}>
          <td>{item.date}</td>
          <td>{item.theme}</td>
          <td>{item.title}</td>
          <td>{item.exercises}</td>
          <td>{item.level}</td>
          <td>
            <button 
              className="action-btn primary"
              onClick={() => onDownload(item.id, 1)}
            >
              Resuelto
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => onDownload(item.id, 0)}
            >
              Sin Resolver
            </button>
          </td>
        </tr>
      )
    }

    return null
  }

  return (
    <div className="report-table-container">
      <table className="report-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => renderCell(item, index))
          ) : (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: 'center' }}>
                No hay exámenes generados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ReportTable
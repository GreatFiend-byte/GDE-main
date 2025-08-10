"use client"

import { useState, useEffect } from "react"
import ReportTable from "./ReportTable"
import ReportChart from "./ReportChart"

const ReportTabs = ({ period }) => {
  const [activeTab, setActiveTab] = useState("exams")
  const [activeView, setActiveView] = useState({
    exams: "table"
  })
  const [examsData, setExamsData] = useState({
    table: [],
    chart: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getWeekNumber = (date) => {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
      const pastDaysOfYear = (date - firstDayOfYear) / 86400000
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
    }

    const processChartData = (data, period) => {
      if (period === "week") {
        const weeklyData = {}
        data.forEach(exam => {
          const date = new Date(exam.fecha_creacion)
          const weekNumber = getWeekNumber(date)
          const key = `Semana ${weekNumber}`
          weeklyData[key] = (weeklyData[key] || 0) + 1
        })
        
        return Object.entries(weeklyData).map(([label, value]) => ({
          label,
          value
        }))
      } else {
        const monthlyData = {}
        data.forEach(exam => {
          const date = new Date(exam.fecha_creacion)
          const month = date.toLocaleString('default', { month: 'long' })
          monthlyData[month] = (monthlyData[month] || 0) + 1
        })
        
        return Object.entries(monthlyData).map(([label, value]) => ({
          label,
          value
        }))
      }
    }

    const fetchExamsData = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/estadisticas/examenes-detallados')
        if (!response.ok) throw new Error('Error al obtener exámenes')
        const data = await response.json()
        
        const tableData = data.map(exam => ({
          id: exam.id_examen,
          date: exam.fecha_creacion,
          theme: exam.nombre_tema,
          title: exam.titulo,
          exercises: exam.num_preguntas,
          level: exam.nivel,
          id_tema: exam.id_tema
        }))
        
        const chartData = processChartData(data, period)
        
        setExamsData({
          table: tableData,
          chart: chartData
        })
      } catch (err) {
        console.error("Error fetching exams data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchExamsData()
  }, [period])

  const switchTab = (tabId) => {
    setActiveTab(tabId)
  }

  const toggleView = (tabId, view) => {
    setActiveView({
      ...activeView,
      [tabId]: view,
    })
  }


  const handleDownload = async (id_examen, resuelto) => {
    try {
      const response = await fetch(`http://localhost:8000/descargar-examen-pdf/${id_examen}/${resuelto}`)
      if (!response.ok) throw new Error('Error al descargar examen')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `examen_${id_examen}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading exam:", err)
      alert(`Error al descargar examen: ${err.message}`)
    }
  }

  if (loading) return <div className="tab-pane active">Cargando datos de exámenes...</div>
  if (error) return <div className="tab-pane active">Error: {error}</div>

  return (
    <>
      <div className="report-tabs">
        <button 
          className={`tab-btn ${activeTab === "exams" ? "active" : ""}`} 
          onClick={() => switchTab("exams")}
        >
          Exámenes Generados
        </button>
      </div>

      <div className="tab-content">
        <div id="exams-tab" className={`tab-pane ${activeTab === "exams" ? "active" : ""}`}>
          <div className="view-toggle">
            <button
              className={`view-btn ${activeView.exams === "table" ? "active" : ""}`}
              onClick={() => toggleView("exams", "table")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
              Tabla
            </button>
            <button
              className={`view-btn ${activeView.exams === "chart" ? "active" : ""}`}
              onClick={() => toggleView("exams", "chart")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Gráfica
            </button>
          </div>

          {activeView.exams === "table" && (
            <ReportTable
              headers={["Fecha", "Tema", "Título", "Ejercicios", "Nivel", "Descargar"]}
              data={examsData.table}
              type="exams"
              onDownload={handleDownload}
            />
          )}
          
          {activeView.exams === "chart" && (
            <ReportChart data={examsData.chart} />
          )}
        </div>
      </div>
    </>
  )
}

export default ReportTabs
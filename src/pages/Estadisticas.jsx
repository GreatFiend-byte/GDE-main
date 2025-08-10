"use client"

import { useState, useEffect } from "react"
import StatCard from "../components/StatCard"
import ReportTabs from "../components/ReportTabs"
import "../styles/estadisticas.css"

const Estadisticas = () => {
  const [period, setPeriod] = useState("week")
  const [stats, setStats] = useState({
    temas: 0,
    examenes: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Fetch temas count
        const temasResponse = await fetch('https://GreatFiend.pythonanywhere.com/estadisticas/temas')
        if (!temasResponse.ok) throw new Error('Error al obtener temas')
        const temasData = await temasResponse.json()
        
        // Fetch examenes count
        const examenesResponse = await fetch('https://GreatFiend.pythonanywhere.com/estadisticas/examenes')
        if (!examenesResponse.ok) throw new Error('Error al obtener exámenes')
        const examenesData = await examenesResponse.json()
        
        setStats({
          temas: temasData.total_temas || 0,
          examenes: examenesData.total_examenes || 0
        })
      } catch (err) {
        console.error("Error fetching statistics:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  if (loading) return <div className="stats-dashboard">Cargando estadísticas...</div>
  if (error) return <div className="stats-dashboard">Error: {error}</div>

  return (
    <div className="stats-dashboard">
      {/* Tarjetas de resumen */}
      <div className="stats-cards">
        <StatCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
            </svg>
          }
          value={stats.temas.toString()}
          label="Temas Guardados"
        />

        <StatCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12h6"></path>
              <path d="M9 16h6"></path>
              <path d="M13 8h2"></path>
              <path d="M4 6h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
              <path d="M16 2l-2 2h-4l-2-2"></path>
            </svg>
          }
          value={stats.examenes.toString()}
          label="Exámenes Generados"
        />
      </div>

      {/* Sección de reportes */}
      <div className="reports-section">
        <div className="report-header">
          <h3>Reportes Detallados</h3>
          <div className="report-controls">
            <div className="period-selector">
              <label htmlFor="period-select">Periodo:</label>
              <select
                id="period-select"
                className="form-select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="week">Semanal</option>
                <option value="month">Mensual</option>
              </select>
            </div>
          </div>
        </div>

        <ReportTabs period={period} />
      </div>
    </div>
  )
}

export default Estadisticas
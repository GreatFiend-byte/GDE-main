"use client"

import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import "../styles/global.css"

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const location = useLocation()
  const currentPage = location.pathname.split("/").pop() || "subir-archivo"

  // Función para obtener el título de la página actual
  const getPageTitle = () => {
    switch (currentPage) {
      case "subir-archivo":
        return "Subir Archivos"
      case "historial":
        return "Historial de Archivos"
      case "generar-examen":
        return "Generar Examen"
      case "resolver-examen":
        return "Resolver Examen"
      case "revisar-respuestas":
        return "Revisar Respuestas"
      case "estadisticas":
        return "Estadísticas"
      default:
        return "Subir Archivos"
    }
  }

  // Manejar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile !== isMobile) {
        setSidebarOpen(!mobile)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMobile])

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Cerrar sidebar en móvil cuando se hace clic fuera
  const closeSidebarOnMobile = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="app-container">
      {/* Overlay para móvil */}
      {isMobile && sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebarOnMobile}></div>}

      <Sidebar
        isOpen={sidebarOpen}
        currentPage={currentPage}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={`main-content ${sidebarOpen && !isMobile ? "sidebar-open" : "sidebar-closed"}`}>
        <header className="content-header">
          <button className="sidebar-toggle" aria-label="Toggle Sidebar" onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h2>{getPageTitle()}</h2>
        </header>

        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
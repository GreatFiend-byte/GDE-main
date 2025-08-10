"use client"

import { Link } from "react-router-dom"
import "../styles/sidebar.css"
import logo from "./logo.jpg";

const Sidebar = ({ isOpen, currentPage, isMobile, onClose }) => {
  const handleLinkClick = () => {
    if (isMobile) {
      onClose()
    }
  }

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""} ${isMobile ? "mobile" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <h1>GDE</h1>
        </div>
        {isMobile && (
          <button className="sidebar-close" onClick={onClose} aria-label="Cerrar Sidebar">
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <h3 className="nav-group-title">Modulos</h3>
          <ul className="nav-list">
            <li className={`nav-item ${currentPage === "subir-archivo" ? "active" : ""}`}>
              <Link to="/subir-archivo" onClick={handleLinkClick}>
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>Subir Archivo</span>
              </Link>
            </li>
            <li className={`nav-item ${currentPage === "generar-examen" ? "active" : ""}`}>
              <Link to="/generar-examen" onClick={handleLinkClick}>
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
                  <path d="M9 12h6"></path>
                  <path d="M9 16h6"></path>
                  <path d="M13 8h2"></path>
                  <path d="M4 6h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
                  <path d="M16 2l-2 2h-4l-2-2"></path>
                </svg>
                <span>Generar Examen</span>
              </Link>
            </li>
            <li className={`nav-item ${currentPage === "resolver-examen" ? "active" : ""}`}>
              <Link to="/resolver-examen" onClick={handleLinkClick}>
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
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span>Resolver Examen</span>
              </Link>
            </li>
            <li className={`nav-item ${currentPage === "historial" ? "active" : ""}`}>
              <Link to="/historial" onClick={handleLinkClick}>
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
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 .49-5.27L1 10"></path>
                  <polyline points="12 7 12 12 15 15"></polyline>
                </svg>
                <span>Historial</span>
              </Link>
            </li>
            <li className={`nav-item ${currentPage === "estadisticas" ? "active" : ""}`}>
              <Link to="/estadisticas" onClick={handleLinkClick}>
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
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Estadísticas</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
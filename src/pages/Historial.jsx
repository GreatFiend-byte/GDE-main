"use client"

import { useState, useEffect } from "react"
import "../styles/historial.css"

const Historial = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [temas, setTemas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTema, setSelectedTema] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [temaToDelete, setTemaToDelete] = useState(null)

  // Obtener temas desde el backend
  const fetchTemas = async () => {
    try {
      const response = await fetch("https://GreatFiend.pythonanywhere.com/obtener-temas", {
        method: "GET",
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'omit'
      })

      if (!response.ok) {
        throw new Error("Error al obtener los temas")
      }

      const data = await response.json()
      setTemas(data)
    } catch (err) {
      console.error("Error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTemas()
  }, [])

  // Filtrar temas por término de búsqueda
  const filteredTemas = temas.filter((tema) => 
    tema.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tema.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Ver detalles del tema
  const handleVerDetalles = async (idTema) => {
    try {
      const response = await fetch(`https://GreatFiend.pythonanywhere.com/obtener-texto-tema/${idTema}`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'omit'
      })

      if (!response.ok) {
        throw new Error("Error al obtener los detalles del tema")
      }

      const data = await response.json()
      setSelectedTema(data)
      setShowModal(true)
    } catch (err) {
      console.error("Error:", err)
      setError(err.message)
    }
  }

  // Descargar archivo
  const handleDescargar = async (tema) => {
    try {
      const response = await fetch(`https://GreatFiend.pythonanywhere.com/descargar-archivo/${tema.id_tema}`, {
        method: "GET",
        credentials: 'omit'
      })

      if (!response.ok) {
        throw new Error("Error al descargar el archivo")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = tema.nombre_archivo || `tema-${tema.id_tema}.${tema.tipo_archivo}`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      console.error("Error:", err)
      setError(err.message)
    }
  }

  // Solicitar eliminación de tema
  const requestEliminar = (idTema) => {
    setTemaToDelete(idTema)
    setShowConfirmModal(true)
  }
  

  // Confirmar eliminación de tema
  const confirmEliminar = async () => {
    try {
      const response = await fetch(`https://GreatFiend.pythonanywhere.com/eliminar-tema/${temaToDelete}`, {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'omit'
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el tema")
      }

      // Actualizar la lista de temas
      await fetchTemas()
      setShowConfirmModal(false)
    } catch (err) {
      console.error("Error:", err)
      setError(err.message)
      setShowConfirmModal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="module-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando temas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="module-section">
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="module-section">
      <div className="search-bar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          placeholder="Buscar temas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTemas.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron temas</p>
        </div>
      ) : (
        <div className="files-grid">
          {filteredTemas.map((tema) => (
            <div className="file-card" key={tema.id_tema}>
              <div className="file-card-header">
                <div className="file-icon">
                  {tema.tipo_archivo === "pdf" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF0000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  )}
                </div>
                <div className="file-info">
                  <h4>{tema.nombre}</h4>
                  <p>Subido: {tema.fecha_creacion}</p>
                  <p className="file-description">{tema.descripcion}</p>
                  <div className="file-meta">
                    <span className={`file-status ${tema.status}`}>
                      {tema.status === "success" ? "Procesado" : "Procesando"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="file-actions">
                <button 
                  className="action-btn"
                  onClick={() => handleVerDetalles(tema.id_tema)}
                >
                  Ver detalles
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => handleDescargar(tema)}
                >
                  Descargar
                </button>
                <button 
                  className="action-btn danger"
                  onClick={() => requestEliminar(tema.id_tema)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedTema?.nombre}</h3>
            </div>
            <div className="modal-body">
              <div className="modal-meta">
                <p><strong>Fecha:</strong> {selectedTema?.fecha_creacion}</p>
              </div>
              <div className="texto-extraido-container">
                <h4>Texto extraído:</h4>
                <div className="texto-extraido-content">
                  {selectedTema?.texto_extraido || "No hay texto disponible"}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="action-btn"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <div className="modal-header">
              <h3>Confirmar eliminación</h3>
              <button 
                className="modal-close"
                onClick={() => setShowConfirmModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar este tema? Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="action-btn secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="action-btn danger"
                onClick={confirmEliminar}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Historial
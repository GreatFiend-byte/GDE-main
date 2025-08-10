import { useState, useEffect } from "react"
import "../styles/generar-examen.css"

const GenerarExamen = () => {
  const [formData, setFormData] = useState({
    id_tema: "",
    tituloExamen: "",
    descripcion: "",
    cantidadExamenes: 1,
    exerciseCount: 10,
    nivel: "Básico"
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [temas, setTemas] = useState([])
  const [generatedExams, setGeneratedExams] = useState({ Examenes: [] })
  const [error, setError] = useState(null)

  // Cargar temas al montar el componente
  useEffect(() => {
    const cargarTemas = async () => {
      try {
        const response = await fetch('http://localhost:8000/obtener-temas')
        if (!response.ok) throw new Error('Error al cargar temas')
        const data = await response.json()
        setTemas(data)
      } catch (err) {
        setError(err.message)
      }
    }
    cargarTemas()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)
    setGeneratedExams({ Examenes: [] })

    try {
      const response = await fetch('http://localhost:8000/generar-preguntas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al generar los exámenes')
      }

      const data = await response.json()
      const examsData = data.examenes || { Examenes: [] }
      setGeneratedExams(examsData)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClearAll = () => {
    setFormData({
      id_tema: "",
      tituloExamen: "",
      descripcion: "",
      cantidadExamenes: 1,
      exerciseCount: 10,
      nivel: "Básico"
    })
    setGeneratedExams({ Examenes: [] })
    setError(null)
  }

  return (
    <div className="exam-generator">
      <div className="generator-form">
        <div className="form-section">
          <h3>Generador de Exámenes</h3>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="tituloExamen">Título Base del Examen</label>
              <input
                type="text"
                id="tituloExamen"
                name="tituloExamen"
                className="form-input"
                value={formData.tituloExamen}
                onChange={handleInputChange}
                required
                placeholder="Ej: Examen de Matemáticas - Primer Parcial"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="form-input"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="3"
                placeholder="Breve descripción del examen"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cantidadExamenes">Cantidad de Exámenes</label>
              <select
                id="cantidadExamenes"
                name="cantidadExamenes"
                className="form-select"
                value={formData.cantidadExamenes}
                onChange={handleInputChange}
                required
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1} Examen{i+1 !== 1 ? 'es' : ''}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="id_tema">Seleccionar Tema</label>
              <select
                id="id_tema"
                name="id_tema"
                className="form-select"
                value={formData.id_tema}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un tema...</option>
                {temas.map(tema => (
                  <option key={tema.id_tema} value={tema.id_tema}>
                    {tema.nombre} ({tema.fecha_creacion})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nivel">Nivel:</label>
              <select
                id="nivel"
                name="nivel"
                value={formData.nivel}
                onChange={handleInputChange}
              >
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="exerciseCount">Preguntas por Examen</label>
              <input
                type="number"
                id="exerciseCount"
                name="exerciseCount"
                className="form-input"
                value={formData.exerciseCount}
                onChange={handleInputChange}
                min="5"
                max="10"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="generate-btn" disabled={isGenerating || !formData.id_tema || !formData.tituloExamen}>
                {isGenerating ? (
                  <>
                    <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    Generando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    Generar Examen
                  </>
                )}
              </button>

              <button 
                type="button" 
                className="generate-btn"
                onClick={handleClearAll}
                disabled={isGenerating}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Limpiar Todo
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="preview-section">
        <div className="preview-header">
          <h3>Vista Previa</h3>
          {generatedExams.Examenes?.length > 0 && (
            <button 
              className="clear-preview-btn"
              onClick={() => setGeneratedExams({ Examenes: [] })}
            >
              Limpiar Vista
            </button>
          )}
        </div>
        
        <div className="exam-preview">
          {generatedExams.Examenes?.length > 0 ? (
            <div className="exams-list">
              {generatedExams.Examenes.map((examen, examIndex) => (
                <div key={examIndex} className="exam-title-item">
                  <div className="exam-title-header">
                    <h4>{examen.titulo || `${formData.tituloExamen} - Versión ${examIndex + 1}`}</h4>
                    <div className="exam-meta">
                      <span>Preguntas: {examen.preguntas?.length || 0}</span>
                      <span>Nivel: {formData.nivel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="preview-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <p>Los exámenes generados aparecerán aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GenerarExamen
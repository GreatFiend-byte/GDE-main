"use client"

import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import "../styles/revisar-respuestas.css"

const RevisarRespuestas = () => {
  const [examFile, setExamFile] = useState(null)
  const [questionCount, setQuestionCount] = useState(10)
  const [answers, setAnswers] = useState({})
  const [examTheme, setExamTheme] = useState("")

  // Configuración de dropzone para subir examen
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setExamFile(acceptedFiles[0])
    },
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  })

  // Generar campos de respuestas basados en el número de preguntas
  useEffect(() => {
    const newAnswers = {}
    for (let i = 1; i <= questionCount; i++) {
      newAnswers[`question-${i}`] = ""
    }
    setAnswers(newAnswers)
  }, [questionCount])

  // Manejar cambio en las respuestas
  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    })
  }

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Respuestas enviadas correctamente")
    console.log({
      examFile,
      examTheme,
      questionCount,
      answers,
    })
  }

  return (
    <div className="review-section">
      {/* Sección para subir examen */}
      <div className="upload-exam-section">
        <h3>Subir Examen Resuelto</h3>
        <div className={`upload-area ${isDragActive ? "active" : ""}`} {...getRootProps()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <p>Arrastra y suelta tu examen resuelto</p>
          <div className="upload-form">
            <label htmlFor="exam-upload" className="upload-button">
              Seleccionar Archivo
            </label>
            <input {...getInputProps()} id="exam-upload" />
          </div>
          {examFile && (
            <div className="file-info">
              <p>Archivo seleccionado: {examFile.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sección para respuestas */}
      <div className="answers-section">
        <h3>Respuestas del Examen</h3>

        <form id="answers-form" className="answers-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="exam-theme">Tema del Examen</label>
            <select
              id="exam-theme"
              className="form-select"
              value={examTheme}
              onChange={(e) => setExamTheme(e.target.value)}
              required
            >
              <option value="">Seleccione un tema...</option>
              <option value="math">Matemáticas</option>
              <option value="history">Historia</option>
              <option value="chemistry">Química</option>
              <option value="physics">Física</option>
              <option value="biology">Biología</option>
              <option value="literature">Literatura</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="question-count">Número de Preguntas/Problemas</label>
            <input
              type="number"
              id="question-count"
              className="form-input"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number.parseInt(e.target.value))}
              min="1"
              max="100"
            />
          </div>

          <div className="answers-container">
            {Object.keys(answers).map((questionId) => {
              const questionNumber = questionId.split("-")[1]
              return (
                <div className="answer-item" key={questionId}>
                  <div className="question-number">Pregunta {questionNumber}</div>
                  <div className="answer-options">
                    {["A", "B", "C", "D"].map((option) => (
                      <label className="option-label" key={option}>
                        <input
                          type="radio"
                          name={questionId}
                          value={option}
                          checked={answers[questionId] === option}
                          onChange={() => handleAnswerChange(questionId, option)}
                          required
                        />
                        <span className="option-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <button type="submit" className="submit-btn">
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
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Enviar Respuestas
          </button>
        </form>
      </div>
    </div>
  )
}

export default RevisarRespuestas

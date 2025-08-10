"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import "../styles/subir-archivo.css"

const SubirArchivo = () => {
  const [files, setFiles] = useState([])
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({
    nombre: false,
    descripcion: false
  })

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles)
    setError(null)
    setUploadResult(null)
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"]
    },
    maxFiles: 1,
    noClick: true
  })

  const validateFields = () => {
    const errors = {
      nombre: !nombre.trim(),
      descripcion: !descripcion.trim()
    }
    setFieldErrors(errors)
    return Object.values(errors).some(error => error)
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Por favor selecciona un archivo")
      return
    }

    // Validar campos obligatorios
    if (validateFields()) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", files[0])
      formData.append("nombre", nombre)
      formData.append("descripcion", descripcion)

      const response = await fetch("https://GreatFiend.pythonanywhere.com/subir-archivo/", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'omit'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Error al subir el archivo")
      }

      const result = await response.json()
      setUploadResult(result)

    } catch (err) {
      console.error("Detalles del error:", {
        name: err.name,
        message: err.message,
        stack: err.stack
      })
      setError("Error al conectar con el servidor")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section className="upload-section">
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
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <h3>Arrastra y suelta tu archivo aquí</h3>
        <p>o</p>
        <button type="button" className="upload-button" onClick={open}>
          Selecciona un archivo
        </button>
        <input {...getInputProps()} />
        
        {files.length > 0 && (
          <div className="selected-files">
            <p>Archivo seleccionado:</p>
            <ul>
              <li>
                {files[0].name} - {(files[0].size / 1024 / 1024).toFixed(2)} MB
              </li>
            </ul>
            <button
              type="button"
              className="clear-button"
              onClick={() => {
                setFiles([])
                setNombre("")
                setDescripcion("")
                setUploadResult(null)
                setError(null)
              }}
              style={{ marginTop: "8px" }}
            >
              Limpiar
            </button>
          </div>
        )}
      </div>

      <div className="upload-form-fields">
        <div className="form-group">
          <label htmlFor="nombre">
            Nombre Tema: <span className="required-field">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value)
              if (fieldErrors.nombre) {
                setFieldErrors({...fieldErrors, nombre: false})
              }
            }}
            placeholder="Nombre del documento"
            className={fieldErrors.nombre ? "error-input" : ""}
            required
          />
          {fieldErrors.nombre && (
            <p className="error-text">Este campo es obligatorio</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">
            Descripción: <span className="required-field">*</span>
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value)
              if (fieldErrors.descripcion) {
                setFieldErrors({...fieldErrors, descripcion: false})
              }
            }}
            placeholder="Descripción del contenido"
            rows="3"
            className={fieldErrors.descripcion ? "error-input" : ""}
            required
          />
          {fieldErrors.descripcion && (
            <p className="error-text">Este campo es obligatorio</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isUploading || files.length === 0}
          className="submit-button"
        >
          {isUploading ? "Subiendo..." : "Subir archivo"}
        </button>

        {error && <div className="error-message">{error}</div>}

        {uploadResult && (
          <div className="upload-result">
            <h4>¡Archivo subido correctamente!</h4>
            <p><strong>ID del tema:</strong> {uploadResult.id_tema}</p>
            <p><strong>Nombre del archivo:</strong> {uploadResult.nombre_archivo}</p>
            <p><strong>Tipo de archivo:</strong> {uploadResult.tipo_archivo}</p>
            <div className="texto-extraido">
              <h5>Texto extraído:</h5>
              <p className="texto-limitado">{uploadResult.texto_extraido}</p>
            </div>
          </div>
        )}
      </div>

      <div className="upload-info">
        <h3>Detalles</h3>
        <ul>
          <li>Formatos soportados: PDF, JPG, PNG</li>
          <li>Tamaño máximo recomendado: 10MB</li>
          <li>El texto se extraerá automáticamente</li>
          <li>Los campos marcados con <span className="required-field">*</span> son obligatorios</li>
        </ul>
      </div>
    </section>
  )
}

export default SubirArchivo
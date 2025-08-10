import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addStyles, EditableMathField } from 'react-mathquill';
import "../styles/resolver-examen.css";

addStyles();

const MathSymbolsKeyboard = ({ onInsertSymbol }) => {
  const symbols = [
    { label: 'x²', latex: '^2', tooltip: 'Exponente' },
    { label: 'xₙ', latex: '_n', tooltip: 'Subíndice' },
    { label: '√x', latex: '\\sqrt{}', tooltip: 'Raíz cuadrada' },
    { label: '∫', latex: '\\int_{a}^{b}', tooltip: 'Integral' },
    { label: '∑', latex: '\\sum_{i=1}^{n}', tooltip: 'Sumatoria' },
    { label: 'α', latex: '\\alpha', tooltip: 'Alpha' },
    { label: 'β', latex: '\\beta', tooltip: 'Beta' },
    { label: 'θ', latex: '\\theta', tooltip: 'Theta' },
    { label: 'π', latex: '\\pi', tooltip: 'Pi' },
    { label: '∞', latex: '\\infty', tooltip: 'Infinito' },
    { label: '→', latex: '\\rightarrow', tooltip: 'Flecha derecha' },
    { label: '±', latex: '\\pm', tooltip: 'Más menos' },
    { label: '≠', latex: '\\neq', tooltip: 'No igual' },
    { label: '≤', latex: '\\leq', tooltip: 'Menor o igual' },
    { label: '≥', latex: '\\geq', tooltip: 'Mayor o igual' },
    { label: 'a/b', latex: '\\frac{a}{b}', tooltip: 'Fracción' },
  ];

  return (
    <div className="math-keyboard">
      {symbols.map((sym, index) => (
        <button
          key={index}
          type="button" 
          onClick={() => onInsertSymbol(sym.latex)}
          className="symbol-btn"
          title={sym.tooltip}
        >
          {sym.label}
        </button>
      ))}
    </div>
  );
};

const ResuelveExamen = () => {
  const [temas, setTemas] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [selectedTema, setSelectedTema] = useState("");
  const [selectedExamen, setSelectedExamen] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeMathFields, setActiveMathFields] = useState({});
  const navigate = useNavigate();

  // Cargar temas al montar el componente
  useEffect(() => {
    const cargarTemas = async () => {
      try {
        const response = await fetch('http://GreatFiend.pythonanywhere.com/obtener-temas');
        if (!response.ok) throw new Error('Error al cargar temas');
        const data = await response.json();
        setTemas(data);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarTemas();
  }, []);

  // Cargar exámenes cuando se selecciona un tema
  useEffect(() => {
    const cargarExamenes = async () => {
      if (!selectedTema) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://GreatFiend.pythonanywhere.com/estadisticas/examenes-detallados');
        if (!response.ok) throw new Error('Error al cargar exámenes');

        const data = await response.json();
        const examenesFiltrados = data.filter(examen => examen.id_tema === parseInt(selectedTema));
        setExamenes(examenesFiltrados);

        setSelectedExamen("");
        setPreguntas([]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    cargarExamenes();
  }, [selectedTema]);

  // Cargar preguntas y respuestas cuando se selecciona un examen
  useEffect(() => {
    const cargarPreguntasYRespuestas = async () => {
      if (!selectedExamen) return;

      setIsLoading(true);
      setError(null);

      try {
        // Cargar preguntas del examen
        const preguntasResponse = await fetch(`http://GreatFiend.pythonanywhere.com/descargar-examen/${selectedExamen}`);
        if (!preguntasResponse.ok) throw new Error('Error al cargar preguntas');
        const preguntasData = await preguntasResponse.json();

        // Inicializar objeto de respuestas vacías
        const respuestasIniciales = preguntasData.preguntas.reduce((acc, pregunta) => {
          acc[pregunta.id_pregunta] = "";
          return acc;
        }, {});

        // Cargar respuestas existentes (con manejo de errores)
        try {
          const respuestasResponse = await fetch(`http://GreatFiend.pythonanywhere.com/obtener-respuestas/${selectedExamen}`);
          if (respuestasResponse.ok) {
            const respuestasData = await respuestasResponse.json();

            // Procesar la estructura bidimensional para encontrar respuestas correctas
            Object.keys(respuestasData).forEach(idPregunta => {
              const respuestasPregunta = respuestasData[idPregunta];
              const respuestaCorrecta = Object.values(respuestasPregunta).find(
                respuesta => respuesta.es_correcta === true
              );

              if (respuestaCorrecta && respuestasIniciales.hasOwnProperty(idPregunta)) {
                respuestasIniciales[idPregunta] = respuestaCorrecta.contenido || "";
              }
            });
          }
        } catch (err) {
          console.log("Error al cargar respuestas existentes:", err);
        }

        setPreguntas(preguntasData.preguntas || []);
        setRespuestas(respuestasIniciales);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    cargarPreguntasYRespuestas();
  }, [selectedExamen]);

  const handleTemaChange = (e) => {
    setSelectedTema(e.target.value);
  };

  const handleExamenChange = (e) => {
    setSelectedExamen(e.target.value);
  };

  const handleRespuestaChange = (idPregunta, mathField) => {
    setActiveMathFields(prev => ({ ...prev, [idPregunta]: mathField }));
    setRespuestas(prev => ({
      ...prev,
      [idPregunta]: mathField.latex()
    }));
  };

  const handleInsertSymbol = (idPregunta, latex) => {
    const mathField = activeMathFields[idPregunta];
    if (mathField) {
      mathField.write(latex);
      mathField.focus();
    }
  };

  // Función para prevenir el submit con Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const respuestasArray = Object.entries(respuestas).map(([id_pregunta, contenido]) => ({
        id_pregunta: parseInt(id_pregunta),
        contenido,
        es_correcta: 1
      }));

      const response = await fetch('http://GreatFiend.pythonanywhere.com/guardar-respuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_examen: selectedExamen,
          respuestas: respuestasArray
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar las respuestas');
      }

      setSuccessMessage("¡Respuestas guardadas correctamente!");
      setTimeout(() => navigate('/historial'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="exam-generator">
      <div className="generator-form">
        <div className="form-section">
          <h3>Resolver Examen</h3>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <div className="form-group">
              <label htmlFor="id_tema">Seleccionar Tema</label>
              <select
                id="id_tema"
                name="id_tema"
                className="form-select"
                value={selectedTema}
                onChange={handleTemaChange}
                required
                disabled={isLoading}
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
              <label htmlFor="id_examen">Seleccionar Examen</label>
              <select
                id="id_examen"
                name="id_examen"
                className="form-select"
                value={selectedExamen}
                onChange={handleExamenChange}
                required
                disabled={isLoading || !selectedTema}
              >
                <option value="">{examenes.length > 0 ? "Seleccione un examen..." : "No hay exámenes para este tema"}</option>
                {examenes.map(examen => (
                  <option key={examen.id_examen} value={examen.id_examen}>
                    {examen.titulo} ({examen.fecha_creacion})
                  </option>
                ))}
              </select>
            </div>

             {preguntas.map((pregunta, index) => (
              <div key={pregunta.id_pregunta} className="question-item">
                <div className="question-text">
                  <strong>Pregunta {index + 1}:</strong>
                  <div className="math-expression">
                    {pregunta.enunciado}
                  </div>
                </div>
                <div className="answer-input">
                  <label htmlFor={`respuesta-${pregunta.id_pregunta}`}>Tu respuesta:</label>
                  <EditableMathField
                    id={`respuesta-${pregunta.id_pregunta}`}
                    className="mathquill-input"
                    latex={respuestas[pregunta.id_pregunta] || ""}
                    onChange={(mathField) => handleRespuestaChange(pregunta.id_pregunta, mathField)}
                    config={{
                      autoCommands: 'sqrt sum int pi theta alpha beta gamma delta epsilon',
                      autoOperatorNames: 'sin cos tan log ln'
                    }}
                  />
                  <MathSymbolsKeyboard 
                    onInsertSymbol={(latex) => handleInsertSymbol(pregunta.id_pregunta, latex)} 
                  />
                </div>
              </div>
            ))}

             {preguntas.length > 0 && (
              <div className="form-buttons">
                <button
                  type="submit"
                  className="generate-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    "Guardar Respuestas"
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="preview-section">
        <div className="preview-header">
          <h3>Instrucciones</h3>
        </div>

        <div className="exam-instructions">
          <ol>
            <li>Selecciona un tema de la lista desplegable</li>
            <li>Elige el examen que deseas resolver</li>
            <li>Lee cuidadosamente cada pregunta</li>
            <li>Escribe tu respuesta en el espacio proporcionado</li>
            <li>Usa el teclado matemático para insertar símbolos especiales</li>
            <li>Haz clic en "Guardar Respuestas" cuando hayas terminado</li>
          </ol>

          <div className="tips">
            <h4>Consejos:</h4>
            <ul>
              <li>Revisa bien las preguntas antes de responder</li>
              <li>Para problemas matemáticos, muestra todo tu procedimiento</li>
              <li>Puedes usar el teclado matemático para símbolos complejos</li>
              <li>Puedes guardar y volver más tarde si necesitas tiempo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResuelveExamen;
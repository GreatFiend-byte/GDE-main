import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Layouts
import MainLayout from "./layouts/MainLayout"

// Pages
import SubirArchivo from "./pages/SubirArchivo"
import Historial from "./pages/Historial"
import GenerarExamen from "./pages/GenerarExamen"
import Estadisticas from "./pages/Estadisticas"
import ResuelveExamen from "./pages/ResuelveExamen" 

// Styles
import "./styles/global.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<SubirArchivo />} />
          <Route path="subir-archivo" element={<SubirArchivo />} />
          <Route path="historial" element={<Historial />} />
          <Route path="generar-examen" element={<GenerarExamen />} />
          <Route path="resolver-examen" element={<ResuelveExamen />} />
          <Route path="estadisticas" element={<Estadisticas />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
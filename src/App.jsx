import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import AdminPage from "./pages/AdminPage"
import HomePage from "./pages/HomePage"

const RutaAdmin = ({ children }) => {
  const token = localStorage.getItem("token")
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null")
  if (!token || !usuario || usuario.rol !== "ADMINISTRADOR") {
    return <Navigate to="/" replace />
  }
  return children
}

const RutaUsuario = ({ children }) => {
  const token = localStorage.getItem("token")
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null")
  if (!token || !usuario) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/admin" element={<RutaAdmin><AdminPage /></RutaAdmin>} />
        <Route path="/home" element={<RutaUsuario><HomePage /></RutaUsuario>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

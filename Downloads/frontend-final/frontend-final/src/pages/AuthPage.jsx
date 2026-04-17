import { useState } from "react"
import Login from "../components/Login"
import Registro from "../components/Registro"

export default function AuthPage() {
  const [modo, setModo] = useState("login")

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Georgia, serif",
      background: "#f5f0e8"
    }}>

      {/* Panel izquierdo */}
      <div style={{
        width: "420px",
        minHeight: "100vh",
        background: "#1a1208",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        flexShrink: 0
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <svg width="60" height="70" viewBox="0 0 60 70">
              <ellipse cx="30" cy="35" rx="12" ry="20" fill="none" stroke="#c9a84c" strokeWidth="1"/>
              <ellipse cx="18" cy="40" rx="9" ry="14" fill="none" stroke="#c9a84c" strokeWidth="1" transform="rotate(-30 18 40)"/>
              <ellipse cx="42" cy="40" rx="9" ry="14" fill="none" stroke="#c9a84c" strokeWidth="1" transform="rotate(30 42 40)"/>
              <circle cx="30" cy="18" r="3" fill="#c9a84c"/>
            </svg>
          </div>

          <h1 style={{ color: "#c9a84c", fontSize: "2.2rem", margin: "0 0 0.3rem", letterSpacing: "3px" }}>
            LA MAISON
          </h1>
          <p style={{ color: "#6a5020", fontSize: "0.7rem", letterSpacing: "5px", margin: "0 0 2rem" }}>
            RESTAURANT
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <div style={{ height: "0.5px", background: "#3a2a10", flex: 1 }}/>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", border: "1px solid #c9a84c" }}/>
            <div style={{ height: "0.5px", background: "#3a2a10", flex: 1 }}/>
          </div>

          <p style={{ color: "#6a5020", fontStyle: "italic", fontSize: "0.95rem", lineHeight: "1.8", margin: 0 }}>
            Una experiencia única<br/>en cada visita
          </p>

          <div style={{ marginTop: "3rem", color: "#3a2a10", fontSize: "0.75rem", letterSpacing: "1px" }}>
            <p style={{ margin: "0 0 4px" }}>Medellín, Colombia</p>
            <p style={{ margin: 0 }}>Reservas desde 1998</p>
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "16px",
          border: "0.5px solid #d4c5a0",
          padding: "2.5rem"
        }}>

          {/* Tabs */}
          <div style={{
            display: "flex",
            background: "#f5f0e8",
            borderRadius: "8px",
            padding: "4px",
            marginBottom: "2rem"
          }}>
            <button
              onClick={() => setModo("login")}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                fontWeight: modo === "login" ? "700" : "400",
                background: modo === "login" ? "#1a1208" : "transparent",
                color: modo === "login" ? "#c9a84c" : "#8a8a8a",
                transition: "all 0.2s"
              }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setModo("registro")}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                fontWeight: modo === "registro" ? "700" : "400",
                background: modo === "registro" ? "#1a1208" : "transparent",
                color: modo === "registro" ? "#c9a84c" : "#8a8a8a",
                transition: "all 0.2s"
              }}
            >
              Registrarse
            </button>
          </div>

          {modo === "login" ? <Login /> : <Registro onRegistrado={() => setModo("login")} />}
        </div>
      </div>

    </div>
  )
}
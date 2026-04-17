import { useState, useEffect } from "react"
import api from "../api/axios"

export default function HomePage() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas")
  const [carrito, setCarrito] = useState([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [tipoEntrega, setTipoEntrega] = useState("domicilio")
  const [direccion, setDireccion] = useState("")
  const [mesa, setMesa] = useState("")
  const [contacto, setContacto] = useState("")
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null")

  useEffect(() => {
    api.get("/productos").then(res => setProductos(res.data)).catch(console.error)
    api.get("/categorias/activas").then(res => setCategorias(res.data)).catch(console.error)
  }, [])

  const productosFiltrados = categoriaSeleccionada === "todas"
    ? productos
    : productos.filter(p => p.categoriaId === categoriaSeleccionada)

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id)
      if (existe) return prev.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p)
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const eliminarDelCarrito = (id) => setCarrito(prev => prev.filter(p => p.id !== id))
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

  const abrirModal = () => {
    if (carrito.length === 0) return
    setCarritoAbierto(false)
    setModalAbierto(true)
  }

  const confirmarPedido = async () => {
    if (!contacto) return alert("Por favor ingresa un número de contacto")
    if (tipoEntrega === "domicilio" && !direccion) return alert("Por favor ingresa una dirección")
    if (tipoEntrega === "presencial" && !mesa) return alert("Por favor ingresa el número de mesa")

    try {
      await api.post("/pedidos", {
        usuario: { nombre: usuario?.nombre, email: usuario?.correo },
        items: carrito.map(p => ({ nombre: p.nombre, precio: p.precio, cantidad: p.cantidad })),
        total
      })
    } catch (error) { console.error("Error guardando pedido", error) }

    let mensaje = "Hola, quiero pedir:%0A"
    carrito.forEach(p => { mensaje += `${p.nombre} x${p.cantidad} - $${(p.precio * p.cantidad).toLocaleString()}%0A` })
    mensaje += `Total: $${total.toLocaleString()}%0A`
    mensaje += tipoEntrega === "domicilio" ? `Dirección: ${direccion}%0A` : `Mesa: ${mesa}%0A`
    mensaje += `Contacto: ${contacto}`

    setModalAbierto(false)
    setCarrito([])
    setDireccion(""); setMesa(""); setContacto("")
    window.open(`https://wa.me/573175397038?text=${mensaje}`, "_blank")
  }

  const handleLogout = () => { localStorage.clear(); window.location.href = "/" }

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "0.5px solid #3a2a10",
    borderRadius: "6px", fontFamily: "Georgia, serif", fontSize: "0.9rem",
    background: "#0e0c08", color: "#f0e6d0", outline: "none", boxSizing: "border-box"
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0e0c08", color: "#f0e6d0", fontFamily: "Georgia, serif" }}>

      <header style={{ background: "#1a1208", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2e2416" }}>
        <div style={{ fontSize: "1.6rem", color: "#c9a84c", fontStyle: "italic", letterSpacing: "3px" }}>La Maison</div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ color: "#8a8a8a", fontSize: "0.85rem" }}>Hola, {usuario?.nombre}</span>
          <button onClick={() => setCarritoAbierto(!carritoAbierto)}
            style={{ background: "none", border: "1px solid #c9a84c", color: "#c9a84c", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif" }}>
            Carrito ({carrito.reduce((acc, p) => acc + p.cantidad, 0)})
          </button>
          <button onClick={handleLogout}
            style={{ background: "none", border: "1px solid #3a2a10", color: "#8a8a8a", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif" }}>
            Salir
          </button>
        </div>
      </header>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "60px 20px 40px", borderBottom: "1px solid #2e2416" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#c9a84c", fontStyle: "italic", margin: "0 0 10px" }}>Nuestro Menú</h1>
        <p style={{ color: "#8a8a8a", fontSize: "0.95rem" }}>Selecciona tus platos y realiza tu pedido</p>
      </div>

      {/* ── Filtros por categoría ── */}
      {categorias.length > 0 && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 20px 0", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setCategoriaSeleccionada("todas")}
            style={{
              padding: "8px 20px", borderRadius: "999px", fontFamily: "Georgia, serif", fontSize: "0.85rem", cursor: "pointer", letterSpacing: "0.5px",
              background: categoriaSeleccionada === "todas" ? "#c9a84c" : "none",
              color: categoriaSeleccionada === "todas" ? "#1a1208" : "#8a8a8a",
              border: categoriaSeleccionada === "todas" ? "1px solid #c9a84c" : "1px solid #3a2a10",
              fontWeight: categoriaSeleccionada === "todas" ? "700" : "400",
              transition: "all 0.2s"
            }}>
            Todas
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSeleccionada(cat.id)}
              style={{
                padding: "8px 20px", borderRadius: "999px", fontFamily: "Georgia, serif", fontSize: "0.85rem", cursor: "pointer", letterSpacing: "0.5px",
                background: categoriaSeleccionada === cat.id ? "#c9a84c" : "none",
                color: categoriaSeleccionada === cat.id ? "#1a1208" : "#8a8a8a",
                border: categoriaSeleccionada === cat.id ? "1px solid #c9a84c" : "1px solid #3a2a10",
                fontWeight: categoriaSeleccionada === cat.id ? "700" : "400",
                transition: "all 0.2s"
              }}>
              {cat.nombre}
            </button>
          ))}
        </div>
      )}

      {/* ── Grid de productos ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {productosFiltrados.length === 0 && (
          <p style={{ color: "#8a8a8a", gridColumn: "1/-1", textAlign: "center", fontStyle: "italic" }}>
            {categoriaSeleccionada === "todas" ? "No hay productos disponibles aún." : "No hay productos en esta categoría."}
          </p>
        )}
        {productosFiltrados.map(p => (
          <div key={p.id} style={{ background: "#1a1208", borderRadius: "12px", overflow: "hidden", border: "1px solid #2e2416" }}>
            <img src={p.imagen || "https://via.placeholder.com/280x180?text=Sin+imagen"} alt={p.nombre}
              style={{ width: "100%", height: "180px", objectFit: "cover" }} />
            <div style={{ padding: "16px" }}>
              {p.categoriaNombre && (
                <span style={{ fontSize: "0.7rem", color: "#c9a84c", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>
                  {p.categoriaNombre}
                </span>
              )}
              <h3 style={{ margin: "4px 0 6px", color: "#f0e6d0", fontSize: "1.1rem" }}>{p.nombre}</h3>
              <p style={{ color: "#8a8a8a", fontSize: "0.85rem", margin: "0 0 12px" }}>{p.descripcion}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#c9a84c", fontSize: "1.1rem", fontWeight: "bold" }}>
                  ${p.precio.toLocaleString()}
                </span>
                <button onClick={() => agregarAlCarrito(p)}
                  style={{ background: "#c9a84c", color: "#1a1208", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: "bold" }}>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Panel carrito ── */}
      <div style={{ position: "fixed", top: 0, right: carritoAbierto ? 0 : "-400px", width: "360px", height: "100%", background: "#1a1208", borderLeft: "1px solid #2e2416", transition: "right 0.3s", display: "flex", flexDirection: "column", zIndex: 1000 }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #2e2416", display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, color: "#c9a84c" }}>Tu Pedido</h3>
          <button onClick={() => setCarritoAbierto(false)} style={{ background: "none", border: "none", color: "#8a8a8a", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {carrito.length === 0 && <p style={{ color: "#8a8a8a", textAlign: "center", marginTop: "40px" }}>Tu carrito está vacío</p>}
          {carrito.map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #2e2416" }}>
              <div>
                <p style={{ margin: "0 0 4px", color: "#f0e6d0", fontSize: "0.9rem" }}>{p.nombre} x{p.cantidad}</p>
                <p style={{ margin: 0, color: "#c9a84c", fontSize: "0.85rem" }}>${(p.precio * p.cantidad).toLocaleString()}</p>
              </div>
              <button onClick={() => eliminarDelCarrito(p.id)} style={{ background: "none", border: "none", color: "#a32d2d", cursor: "pointer", fontSize: "1rem" }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderTop: "1px solid #2e2416" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ color: "#8a8a8a" }}>Total</span>
            <span style={{ color: "#c9a84c", fontWeight: "bold", fontSize: "1.1rem" }}>${total.toLocaleString()}</span>
          </div>
          <button onClick={abrirModal} disabled={carrito.length === 0}
            style={{ width: "100%", padding: "12px", background: carrito.length === 0 ? "#2e2416" : "#25D366", color: carrito.length === 0 ? "#8a8a8a" : "white", border: "none", borderRadius: "6px", fontFamily: "Georgia, serif", fontSize: "1rem", fontWeight: "bold", cursor: carrito.length === 0 ? "not-allowed" : "pointer" }}>
            Pedir por WhatsApp
          </button>
        </div>
      </div>

      {/* ── Modal confirmación ── */}
      {modalAbierto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ background: "#1a1208", borderRadius: "16px", border: "1px solid #2e2416", padding: "36px", width: "100%", maxWidth: "440px" }}>
            <h2 style={{ color: "#c9a84c", margin: "0 0 6px", fontSize: "1.3rem", fontStyle: "italic" }}>Confirmar pedido</h2>
            <p style={{ color: "#6a5020", fontSize: "0.85rem", margin: "0 0 24px" }}>Total: <strong style={{ color: "#c9a84c" }}>${total.toLocaleString()}</strong></p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              {["domicilio", "presencial"].map(t => (
                <button key={t} onClick={() => setTipoEntrega(t)} style={{ flex: 1, padding: "10px", border: `1px solid ${tipoEntrega === t ? "#c9a84c" : "#3a2a10"}`, borderRadius: "6px", background: tipoEntrega === t ? "#2e2416" : "none", color: tipoEntrega === t ? "#c9a84c" : "#6a5020", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.85rem", letterSpacing: "1px" }}>
                  {t === "domicilio" ? "Domicilio" : "Presencial"}
                </button>
              ))}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>
                {tipoEntrega === "domicilio" ? "DIRECCIÓN DE ENTREGA" : "NÚMERO DE MESA"}
              </label>
              {tipoEntrega === "domicilio"
                ? <input style={inputStyle} placeholder="Ej: Calle 10 # 5-20, Apto 301" value={direccion} onChange={e => setDireccion(e.target.value)} />
                : <input style={inputStyle} placeholder="Ej: Mesa 4" value={mesa} onChange={e => setMesa(e.target.value)} />}
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>NÚMERO DE CONTACTO</label>
              <input style={inputStyle} placeholder="Ej: 3001234567" value={contacto} onChange={e => setContacto(e.target.value)} type="tel" />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setModalAbierto(false)}
                style={{ flex: 1, padding: "12px", background: "none", border: "1px solid #3a2a10", color: "#8a8a8a", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif" }}>
                Cancelar
              </button>
              <button onClick={confirmarPedido}
                style={{ flex: 2, padding: "12px", background: "#25D366", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "1rem", fontWeight: "bold" }}>
                Confirmar y pedir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

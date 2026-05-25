import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pestana, setPestana] = useState("productos");
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "", imagen: "", categoria: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mensajePedido, setMensajePedido] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    else {
      cargarProductos();
      cargarPedidos();
      cargarUsuarios();
    }
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await api.get("/productos");
      setProductos(res.data);
    } catch (error) {
      console.error("Error cargando productos", error);
    }
  };

  const cargarPedidos = async () => {
    try {
      const res = await api.get("/pedidos");
      setPedidos(res.data);
    } catch (error) {
      console.error("Error cargando pedidos", error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/productos/${editandoId}`, form);
        setMensaje("Producto actualizado ✅");
      } else {
        await api.post("/productos", form);
        setMensaje("Producto creado ✅");
      }
      setForm({ nombre: "", descripcion: "", precio: "", imagen: "", categoria: "" });
      setEditandoId(null);
      cargarProductos();
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      setMensaje(error.response?.data?.error || "Error al guardar");
    }
  };

  const handleEditar = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria
    });
    setEditandoId(producto.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await api.delete(`/productos/${id}`);
    setMensaje("Producto eliminado ✅");
    cargarProductos();
    setTimeout(() => setMensaje(""), 3000);
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/pedidos/${id}`, { estado });
      setMensajePedido("Estado actualizado correctamente");
      cargarPedidos();
      setTimeout(() => setMensajePedido(""), 3000);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        setMensajePedido("No tienes permisos para realizar esta acción.");
      } else {
        setMensajePedido(err.response?.data?.error || "Error inesperado al actualizar el estado");
      }
      setTimeout(() => setMensajePedido(""), 4000);
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    try {
      await api.patch(`/admin/users/${id}/role?rol=${nuevoRol}`);
      cargarUsuarios();
    } catch (err) {
      console.error("Error cambiando rol", err);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      cargarUsuarios();
    } catch (err) {
      console.error("Error eliminando usuario", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "0.5px solid #3a2a10",
    borderRadius: "6px", fontFamily: "Georgia, serif", fontSize: "0.9rem",
    background: "#1a1208", color: "#f0e6d0", outline: "none", boxSizing: "border-box"
  };

  const estadoColor = {
    "pendiente": "#c9a84c",
    "en proceso": "#3498db",
    "entregado": "#27ae60"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0e0c08", color: "#f0e6d0", fontFamily: "Georgia, serif" }}>

      <header style={{ background: "#1a1208", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2e2416" }}>
        <div style={{ fontSize: "1.6rem", color: "#c9a84c", fontStyle: "italic", letterSpacing: "3px" }}>La Maison</div>
        <span style={{ color: "#6a5020", fontSize: "0.8rem", letterSpacing: "2px" }}>PANEL ADMINISTRADOR</span>
        <button onClick={handleLogout} style={{ background: "none", border: "1px solid #a32d2d", color: "#a32d2d", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif" }}>
          Cerrar sesión
        </button>
      </header>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "40px", borderBottom: "1px solid #2e2416" }}>
          {[
            { key: "productos", label: `PRODUCTOS (${productos.length})` },
            { key: "pedidos", label: `PEDIDOS (${pedidos.length})` },
            { key: "usuarios", label: `USUARIOS (${usuarios.length})` }
          ].map(t => (
            <button key={t.key} onClick={() => setPestana(t.key)} style={{
              padding: "12px 30px", background: "none", border: "none",
              borderBottom: pestana === t.key ? "2px solid #c9a84c" : "2px solid transparent",
              color: pestana === t.key ? "#c9a84c" : "#6a5020",
              cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.85rem", letterSpacing: "1px"
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Pestaña Productos */}
        {pestana === "productos" && (
          <>
            <div style={{ background: "#1a1208", borderRadius: "12px", border: "1px solid #2e2416", padding: "30px", marginBottom: "40px" }}>
              <h2 style={{ color: "#c9a84c", margin: "0 0 24px", fontSize: "1.3rem", letterSpacing: "1px" }}>
                {editandoId ? "Editar producto" : "Agregar producto"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>NOMBRE</label>
                    <input style={inputStyle} placeholder="Ej: Filete de res" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>CATEGORÍA</label>
                    <input style={inputStyle} placeholder="Ej: Carnes" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} />
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>DESCRIPCIÓN</label>
                  <input style={inputStyle} placeholder="Descripción del plato" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>PRECIO (COP)</label>
                    <input style={inputStyle} type="number" placeholder="Ej: 35000" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>URL DE IMAGEN</label>
                    <input style={inputStyle} placeholder="https://..." value={form.imagen} onChange={e => setForm({ ...form, imagen: e.target.value })} />
                  </div>
                </div>
                {form.imagen && (
                  <div style={{ marginBottom: "20px" }}>
                    <img src={form.imagen} alt="preview" style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #2e2416" }} />
                  </div>
                )}
                {mensaje && (
                  <p style={{ color: "#c9a84c", fontSize: "0.85rem", marginBottom: "16px", textAlign: "center", background: "#2e2416", padding: "10px", borderRadius: "6px" }}>
                    {mensaje}
                  </p>
                )}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="submit" style={{ flex: 1, padding: "12px", background: "#c9a84c", color: "#1a1208", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "1rem", fontWeight: "700", letterSpacing: "1px" }}>
                    {editandoId ? "ACTUALIZAR" : "AGREGAR"}
                  </button>
                  {editandoId && (
                    <button type="button" onClick={() => { setEditandoId(null); setForm({ nombre: "", descripcion: "", precio: "", imagen: "", categoria: "" }); }}
                      style={{ padding: "12px 24px", background: "none", color: "#8a8a8a", border: "1px solid #3a2a10", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif" }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div style={{ background: "#1a1208", borderRadius: "12px", border: "1px solid #2e2416", overflow: "hidden" }}>
              <div style={{ padding: "20px 30px", borderBottom: "1px solid #2e2416" }}>
                <h2 style={{ color: "#c9a84c", margin: 0, fontSize: "1.2rem", letterSpacing: "1px" }}>PRODUCTOS ({productos.length})</h2>
              </div>
              {productos.length === 0 ? (
                <p style={{ color: "#6a5020", textAlign: "center", padding: "40px", fontStyle: "italic" }}>No hay productos aún.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #2e2416" }}>
                      {["Imagen", "Nombre", "Categoría", "Precio", "Acciones"].map(h => (
                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.75rem", color: "#6a5020", letterSpacing: "1px" }}>{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(p => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #2e2416" }}>
                        <td style={{ padding: "14px 20px" }}>
                          <img src={p.imagen || "https://via.placeholder.com/60"} alt={p.nombre} style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "6px" }} />
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <p style={{ margin: "0 0 4px", color: "#f0e6d0" }}>{p.nombre}</p>
                          <p style={{ margin: 0, color: "#6a5020", fontSize: "0.8rem" }}>{p.descripcion}</p>
                        </td>
                        <td style={{ padding: "14px 20px", color: "#8a8a8a", fontSize: "0.85rem" }}>{p.categoria}</td>
                        <td style={{ padding: "14px 20px", color: "#c9a84c", fontWeight: "bold" }}>${Number(p.precio).toLocaleString()}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <button onClick={() => handleEditar(p)} style={{ background: "none", border: "1px solid #c9a84c", color: "#c9a84c", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontFamily: "Georgia, serif", marginRight: "8px" }}>Editar</button>
                          <button onClick={() => handleEliminar(p.id)} style={{ background: "none", border: "1px solid #a32d2d", color: "#a32d2d", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontFamily: "Georgia, serif" }}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Pestaña Pedidos */}
        {pestana === "pedidos" && (
          <div style={{ background: "#1a1208", borderRadius: "12px", border: "1px solid #2e2416", overflow: "hidden" }}>
            <div style={{ padding: "20px 30px", borderBottom: "1px solid #2e2416" }}>
              <h2 style={{ color: "#c9a84c", margin: 0, fontSize: "1.2rem", letterSpacing: "1px" }}>HISTORIAL DE PEDIDOS ({pedidos.length})</h2>
              {mensajePedido && (
                <p style={{
                  color: mensajePedido.startsWith("No tienes") || mensajePedido.startsWith("Error") ? "#a32d2d" : "#27ae60",
                  fontSize: "0.85rem", marginTop: "12px", marginBottom: 0,
                  background: mensajePedido.startsWith("No tienes") || mensajePedido.startsWith("Error") ? "#2c0e0e" : "#0e2c14",
                  padding: "8px 12px", borderRadius: "6px"
                }}>
                  {mensajePedido}
                </p>
              )}
            </div>
            {pedidos.length === 0 ? (
              <p style={{ color: "#6a5020", textAlign: "center", padding: "40px", fontStyle: "italic" }}>No hay pedidos aún.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #2e2416" }}>
                    {["Cliente", "Pedido", "Total", "Estado", "Fecha"].map(h => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.75rem", color: "#6a5020", letterSpacing: "1px" }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #2e2416" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <p style={{ margin: "0 0 4px", color: "#f0e6d0" }}>{p.usuario?.nombre}</p>
                        <p style={{ margin: 0, color: "#6a5020", fontSize: "0.8rem" }}>{p.usuario?.email}</p>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        {p.items?.map((item, i) => (
                          <p key={i} style={{ margin: "0 0 4px", color: "#8a8a8a", fontSize: "0.85rem" }}>
                            {item.nombre} x{item.cantidad}
                          </p>
                        ))}
                      </td>
                      <td style={{ padding: "14px 20px", color: "#c9a84c", fontWeight: "bold" }}>${p.total?.toLocaleString()}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <select value={p.estado} onChange={e => cambiarEstado(p.id, e.target.value)}
                          style={{ background: "#0e0c08", color: estadoColor[p.estado] || "#c9a84c", border: `1px solid ${estadoColor[p.estado] || "#c9a84c"}`, padding: "6px 10px", borderRadius: "4px", fontFamily: "Georgia, serif", cursor: "pointer" }}>
                          <option value="pendiente">Pendiente</option>
                          <option value="en proceso">En proceso</option>
                          <option value="entregado">Entregado</option>
                        </select>
                      </td>
                      <td style={{ padding: "14px 20px", color: "#6a5020", fontSize: "0.85rem" }}>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Pestaña Usuarios */}
        {pestana === "usuarios" && (
          <div style={{ background: "#1a1208", borderRadius: "12px", border: "1px solid #2e2416", overflow: "hidden" }}>
            <div style={{ padding: "20px 30px", borderBottom: "1px solid #2e2416" }}>
              <h2 style={{ color: "#c9a84c", margin: 0, fontSize: "1.2rem", letterSpacing: "1px" }}>USUARIOS ({usuarios.length})</h2>
            </div>
            {usuarios.length === 0 ? (
              <p style={{ color: "#6a5020", textAlign: "center", padding: "40px", fontStyle: "italic" }}>No hay usuarios.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #2e2416" }}>
                    {["Nombre", "Correo", "Rol", "Estado", "Acciones"].map(h => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.75rem", color: "#6a5020", letterSpacing: "1px" }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #2e2416" }}>
                      <td style={{ padding: "14px 20px", color: "#f0e6d0" }}>{u.nombre}</td>
                      <td style={{ padding: "14px 20px", color: "#8a8a8a", fontSize: "0.85rem" }}>{u.correo}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ color: u.rol === "ADMINISTRADOR" ? "#c9a84c" : "#8a8a8a", fontSize: "0.85rem" }}>{u.rol}</span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ color: u.activo ? "#27ae60" : "#a32d2d", fontSize: "0.85rem" }}>{u.activo ? "Activo" : "Inactivo"}</span>
                      </td>
                      <td style={{ padding: "14px 20px", display: "flex", gap: "8px" }}>
                        <button onClick={() => cambiarRol(u.id, u.rol === "ADMINISTRADOR" ? "CLIENTE" : "ADMINISTRADOR")}
                          style={{ background: "none", border: "1px solid #c9a84c", color: "#c9a84c", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.8rem" }}>
                          {u.rol === "ADMINISTRADOR" ? "→ Cliente" : "→ Admin"}
                        </button>
                        <button onClick={() => eliminarUsuario(u.id)}
                          style={{ background: "none", border: "1px solid #a32d2d", color: "#a32d2d", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.8rem" }}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminPage;
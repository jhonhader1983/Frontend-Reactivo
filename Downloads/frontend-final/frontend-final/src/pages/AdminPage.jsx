import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const inputStyle = {
  width: "100%", padding: "10px 14px", border: "0.5px solid #3a2a10",
  borderRadius: "6px", fontFamily: "Georgia, serif", fontSize: "0.9rem",
  background: "#1a1208", color: "#f0e6d0", outline: "none", boxSizing: "border-box"
};
const btnBase = { background: "none", border: "1px solid #c9a84c", color: "#c9a84c", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontFamily: "Georgia, serif", marginRight: "8px" };
const btnDanger = { ...btnBase, border: "1px solid #a32d2d", color: "#a32d2d", marginRight: 0 };
const estadoColor = { "pendiente": "#c9a84c", "en proceso": "#3498db", "entregado": "#27ae60" };

function TabCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "", imagenUrl: "", activa: true });
  const [editandoId, setEditandoId] = useState(null);
  const [msg, setMsg] = useState({ texto: "", error: false });

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try { const res = await api.get("/categorias"); setCategorias(res.data); }
    catch (e) { console.error(e); }
  };

  const mostrar = (texto, error = false) => {
    setMsg({ texto, error });
    setTimeout(() => setMsg({ texto: "", error: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return mostrar("El nombre es obligatorio", true);
    try {
      if (editandoId) { await api.put(`/categorias/${editandoId}`, form); mostrar("Categoría actualizada ✅"); }
      else { await api.post("/categorias", form); mostrar("Categoría creada ✅"); }
      setForm({ nombre: "", descripcion: "", imagenUrl: "", activa: true });
      setEditandoId(null);
      cargar();
    } catch (err) {
      mostrar(err.response?.data?.detail || err.response?.data?.message || "Error al guardar", true);
    }
  };

  const handleEditar = (cat) => {
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion || "", imagenUrl: cat.imagenUrl || "", activa: cat.activa });
    setEditandoId(cat.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try { await api.delete(`/categorias/${id}`); mostrar("Categoría eliminada ✅"); cargar(); }
    catch (err) { mostrar(err.response?.data?.detail || "No se puede eliminar: tiene productos asociados", true); }
  };

  const handleToggle = async (id) => {
    try { await api.patch(`/categorias/${id}/toggle`); cargar(); }
    catch (e) { console.error(e); }
  };

  return (
    <>
      <div style={{ background: "#1a1208", borderRadius: "12px", border: "1px solid #2e2416", padding: "30px", marginBottom: "40px" }}>
        <h2 style={{ color: "#c9a84c", margin: "0 0 24px", fontSize: "1.3rem", letterSpacing: "1px" }}>
          {editandoId ? "Editar categoría" : "Nueva categoría"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>NOMBRE *</label>
              <input style={inputStyle} placeholder="Ej: Sala" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>ESTADO</label>
              <select style={inputStyle} value={form.activa} onChange={e => setForm({ ...form, activa: e.target.value === "true" })}>
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>DESCRIPCIÓN</label>
            <input style={inputStyle} placeholder="Descripción opcional" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>URL DE IMAGEN</label>
            <input style={inputStyle} placeholder="https://..." value={form.imagenUrl} onChange={e => setForm({ ...form, imagenUrl: e.target.value })} />
          </div>
          {msg.texto && (
            <p style={{ color: msg.error ? "#a32d2d" : "#c9a84c", fontSize: "0.85rem", marginBottom: "16px", textAlign: "center", background: "#2e2416", padding: "10px", borderRadius: "6px" }}>
              {msg.texto}
            </p>
          )}
          <div style={{ display: "flex", gap: "12px" }}>
            <button type="submit" style={{ flex: 1, padding: "12px", background: "#c9a84c", color: "#1a1208", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "1rem", fontWeight: "700", letterSpacing: "1px" }}>
              {editandoId ? "ACTUALIZAR" : "AGREGAR"}
            </button>
            {editandoId && (
              <button type="button" onClick={() => { setEditandoId(null); setForm({ nombre: "", descripcion: "", imagenUrl: "", activa: true }); }}
                style={{ padding: "12px 24px", background: "none", color: "#8a8a8a", border: "1px solid #3a2a10", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif" }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: "#1a1208", borderRadius: "12px", border: "1px solid #2e2416", overflow: "hidden" }}>
        <div style={{ padding: "20px 30px", borderBottom: "1px solid #2e2416" }}>
          <h2 style={{ color: "#c9a84c", margin: 0, fontSize: "1.2rem", letterSpacing: "1px" }}>CATEGORÍAS ({categorias.length})</h2>
        </div>
        {categorias.length === 0 ? (
          <p style={{ color: "#6a5020", textAlign: "center", padding: "40px", fontStyle: "italic" }}>No hay categorías aún.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2e2416" }}>
                {["Nombre", "Descripción", "Estado", "Acciones"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.75rem", color: "#6a5020", letterSpacing: "1px" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categorias.map(cat => (
                <tr key={cat.id} style={{ borderBottom: "1px solid #2e2416" }}>
                  <td style={{ padding: "14px 20px", color: "#f0e6d0", fontWeight: "500" }}>{cat.nombre}</td>
                  <td style={{ padding: "14px 20px", color: "#8a8a8a", fontSize: "0.85rem" }}>{cat.descripcion || "—"}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "600", background: cat.activa ? "#0d2e1a" : "#2e0d0d", color: cat.activa ? "#27ae60" : "#a32d2d", border: `1px solid ${cat.activa ? "#27ae60" : "#a32d2d"}` }}>
                      {cat.activa ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleToggle(cat.id)} style={{ ...btnBase, fontSize: "0.8rem", padding: "4px 10px" }}>
                        {cat.activa ? "Desactivar" : "Activar"}
                      </button>
                      <button onClick={() => handleEditar(cat)} style={btnBase}>Editar</button>
                      <button onClick={() => handleEliminar(cat.id)} style={btnDanger}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pestana, setPestana] = useState("productos");
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "", imagen: "", categoriaId: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    else { cargarProductos(); cargarPedidos(); cargarUsuarios(); cargarCategorias(); }
  }, []);

  const cargarProductos = async () => { try { const r = await api.get("/productos"); setProductos(r.data); } catch (e) { console.error(e); } };
  const cargarPedidos   = async () => { try { const r = await api.get("/pedidos");   setPedidos(r.data);   } catch (e) { console.error(e); } };
  const cargarUsuarios  = async () => { try { const r = await api.get("/admin/users"); setUsuarios(r.data); } catch (e) { console.error(e); } };
  const cargarCategorias = async () => { try { const r = await api.get("/categorias"); setCategorias(r.data); } catch (e) { console.error(e); } };

  const mostrarMsg = (txt) => { setMensaje(txt); setTimeout(() => setMensaje(""), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoriaId) return mostrarMsg("Selecciona una categoría ❌");
    try {
      const payload = { ...form, precio: Number(form.precio) };
      if (editandoId) { await api.put(`/productos/${editandoId}`, payload); mostrarMsg("Producto actualizado ✅"); }
      else { await api.post("/productos", payload); mostrarMsg("Producto creado ✅"); }
      setForm({ nombre: "", descripcion: "", precio: "", imagen: "", categoriaId: "" });
      setEditandoId(null);
      cargarProductos();
    } catch (err) { mostrarMsg(err.response?.data?.detail || err.response?.data?.message || "Error al guardar ❌"); }
  };

  const handleEditar = (p) => {
    setForm({ nombre: p.nombre, descripcion: p.descripcion || "", precio: p.precio, imagen: p.imagen || "", categoriaId: p.categoriaId || "" });
    setEditandoId(p.id);
    setPestana("productos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await api.delete(`/productos/${id}`);
    mostrarMsg("Producto eliminado ✅");
    cargarProductos();
  };

  const cambiarEstado  = async (id, estado)   => { await api.put(`/pedidos/${id}`, { estado }); cargarPedidos(); };
  const cambiarRol     = async (id, nuevoRol)  => { try { await api.patch(`/admin/users/${id}/role?rol=${nuevoRol}`); cargarUsuarios(); } catch (e) { console.error(e); } };
  const eliminarUsuario = async (id)           => { if (!confirm("¿Eliminar este usuario?")) return; try { await api.delete(`/admin/users/${id}`); cargarUsuarios(); } catch (e) { console.error(e); } };
  const handleLogout   = () => { localStorage.removeItem("token"); localStorage.removeItem("usuario"); navigate("/"); };

  const tabs = [
    { key: "productos",  label: `PRODUCTOS (${productos.length})`  },
    { key: "categorias", label: `CATEGORÍAS (${categorias.length})` },
    { key: "pedidos",    label: `PEDIDOS (${pedidos.length})`    },
    { key: "usuarios",   label: `USUARIOS (${usuarios.length})`   },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0e0c08", color: "#f0e6d0", fontFamily: "Georgia, serif" }}>
      <header style={{ background: "#1a1208", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2e2416" }}>
        <div style={{ fontSize: "1.6rem", color: "#c9a84c", fontStyle: "italic", letterSpacing: "3px" }}>La Maison</div>
        <span style={{ color: "#6a5020", fontSize: "0.8rem", letterSpacing: "2px" }}>PANEL ADMINISTRADOR</span>
        <button onClick={handleLogout} style={{ background: "none", border: "1px solid #a32d2d", color: "#a32d2d", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif" }}>Cerrar sesión</button>
      </header>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", gap: "0", marginBottom: "40px", borderBottom: "1px solid #2e2416" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setPestana(t.key)} style={{ padding: "12px 30px", background: "none", border: "none", borderBottom: pestana === t.key ? "2px solid #c9a84c" : "2px solid transparent", color: pestana === t.key ? "#c9a84c" : "#6a5020", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.85rem", letterSpacing: "1px" }}>
              {t.label}
            </button>
          ))}
        </div>

        {pestana === "categorias" && <TabCategorias />}

        {pestana === "productos" && (
          <>
            <div style={{ background: "#1a1208", borderRadius: "12px", border: "1px solid #2e2416", padding: "30px", marginBottom: "40px" }}>
              <h2 style={{ color: "#c9a84c", margin: "0 0 24px", fontSize: "1.3rem", letterSpacing: "1px" }}>{editandoId ? "Editar producto" : "Agregar producto"}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>NOMBRE *</label>
                    <input style={inputStyle} placeholder="Ej: Sofá esquinero" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>CATEGORÍA *</label>
                    <select style={inputStyle} value={form.categoriaId} onChange={e => setForm({ ...form, categoriaId: e.target.value })} required>
                      <option value="">— Selecciona una categoría —</option>
                      {categorias.filter(c => c.activa).map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>DESCRIPCIÓN</label>
                  <input style={inputStyle} placeholder="Descripción del producto" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>PRECIO (COP) *</label>
                    <input style={inputStyle} type="number" placeholder="Ej: 1200000" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#6a5020", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>URL DE IMAGEN</label>
                    <input style={inputStyle} placeholder="https://..." value={form.imagen} onChange={e => setForm({ ...form, imagen: e.target.value })} />
                  </div>
                </div>
                {form.imagen && <div style={{ marginBottom: "20px" }}><img src={form.imagen} alt="preview" style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #2e2416" }} /></div>}
                {mensaje && <p style={{ color: mensaje.includes("❌") ? "#a32d2d" : "#c9a84c", fontSize: "0.85rem", marginBottom: "16px", textAlign: "center", background: "#2e2416", padding: "10px", borderRadius: "6px" }}>{mensaje}</p>}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="submit" style={{ flex: 1, padding: "12px", background: "#c9a84c", color: "#1a1208", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "1rem", fontWeight: "700", letterSpacing: "1px" }}>
                    {editandoId ? "ACTUALIZAR" : "AGREGAR"}
                  </button>
                  {editandoId && (
                    <button type="button" onClick={() => { setEditandoId(null); setForm({ nombre: "", descripcion: "", precio: "", imagen: "", categoriaId: "" }); }}
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
                        <td style={{ padding: "14px 20px", color: "#8a8a8a", fontSize: "0.85rem" }}>{p.categoriaNombre || "—"}</td>
                        <td style={{ padding: "14px 20px", color: "#c9a84c", fontWeight: "bold" }}>${Number(p.precio).toLocaleString()}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <button onClick={() => handleEditar(p)} style={btnBase}>Editar</button>
                          <button onClick={() => handleEliminar(p.id)} style={btnDanger}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {pestana === "pedidos" && (
          <div style={{ background: "#1a1208", borderRadius: "12px", border: "1px solid #2e2416", overflow: "hidden" }}>
            <div style={{ padding: "20px 30px", borderBottom: "1px solid #2e2416" }}>
              <h2 style={{ color: "#c9a84c", margin: 0, fontSize: "1.2rem", letterSpacing: "1px" }}>HISTORIAL DE PEDIDOS ({pedidos.length})</h2>
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
                        {p.items?.map((item, i) => <p key={i} style={{ margin: "0 0 4px", color: "#8a8a8a", fontSize: "0.85rem" }}>{item.nombre} x{item.cantidad}</p>)}
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
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

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
                      <td style={{ padding: "14px 20px" }}><span style={{ color: u.rol === "ADMINISTRADOR" ? "#c9a84c" : "#8a8a8a", fontSize: "0.85rem" }}>{u.rol}</span></td>
                      <td style={{ padding: "14px 20px" }}><span style={{ color: u.activo ? "#27ae60" : "#a32d2d", fontSize: "0.85rem" }}>{u.activo ? "Activo" : "Inactivo"}</span></td>
                      <td style={{ padding: "14px 20px", display: "flex", gap: "8px" }}>
                        <button onClick={() => cambiarRol(u.id, u.rol === "ADMINISTRADOR" ? "CLIENTE" : "ADMINISTRADOR")} style={{ ...btnBase, fontSize: "0.8rem", padding: "6px 12px" }}>
                          {u.rol === "ADMINISTRADOR" ? "→ Cliente" : "→ Admin"}
                        </button>
                        <button onClick={() => eliminarUsuario(u.id)} style={{ ...btnDanger, fontSize: "0.8rem", padding: "6px 12px" }}>Eliminar</button>
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

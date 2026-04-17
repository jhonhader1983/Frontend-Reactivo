import api from "./axios";

// Obtener todas
export const getCategorias = () => api.get("/categorias");

// Crear
export const crearCategoria = (data) =>
  api.post("/categorias", data);

// Actualizar
export const actualizarCategoria = (id, data) =>
  api.put(`/categorias/${id}`, data);

// Eliminar
export const eliminarCategoria = (id) =>
  api.delete(`/categorias/${id}`);
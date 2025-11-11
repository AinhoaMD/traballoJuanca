import db from '@/data/db.json'

// Mantener una copia en memoria de las noticias para uso en runtime.
const noticiasData = (db && db.noticias ? db.noticias.map((n, idx) => ({ id: n.id ?? String(idx + 1), ...n })) : [])

export function getNoticias() {
	// Devolver objeto tipo axios { data: ... } para compatibilidad con el componente
	return Promise.resolve({ data: noticiasData })
}

export function addNoticia(noticia) {
	const id = String(Date.now())
	const nueva = { id, ...noticia }
	// Insertar al principio para que las más recientes salgan primero
	noticiasData.unshift(nueva)
	return Promise.resolve({ data: nueva })
}

export function deleteNoticia(id) {
  const index = noticiasData.findIndex((n) => n.id === id);
  if (index === -1) {
    return Promise.reject(new Error("Noticia no encontrada"));
  }

  noticiasData.splice(index, 1); // eliminar del array en memoria
  return Promise.resolve({ success: true });
}


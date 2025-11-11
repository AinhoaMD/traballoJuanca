import axios from 'axios';

export async function getNoticias() {
	try {
		const res = await axios.get("http://localhost:3000/noticias");
		return res.data;
	} catch (error) {
		console.error("Fallo al obtener las noticias de la bbdd", error);
		throw error;
	}
}

export async function addNoticia(noticia) {
	try {
    await axios.post("http://localhost:3000/noticias", noticia).then((res) => res.data);
  } catch (error) {
    console.error("Fallo al añadir la nueva noticia a la bbdd", error);
    throw error;
  }
}

export async function deleteNoticia(id) {
	try {
    await axios.delete(`http://localhost:3000/noticias/${id}`).then((res) => res.data);
  } catch (error) {
    console.error("Fallo al borrar la noticia", error);
    throw error;
  }
  }


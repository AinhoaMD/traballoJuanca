import axios from "axios";

const API_URL = "http://localhost:3000/taller";

export async function getCitasTaller() {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Error al conseguir los datos: ", error);
  }
}

export async function addCitaTaller(cita) {
  try {
    axios.post(API_URL, cita);
  } catch (error) {
    console.error("Error al añadir la cita: ", error);
  }
}

export async function deleteCitaTaller(id) {
  try {
    await axios.delete(API_URL + `/${id}`);
  } catch (error) {
    console.error("Error al borrar la cita: ", error);
  }
}

export async function updateCitaTaller(id, cita) {
  try {
    await axios.put(API_URL + `/${id}`, cita);
  } catch (error) {
    console.error("Error al actualizar la cita: ", error);
  }
}

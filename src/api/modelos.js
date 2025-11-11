import axios from 'axios';

const API_URL = 'http://localhost:3000/modelos';

export async function getModelos() {
    try {
        const res = await axios.get(API_URL);
        return res.data;
    } catch (error) {
        console.error('Error al conseguir los datos: ', error);
    }
}

// aquí no devuelve nada por eso no se hace const res
export async function addModelo(modelo) {
    try{
        axios.post(API_URL, modelo);
    }catch(error){
        console.error('Error al añadir el modelo: ', error);
    }
}

export async function deleteModelo(id){
    try{
        await axios.delete(API_URL + `/${id}`);
    }catch(error){
        console.error("Error al borrar el modelo: ", error);
    }
}

export async function updateModelo(id, modelo) {
    try {
        await axios.put(API_URL + `/${id}`, modelo);
    } catch(error){
        console.error("Error al actualizar el modelo: ", error);
    }
}
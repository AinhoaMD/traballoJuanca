<template>
    <div class="container-fluid my-1 p-3 border rounded-3 shadow-sm bg-light">
    <!-- Título principal -->
    <h4
      class="text-center mx-2 my-1 bg-`primary-subtle py-1 border bg-primary bg-opacity-25 text-primary p-3 rounded"
    >
      <i class="bi bi-person-gear me-2"></i>Lista de Modelos
    </h4>

    <!-- Botón para limpiar formulario -->
    <div class="d-flex justify-content-end">
      <button
        type="button"
        class="btn border border-primary border-2 rounded-0 text-primary shadow-none mt-2 me-2"
        style="--bs-btn-hover-bg: var(--bs-primary-bg-subtle)"
        @click="limpiarPagina"
        title="Limpiar formulario"
      >
        <i class="bi bi-arrow-counterclockwise"></i>
      </button>
    </div>

    <!-- Formulario para añadir o modificar modelos -->
    <form @submit.prevent="guardarModelo" class="mb-4">
      <div class="row g-3 align-items-end">
        <!-- Campo de nombre -->
        <div class="col-md-4">
          <label for="nombre" class="form-label">Nombre:</label>
          <input
            type="text"
            class="form-control"
            id="nombre"
            @blur="capitalizarTexto('nombre')"
            v-model="nuevoModelo.nombre"
            required
          />
        </div>

        <!-- Input matricula -->
        <div class="col-md-4">
          <label for="matricula" class="form-label">Matrícula: </label>
          <input
            type="text"
            class="form-control"
            id="matricula"
            pattern="[0-9]{4}[A-Za-z]{3}"
            v-model="nuevoModelo.matricula"
            required
          />  
        </div>

        <!-- Campo de dueno -->
        <div class="col-md-4">
          <label for="dueno" class="form-label">Dueño: </label>
          <input
            type="text"
            class="form-control"
            id="dueno"
            @blur="capitalizarTexto('dueno')"
            v-model="nuevoModelo.dueno"
            required
          />
        </div>

        <!-- Select de Tipo -->
        <div class="col-md-4">
        <label for="tipo" class="form-label">Tipo: </label>
          <select
            id="puesto"
            v-model="nuevoModelo.tipo"
            class="form-select"
            required
          >
            <option disabled value="">Seleccione un tipo</option>
            <option
              v-for="opcion in opcionesTipo"
              :key="opcion"
              :value="opcion"
            >
              {{ opcion }}
            </option>
          </select>
          </div>

          <!-- Select de Marca -->
        <div class="col-md-4">
        <label for="tipo" class="form-label">Marca: </label>
          <select
            id="marca"
            v-model="nuevoModelo.marca"
            class="form-select"
            required
          >
            <option disabled value="">Seleccione una marca</option>
            <option
              v-for="opcion in opcionesMarca"
              :key="opcion"
              :value="opcion"
            >
              {{ opcion }}
            </option>
          </select>
          </div>
      </div>
    <div
        class="d-flex justify-content-center align-items-center mt-2 me2 gap-5"
      >
        <label for="combustible1"
          >Diesel:
          <input
            type="radio"
            v-model="nuevoModelo.combustible"
            value="Diesel"
            class="form-input"
        />
    </label>
    <label for="combustible2"
          >Gasolina:
          <input
            type="radio"
            v-model="nuevoModelo.combustible"
            value="Gasolina"
            class="form-input"
        /></label>
    <label for="combustible3"
          >Eléctrico:
          <input
            type="radio"
            v-model="nuevoModelo.combustible"
            value="Eléctrico"
            class="form-check-input"
        /></label>
        
      </div>

      <div
        class="form-check form-check d-flex justify-content-end align-items-center mt-2 me-2"
      >
        <label for="ITV"
          >ITV
          <input
            type="checkbox"
            v-model="nuevoModelo.itv"
            class="form-check-input"
        /></label>
      </div>
      <!-- Botón de acción: Añadir o Modificar -->
      <button
        type="submit"
        class="btn btn-primary mt-3"
      >
        {{ editando ? "Modificar" : "Añadir" }}
      </button>
    </form>

    <!-- Tabla que muestra la lista de modelos cargados -->
    <table
      class="table table-bordered table-striped table-hover table-sm align-middle table-responsive"
    >
      <thead class="thead-dark table-primary text-center">
        <tr>
            <th>Nombre</th>
            <th>Matrícula</th>
            <th>Dueño</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Combustible</th>
            <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="modelo in modelos" :key="modelo.id">
            <td>{{ modelo.nombre }}</td>
            <td>{{ modelo.matricula }}</td>
            <td>{{ modelo.dueno }}</td>
            <td>{{ modelo.tipo }}</td> 
            <td>{{ modelo.marca }}</td>
            <td>{{ modelo.combustible }}</td>
            <td class="align-middle text-center">

            <!-- Botón para eliminar un modelo -->
            <button
              class="btn btn-danger btn-sm border-0 ms-4 me-2 shadow-none rounded-0"
              @click="borrarModelo(modelo.id)"
            >
              <i class="bi bi-trash"></i>
            </button>

            <!-- Botón para editar un modelo -->
            <button
              class="btn btn-warning btn-sm shadow-none rounded-0"
              @click="editarModelo(modelo.id)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              v-if="modelo.historico === true"
              @click="rotoModelo(modelo)"
              class="btn btn-secondary btn-sm ms-2 border-0 shadow-none rounded-0"
              title="Activar cliente"
            >
              <i class="bi bi-unlock"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { 
    getModelos, 
    addModelo, 
    updateModelo, 
    deleteModelo
} from '../api/modelos.js';

// Variable reactiva para almacenar la lista de modelos
const modelos = ref([]);
const nuevoModelo = ref({
  nombre: '',
  matricula: '',
  tipo: '',
  dueno: '',
  marca: '',
  combustible: '',
  roto: false,
  itv: false
});

async function cargarModelos() {
    try {
        Swal.fire({
            icon: 'success',
            title: 'Listando Modelos...',
            showConfirmButton: false,
            timer: 1500
    });
    modelos.value = await getModelos();
    } catch (error) {
        console.error('Error al cargar los modelos:', error);
    }
}


const opcionesMarca = [
    'Toyota',
    'Ford',
    'Chevrolet',
    'Honda',
    'Nissan',
    'Volkswagen',
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Hyundai',
    'Citroen',
    'Kia',
    'Peugeot',
    'Renault',
];
const opcionesTipo = [
    'Deportivo',
    'Turismo',
    'Todoterreno',
    'Camión'
];
const editando = ref(false);
const modeloEditandoId = ref("");

onMounted(async () => {
    await cargarModelos();
});

async function guardarModelo(){
    if(!nuevoModelo.value.nombre.trim() || !nuevoModelo.value.matricula.trim() || !nuevoModelo.value.dueno.trim() || !nuevoModelo.value.tipo.trim() || !nuevoModelo.value.marca.trim() || !nuevoModelo.value.combustible.trim()){
        alert("Por favor, complete todos los campos obligatorios.");
        return;
    }
    const result = await Swal.fire({
        title: editando.value ? '¿Modificar modelo?' : '¿Añadir modelo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: editando.value ? 'Modificar' : 'Añadir',
        cancelButtonText: 'Cancelar'
    });
    if(!result.isConfirmed){return}
    
    if(editando.value){
        const index = modelos.value.findIndex(modelo => modelo.id === modeloEditandoId.value.id);
        // si existen objetos
        if(index !== -1){ // copia todo lo de dentro y se lo pasa como copia
            modelos.value[index] = {...nuevoModelo.value};
        }
        try {
            await updateModelo(modeloEditandoId.value, nuevoModelo.value);
            Swal.fire({
                icon: 'success',
                title: 'Modelo modificado correctamente',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error al actualizar el modelo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al modificar el modelo',
                text: 'Por favor, inténtelo de nuevo más tarde.',
                showConfirmButton: false,
                timer: 1500
            });
        }
} else {
    const modeloNuevo = {
        id:String(modelos.value.length > 0 ? modelos.value.length + 1 : 1),
        nombre: nuevoModelo.value.nombre,
        matricula:nuevoModelo.value.matricula.toUpperCase(),
        dueno: nuevoModelo.value.dueno,
        tipo: nuevoModelo.value.tipo,
        marca: nuevoModelo.value.marca,
        combustible: nuevoModelo.value.combustible,
        roto: nuevoModelo.value.roto,
        itv: nuevoModelo.value.itv
    }
    try{
        await addModelo(modeloNuevo);
        modelos.value.push(modeloNuevo);
        Swal.fire({
            icon: 'success',
            title: 'Nuevo modelo añadido correctamente',
            showConfirmButton: false,
            timer: 1500
        });
    }catch (error) {
        console.error("Fallo al añadir el nuevo modelo a la BBDD", error)
    }
}
    limpiarPagina();
}

async function borrarModelo(id){
    try {
        const result = await Swal.fire({
            title: '¿Eliminar modelo?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        });
        if(!result.isConfirmed){
            return;
        }
        await deleteModelo(id);
        modelos.value = modelos.value.filter((modelo) => modelo.id !== id);
        Swal.fire({
            icon: 'success',
            title: 'Modelo eliminado correctamente',
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.error('Error al eliminar el modelo:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al eliminar el modelo',
            text: 'Por favor, inténtelo de nuevo más tarde.',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

async function editarModelo(id) {
    editando.value = true;
    nuevoModelo.value = {...modelos.value.find((modelo) => modelo.id === id)};

    modeloEditandoId.value = id;
}

function limpiarPagina() {
    nuevoModelo.value = {
        nombre: '',
        matricula: '',
        tipo: '',
        dueno: '',
        marca: '',
        combustible: '',
        roto: false,
        itv: false
    };
    editando.value = false;
    modeloEditandoId.value = "";
}   

const capitalizarTexto = (propiedad) => {
    if (!nuevoModelo.value[propiedad]) return;
    nuevoModelo.value[propiedad] = nuevoModelo.value[propiedad]
        .split(" ")
        .map(
            (palabra) =>
                palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(" ");
};

</script>

<style scoped>

</style>
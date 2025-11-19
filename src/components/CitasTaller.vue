<template>
    <div class="container-fluid my-1 p-3 border rounded-0 shadow-sm bg-light">
        <h4 class="text-center my-2">Citas Taller</h4>
        <form @submit.prevent="guardarCita" class="mb-4">

            <div class="col-12 col-md-3">
                <label for="matricula" class="form-label">Matricula:</label>
                <input
                    type="text"
                    id="matricula"
                    class="form-control"
                    v-model="cita.matricula"
                    required
                    maxlength="10"
                />
            </div>

            <div class="col-md-3">
                <label for="movil" class="form-label">Móvil:</label>
                <input type="tel" id="movil" class="form-control" v-model="cita.movilCliente" required />
            </div>

            <div class="col-md-4">
            <label for="fecha_cita" class="form-label">Fecha de Cita:</label>
                <div class="input-group">
                    <input type="date" id="fecha_cita" class="form-control" v-model="cita.fechaCita" required />
                </div>
                <!-- <button type="button" class="btn btn-secondary shadow-none rounded-0" >
                    <i class="bi bi-arrow-clockwise"></i>
                    </button> -->
            </div>

            <div class="col-12 col-md-4">
                <label for="servicio" class="form-label">Servicio:</label>
                <select
                    id="servicio"
                    class="form-select"
                    v-model="cita.servicioTaller"
                    required
                    >
                    <option disabled value="">Seleccione</option>
                    <option
                        v-for="servicio in servicios" 
                        :value="servicio">
                        {{servicio }}
                    </option>
                </select>
            </div>

            Estado:
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="estado"
                id="tipo-furgoneta"
                value="furgoneta"  
                v-model="cita.estadoCita"
                checked
              />

              <label class="form-check-label" for="tipo-furgoneta"
                >Pendiente</label>
            </div>

            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="estado"
                id="tipo-moto"
                v-model="cita.estadoCita"
                value="moto"
                />
              <label class="form-check-label" for="tipo-moto">Finalizado</label>
            </div>

            <div class="form-check">
                <input type="checkbox" id="acepta" class="form-check-input" v-model="cita.acepta" required />
                <label for="acepta" class="form-check-label">
                    Acepta
                </label>
            </div>

            <div id="botones">
                <button type="submit" class="btn btn-primary w-30">
                    Grabar
                </button>
                
                <button type="reset" class="btn btn-primary w-30">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
            </div>

        </form>
    </div>

        <!-- Tabla -->
    <div class="table-responsive mt-4">
      <table
        class="table table-hover table-bordered align-middle text-center table-striped"
      >
        <thead class="table-primary">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Matrícula</th>
            <th>Móvil</th>
            <th>Servicio</th>
            <th>Estado</th>
            <th>Botones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cita in citas" :key="citas.id">
            <td>{{  cita.id }}</td>
            <td>{{  cita.fecha }}</td>
            <td>{{  cita.matricula }}</td>
            <td>{{ cita.movilCliente}}</td>
            <td>{{  cita.servicioTaller }}</td>
            <td>{{ cita.estadoCita }}</td>
            <td><button
                class="btn btn-sm btn-danger me-2 shadow-none"
                @click="borrarCita(cita.id)"
                >
                <i class="bi bi-trash"></i>
              </button>
              <button type="button" class="btn btn-primary w-30">
                    Editar
                </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="d-flex justify-content-center align-items-center gap-2 my-3">
      <button class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none" @click="beforePagina" :disabled="currentPage <= 1">
        <i class="bi bi-chevron-left"></i>
      </button>
      <span class="text-muted">Página {{ currentPage }}</span>
      <button class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none" @click="nextPagina" :disabled="currentPage >= totalPages">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
    getCitas,
    addCita,
    deleteCita,
    updateCita
} from "@/api/taller.js"
import Swal from "sweetalert2";

const cita = ref({
    id: "",
    matricula: "",
    movilCliente: "",
    fechaCita: "",
    servicioTaller: "",
    estadoCita: "",
    acepta: true
})

const citas = ref([]);
const servicios = ["revision", "preitv", "neumaticos", "frenos", "cambio-aceite"]
const editando = ref(false);
const currentPage = ref(1);


onMounted(async () => {
  await cargarCitas();
});

const beforePagina = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPagina = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

async function cargarCitas() {
  try {
    Swal.fire({
      icon: "success",
      title: "Listando Modelos...",
      showConfirmButton: false,
      timer: 1500,
    });
    citas.value = await getCitas();
  } catch (error) {
    console.error("Fallo al cargar los datos de la bbdd", error);
  }
}

async function guardarCita() {
  const result = await Swal.fire({
    title: "Guardar"
      ? "¿Desea modificar este modelo?"
      : "¿Desea añadir este modelo?",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
  });
  if (!result.isConfirmed) {
    return;
  }

  if (editando.value) {
    const index = citas.value.findIndex(
      (cita) => cita.id === modeloEditandoId.value
    );
    if (index !== -1) {
      modelos.value[index] = { ...nuevoModelo.value };
    }
    try {
      await updateModelo(modeloEditandoId.value, nuevoModelo.value);
      Swal.fire({
        icon: "success",
        title: "Modelo modificado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al actualizar moodelo", error);
      Swal.fire({
        icon: "error",
        title: "Error al modificar modelo",
        text: "Inténtelo de nuevo o contacte con el administrador.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } else {
    const citaNueva = {
      id: String(
        // Si hay elementos en el array modelos...
        citas.value.length > 0
          ? // Reducimos el array para encontrar el mayor id numérico existente
            citas.value.reduce(
              // Función reductora: compara el acumulador 'max' con el id actual convertido a número y devuelve el mayor
              (max, cita) => Math.max(max, Number(cita.id)),
              0 // Valor inicial para el máximo es 0 (si el array está vacío)
            ) +
              // Sumamos 1 al máximo para obtener el nuevo id único
              1
          : // Si el array está vacío, el primer id será 1
            1
      ),
        matricula: cita.value.matricula.toUpperCase(),
        movilCliente: cita.value.movilCliente,
        fechaCita: cita.value.fechaCita,
        servicioTaller: cita.value.servicioTaller,
        estadoCita: cita.value.estadoCita,
        acepta: true,
    };
    try {
      await addCita(citaNueva);
      citas.value.push(citaNueva);
      Swal.fire({
        icon: "success",
        title: "Modelo agregado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Fallo al añadir la cita a la BBDD", error);
      Swal.fire({
        icon: "error",
        title: "Error al añadir modelo",
        text: "Inténtelo de nuevo o contacte con el administrador.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}

async function borrarCita(id) {
  try {
    const result = await Swal.fire({
      title: `¿Eliminar la cita?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    await deleteCita(id);
    citas.value = citas.value.filter((cita) => cita.id !== id);
    Swal.fire({
      icon: "success",
      title: "Cita eliminada",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("Error a la hora de eliminar ", error);
    Swal.fire({
      icon: "error",
      title: "Error al eliminar modelo",
      text: "Inténtelo de nuevo o contacte con el administrador.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

</script>
<style scoped></style>
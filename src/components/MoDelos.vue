<template>
  <div class="container-fluid my-4 p-4 border rounded-4 shadow-lg bg-white">
    <h4
      class="text-center mb-4 fw-semibold text-primary border-bottom pb-2 mt-2"
    >
      <i class="bi bi-car-front me-2"></i>Registro de Vehículos
    </h4>

    <form @submit.prevent="guardarVehiculo" class="mb-2 mt-1">
      <!-- FILA: Tipo, Marca, Modelo, Matricula -->
      <div class="row g-3 mt-1">
        <div class="col-12 col-md-3">
          <label class="form-label">Tipo:</label>
          <div class="d-flex gap-3">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-coche"
                value="coche"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label" for="tipo-coche">Coche</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-furgoneta"
                value="furgoneta"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label" for="tipo-furgoneta"
                >Furgoneta</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-moto"
                value="moto"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label" for="tipo-moto">Moto</label>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <label for="marca" class="form-label">Marca:</label>
          <input
            type="text"
            id="marca"
            v-model="vehiculo.marca"
            class="form-control"
            required
          />
        </div>
        <div class="col-12 col-md-3">
          <label for="modelo" class="form-label">Modelo:</label>
          <input
            type="text"
            id="modelo"
            v-model="vehiculo.modelo"
            class="form-control"
            required
          />
        </div>
        <div class="col-12 col-md-3">
          <label for="matricula" class="form-label">Matricula:</label>
          <input
            type="text"
            id="matricula"
            v-model="vehiculo.matricula"
            class="form-control"
          />
        </div>
      </div>

      <!-- FILA: Año, Kilómetros, Precio -->
      <div class="row g-3 mt-2">
        <div class="col-12 col-md-2">
          <label for="anio" class="form-label">Año:</label>
          <input
            type="number"
            id="anio"
            v-model="vehiculo.anio"
            class="form-control"
            required
          />
        </div>
        <div class="col-12 col-md-5">
          <label for="kilometros" class="form-label">Kilómetros:</label>
          <input
            type="number"
            id="kilometros"
            v-model="vehiculo.kilometros"
            class="form-control"
            required
          />
        </div>
        <div class="col-12 col-md-5">
          <label for="precio" class="form-label">Precio (€):</label>
          <input
            type="number"
            id="precio"
            v-model="vehiculo.precio"
            class="form-control"
            required
          />
        </div>
      </div>

      <!-- FILA: Combustible, Transmisión, Potencia -->
      <div class="row g-3 mt-2">
        <div class="col-12 col-md-4">
          <label for="combustible" class="form-label">Combustible:</label>
          <select
            id="combustible"
            v-model="vehiculo.combustible"
            class="form-select"
          >
            <option disabled value="">Seleccione</option>
            <option>Gasolina</option>
            <option>Diésel</option>
            <option>Híbrido</option>
            <option>GLP</option>
            <option>Eléctrico</option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label for="transmision" class="form-label">Transmisión:</label>
          <select
            id="transmision"
            v-model="vehiculo.transmision"
            class="form-select"
          >
            <option disabled value="">Seleccione</option>
            <option>Manual</option>
            <option>Automática</option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label for="potencia" class="form-label">Potencia (CV):</label>
          <input
            type="number"
            id="potencia"
            v-model="vehiculo.potencia_cv"
            class="form-control"
          />
        </div>
      </div>

      <!-- FILA: Descripción -->
      <div class="row g-3 mt-2">
        <div class="col-12">
          <label for="descripcion" class="form-label">Descripción:</label>
          <textarea
            id="descripcion"
            v-model="vehiculo.descripcion"
            rows="3"
            class="form-control"
            placeholder="Describe el estado, revisiones, etc."
          ></textarea>
        </div>
      </div>

      <h6 class="text-center fw-semibold bg-primary-subtle py-2 rounded mt-3">
        <i class="bi bi-person me-2"></i>Cliente Ubicación
      </h6>

      <!-- FILA: Provincia, Ciudad, Fecha Publicación -->
      <div class="row g-3 mt-3">
        <div class="col-12 col-md-4">
          <label for="provincia" class="form-label">Provincia:</label>
          <select
            id="provincia"
            v-model="vehiculo.ubicacion.provincia"
            class="form-select"
            @change="filtrarCiudades"
          >
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
              {{ prov.nm }}
            </option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label for="ciudad" class="form-label">Ciudad:</label>
          <select
            id="ciudad"
            v-model="vehiculo.ubicacion.ciudad"
            class="form-select"
          >
            <option disabled value="">Seleccione ciudad</option>
            <option
              v-for="mun in municipiosFiltrados"
              :key="mun.id"
              :value="mun.nm"
            >
              {{ mun.nm }}
            </option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label for="fecha_publicacion" class="form-label"
            >Fecha Publicación:</label
          >
          <input
            type="date"
            id="fecha_publicacion"
            v-model="vehiculo.fecha_publicacion"
            class="form-control"
          />
        </div>
      </div>

      <!-- FILA: Contacto -->
      <div class="row g-3 mt-2">
        <div class="col-12 col-md-4">
          <label for="contacto_nombre" class="form-label"
            >Nombre Contacto:</label
          >
          <input
            type="text"
            id="contacto_nombre"
            v-model="vehiculo.contacto.nombre"
            class="form-control"
          />
        </div>
        <div class="col-12 col-md-4">
          <label for="contacto_telefono" class="form-label">Teléfono:</label>
          <input
            type="tel"
            id="contacto_telefono"
            v-model="vehiculo.contacto.telefono"
            class="form-control"
          />
        </div>
        <div class="col-12 col-md-4">
          <label for="contacto_email" class="form-label">Email:</label>
          <input
            type="email"
            id="contacto_email"
            v-model="vehiculo.contacto.email"
            class="form-control"
          />
        </div>
      </div>

      <!-- FILA: Estado y botón -->
      <div class="row g-3 align-items-end mt-3">
        <div class="col-12 col-md-8">
          <label class="form-label">Estado:</label>
          <select v-model="vehiculo.estado" class="form-select">
            <option value="disponible">Disponible</option>
            <option value="vendido">Vendido</option>
            <option value="reservado">Reservado</option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <button type="submit" class="btn btn-primary w-100">
            {{ editando ? "Modificar" : "Guardar" }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const vehiculo = ref({
  tipo: "",
  marca: "",
  modelo: "",
  anio: "",
  kilometros: "",
  precio: "",
  matricula: "",
  combustible: "",
  transmision: "",
  potencia_cv: "",
  descripcion: "",
  ubicacion: {
    provincia: "",
    ciudad: "",
  },
  contacto: {
    nombre: "",
    telefono: "",
    email: "",
  },
  fecha_publicacion: "",
  estado: "disponible",
});

const tiposVehiculo = ref(["coche", "moto", "furgoneta", "camión"]);
const tiposCombustible = ref(["gasolina", "diésel", "híbrido", "eléctrico"]);

const provincias = ref([
  { id: 1, nm: "A Coruña" },
  { id: 2, nm: "Lugo" },
  { id: 3, nm: "Ourense" },
  { id: 4, nm: "Pontevedra" },
]);

const municipios = ref([
  { id: 1, nm: "Santiago de Compostela", prov: "A Coruña" },
  { id: 2, nm: "Ferrol", prov: "A Coruña" },
  { id: 3, nm: "Lugo", prov: "Lugo" },
  { id: 4, nm: "Monforte de Lemos", prov: "Lugo" },
  { id: 5, nm: "Ourense", prov: "Ourense" },
  { id: 6, nm: "Vigo", prov: "Pontevedra" },
  { id: 7, nm: "Pontevedra", prov: "Pontevedra" },
]);

const municipiosFiltrados = computed(() =>
  municipios.value.filter((m) => m.prov === vehiculo.value.ubicacion.provincia)
);
</script>
<style></style>

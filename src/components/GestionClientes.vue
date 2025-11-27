<template>
  <div class="container-fluid my-1 p-3 border rounded-0 shadow-sm bg-light">
    <h4 class="text-center my-2">Registro de Clientes</h4>

    <form @submit.prevent="guardarCliente" class="mb-4">
      <!-- DNI, Tipo Cliente, Fecha Alta -->
      <div class="mb-3 row g-3">
        <div class="col-md-4">
          <label for="dni" class="form-label">DNI:</label>
          <div class="input-group">
            <input
              type="text"
              id="dni"
              v-model="nuevoCliente.dni"
              @blur="validarDni"
              class="form-control"
              :class="{ 'is-invalid': !dniValido }"
              required
            />
            <button type="button" class="btn btn-primary shadow-none rounded-0" @click="buscarClientePorDNI(nuevoCliente.dni)">
              <i class="bi bi-search"></i>
            </button>
          </div>
          <div v-if="!dniValido" class="invalid-feedback d-block">DNI o NIE inválido</div>
        </div>

        <div class="col-md-4">
          <label class="form-label">Tipo Cliente:</label>
          <div class="d-flex gap-3">
            <div class="form-check">
              <input type="radio" id="particular" value="particular" v-model="nuevoCliente.tipoCliente" class="form-check-input" />
              <label for="particular" class="form-check-label">Particular</label>
            </div>
            <div class="form-check">
              <input type="radio" id="empresa" value="empresa" v-model="nuevoCliente.tipoCliente" class="form-check-input" />
              <label for="empresa" class="form-check-label">Empresa</label>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <label for="fecha_alta" class="form-label">Fecha de Alta:</label>
          <div class="input-group">
            <input type="date" id="fecha_alta" v-model="nuevoCliente.fecha_alta" class="form-control" required />
            <button type="button" class="btn btn-secondary shadow-none rounded-0" @click="recargaForm()">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Nombre y Apellidos -->
      <div class="mb-3 row g-3">
        <div class="col-md-6">
          <label for="nombre" class="form-label">Nombre:</label>
          <input type="text" id="nombre" v-model="nuevoCliente.nombre" class="form-control" @blur="capitalizarTexto('nombre')" required />
        </div>
        <div class="col-md-6">
          <label for="apellidos" class="form-label">Apellidos:</label>
          <input type="text" id="apellidos" v-model="nuevoCliente.apellidos" class="form-control" @blur="capitalizarTexto('apellidos')" required />
        </div>
      </div>

      <!-- Email y Móvil -->
      <div class="mb-3 row g-3">
        <div class="col-md-6">
          <label for="email" class="form-label">Email:</label>
          <input type="email" id="email" v-model="nuevoCliente.email" class="form-control" @blur="validarEmail" :class="{ 'is-invalid': !emailValido }" required />
          <div v-if="!emailValido" class="invalid-feedback d-block">Email inválido</div>
        </div>
        <div class="col-md-3">
          <label for="movil" class="form-label">Móvil:</label>
          <input type="tel" id="movil" v-model="nuevoCliente.movil" class="form-control" @blur="validarMovil" :class="{ 'is-invalid': !movilValido }" />
          <div v-if="!movilValido" class="invalid-feedback d-block">9 dígitos, empieza por 6 o 7</div>
        </div>
      </div>

      <!-- Dirección, Provincia y Municipio -->
      <div class="mb-3 row g-3">
        <div class="col-md-4">
          <label for="direccion" class="form-label">Dirección:</label>
          <input type="text" id="direccion" v-model="nuevoCliente.direccion" class="form-control" @blur="capitalizarTexto('direccion')" />
        </div>
        <div class="col-md-4">
          <label for="provincia" class="form-label">Provincia:</label>
          <select id="provincia" v-model="nuevoCliente.provincia" class="form-select" @change="filtrarMunicipios">
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">{{ prov.nm }}</option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="municipio" class="form-label">Municipio:</label>
          <select id="municipio" v-model="nuevoCliente.municipio" class="form-select">
            <option disabled value="">Seleccione municipio</option>
            <option v-for="mun in municipiosFiltrados" :key="mun.id" :value="mun.nm">{{ mun.nm }}</option>
          </select>
        </div>
      </div>

      <!-- Histórico y Aviso Legal -->
      <div class="mb-3 d-flex justify-content-between align-items-center">
        <div class="form-check form-switch">
          <input type="checkbox" id="historico" v-model="mostrarHistorico" class="form-check-input" @change="cargarClientes" />
          <label for="historico" class="form-check-label">Histórico</label>
        </div>

        <div class="form-check">
          <input type="checkbox" id="avisolegal" v-model="avisoLegal" class="form-check-input" required />
          <label for="avisolegal" class="form-check-label">
            Aceptar <router-link to="/aviso-legal">Aviso Legal</router-link>
          </label>
        </div>
      </div>

      <div class="row mb-3">
        <!-- Contraseña -->
        <div class="row g-2 justify-content-center mt-2">
          <div class="col-md-3 d-flex mt-3 align-items-center">
            <label class="me-2 mb-0 text-nowrap align-middle"
              >Contraseña:</label
            >
            <input
              type="password"
              v-model="nuevoCliente.password"
              class="form-control"
              required
            />
          </div>

          <!-- Repetir contraseña -->
          <div class="col-md-3 d-flex mt-3 align-items-center ms-5">
            <label class="me-2 mb-0 text-nowrap align-middle"
              >Repetir Contraseña:</label
            >
            <input
              type="password"
              v-model="nuevoCliente.password2"
              class="form-control"
              required
            />
          </div>
        </div>
      </div>

      <!-- Botón Guardar -->
      <div class="text-center">
        <button type="submit" class="btn btn-primary border-0 shadow-none rounded-0" :disabled="!avisoLegal">
          {{ editando ? 'Modificar Cliente' : 'Guardar Cliente' }}
        </button>
      </div>
    </form>

    <!-- Lista de Clientes (aquí faltaría un v-if=admin + definir admin abajo) -->
    <div class="table-responsive" v-if="admin">
      <h4 class="text-center mb-3">Listado Clientes</h4>
      <table class="table table-bordered table-striped table-hover table-sm align-middle">
        <thead class="table-primary">
          <tr>
            <th class="text-center">ID</th>
            <th class="text-center">Apellidos</th>
            <th class="text-center">Nombre</th>
            <th class="text-center">Móvil</th>
            <th class="text-center">Municipio</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cliente, index) in clientesPaginados" :key="cliente.id || index">
            <th scope="row" class="text-center">{{ (currentPage - 1) * clientesPorPage + index + 1 }}</th>
            <td>{{ cliente.apellidos }}</td>
            <td>{{ cliente.nombre }}</td>
            <td class="text-center">{{ cliente.movil }}</td>
            <td class="text-center">{{ cliente.municipio }}</td>
            <td class="text-center">
              <button @click="eliminarCliente(cliente.movil)" class="btn btn-danger btn-sm me-2 border-0 shadow-none rounded-0" title="Eliminar">
                <i class="bi bi-trash"></i>
              </button>
              <button @click="editarCliente(cliente.movil)" class="btn btn-warning btn-sm me-2 border-0 shadow-none rounded-0" title="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button v-if="cliente.historico === false" @click="activarCliente(cliente)" class="btn btn-secondary btn-sm border-0 shadow-none rounded-0" title="Activar">
                <i class="bi bi-unlock-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="d-flex justify-content-center align-items-center gap-2 my-3" v-if="admin">
      <button class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none" @click="beforePagina" :disabled="currentPage <= 1">
        <i class="bi bi-chevron-left"></i>
      </button>
      <span class="text-muted">Página {{ currentPage }}</span>
      <button class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none" @click="nextPagina" :disabled="currentPage >= totalPages">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import provmuniData from '@/data/provmuni.json';
import { ref, onMounted, computed } from 'vue';
import { getClientes, addCliente, deleteCliente, updateCliente } from '@/api/clientes.js';
import Swal from 'sweetalert2';
import { getClientePorDni } from '../api/clientes';
import bcrypt from "bcryptjs"
const nuevoCliente = ref({
  dni: '',
  nombre: '',
  apellidos: '',
  email: '',
  movil: '',
  direccion: '',
  provincia: '',
  municipio: '',
  fecha_alta: '',
  historico: true,
  lopd: false,
  tipoCliente: '',
  tipo: "user",
  password: "",
  password2: ""

});

const clientes = ref([]);
const editando = ref(false);
const clienteEditandoId = ref(null);
const mostrarHistorico = ref(false);
const numClientes = ref(0);
const currentPage = ref(1);
const clientesPorPage = 10;
const avisoLegal = ref(false);

const dniValido = ref(true);
const emailValido = ref(true);
const movilValido = ref(true);

const provincias = ref(provmuniData.provincias);
const municipios = ref(provmuniData.municipios);
const municipiosFiltrados = ref([]);
const admin = localStorage.getItem("isAdmin")

const totalPages = computed(() => Math.ceil(numClientes.value / clientesPorPage));

const clientesPaginados = computed(() => {
  const start = (currentPage.value - 1) * clientesPorPage;
  const end = start + clientesPorPage;
  return clientes.value.slice(start, end);
});

onMounted(async () => {
  cargarClientes();
});

const cargarClientes = () => {
  getClientes(mostrarHistorico.value).then(data => {
    clientes.value = data;
    numClientes.value = data.length;
    currentPage.value = 1;
  });
  Swal.fire({
    icon: 'success',
    title: "Listando Clientes...",
    showConfirmButton: false,
    timer: 150
  });
};

const guardarCliente = async () => {
  // if (!nuevoCliente.value.lopd)
  if (!avisoLegal.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Debes aceptar el Aviso Legal',
      showConfirmButton: false,
      timer: 2000
    });
    return;
  }

  if (nuevoCliente.value.password != nuevoCliente.value.password2){
    Swal.fire({
      icon: "error",
      title: "Las contraseñas no coinciden",
      showConfirmButton: false,
      timer: 2000,
    })
    return; // No continuar con el proceso si las contraseñas no coinciden
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(nuevoCliente.value.password, salt)

  if (!editando.value) {
    const duplicado = clientes.value.find(cliente =>
      cliente.dni === nuevoCliente.value.dni ||
      cliente.movil === nuevoCliente.value.movil ||
      cliente.email === nuevoCliente.value.email
    );
    if (duplicado) {
      Swal.fire({
        icon: 'error',
        title: 'DNI, móvil o email duplicados',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
  }

  nuevoCliente.value.password = hash;
  delete nuevoCliente.value.password2;

  const result = await Swal.fire({
    title: editando.value ? '¿Desea modificar este cliente?' : '¿Desea grabar este cliente?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: editando.value ? 'Modificar' : 'Grabar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    nuevoCliente.value.lopd = avisoLegal.value;

    if (editando.value) {
      const clienteActualizado = await updateCliente(clienteEditandoId.value, nuevoCliente.value);
      const index = clientes.value.findIndex(c => c.id === clienteEditandoId.value);
      if (index !== -1) clientes.value[index] = clienteActualizado;
      Swal.fire({
        icon: 'success',
        title: 'Cliente modificado',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      const clienteAgregado = await addCliente(nuevoCliente.value);
      clientes.value.push(clienteAgregado);
      Swal.fire({
        icon: 'success',
        title: 'Cliente agregado',
        showConfirmButton: false,
        timer: 1500
      });
    }

    editando.value = false;
    clienteEditandoId.value = null;
    dniValido.value = true;
    movilValido.value = true;
    emailValido.value = true;
    clientes.value = await getClientes();
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar cliente',
      showConfirmButton: false,
      timer: 1500
    });
  }
  recargaForm()
};

const editarCliente = (movil) => {
  const cliente = clientes.value.find(c => c.movil === movil);
  if (!cliente) return;
  nuevoCliente.value = { ...cliente };
  nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);
  filtrarMunicipios();
  nuevoCliente.value.municipio = cliente.municipio;
  editando.value = true;
  clienteEditandoId.value = cliente.id;
  nuevoCliente.value.password=""
};

const eliminarCliente = async (movil) => {
  clientes.value = await getClientes();
  const clienteAEliminar = clientes.value.find(cliente => cliente.movil === movil);

  if (!clienteAEliminar) return;

  const result = await Swal.fire({
    title: `¿Eliminar a ${clienteAEliminar.nombre} ${clienteAEliminar.apellidos}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  await deleteCliente(clienteAEliminar.id);
  clientes.value = await getClientes();
  Swal.fire({
    icon: 'success',
    title: 'Cliente eliminado',
    showConfirmButton: false,
    timer: 1500
  });
};

const activarCliente = async (cliente) => {
  const confirmacion = await Swal.fire({
    title: `¿Activar ${cliente.nombre} ${cliente.apellidos}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Activar'
  });

  if (!confirmacion.isConfirmed) return;

  try {
    const clienteActivado = { ...cliente, historico: true };
    const actualizado = await updateCliente(cliente.id, clienteActivado);
    const index = clientes.value.findIndex(c => c.id === cliente.id);
    if (index !== -1) clientes.value[index] = actualizado;
    await cargarClientes();
    Swal.fire({
      icon: 'success',
      title: 'Cliente reactivado',
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al activar cliente',
      showConfirmButton: false,
      timer: 1500
    });
  }
};

const validarDni = () => {
  nuevoCliente.value.dni = nuevoCliente.value.dni.trim().toUpperCase();
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
  const valor = nuevoCliente.value.dni;

  if (dniRegex.test(valor)) {
    const numero = parseInt(valor.slice(0, 8), 10);
    dniValido.value = valor.charAt(8) === letras[numero % 23];
  } else if (nieRegex.test(valor)) {
    const nie = valor.replace('X', '0').replace('Y', '1').replace('Z', '2');
    const numero = parseInt(nie.slice(0, 8), 10);
    dniValido.value = valor.charAt(8) === letras[numero % 23];
  } else {
    dniValido.value = false;
  }
};

const validarEmail = () => {
  const email = nuevoCliente.value.email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailValido.value = regex.test(email);
};

const validarMovil = () => {
  const movil = nuevoCliente.value.movil.trim();
  if (movil === '') {
    movilValido.value = true;
    return;
  }
  const regex = /^[67]\d{8}$/;
  movilValido.value = regex.test(movil);
};

const capitalizarTexto = (campo) => {
  const texto = nuevoCliente.value[campo] ?? '';
  nuevoCliente.value[campo] = texto
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1))
    .join(' ');
};

const filtrarMunicipios = () => {
  const nombreProv = nuevoCliente.value.provincia;
  const prov = provincias.value.find(p => p.nm === nombreProv);
  if (!prov) {
    municipiosFiltrados.value = [];
    return;
  }
  const codigoProv = prov.id.slice(0, 2);
  municipiosFiltrados.value = municipios.value.filter(m => m.id.startsWith(codigoProv));
  nuevoCliente.value.municipio = '';
};

const buscarClientePorDNI = async (dni) => {
  if (!dni || dni.trim() === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Introduzca un DNI',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }

  try {
    const cliente = await getClientePorDni(dni.trim().toUpperCase());
    if (!cliente) {
      Swal.fire({
        icon: 'info',
        title: 'Cliente no encontrado',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    nuevoCliente.value = { ...cliente };
    nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);
    filtrarMunicipios();
    editando.value = true;
    clienteEditandoId.value = cliente.id;
    Swal.fire({
      icon: 'success',
      title: 'Cliente cargado',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al buscar',
      timer: 1500,
      showConfirmButton: false
    });
  }
};

const beforePagina = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPagina = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

function formatearFechaParaInput(fecha) {
  if (!fecha) return '';
  if (fecha.includes('/')) {
    const [dd, mm, yyyy] = fecha.split('/');
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }
  if (fecha.includes('-')) {
    const partes = fecha.split('-');
    if (partes.length === 3) return fecha;
  }
  return '';
}

function recargaForm() {
  nuevoCliente.value = {
    dni: '',
    nombre: '',
    apellidos: '',
    email: '',
    movil: '',
    direccion: '',
    provincia: '',
    municipio: '',
    fecha_alta: '',
    historico: true,
    tipo: "user",
    password: "",
    password2: ""
  };
  editando.value = false;
  clienteEditandoId.value = null;
  dniValido.value = true;
  movilValido.value = true;
  emailValido.value = true;
}
</script>

<style scoped>
.is-invalid {
  border-color: #f28b82 !important;
  background-color: #ffe6e6;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>



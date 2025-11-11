<template>
  <div class="container my-1 p-3 border rounded-0 shadow-sm bg-light">
 <!-- <div
  class="mx-auto mt-2 p-4 pb-5 border rounded-3 shadow-sm min-vh-75 bg-light"> -->
    <h4 class="text-center my-2">Registro de Clientes</h4>
    <!-- Formulario -->
<form @submit.prevent="guardarCliente" class="mb-4">
<!-- DNI con validación visual -->
<div class="mb-3 row align-items-center">
  <!-- Columna DNI -->
  <div class="col-md-4 d-flex align-items-center">
    <label for="dni" class="form-label mb-0 w-25">DNI:  </label>
    <div class="flex-grow-1 d-flex">
      <input
        type="text"
        id="dni"
        v-model="nuevoCliente.dni"
        @blur="validarDni"
        class="form-control w-auto me-2"
        :class="{ 'is-invalid': !dniValido }"
        required
        oninvalid="this.setCustomValidity('Por favor, rellene este campo')"
        oninput="this.setCustomValidity('')"
      />
      <button
              type="button"
              class="btn btn-primary shadow-none rounded-0"
              @click="buscarClientePorDNI(nuevoCliente.dni)">
              
              <i class="bi bi-search"></i>
            </button>
      <div v-if="!dniValido" class="invalid-feedback">
        DNI o NIE inválido.
      </div>
    </div>
  </div>

  <div class="align-items-center d-flex col-md-4">
    <label class="form-label me-2 ms-5 mb-0 text-nowrap">Tipo Cliente:</label>
    Particular:<input type="radio" name="tipoCliente" id="particular" value="particular" v-model="nuevoCliente.tipoCliente" class="form-check-input ms-2 me-3" />
    &nbsp;
    Empresa:<input type="radio" name="tipoCliente" id="empresa" value="empresa" v-model="nuevoCliente.tipoCliente" class="form-check-input ms-2 me-3" />
  </div>
  
  <!-- Columna Fecha de Alta a la derecha -->
  <div class="col-md-4 ms-auto d-flex align-items-center justify-content-end">
    <label for="fecha_alta" class="form-label me-2 mb-0 text-nowrap">Fecha de Alta:</label>
    <input
      type="date"
      id="fecha_alta"
      v-model="nuevoCliente.fecha_alta"
      class="form-control w-auto"
      required
      
    />

    <button 
      type="button"
      class="btn btn-secondary ms-3 shadow-none rounded-0"
      @click="recargaForm()">
              
      <i class="bi bi-arrow-clockwise"></i>
    </button>
  </div>
  
</div>

<!-- Nombre y Apellidos -->
<div class="mb-3 row g-3 align-items-center">
  <!-- Nombre -->
  <div class="col-md-5 d-flex align-items-center">
    <label for="nombre" class="form-label  mb-0 text-nowrap w-25">Nombre:</label>
    <input
      type="text"
      id="nombre"
      v-model="nuevoCliente.nombre"
      class="form-control flex-grow-1"º
      @blur="capitalizarTexto('nombre')"
      required
    />
  </div>

  <!-- Apellidos -->
  <div class="col-md-6 d-flex align-items-center ms-auto">
    <label for="apellidos" class="form-label me-4 mb-0 text-nowrap">Apellidos:</label>
    <input
      type="text"
      id="apellidos"
      v-model="nuevoCliente.apellidos"
      class="form-control flex-grow-1"
      @blur="capitalizarTexto('apellidos')"
      required
    />
  </div>
</div>

<!-- Email y Móvil -->
<div class="mb-3 row g-3 align-items-center">
  <!-- Email -->
  <div class="col-md-5 d-flex align-items-center">
    <label for="email" class="form-label mb-0 text-nowrap w-25">Email:</label>
    <div class="d-flex flex-column w-100">
        <input
          type="email"
          id="email"
          v-model="nuevoCliente.email"
          class="form-control flex-grow-1"
          @blur="validarEmail"
          :class="{ 'is-invalid': !emailValido }"
          required
        />
        <div v-if="!emailValido" class="invalid-feedback">
        El email debe tener un formato válido (ej: usuario@dominio.com).
        </div>
    </div>
  </div>

  

  <!-- Móvil -->
  <div class="col-md-3 d-flex align-items-center">
    <label for="movil" class="form-label me-5 ms-5 mb-0 text-nowrap ">Móvil:</label>
    <input
      type="tel"
      id="movil"
      v-model="nuevoCliente.movil"
      @blur="validarMovil"
      class="form-control flex-grow-1 text-center"
      :class="{ 'is-invalid': !movilValido }"
    />
    <div v-if="!movilValido" class="invalid-feedback">
    El móvil debe tener 9 dígitos y empezar por 6 o 7.
    </div>
  </div>
</div>



 <!-- Dirección, Provincia y Municipio -->
<div class="mb-3 row g-3 align-items-center">
  <!-- Dirección -->
  <div class="col-md-5 d-flex align-items-center">
    <label for="direccion" class="form-label mb-0 w-25 text-nowrap">Dirección:</label>
    <input
      type="text"
      id="direccion"
      v-model="nuevoCliente.direccion"
      @blur="capitalizarTexto('direccion')"
      class="form-control flex-grow-1"
    />
  </div>

  <!-- Provincia -->
  <div class="col-md-3 d-flex align-items-center">
    <label for="provincia" class="form-label me-2 ms-5 mb-0 text-nowrap">Provincia:</label>
    <select
      id="provincia"
      v-model="nuevoCliente.provincia"
      class="form-select flex-grow-1 w-25"
      @change="filtrarMunicipios"
    >
      <option disabled value="">Seleccione provincia</option>
      <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">{{ prov.nm }}</option>
    </select>
  </div>

  <!-- Municipio -->
  <div class="col-md-3 d-flex align-items-center">
    <label for="municipio" class="form-label me-2 ms-4 mb-0 text-nowrap">Municipio:</label>
    <select
      id="municipio"
      v-model="nuevoCliente.municipio"
      class="form-select flex-grow-1 w-auto"
    >
      <option disabled value="">Seleccione municipio</option>
      <option v-for="mun in municipiosFiltrados" :key="mun.id" :value="mun.nm">{{ mun.nm }}</option>
    </select>
  </div>
</div>

  <!-- Histórico
  <div class="d-flex justify-content-end mb-2">
    <input type="checkbox" id="historico" v-model="nuevoCliente.historico" class="form-check-input" />
    <label for="historico" class="form-check-label ms-3 me-5 mb-0">Histórico</label>
  </div> -->

  <!-- ////// CHECKBOX -->

<!-- Checkbox al final -->
        <!-- <div class="form-check form-switch ms-3">
          <input
            type="checkbox"
            id="historico"
            v-model="mostrarHistorico"
            class="form-check-input"
            @change="cargarClientes"
          />
          <label for="historico" class="form-check-label ms-2">Histórico</label>
        </div> -->

  <!-- Botón centrado -->
  <!-- <div class="text-center">
    <button type="submit" class="btn btn-primary border-0 shadow-none rounded-0">
      {{ editando ? 'Modificar Cliente' : 'Guardar Cliente'}}
    </button>
  </div> -->

  <!-- ////////BOTON Y CHECKBOX EN LA MISMA LÍNEA -->


<!-- Botón centrado y checkbox al final -->
      <div class="d-flex justify-content-end align-items-center mt-3">
        <!-- Espacio izquierdo para centrar el botón -->
        

        <!-- Checkbox al final -->
        <div class="form-check form-switch ms-3">
          <input
            type="checkbox"
            id="historico"
            v-model="mostrarHistorico"
            class="form-check-input"
            @change="cargarClientes"
          />
          <label for="historico" class="form-check-label ms-2">Histórico</label>
        </div>
      </div>
      
        <!-- Aviso Legal -->
      <div class="text-center ">
        <input
          type="checkbox"
          id="avisolegal"
          v-model="avisoLegal"
          class="form-check-input"
        />
        Aceptar terminos y condiciones: 
        <span class="form-check-label ms-3 me-5 mb-0">
          <router-link to="/aviso-legal">Aviso Legal</router-link>
        </span>
      </div>

      <!-- Botón centrado -->
      <div class="text-center">
        <button
          type="submit"
          class="btn btn-primary border-0 shadow-none rounded-0"
          :disabled="!avisoLegal"
        >
          {{ editando ? 'Modificar Cliente' : 'Guardar Cliente' }}
        </button>
      </div>

</form>
    <!-- Lista de Clientes -->
    <div class="table-responsive">
      <h4 class="text-center w-100">Listado Clientes</h4>
      <table class="table table-bordered table-striped table-hover table-sm align-middle">
        <thead class="table-primary">
          <tr >
            <th class="text-center">ID</th>
            <th class="text-center">Apellidos</th>
            <th class="text-center">Nombre</th>
            <th class="text-center">Móvil</th>
            <th class="text-center">Municipio</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cliente, index) in clientesPaginados" :key="cliente.id || index" >
            <th scope="row" class="text-center">{{ (currentPage -1) * clientesPorPage + index + 1 }}</th>
            <td >{{ cliente.apellidos }}</td>
            <td >{{ cliente.nombre }}</td>
            <td class="text-center">{{ cliente.movil }}</td>
            <td class="text-center">{{ cliente.municipio }}</td>
            <td class="align-middle text-center">
              <button
                @click="eliminarCliente(cliente.movil)"
                class="btn btn-danger btn-sm me-2 border-0 shadow-none rounded-0"
                title="Eliminar Cliente"
                aria-label="Eliminar Cliente">
                <i class="bi bi-trash"></i>
              </button>
              <button
                @click="editarCliente(cliente.movil)"
                class="btn btn-warning btn-sm border-0 shadow-none rounded-0"
                title="Editar cliente"
                aria-label="Editar cliente">
                <i class="bi bi-pencil"></i>
              </button>
              <button
                  v-if="cliente.historico === false"
                  @click="activarCliente(cliente)"
                  class="btn btn-secondary btn-sm ms-2 border-0 shadow-none rounded-0"
                  title="Activar cliente">
                  <i class="bi bi-unlock-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Navegación de página -->
       <!-- <div class="d-flex justify-content-center my-3">
        <button class="btn btn-outline-primary btn-sm me-2" disabled>
          <i class="bi bi-chevron-left"></i>Anterior
        </button>
        <span class="mx-3 align-self-center">Página {{ currentPage }}</span>
        <button class="btn btn-outline-primary btn-sm" disabled>
          Siguiente<i class="bi bi-chevron-right"></i>
        </button>
       </div> -->
       
    </div>
  <!-- </div> -->
   <!-- Navegación de página-->
       <div class="d-flex justify-content-center my-3">
        <button class="btn btn-outline-primary btn-sm me-2 rounded-0 border-1 shadow-none" 
        @click = "beforePagina" :disabled="currentPage <= 1">
          <i class="bi bi-chevron-left "></i>
        </button>
        <span class="mx-3 align-self-center text-muted">Página {{ currentPage  }}</span>
        <button class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none" 
        @click="nextPagina" :disabled="currentPage >= totalPages">
         <i class="bi bi-chevron-right "></i>
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
import AvisoLegal from './AvisoLegal.vue';

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
  tipoCliente: ''  // Nuevo campo para tipo de cliente
});

// Función Listar Clientes con get
const clientes = ref([]) // Array de todos los clientes cargados

// // Cargar clientes al montar el componente 
// onMounted(async () => {
//   clientes.value = await getClientes()
//   Swal.fire({
//     icon: 'success',
//     title: "Listando Clientes...",
//     showConfirmButton: false,
//     timer: 1500
//     });
// })

// Cargar clientes al montar el componente 
onMounted(async () =>{
  cargarClientes()
})

const cargarClientes = () => {
  getClientes(mostrarHistorico.value).then(data => {
    clientes.value = data
    numClientes.value = data.length // Actualiza el número total de clientes
    currentPage.value = 1; //Reiniciar a la primera página al cargar
  })
  Swal.fire({
    icon: 'success',
    title: "Listando Clientes...",
    showConfirmButton: false,
    timer: 150
  });
}

const editando = ref(false)
const clienteEditandoId = ref(null)

const mostrarHistorico = ref(false)
const numClientes = ref(0); // Número total de clientes para paginación
const currentPage = ref(1); // Página actual (para paginación)
const clientesPorPage = 10; // Num de clientes por page
const avisoLegal = ref(false); // Checkbox Aviso Legal

const agregarCliente = () => {
  clientes.value.push({ ...nuevoCliente.value });
  // Reiniciar el formulario
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
    historico: false
  };
};

// const eliminarCliente = (index) => { // esto también será modificado async (movil)
//   clientes.value.splice(index, 1);
// };

// Funcion Eliminar Cliente con patch (histórico a false)
const eliminarCliente = async (movil) => {
  // Refrescar lista desde la API
  clientes.value = await getClientes();
  // Buscar cliente completo (que incluye el ID)
  const clienteAEliminar = clientes.value.find(cliente => cliente.movil === movil);

  if (!clienteAEliminar) {
    Swal.fire({
      icon: 'error',
      title: 'Cliente no encontrado',
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }

  // Pedir confirmación antes de eliminar
  const result = await Swal.fire({
    title: `¿Eliminar al cliente ${clienteAEliminar.nombre} ${clienteAEliminar.apellidos}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });


  // Si no confirma, salir
  if (!result.isConfirmed) return;

  // Si confirma, eliminar cliente usando la API y movil como ID
  await deleteCliente(clienteAEliminar.id);
  // Refrescar la lista desde la "API"
  clientes.value = await getClientes();

  Swal.fire({
    icon: 'success',
    title: 'Cliente eliminado',
    showConfirmButton: false,
    timer: 1500
  });
};


// script AUXILIARES

// Falta la fecha y el municipio
// Función Editar Cliente (carga datos en el formulario)
const editarCliente = (movil) => {
  const cliente = clientes.value.find(c => c.movil === movil);
  if (!cliente) {
    Swal.fire({
      icon: 'error',
      title: 'Cliente no encontrado',
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }

  // Copiar datos al formulario
  nuevoCliente.value = { ...cliente }; // 🔁 Aquí cargas el formulario con los datos
  editando.value = true;
  // Formatear fecha para el input type="date"
  nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);
  // Actualiza municipios filtrados según la provincia seleccionada
  filtrarMunicipios();
  nuevoCliente.value.municipio = cliente.municipio;               // 🟢 Ahora estamos en modo edición
  clienteEditandoId.value = cliente.id;
};

  const activarCliente = async (cliente) => {
  const confirmacion = await Swal.fire({
    title: `¿Activar cliente ${cliente.nombre} ${cliente.apellidos}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Activar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmacion.isConfirmed) return;

  try {
    // Crear una copia del cliente con historico en true
    const clienteActivado = { ...cliente, historico: true };

    // Llamar a la API para actualizar
    const actualizado = await updateCliente(cliente.id, clienteActivado);

    // Actualizar la lista local (opcional, también puedes volver a cargar todo)
    const index = clientes.value.findIndex(c => c.id === cliente.id);
    if (index !== -1) {
      clientes.value[index] = actualizado;
    }

    Swal.fire({
      icon: 'success',
      title: 'Cliente reactivado',
      showConfirmButton: false,
      timer: 1500
    });

    // Recargar lista actualizada
    await cargarClientes();

  } catch (error) {
    console.error('Error al reactivar cliente:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al activar cliente',
      text: 'Por favor, intenta de nuevo.',
      timer: 1500
    });
  }
};

// // conversor fecha
// const formatearFechaParaInput = (fecha) => {
//   if (!fecha) return '';
//   const partes = fecha.split('/');
//   if (partes.length !== 3) return '';
//   // partes = [dd, mm, yyyy]
//   return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
// }


// Estado de validez del DNI/NIE si la estructura de datos es más compleja se usa reactive
const dniValido = ref(true);  // Por defecto es válido y no muestra error al iniciar

// Función para validar DNI y NIE
const validarDniNie = (valor) => {
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

  valor = valor.toUpperCase();

  if (dniRegex.test(valor)) {
      const numero = parseInt(valor.slice(0, 8), 10);
      const letra = valor.charAt(8);
      return letra === letras[numero % 23];  //sale con true si es válido
    } else if (nieRegex.test(valor)) {
      const nie = valor.replace('X', '0').replace('Y', '1').replace('Z', '2');
      const numero = parseInt(nie.slice(0, 8), 10);
      const letra = valor.charAt(8);
      return letra === letras[numero % 23];  //sale con true si es válido
    }
  return false; 
};

// Validar al salir del campo
const validarDni = () => {
  nuevoCliente.value.dni = nuevoCliente.value.dni.trim().toUpperCase();
  dniValido.value = validarDniNie(nuevoCliente.value.dni);
};

// Estado de validez del email y móvil
// const emailValido = ref(true);
// const movilValido = ref(true);

// Validar Email
// const validarEmail = () => {
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   emailValido.value = regex.test(nuevoCliente.value.email.trim());
// };
// control email 

const emailValido = ref(true);
const validarEmail = () => {
  const email = nuevoCliente.value.email.trim();
  // Expresión simple para email válido
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailValido.value = regex.test(email);
};

// Validar Móvil (ejemplo para España: 9 dígitos, empieza por 6 o 7)
// const validarMovil = () => {
//   if (!nuevoCliente.value.movil) {
//     movilValido.value = true; // si está vacío, no marca error
//     return;
//   }
//   const regex = /^[67][0-9]{8}$/;
//   movilValido.value = regex.test(nuevoCliente.value.movil.trim());
// };
// Control móvil
const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;

const validarMovil = () => {
  const movil = nuevoCliente.value.movil.trim();

  if (movil === '') {
    movilValido.value = true; // Vacío = válido (opcional)
    return true;
  }

  if (movil.charAt(0) === '6' || movil.charAt(0) === '7') {
    movilValido.value = movilRegex.test(movil);
    return movilValido.value;
  } else {
    movilValido.value = false;
    return false;
  }
  };

// Función única: capitaliza y asigna en el mismo paso
const capitalizarTexto = (campo) => {
  const texto = nuevoCliente.value[campo] ?? '';
  nuevoCliente.value[campo] = texto
    .toLowerCase()
    .split(' ')
    .map(palabra => {
      if (!palabra) return '';
      return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
    })
    .join(' ');
};

// Provincias y municipios

const provincias = ref(provmuniData.provincias); // Array de provincias
const municipios = ref(provmuniData.municipios); // Array de municipios para filtrarlos
const municipiosFiltrados = ref([]);  // vacío pero contendrá los municipios filtrados

const filtrarMunicipios = () => {
  // nombre de la provincia elegida en el <select>
  const nombreProv = nuevoCliente.value.provincia;

  // 1️⃣ buscar en provincias el objeto con ese nombre
  const prov = provincias.value.find(p => p.nm === nombreProv);
  if (!prov) {
    municipiosFiltrados.value = [];
    return;
  }

  // 2️⃣ los dos primeros dígitos del id de la provincia
  const codigoProv = prov.id.slice(0, 2);

  // 3️⃣ filtrar los municipios cuyo id empiece por esos dos dígitos
  municipiosFiltrados.value = municipios.value.filter(
    m => m.id.startsWith(codigoProv)
  );

  // 4️⃣ opcional: resetear el municipio si ya no corresponde
  nuevoCliente.value.municipio = '';
};

// const guardarCliente = async () => {
//   // Validar duplicados solo si estás creando (no si editando)
//   if (!editando.value) {
//     const duplicado = clientes.value.find(cliente =>
//       cliente.dni === nuevoCliente.value.dni ||
//       cliente.movil === nuevoCliente.value.movil ||
//       cliente.email === nuevoCliente.value.email
//     );
//     if (duplicado) {
//       Swal.fire({
//         icon: 'error',
//         title: 'DNI, móvil o email duplicados',
//         showConfirmButton: false,
//         timer: 2000
//       });
//       return;
//     }
//   }

//   // Confirmación antes de guardar
//   const result = await Swal.fire({
//     title: editando.value ? '¿Desea modificar este cliente?' : '¿Desea grabar este cliente?',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonText: editando.value ? 'Modificar' : 'Grabar',
//     cancelButtonText: 'Cancelar'
//   });

//   if (!result.isConfirmed) return;

//   try {
//     if (editando.value) {
//       // Modificar cliente (PUT)
//       const clienteActualizado = await updateCliente(clienteEditandoId.value, nuevoCliente.value);
//       // Actualiza el cliente en la lista local
//       const index = clientes.value.findIndex(c => c.id === clienteEditandoId.value);
//       if (index !== -1) clientes.value[index] = clienteActualizado;
//       Swal.fire({
//         icon: 'success',
//         title: 'Cliente modificado',
//         showConfirmButton: false,
//         timer: 1500
//       });
//     } else {
//       // Agregar cliente (POST)
//       const clienteAgregado = await addCliente(nuevoCliente.value);
//       clientes.value.push(clienteAgregado);
//       Swal.fire({
//         icon: 'success',
//         title: 'Cliente agregado',
//         showConfirmButton: false,
//         timer: 1500
//       });
//     }

//     // Reset formulario y estado
//     nuevoCliente.value = {
//       dni: '',
//       nombre: '',
//       apellidos: '',
//       email: '',
//       movil: '',
//       direccion: '',
//       provincia: '',
//       municipio: '',
//       fecha_alta: '',
//       historico: true
//     };
//     editando.value = false;
//     clienteEditandoId.value = null;

//     // Reset validaciones si tienes (dniValido, movilValido, etc)
//     dniValido.value = true;
//     movilValido.value = true;
//     emailValido.value = true;

//     // Refrescar lista completa (opcional)
//     clientes.value = await getClientes();

//   } catch (error) {
//     console.error('Error al guardar cliente:', error);
//     Swal.fire({
//       icon: 'error',
//       title: 'Error al guardar cliente',
//       text: 'Inténtelo de nuevo o contacte con el administrador.',
//       showConfirmButton: false,
//       timer: 1500
//     });
//   }
// };

const guardarCliente = async () => {
  // Antes de guardar, el usuario debe haber aceptado el Aviso Legal
  if (!avisoLegal.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Debes aceptar el Aviso Legal antes de guardar',
      showConfirmButton: false,
      timer: 2000
    });
    return;
  }
  // Validar duplicados solo si estás creando (no si editando)
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

  // Confirmación antes de guardar
  const result = await Swal.fire({
    title: editando.value ? '¿Desea modificar este cliente?' : '¿Desea grabar este cliente?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: editando.value ? 'Modificar' : 'Grabar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    if (editando.value) {
      // Asegurarnos de guardar el estado de aceptación LOPD según el checkbox
      nuevoCliente.value.lopd = avisoLegal.value;

      // Modificar cliente (PUT)
      const clienteActualizado = await updateCliente(clienteEditandoId.value, nuevoCliente.value);
      // Actualiza el cliente en la lista local
      const index = clientes.value.findIndex(c => c.id === clienteEditandoId.value);
      if (index !== -1) clientes.value[index] = clienteActualizado;
      Swal.fire({
        icon: 'success',
        title: 'Cliente modificado',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
       // Asegurarnos de guardar el estado de aceptación LOPD según el checkbox
      nuevoCliente.value.lopd = avisoLegal.value;

      // Agregar cliente (POST)
      const clienteAgregado = await addCliente(nuevoCliente.value);
      clientes.value.push(clienteAgregado);
      Swal.fire({
        icon: 'success',
        title: 'Cliente agregado',
        showConfirmButton: false,
        timer: 1500
      });
    }

    // Reset formulario y estado -- esto probablemente se quite -- si
    // nuevoCliente.value = {
    //   dni: '',
    //   nombre: '',
    //   apellidos: '',
    //   email: '',
    //   movil: '',
    //   direccion: '',
    //   provincia: '',
    //   municipio: '',
    //   fecha_alta: '',
    //   historico: true
    // };

    editando.value = true;
    clienteEditandoId.value = null;

    // Reset validaciones si tienes (dniValido, movilValido, etc)
    dniValido.value = true;
    movilValido.value = true;
    emailValido.value = true;

    // Refrescar lista completa (opcional)
    clientes.value = await getClientes();

  } catch (error) {
    console.error('Error al guardar cliente:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar cliente',
      text: 'Inténtelo de nuevo o contacte con el administrador.',
      showConfirmButton: false,
      timer: 1500
    });
  }
};

function formatearFechaParaInput(fecha) {
  console.log(fecha)
  if (!fecha) return '';

  // Detecta formato dd/mm/yyyy
  if (fecha.includes('/')) {
    const [dd, mm, yyyy] = fecha.split('/');
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }

  // Detecta formato yyyy-mm-dd
  if (fecha.includes('-')) {
    const partes = fecha.split('-');
    if (partes.length === 3) return fecha; // ya formato ISO
  }

  return '';
}

///CODIGO BUSQUEDA COMPONENTES

const buscarClientePorDNI = async (dni) => {
  if (!dni || dni.trim() === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Debe introducir un DNI antes de buscar.',
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
        text: 'No existe ningún cliente con ese DNI.',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    // ✅ Cargar los datos en el formulario
    nuevoCliente.value = { ...cliente };
    nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);

    // Actualiza lista de municipios si cambia la provincia
    filtrarMunicipios();
    //opcional
    editando.value = true;
    clienteEditandoId.value = cliente.id;

    Swal.fire({
      icon: 'success',
      title: 'Cliente encontrado y cargado',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error buscando cliente por DNI:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al buscar cliente',
      text: 'Verifique la conexión o contacte con el administrador.',
      timer: 2000,
      showConfirmButton: false
    });
  }}


///avanzar y retroceder
 
 // Métodos de paginación
const beforePagina = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPagina = () => {
  const totalPages = Math.ceil(numClientes.value / clientesPorPage); 
  //redondear hacia arriba para mostrar la última página aunque no esté completa
  if (currentPage.value < totalPages) {
    currentPage.value++;
  }
};

// Propiedad computada para obtener los clientes en la página actual
// computed crea una propiedad reactiva que se actualiza automáticamente
// cuando cambian las dependencias (currentPage o clientes) 
// es decir paso pagina o vuelvo atrás cargando los clientes de esa página
// slice extrae una sección del array clientes
// start es el índice inicial y end el índice final (no incluido)

const clientesPaginados = computed(() => {
  const start = (currentPage.value - 1) * clientesPorPage;
  const end = start + clientesPorPage;
  return clientes.value.slice(start, end);
});

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
    historico: true
  };
  editando.value = false;
  clienteEditandoId.value = null;

  // Reset validaciones
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
  display:block;
}

#app > main > div > form > div:nth-child(2) > div.col-md-6.d-flex.align-items-center.ms-auto {
  margin-left: 48px !important
}

/* .gestion-clientes {
  width: 95%;
  max-width: none;
  margin: 0 auto;
  padding: 2rem 0;
}

.form-control {
  width: 100%;
} */
</style>



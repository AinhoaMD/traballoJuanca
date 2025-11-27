<template>
  <div class="container">

    <form @submit.prevent="agregarNoticia" class="formulario" v-if="admin">
      <div>
        <label for="title">Título:</label>
        <input
          id="title"
          v-model="titulo"
          type="text"
          maxlength="128"
          required
        />
      </div>

      <div>
        <label for="contenido">Contenido:</label>
        <textarea
          id="contenido"
          v-model="contenido"
          maxlength="2556"
          required
        ></textarea>
      </div>

      <button type="submit" class="btn btn-sm btn-form">Publicar</button>
    </form>

    <hr />

    <!-- noticia el elemento, index la posicion del elemento en el array
    <div v-for="(noticia, index) in noticiasOrdenadas" :key="index" class="noticia">
      <div class="noticia-header">
        <h3>{{ noticia.titulo }}</h3>
        <small>{{ formatearFecha(noticia.fecha) }}</small>
      </div>

      <div v-if="noticia.expandida" class="noticia-contenido">
        <p>{{ noticia.contenido }}</p>
      </div>

      <div class="noticia-botones">
        <button @click="toggleExpand(index)">
          {{ noticia.expandida ? "Ocultar" : "Ver más" }}
        </button>
        <button @click="editarNoticia(index)">Editar</button>
        <button @click="eliminarNoticia(index)">Eliminar</button>
      </div>
    </div> -->
  

  <!-- Tabla sin bordes -->
  <table class="table table-borderless mt-3">
    <tbody>
      <template v-for="noticia in noticias" :key="noticia.id">  <!-- Template dentro de otro template-->
        <!-- Fila 1: título y fecha -->
        <tr>
          <td>
            <div class="d-flex justify-content-between">
              <strong class="text-primary">{{ noticia.titulo }}</strong>
              <small class="text-muted text-secondary">{{ formatearFecha(noticia.fecha) }}</small>
            </div>
          </td>
      </tr>
      <!-- Fila 2: contenido con "mostrar más/menos" -->
      <tr>
        <td>
          <span>
            {{ previewText(noticia) }}
          </span>
          <a
            v-if="canShowToggle(noticia)"
            href="#"
            @click.prevent="toggleExpand(noticia.id)"
            class="float-end text-decoration-none"
          >
            {{ isExpanded[noticia.id] ? 'Mostrar menos...' : 'Seguir leyendo...' }}
          </a>
        </td>
      </tr>
      <!-- Fila 3: botones -->
      <tr>
        <td class="text-end">
          <button
            class="btn-borrar"
            @click="eliminarNoticia(noticia.id)"
            v-if="admin"
          >
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
      <!-- Fila 4: espacio en blanco -->
      <tr><td>&nbsp;</td></tr>
    </template>
  </tbody>
</table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { addNoticia, getNoticias, deleteNoticia } from '@/api/noticias'

const titulo = ref('')
const contenido = ref('')
const noticias = ref([])
const isExpanded = ref({}) // para rastrear qué noticias están expandidas
const admin = localStorage.getItem("isAdmin")

onMounted(() => {
  cargarNoticias()
})

const toggleExpand = (id) => {
  isExpanded.value[id] = !isExpanded.value[id]
}

const cargarNoticias = async () => {
  try {
    const data = await getNoticias()
    noticias.value = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    // Inicializar el estado de expansión
    noticias.value.forEach(noticia => {
      isExpanded.value[noticia.id] = false
    })
  } catch (error) {
    console.error('Error al cargar noticias:', error)
  }
}

const agregarNoticia = async () => {
  if (!titulo.value.trim() || !contenido.value.trim()) {
    Swal.fire('Error', 'Rellena título y contenido', 'error')
    return
  }

  const nueva = {
    id: noticias.value.length > 0
      ? String(Math.max(...noticias.value.map(n => Number(n.id))) + 1)
      : '1',
    titulo: titulo.value.trim(),
    contenido: contenido.value.trim(),
    fecha: new Date().toISOString()
  }

  try {
    const res = await addNoticia(nueva)
    // actualizar lista local
    noticias.value.unshift(nueva)
    isExpanded.value[nueva.id] = false
    // limpiar formulario
    titulo.value = ''
    contenido.value = ''
    Swal.fire('OK', 'Noticia grabada', 'success')
  } catch (err) {
    console.error('Error al grabar noticia', err)
    Swal.fire('Error', 'No se pudo grabar la noticia', 'error')
  }
}

const eliminarNoticia = async (id) => {
  const confirm = await Swal.fire({
    title: '¿Eliminar noticia?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (!confirm.isConfirmed) return

  try {
    await deleteNoticia(id)
    noticias.value = noticias.value.filter(n => n.id !== id)
    Swal.fire('Eliminada', 'La noticia fue eliminada correctamente', 'success')
  } catch (err) {
    console.error('Error al eliminar noticia:', err)
    Swal.fire('Error', 'No se pudo eliminar la noticia', 'error')
  }
}

// Helpers para vista previa y control del enlace "seguir leyendo"
const PREVIEW_LIMIT = 100

const previewText = (noticia) => {
  if (!noticia || !noticia.contenido) return ''
  const id = noticia.id
  const full = noticia.contenido
  const expanded = isExpanded.value[id]
  if (expanded) return full
  if (full.length <= PREVIEW_LIMIT) return full
  return full.slice(0, PREVIEW_LIMIT).trimEnd() + '...'
}

const canShowToggle = (noticia) => {
  if (!noticia || !noticia.contenido) return false
  return noticia.contenido.length > PREVIEW_LIMIT
}

function formatearFecha(fecha) {
  if (!fecha) return ''
  try {
    const d = new Date(fecha)
    if (isNaN(d)) return fecha
    // Fecha corta (día mes año) + hora:minuto en formato español
    const fechaStr = d.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    const horaStr = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    return `${fechaStr} ${horaStr}`
  } catch (e) {
    return fecha
  }
}


// import { ref, computed, onMounted } from "vue";
// import noticiasData from "../data/db.json"; // ajusta la ruta según tu estructura

// const titulo = ref("");
// const contenido = ref("");
// const noticias = ref([]);

// // cargar noticias desde el json
// onMounted(() => {
//   noticias.value = noticiasData.map((n) => ({ ...n, expandida: false }));
// });

// // ordenar por fecha (más reciente primero)
// const noticiasOrdenadas = computed(() =>
//   [...noticias.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
// );

// // agregar nueva noticia
// function agregarNoticia() {
//   const nueva = {
//     titulo: titulo.value,
//     contenido: contenido.value,
//     fecha: new Date().toISOString(),
//     expandida: false,
//   };
//   noticias.value.push(nueva);
//   titulo.value = "";
//   contenido.value = "";
// }

// // eliminar noticia
// function eliminarNoticia(index) {
//   noticias.value.splice(index, 1);
// }

// // alternar expansión
// function toggleExpand(index) {
//   noticias.value[index].expandida = !noticias.value[index].expandida;
// }

// // editar noticia (simple)
// function editarNoticia(index) {
//   const noticia = noticias.value[index];
//   titulo.value = noticia.titulo;
//   contenido.value = noticia.contenido;
//   noticias.value.splice(index, 1); // la quitamos para volverla a grabar
// }

// function formatearFecha(fecha) {
//   return new Date(fecha).toLocaleDateString("es-ES", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit"
//   });
// }


</script>

<style scoped>
.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
}

button {
  background-color: #4b6ef5;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 0.3rem;
}

.noticia {
  background: #f3f3f3;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
}

.noticia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.noticia-botones {
  margin-top: 0.5rem;
}

/* Evitar que el contenido estire los contenedores */
.container, table {
  word-break: break-word;
}

table.table {
  table-layout: fixed;
  width: 100%;
}

td {
  max-width: 100%;
  white-space: normal;
}

.btn-form {
  padding: 0.25rem 0.6rem; /* reduce el alto y el ancho */
  font-size: 0.85rem; /* texto un poco más pequeño */
  align-self: center; /* evita que se estire al ancho del formulario */
}

.btn-borrar {
  background-color: rgba(199, 64, 64, 0.734);
  color: white;
  border: none;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s ease;
}

.btn-borrar:hover {
  background-color: #c0392b;
}
</style>

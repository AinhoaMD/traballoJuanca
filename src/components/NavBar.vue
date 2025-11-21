<template>
  <nav class="navbar navbar-dark bg-primary sticky-top navbar-expand-lg">

    <div class="container-fluid">
      <!-- Marca o logo -->
      <a class="navbar-brand" href="#"><img src="/src/assets/porfavor.svg" width="100"></a>

      <!-- Botón de hamburguesa en pantallas pequeñas -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Links de navegación -->
      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <!-- <a class="nav-link" aria-current="page" href="#">Inicio</a> -->
             <router-link to="/" class="nav-link">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/clientes" class="nav-link">Clientes</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/noticias" class="nav-link">Noticias</router-link>
          </li>
          <li>
            <router-link to='/modelos' class="nav-link">Modelos</router-link>
          </li>
          <li>
            <router-link to="/citas-taller" class="nav-link">Citas Taller</router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link to="/" class="nav-link">Inicio</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Blog</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Contacto</a>
          </li> -->
        </ul>
      </div>
    </div>

    <!-- Dropdown de acceso/registro -->
        <div class="dropdown ms-auto">
          <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person fs-2"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <!-- Mostra “Acceso/Registro” se NON hai usuario logueado -->
            <li v-if="!isLogueado"><router-link class="dropdown-item" to="/login">Acceso</router-link></li>
            <li v-if="!isLogueado"><router-link class="dropdown-item" to="/clientes">Registro</router-link></li>
            <!-- Mostra “Cerrar Sesión” se está logueado -->
            <li v-if="isLogueado">
              <a class="dropdown-item" href="#" @click.prevent="logout">Cerrar Sesión</a>
            </li>
          </ul>
        </div>

  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Estado do login
const isLogueado = ref(false)
const userName = ref('')

// Cando o componente se monta, le localStorage (para cando montes a autenticación)
onMounted(() => {
  isLogueado.value = localStorage.getItem('isLogueado') === 'true'
  userName.value = localStorage.getItem('userName') || ''
})

// Logout
function logout() {
  // Borra datos de sesión do localStorage
  localStorage.removeItem('isLogueado')
  localStorage.removeItem('userName')
  localStorage.removeItem('isAdmin')
  localStorage.removeItem('isUsuario')

  // Actualiza estado
  isLogueado.value = false
  userName.value = ''

  // Redirixe ao inicio recargando a páxina
  window.location.href = '/'
}
</script>

<style>

.navbar-dark .nav-link {
  color: rgba(255,255,255,0.9); /* blanco suave */
}

.navbar-dark .nav-link:hover,
.navbar-dark .nav-link:focus {
  color: #fff; /* blanco intenso al pasar el ratón */
}

</style>

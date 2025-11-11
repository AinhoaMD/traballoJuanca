<template>
  <footer class="navbar navbar-dark bg-primary position-sticky top-0">
    <div class="container">
      <ul class="list-inline mb-0">
        <li class="list-inline-item"><router-link to="/aviso-legal" class="nav-link">Aviso legal</router-link></li>
        <li class="list-inline-item"><router-link to="/politica-privacidad" class="nav-link">Política de privacidad</router-link></li>
        <!-- <li class="list-inline-item"><a href="#" class="text-light text-decoration-none">Política de privacidad</a></li> -->
        <li class="list-inline-item"><a href="#" class="text-light text-decoration-none">Contacto</a></li>
      </ul>
      <p class="mb-1">&copy; {{ new Date().getFullYear() }} MiSitio. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup></script>

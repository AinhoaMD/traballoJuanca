<template>
  <div class="home">
    <header class="header">
      <div class="container header-inner">
        <h1 class="logo">Coches AMDC</h1>
      </div>
    </header>

    <section class="hero">
      <div class="container-fluid">
        <!-- <h2>Encuentra tu coche ideal</h2>
        <p>Vehículos nuevos y de ocasión a precios inmejorables.</p> -->
        <!-- <form class="search" @submit.prevent>
          <input type="text" placeholder="Buscar marca o modelo" />
          <button>Buscar</button>
        </form> -->
        <div class="container-login">
          <div class="login-box">
            <h2>Benvido a AMDC!</h2>
            <!-- <h2>Inicio de sesión</h2>
            <form @submit.prevent="login">
              <div class="field">
                <label for="email">Correo electrónico</label>
                <input id="email" type="email" v-model="email" required />
              </div>

              <div class="field">
                <label for="password">Contraseña</label>
                <input id="password" type="password" v-model="password" required />
              </div>

              <button type="submit">Entrar</button>
            </form> -->
          </div>
        </div>
      </div>
    </section>

    <main class="container cars" id="cars">
      <h2>Modelos destacados</h2>
      <div class="grid">
        <div class="card">
          <img src="/frontend/assets/mazdarx7.jpg" alt="Coche" />
          <h3>Mazda RX-7</h3>
          <p>Coche de Amuro</p>
          <!-- <button>Ver detalles</button> -->
        </div>
        <div class="card">
          <img src="/frontend/assets/chevroletc1500.jpg" alt="Coche" />
          <h3>Chevrolet C‑1500</h3>
          <p>Coche de Akai</p>
          <!-- <button>Ver detalles</button> -->
        </div>
        <div class="card">
          <img src="/frontend/assets/porsche356a.jpg" alt="Coche" />
          <h3>Chevrolet C‑1500</h3>
          <p>Coche de Gin</p>
          <!-- <button>Ver detalles</button> -->
        </div>
        <div class="card">
          <img src="/frontend/assets/beetle.png" alt="Coche" />
          <h3>Volkswagen Beetle</h3>
          <p>Coche de Agasa</p>
          <!-- <button>Ver detalles</button> -->
        </div>
      </div>
    </main>

    <!-- <footer class="footer" id="contact">
      <div class="container">
        <p>© {{ new Date().getFullYear() }} AMDC — Todos los derechos reservados.</p>
      </div>
    </footer> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const login = () => {
  alert(`Iniciando sesión con:\nEmail: ${email.value}\nPassword: ${password.value}`)
}
</script>

<style scoped>
:root {
  --accent: #0b72ff;
  --text: #333;
}

body {
  font-family: system-ui, sans-serif;
  margin: 0;
  color: var(--text);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  background: #fff;
  border-bottom: 1px solid #eee;
}

.header-inner {
  flex-direction: column;
  text-align: center;
  padding: 1rem;
}

.logo {
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.nav a {
  margin-left: 1rem;
  text-decoration: none;
  color: var(--text);
}

/* .hero {
  background: linear-gradient(180deg, rgba(11,114,255,0.05), #fff);
  text-align: center;
  padding: 3rem 1rem;
} */

/* .hero h2 {
  margin: 0 0 0.5rem;
} */

.search {
  margin-top: 1rem;
}

.search input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* .search button {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 6px;
} */

.cars {
  padding: 2rem 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.card {
background: #fff;
border: 1px solid #eee;
border-radius: 8px;
text-align: center;
padding: 1rem;
box-shadow: 0 2px 8px rgba(0,0,0,0.05);
transition: transform 0.3s ease, box-shadow 0.3s ease;
}


.card:hover {
transform: scale(1.05);
box-shadow: 0 6px 20px rgba(11,114,255,0.3);
}

.card img {
width: 100%;
height: 140px;
object-fit: cover;
border-radius: 6px;
background: #f3f4f6;
transition: filter 0.3s ease;
}


.card:hover img {
filter: brightness(1.1);
}


/* .card button {
margin-top: 0.5rem;
background: var(--accent);
color: #fff;
border: none;
padding: 0.5rem 1rem;
border-radius: 6px;
cursor: pointer;
transition: background 0.3s ease;
}


.card button:hover {
background: #095ed1;
} */

.footer {
  background: #111;
  color: #fff;
  text-align: center;
  padding: 1rem 0;
  margin-top: 2rem;
}

.container-login {
  background-image: url("@/assets/cocheConan.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 89.5vh;

  display: flex;
  align-items: center;
  justify-content: center;

  /* Capa de oscurecimiento sutil sobre el fondo */
  position: relative;
}

.container-login::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); /* oscurece el fondo */
}

.login-box {
  position: relative; /* para quedar sobre el ::before */
  background: rgba(255, 255, 255, 0.5); /* Fondo con 50% de opacidad */
  backdrop-filter: blur(6px);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.login-box h2 {
  margin-bottom: 1.2rem;
  color: #1f2937;
}

.field {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 1rem;
}

.field label {
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 0.3rem;
}

.field input {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #1e40af;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background-color: #1d4ed8;
}
</style>

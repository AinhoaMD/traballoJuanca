<template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-75 mt-5">
    <div class="text-center mb-4">
      <h5 class="fw-bold text-uppercase text-primary position-relative d-inline-block">
        <i class="bi bi-people-fill me-2 fs-3"></i>
        Iniciar sesión
        <span class="underline-effect"></span>
      </h5>
    </div>

    <div class="border p-4 shadow-sm rounded w-100" style="max-width: 400px;">
      <form @submit.prevent="iniciarSesion">
        <div class="mb-3">
          <label for="dni" class="form-label fw-bold">DNI:</label>
          <input type="text" id="dni" autocomplete="off" @blur="capitalizarTexto" class="form-control text-center" v-model="dni" required />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label fw-bold">Contraseña:</label>
          <input type="password" id="password" autocomplete="new-password" class="form-control" v-model="pass" required />
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-primary w-50">Iniciar sesión</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// DEBE QUEDAR CLARO QUE ESTA É UNHA SIMULACIÓN DE LOGIN PARA FINS DIDÁCTICOS CON JSON-SERVER
// EN NINGÚN CASO DEBE USARSE ESTA IMPLEMENTACIÓN EN PRODUCCIÓN
// PARA UNHA APLICACIÓN REAL, O LOGIN DEBE XESTIONARSE NO LADO DO SERVIDOR CON HTTPS Y JWT SEGURO
/*  JWT (JSON Web Token) es un estándar que permite transmitir información segura entre un cliente (frontend) 
y un servidor (backend) como un token firmado.
Cómo funciona:
1. Login: El usuario introduce DNI y contraseña.
2. Backend valida las credenciales.
3. Genera un token JWT que contiene datos como: id, nombre, tipo (admin o user) y un tiempo de expiración (exp).
4. El token se envía al frontend y se guarda en sessionStorage o localStorage.
5. Cada vez que el frontend hace una petición protegida, envía ese token en los headers (Authorization: Bearer <token>).
6. El backend verifica el token: si es válido y no expiró, concede acceso; si no, devuelve error.
Aunque un usuario pueda decodificar el token en el frontend y ver los datos (tipo, nombre, etc.), 
no puede modificarlo para actuar como admin porque:
El token está firmado con una clave secreta que solo el backend conoce.
Si alguien modifica el token, la firma ya no coincidirá y el backend lo rechazará.
Por eso, la seguridad real siempre reside en el backend, no en el token visible en el frontend. */

import Swal from 'sweetalert2';
import { loginUsuario } from "@/api/authApi.js";
import * as jwtDecode from 'jwt-decode';  // Importación de la librería jwt-decode de forma antigua
// de importación por eso el "* as" no funciona con "import jwtDecode from 'jwt-decode';"
// npm install jwt-decode  o  npm install jwt-decode@3.1.2

export default {
  name: "TablaLogin",
  data() {
    return {
      dni: "",
      pass: "",
    };
  },
  
  methods: {
    async iniciarSesion() {
      try {

        this.dni = this.dni.toUpperCase().trim();
        this.pass = this.pass.trim(); 
        if (this.dni === "" || this.pass === "") {
          await Swal.fire({
            title: "Campos vacíos",
            text: "Por favor, complete ambos campos.",
            icon: "warning",
            confirmButtonText: "Aceptar"
          });
          return;
        }

        const data = await loginUsuario(this.dni, this.pass);
       
        
        // Guardar token y datos del usuario en sessionStorage o sessionStorage
        sessionStorage.setItem('token', data.token);
        //sessionStorage.setItem('userName', data.nombre);
        sessionStorage.setItem('isLogueado', 'true');

        // Decodificar el token JWT para obtener el tipo de usuario


        const decoded = jwtDecode.default(data.token);
        

        /*
        if (data.tipo === "admin") {
          sessionStorage.setItem('isAdmin', 'true');
        } else {
          sessionStorage.setItem('isUsuario', 'true');
        }
        */
        sessionStorage.setItem('token', data.token)
        if (decoded.tipo === "admin") {
            sessionStorage.setItem('isAdmin', 'true');
            sessionStorage.setItem('userName', data.nombre);
            sessionStorage.setItem('isUser', 'false');
            sessionStorage.setItem('userDni', this.dni)
          } else {
            sessionStorage.setItem('isAdmin', 'false');
            sessionStorage.setItem('userName', data.nombre);
            sessionStorage.setItem('isUser', 'true');
            sessionStorage.setItem('userDni', this.dni)
          }
        console.log(decoded.tipo)

        Swal.fire({
          title: "Bienvenido",
          text: `Hola ${data.nombre}`,
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
        // Redirigir a la página de inicio y recargar con $router
        // $router se usa para evitar problemas de historial en SPA
        // window.location.reload() recarga la página para reflejar el estado autenticado
        this.$router.push({ name: 'Inicio' }).then(() => window.location.reload());

      } catch (error) {
        console.error("Error en iniciarSesion:", error);
        Swal.fire({
          title: "Error de autenticación",
          text: "Error usuario o contraseña. Verifica tus credenciales.",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      }
    },
  }
};

// DEBE QUEDAR CLARO QUE ESTA É UNHA SIMULACIÓN DE LOGIN PARA FINS DIDÁCTICOS CON JSON-SERVER
// EN NINGÚN CASO DEBE USARSE ESTA IMPLEMENTACIÓN EN PRODUCCIÓN
// PARA UNHA APLICACIÓN REAL, O LOGIN DEBE XESTIONARSE NO LADO DO SERVIDOR CON HTTPS Y JWT SEGURO

// import Swal from 'sweetalert2';
// import { loginUsuario } from "@/api/authApi.js";
// import { onMounted } from 'vue';
// // import * as jwtDecode from 'dwt-decode';

// export default {
//   name: "TablaLogin",
//   data() {
//     return {
//       dni: "",
//       pass: "",
//     };
//   },
  
//   methods: {
//     async iniciarSesion() {
//       try {

//         this.dni = this.dni.toUpperCase().trim();
//         this.pass = this.pass.trim();
//         if (this.dni === "" || this.pass === ""){
//           Swal.fire({
//             title: "Campos Vacíos",
//             text: "Por favor, complete ambos campos",
//             icon: "warning",
//             confirmButtonText: "Aceptar"
//           });
//           return
//         }

//         const data = await loginUsuario(this.dni, this.pass);

//         // Guardar token y datos del usuario en sessionStorage
//         sessionStorage.setItem('token', data.token);
//         sessionStorage.setItem('userName', data.nombre);
//         sessionStorage.setItem('isLogueado', 'true');

//         if (data.tipo === "admin") {
//           sessionStorage.setItem('isAdmin', 'true');
//         } else {
//           sessionStorage.setItem('isUsuario', 'true');
//         }

//         Swal.fire({
//           title: "Bienvenido",
//           text: `Hola ${data.nombre}`,
//           icon: "success",
//           showConfirmButton: false,
//           timer: 2000
//         });
//         // Redirigir a la página de inicio y recargar con $router
//         // $router se usa para evitar problemas de historial en SPA
//         // window.location.reload() recarga la página para reflejar el estado autenticado
//         this.$router.push({ name: 'Inicio' }).then(() => window.location.reload());

//       } catch (error) {
//         console.error("Error en iniciarSesion:", error);
//         Swal.fire({
//           title: "Error de autenticación",
//           text: "Error usuario o contraseña. Verifica tus credenciales.",
//           icon: "error",
//           confirmButtonText: "Aceptar"
//         });
//       }
//     },
//         // Función única: capitaliza y asigna en el mismo paso
//     capitalizarTexto() {
//       this.dni = this.dni.toUpperCase().trim();
//     }
//   }
// };


// Esto es un tipo de formato más antiguo pero copió y pegó uno antiguo que tenía

  
  // import Swal from 'sweetalert2';
  // // import passport from  '../config/passport.mjs';
  // import { loginUsuario } from '../api/authApi';
  
  // export default {
  //   name: "TablaLogin",
  //   // components: {
      
  //   // },
  //   data() {
  //     return {
  //       dni: "",
  //       pass: "",
  //       errorMessage: "",
  //       usuarios: [] // Aquí se almacenarán los usuarios cargados desde el archivo JSON
  //     };
  //   },

  //   mounted() {
  //     // Cargar los usuarios desde el archivo datos.json al montar el componente
  //     console.log(this.$router.options.routes);

  //   },
  
  //   created() {
  //     // Cargar los usuarios desde el archivo datos.json al crear el componente
  //     this.getUsuarios();
  //   },

  //   methods: {

  //       async getUsuarios() {
  //           try {
  //               const response = await fetch('http://localhost:3000/usuarios');
  //               if (!response.ok) {
  //                   throw new Error('Error en la solicitud: ' + response.statusText);
  //               }

  //               // Obtener y ordenar usuarios por apellidos y luego por nombre
  //               this.usuarios = (await response.json()).sort((a, b) =>
  //                   a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre)
  //               );

  //               } catch (error) {
  //                   console.error(error);
  //               }
  //           },

  //       async iniciarSesion() {
  //           // Buscar el usuario con el DNI proporcionado
  //           const usuario = this.usuarios.find((user) => user.dni === this.dni);
    
  //           // Verificar si el usuario existe
  //           if (usuario) {
  //           // Verificar la contraseña usando passport para compararla con la encriptada
  //           const contrasenaCorrecta = await passport.verificarContrasena(
  //               this.pass,
  //               usuario.pass
  //           );
  
  //         if (contrasenaCorrecta) {
  //           // Guardar datos en Vuex al iniciar sesión
  //           this.$store.dispatch("login", usuario);
  //           if (usuario.tipo === "admin" || usuario.tipo === "usuario") {
  //             this.errorMessage = ""; // Limpiar mensaje de error si las credenciales son correctas
  //             this.mostrarAlerta("Bienvenido", "Sesión Iniciada", "success")
  //             sessionStorage.setItem('isLogueado', 'true')
  //             sessionStorage.setItem('userName', usuario.nombre)
  //             if (usuario.tipo === "admin") {
  //               sessionStorage.setItem('isAdmin', 'true')
  //               this.$router.push({ name: 'inicio' }).then(() => {
  //               window.location.reload();  // Recargar la página
  //             });
  //             } else {
  //               sessionStorage.setItem('isUsuario', 'true')
  //               this.$router.push({ name: 'inicio' }).then(() => {
  //               window.location.reload();  // Recargar la página
  //             });
  //             }
            
  //             // Redirigir o hacer algo después del inicio de sesión
  //           } else {
  //             this.errorMessage = "DNI y/o contraseña incorrectos 1.";
  //           }
  //           // Redirigir o hacer algo después del inicio de sesión
  //         } else {
  //           this.errorMessage = "DNI y/o contraseña incorrectos 2.";
  //         }
  //       } else {
  //         this.errorMessage = "DNI y/o contraseña incorrectos. 3";
  //       }
  //     },
  //          // Método para mostrar alertas
  //   mostrarAlerta(titulo, mensaje, icono) {
  //       Swal.fire({
  //         title: titulo,
  //         text: mensaje,
  //         icon: icono,
  //         showConfirmButton: false,
  //         timer: 3000,
  //         customClass: {
  //           container: 'custom-alert-container',
  //           popup: 'custom-alert-popup',
  //           modal: 'custom-alert-modal'
  //         }
  //       });
  //     }
  //   }
  // };
</script>

<style>
.form-label {
  background-color: transparent !important;
  margin-bottom: 0.5rem;
}
</style>

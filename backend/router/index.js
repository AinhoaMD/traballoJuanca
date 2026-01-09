import NotFound from '@/components/NotFound.vue'
import PaginaInicio from '@/components/PaginaInicio.vue'
import GestionClientes from '@/components/GestionClientes.vue'
import NotiCias from '@/components/NotiCias.vue';
import { createRouter, createWebHistory } from "vue-router";
import AvisoLegal from '@/components/AvisoLegal.vue';
import PoliticaPrivacidad from '@/components/PoliticaPrivacidad.vue';
import MoDelos from '@/components/MoDelos.vue';  
import CitasTaller from '@/components/CitasTaller.vue';
import TablaLogin from '@/components/TablaLogin.vue';
import VenTas from '@/components/VenTas.vue';
import ConTacto from '@/components/ConTacto.vue';
import BusCar from '@/components/BusCar.vue';



const routes = [
  {
    path: "/", // Ruta raíz o la que se carga al iniciar la aplicación
    name: "Inicio",
    component: PaginaInicio,
  },
  {
    path: "/clientes",
    name: "GestionClientes",
    component: GestionClientes,
  },
  {
    path: "/noticias",
    name: "NotiCias",
    component: NotiCias,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/aviso-legal",
    name: "AvisoLegal",
    component: AvisoLegal,
  },
  {
    path: "/politica-privacidad",
    name: "ProliticaPrivacidad",
    component: PoliticaPrivacidad,
  },
  {
    path: "/modelos",
    name: "MoDelos",
    component: MoDelos,
  },
  {
    path: "/citas-taller",
    name: "CitasTaller",
    component: CitasTaller,
  },
  {
    path: "/login",
    name: "TablaLogin",
    component: TablaLogin,
  },
  {
    path: "/ventas",
    name: "VenTas",
    component: VenTas,
  },
  {
    path: "/contacto",
    name: "ConTacto",
    component: ConTacto,
  },
  {
    path: "/buscar",
    name: "BusCar",
    component: BusCar
  }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
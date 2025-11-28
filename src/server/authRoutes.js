import { login, verificarToken, soloAdmin } from "./authController.js";
import express from "express";

const router = express.Router();

router.post("/login", login);

// Ruta protegida (ejemplo)
// Solo accesible con JWT válido y rol de admin
// sino pongo soloAdmin entonces cualquier usuario autenticado puede acceder

router.get("/modelos", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola ${req.user.nombre}, estás autenticado`});
});

export default router;
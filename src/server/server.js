import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';

import articulosRoutes from "./articulosRoutes";
import { fileURLToPath } from "url";

//dotenv.config(path.resolve(process.cwd(), "env"));
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.MONGODB_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Could not connect to MongoDB", err));

// Iniciar el servidor Express
app.listen(PORT, () => {
    console.log(`Server Express está corriendo en el puerto ${PORT}`);
});

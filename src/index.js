require("dotenv").config();
const express = require('express')
const database = require("./config/database")
const routes = require("./router/routes")
const bodyparser = require("body-parser")
const cors = require("cors")

const app = express();

// Middleware CORS
app.use(cors({
    origin: ["http://localhost:5173", "https://med-core-ewen0o414-andres2417s-projects.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Middleware: POST, PUT, PATCH
app.use(bodyparser.json());

// Monta todas las rutas bajo el prefijo /api/v1/
app.use('/v1/', routes)

// Iniciar la conexión a la base de datos
database();

module.exports = app; 

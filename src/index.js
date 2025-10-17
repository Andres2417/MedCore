import 'dotenv/config'; // equivalente a require('dotenv').config()
import express from 'express';
//import database from './config/database.js';
import routes from './router/routes.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;
// Middleware CORS
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://med-core.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.get('/', (req, res) => {
  res.send('🚀 Backend funcionando correctamente');
});
// Middleware: POST, PUT, PATCH
app.use(bodyParser.json());

app.get('/api/v1/test', (req, res) => {
  res.status(200).json({
    message: 'Backend en Vercel funcionando',
    timestamp: new Date().toISOString(),
  });
});
app.use('/api/v1', routes);


// Iniciar la conexión a la base de datos
//database();

export default app;

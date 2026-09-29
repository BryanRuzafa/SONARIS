// Importem les llibreries necessàries
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carreguem les variables d'entorn
dotenv.config();

// Inicialitzem l'aplicació Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware per permetre peticions des del frontend (CORS) i processar JSON
app.use(cors());
app.use(express.json());

// Importem i registrem totes les rutes de l'aplicació
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Servidor SONARIS operatiu 🚀');
});

app.get('/api/estat', (req, res) => {
  // Retornem l'estat del servidor en format JSON
  res.json({
    missatge: 'Tot funciona correctament',
    data: new Date().toISOString()
  });
});

// Importar i iniciar tasques en segon pla (Cron Jobs) automatitzades
const { iniciarRadarUnderground } = require('./jobs/radarJob');
iniciarRadarUnderground();

const http = require('http');
const { Server } = require('socket.io');

// Creem el servidor HTTP per adjuntar-lo a Express
const server = http.createServer(app);

// Inicialitzem WebSockets (Socket.io) per permetre connexions bidireccionals per al Playground
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Implementem la lògica de les sales de joc al socket handler
const socketHandler = require('./sockets/socketHandler');
socketHandler(io);

// Iniciem el servidor HTTP combinat
server.listen(port, () => {
  console.log(`Servidor SONARIS i Radar de WebSockets escoltant al port ${port}`);
  console.log(`Pots accedir a http://localhost:${port}`);
});

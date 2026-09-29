const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Ruta per obtenir les dades principals del dashboard
router.get('/dades', dashboardController.obtenirDadesDashboard);

// Ruta per regenerar només la Dada del Dia (inclou Roast Mode)
router.get('/dada-del-dia', dashboardController.obtenirDadaDelDia);
// Ruta per obtenir el top d'artistes o cançons amb filtre de termini temporal
router.get('/top/:tipus', dashboardController.obtenirTop);

// Ruta per obtenir les playlists de l'usuari
router.get('/playlists', dashboardController.obtenirPlaylists);

// Rutes per al Netejador de Playlists
router.get('/playlists/:id/duplicats', dashboardController.analitzarDuplicats);
router.post('/playlists/:id/netejar', dashboardController.eliminarDuplicats);

// Ruta per al Radar de Concerts
router.post('/concerts', dashboardController.obtenirConcerts);

// Ruta pel Creador de Cartells de Festival
router.get('/festival', dashboardController.generarFestival);

// Rutes per a la Configuració del Radar Underground
router.get('/radar/generes', dashboardController.obtenirGeneresSpotify);
router.get('/radar/config', dashboardController.obtenirConfigRadar);
router.put('/radar/config', dashboardController.actualitzarConfigRadar);
router.post('/radar/executar', dashboardController.executarRadarManual);
// Ruta per a obtenir cançons dinàmiques pel Tinder Musical
router.get('/tinder-tracks', dashboardController.obtenirCanconsTinder);
router.get('/activitat', dashboardController.obtenirActivitatRecent);


const contextController = require('../controllers/contextController');

// Rutes per a Intel·ligència Artificial i Context
router.post('/diari', contextController.processarDiariEmocional);
router.post('/soundtrack', contextController.generarSoundtrack);

module.exports = router;

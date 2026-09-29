const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Defineix les rutes /api/auth/...
router.get('/login', authController.login);
router.get('/callback/spotify', authController.callback);

module.exports = router;

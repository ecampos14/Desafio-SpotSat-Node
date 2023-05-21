const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/authController');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Bem-vindo a API GeoPoly!' });
});

router.post('/auth', authController.authenticate);

module.exports = router;

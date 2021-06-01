const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const dogRoutes = require('./dogs');
const temperamentRoutes = require('./temperament');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/dogs',dogRoutes);
router.use('/temperament',temperamentRoutes);

module.exports = router;

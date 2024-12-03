const express = require('express');
const router = express.Router();
const informeControllers = require('../controllers/informeControllers');
const { descargarInforme } = require("../controllers/descargarInformeController");

// Ruta para consultar todos los trabajos
router.get('/', informeControllers.consultar);

// Ruta para ingresar un nuevo trabajo
router.post('/', informeControllers.ingresar);

router.get("/descargar", descargarInforme);

// Ruta para consultar un equipo por número de serie
router.get('/buscar/:numero_serie', informeControllers.consultarPorNumeroSerie);

// Rutas para consultar, actualizar y borrar un trabajo por ID
router.route('/:id_trabajo')
    .get(informeControllers.consultarDetalles)
    .put(informeControllers.actualizar)
    .delete(informeControllers.borrar);

module.exports = router;
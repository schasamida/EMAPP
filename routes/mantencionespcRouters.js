const express = require('express');
const router = express.Router();
const mantencionespcControllers = require('../controllers/mantencionespcControllers');


router.get('/', mantencionespcControllers.consultar);

router.post('/',mantencionespcControllers.ingresar);


router.route("/:id_mc")           
   .get(mantencionespcControllers.consultarDetalles)
    .put(mantencionespcControllers.actualizar)
    .delete(mantencionespcControllers.borrar);

    module.exports = router;

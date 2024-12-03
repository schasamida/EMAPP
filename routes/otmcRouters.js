const express = require('express');
const router = express.Router();
const otmcControllers = require('../controllers/otmc.Crontrollers');


router.get('/', otmcControllers.consultar);

router.post('/',otmcControllers.ingresar);


router.route("/:id_ot")            //<----automatiza la secuencia /:id
   .get(otmcControllers.consultarDetalles)
    .put(otmcControllers.actualizar)
    .delete(otmcControllers.borrar);

    module.exports = router;
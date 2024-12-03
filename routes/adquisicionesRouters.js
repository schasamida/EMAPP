const express = require('express');
const router = express.Router();
const adquisicionesControllers = require('../controllers/adquisicionesControllers');


router.get('/', adquisicionesControllers.consultar);

router.post('/',adquisicionesControllers.ingresar);


router.route("/:id_a")            //automatiza la secuencia /:id
   .get(adquisicionesControllers.consultarDetalles)
    .put(adquisicionesControllers.actualizar)
    .delete(adquisicionesControllers.borrar);

    module.exports = router;
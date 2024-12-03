const express = require('express');
const router = express.Router();
const conveniosControllers = require('../controllers/conveniosControllers.js');


router.get('/', conveniosControllers.consultar);

router.post('/',conveniosControllers.ingresar);


router.route("/:id_con")            //automatiza la secuencia /:id
   .get(conveniosControllers.consultarDetalles)
    .put(conveniosControllers.actualizar)
    .delete(conveniosControllers.borrar);

    module.exports = router;
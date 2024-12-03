const express = require('express');
const router = express.Router();
const registroControllers = require('../controllers/registroControllers');


router.get('/', registroControllers.consultar);

router.post('/',registroControllers.ingresar);


router.route("/:id")            //automatiza la secuencia /:id
   .get(registroControllers.consultarDetalles)
    .put(registroControllers.actualizar)
    .delete(registroControllers.borrar);

    module.exports = router;
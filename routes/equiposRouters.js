const express = require('express');
const router = express.Router();
const equiposControllers = require('../controllers/equiposControllers');


router.get('/', equiposControllers.consultar);

router.post('/',equiposControllers.ingresar);


router.route("/:id_ie")            //<----automatiza la secuencia /:id
   .get(equiposControllers.consultarDetalles)
    .put(equiposControllers.actualizar)
    .delete(equiposControllers.borrar);

    module.exports = router;
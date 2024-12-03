const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorControllers.js');


router.get('/', proveedorController.consultar);

router.post('/',proveedorController.ingresar);


router.route("/:id")            //automatiza la secuencia /:id
   .get(proveedorController.consultarDetalles)
    .put(proveedorController.actualizar)
    .delete(proveedorController.borrar);

    module.exports = router;
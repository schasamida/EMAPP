const express = require('express');
const router = express.Router();
const usuariosControllers = require('../controllers/usuariosControllers');

// Ruta GET para obtener todos los usuarios
router.get('/', usuariosControllers.consultar);

// Ruta POST para registrar un nuevo usuario
router.post('/', usuariosControllers.ingresar);

// Ruta POST para login
router.post('/login', usuariosControllers.login);


// Rutas para consultar, actualizar y borrar usuarios por ID
// Definir la ruta para borrar un usuario por ID
router.route("/:id_r")            
    .get(usuariosControllers.consultarDetalles)
    .put(usuariosControllers.actualizar)
    .delete(usuariosControllers.borrar);
    

module.exports = router;

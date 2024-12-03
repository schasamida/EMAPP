const db = require('../database/conexion.js');
const bcrypt = require('bcryptjs');  // Importar bcrypt para la comparación de contraseñas

class UsuariosController {
    constructor() {}

    // Consultar todos los proveedores
    consultar(req, res) { 
        try {
            db.query(`SELECT * FROM usuarios`, (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }
                res.status(200).json(rows);
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Consultar detalle de un proveedor por ID
    consultarDetalles(req, res) { 
        const { id_r } = req.params;

        try {
            db.query(`SELECT * FROM usuarios WHERE id_r = ?`, [id_r], (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }
                res.status(200).json(rows);
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    
ingresar(req, res) { 
    try {
        const { nombre_usuario, email, contraseña } = req.body;

        
        bcrypt.hash(contraseña, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: "Error al cifrar la contraseña" });
            }

            const query = `
                INSERT INTO usuarios (nombre_usuario, email, contraseña) 
                VALUES (?, ?, ?);
            `;    

            // Guarda la contraseña cifrada en la base de datos
            db.query(query, [nombre_usuario, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                res.status(201).json({ id_con: result.insertId });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
    

    actualizar(req, res) {
        const { id_r } = req.params;
        try {
            const {nombre_usuario, email, contraseña} = req.body;
            db.query(
                `UPDATE usuarios SET  nombre_usuario = ?, email = ?, contraseña = ?                               
                 WHERE id_r = ?;`               
                ,
                [nombre_usuario, email, contraseña, id_r],
                (err, rows) => {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    if (rows.affectedRows == 1)
                        res.status(200).json({ respuesta: 'Usuario actualizado con éxito!' });
                    else
                        res.status(404).json({ respuesta: 'Usuario no encontrado' });
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

   
    
    login(req, res) {
        const { nombre_usuario, contraseña } = req.body;
    
        // Validación de campos
        if (!nombre_usuario || !contraseña) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
    
        const query = `
            SELECT * FROM usuarios 
            WHERE nombre_usuario = ? OR email = ? LIMIT 1
        `;
    
        db.query(query, [nombre_usuario, nombre_usuario], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Error en el servidor" });
            }
    
            // Validar si el usuario existe
            if (results.length === 0) {
                return res.status(401).json({ error: "Usuario no encontrado" });
            }
    
            const usuario = results[0];
    
            // Validar la contraseña cifrada usando bcrypt.compare
            bcrypt.compare(contraseña, usuario.contraseña, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ error: "Error en la comparación de contraseñas" });
                }
    
                if (!isMatch) {
                    return res.status(401).json({ error: "Contraseña incorrecta" });
                }
    
                // Respuesta exitosa si las contraseñas coinciden
                res.status(200).json({
                    mensaje: "Inicio de sesión exitoso",
                    usuario: {
                        id: usuario.id_r,
                        nombre_usuario: usuario.nombre_usuario,
                        email: usuario.email,
                    },
                });
            });
        });
    }
    



    borrar(req, res) {
        const { id_r } = req.params;  // Obtener el ID del usuario
        try {
            db.query(`DELETE FROM usuarios WHERE id_r = ?;`, [id_r], (err, rows) => {
                if (err) {
                    return res.status(400).send(err);  // Si ocurre un error en la consulta
                }
                if (rows.affectedRows == 1) {
                    return res.status(200).json({ respuesta: '¡Usuario eliminado con éxito!' });
                } else {
                    return res.status(404).json({ respuesta: 'Usuario no encontrado' });
                }
            });
        } catch (err) {
            res.status(500).send(err.message);  // Error en el servidor
        }
    }
    
}

module.exports = new UsuariosController();
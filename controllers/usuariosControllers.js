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
            const { nombre_usuario, email, contraseña, rol } = req.body;
    
            // Validar que el rol sea válido
            if (!['usuario', 'admin'].includes(rol)) {
                return res.status(400).json({ error: "Rol no válido. Debe ser 'usuario' o 'admin'." });
            }
    
            bcrypt.hash(contraseña, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ error: "Error al cifrar la contraseña" });
                }
    
                const query = `
                    INSERT INTO usuarios (nombre_usuario, email, contraseña, rol, estado) 
                    VALUES (?, ?, ?, ?, 'pendiente');
                `;
    
                db.query(query, [nombre_usuario, email, hashedPassword, rol], (err, result) => {
                    if (err) {
                        return res.status(400).json({ error: err.message });
                    }
                    res.status(201).json({ mensaje: "Usuario registrado. Pendiente de aprobación." });
                });
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
    aprobarUsuario(req, res) {
        const { id_r } = req.params;
    
        const query = `
            UPDATE usuarios SET estado = 'aprobado' WHERE id_r = ? AND estado = 'pendiente';
        `;
    
        db.query(query, [id_r], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error al actualizar el estado del usuario." });
            }
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: "Usuario no encontrado o ya aprobado." });
            }
    
            res.status(200).json({ mensaje: "Usuario aprobado exitosamente." });
        });
    }
    
    

    actualizar(req, res) {
        const { id_r } = req.params; // ID del usuario a actualizar
    
        try {
            const { nombre_usuario, email, contraseña, rol, estado } = req.body; // Datos enviados por el cliente
    
            // Validar que se envíen los datos requeridos
            if (!nombre_usuario || !email || !rol || !estado) {
                return res.status(400).json({ error: "Todos los campos son obligatorios." });
            }
    
            // Verificar si se debe actualizar la contraseña
            if (contraseña) {
                // Cifrar la nueva contraseña
                bcrypt.hash(contraseña, 10, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json({ error: "Error al cifrar la contraseña." });
                    }
    
                    // Actualizar el usuario con la nueva contraseña
                    const query = `
                        UPDATE usuarios 
                        SET nombre_usuario = ?, email = ?, contraseña = ?, rol = ?, estado = ?
                        WHERE id_r = ?;
                    `;
    
                    db.query(query, [nombre_usuario, email, hashedPassword, rol, estado, id_r], (err, rows) => {
                        if (err) {
                            return res.status(400).send(err);
                        }
                        if (rows.affectedRows == 1) {
                            res.status(200).json({ respuesta: "Usuario actualizado con éxito." });
                        } else {
                            res.status(404).json({ respuesta: "Usuario no encontrado." });
                        }
                    });
                });
            } else {
                // Actualizar el usuario sin cambiar la contraseña
                const query = `
                    UPDATE usuarios 
                    SET nombre_usuario = ?, email = ?, rol = ?, estado = ?
                    WHERE id_r = ?;
                `;
    
                db.query(query, [nombre_usuario, email, rol, estado, id_r], (err, rows) => {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    if (rows.affectedRows == 1) {
                        res.status(200).json({ respuesta: "Usuario actualizado con éxito." });
                    } else {
                        res.status(404).json({ respuesta: "Usuario no encontrado." });
                    }
                });
            }
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    }

    login(req, res) {
        const { nombre_usuario, contraseña } = req.body;
    
        // Consulta SQL para buscar un usuario aprobado
        const query = `
            SELECT * FROM usuarios 
            WHERE (nombre_usuario = ? OR email = ?) AND estado = 'aprobado' LIMIT 1;
        `;
    
        db.query(query, [nombre_usuario, nombre_usuario], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Error en el servidor" });
            }
    
            // Si no se encuentra el usuario o no está aprobado
            if (results.length === 0) {
                return res.status(401).json({ error: "Usuario no aprobado o no encontrado." });
            }
    
            const usuario = results[0];
    
            // Comparar la contraseña cifrada
            bcrypt.compare(contraseña, usuario.contraseña, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ error: "Error en la comparación de contraseñas" });
                }
    
                if (!isMatch) {
                    return res.status(401).json({ error: "Contraseña incorrecta" });
                }
    
                // Respuesta exitosa
                res.status(200).json({
                    mensaje: "Inicio de sesión exitoso",
                    usuario: {
                        id: usuario.id_r,
                        nombre_usuario: usuario.nombre_usuario,
                        email: usuario.email,
                        rol: usuario.rol,
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
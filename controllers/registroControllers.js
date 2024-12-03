const db = require('../database/conexion.js');

class RegistroController {
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
        const { id_u } = req.params;

        try {
            db.query(`SELECT * FROM usuarios WHERE id_u = ?`, [id_u], (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }
                res.status(200).json(rows);
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Ingresar un nuevo proveedor
    ingresar(req, res) { 
        try {
            const {nombre_usuario, email, contraseña, rol} = req.body;
    
            const query = `
                INSERT INTO usuarios (nombre_usuario, email, contraseña, rol) 
                VALUES (?, ?, ?, ?);
                `;    
            db.query(query, 
                [nombre_usuario, email, contraseña, rol], (err, result) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                res.status(201).json({ id_con: result.insertId });
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
    
////////////////////////// Actualizar un proveedor por ID ////////////////////////////
    actualizar(req, res) {
        const { id_u } = req.params;
        try {
            const {nombre_usuario, email, contraseña, rol} = req.body;
            db.query(
                `UPDATE usuarios SET  nombre_usuario = ?, email = ?, contraseña = ?, rol = ?                               
                 WHERE id_u = ?;`               
                ,
                [nombre_usuario, email, contraseña, rol, id_u],
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

    // Borrar un registro por ID
    borrar(req, res) {
        const id_u = Number(req.params.id_u);
        console.log("ID para borrar:", id_u);  
        try {
            db.query(`DELETE FROM usuarios WHERE id_u = ?;`, [id_u], (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }
                if (rows.affectedRows == 1)
                    res.status(200).json({ respuesta: '¡Usuario eliminado con éxito!' });
                else
                    res.status(404).json({ respuesta: 'Usuario no encontrado' });
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Asociar un estudiante a un curso
    asociarEstudiante(req, res) {
        try {
            const { curso_id, estudiante_id } = req.body;
            db.query(
                `INSERT INTO con_convenios (curso_id, estudiantes_id) VALUES(?, ?);`,
                [curso_id, estudiante_id],
                (err, rows) => {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    res.status(201).json({ respuesta: 'Usuario registrado con éxito' });
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

module.exports = new RegistroController();
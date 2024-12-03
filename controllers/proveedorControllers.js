const db = require('../database/conexion.js');

class ProveedorController {
    constructor() {}

    // Consultar todos los proveedores
    consultar(req, res) {
        try {
            db.query(`SELECT * FROM us_proveedores`, (err, rows) => {
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
        const { id } = req.params;
    
        try {
            db.query(`SELECT * FROM us_proveedores WHERE id = ?`, [id], (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }
                if (rows.length > 0) {
                    res.status(200).json(rows[0]); // Devuelve el primer elemento
                } else {
                    res.status(404).json({ message: "Proveedor no encontrado" }); // Manejo de error si no existe el proveedor
                }
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Ingresar un nuevo proveedor
    ingresar(req, res) {
        try {
            const { proveedor, contacto, correo, direccion } = req.body;
            db.query(
                `INSERT INTO us_proveedores (proveedor, contacto, correo, direccion) VALUES (?, ?, ?, ?);`,
                [proveedor, contacto, correo, direccion],
                (err, rows) => {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    res.status(201).json({ id: rows.insertId });
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Actualizar un proveedor por ID
    actualizar(req, res) {
        const { id } = req.params;
        try {
            const { proveedor, contacto, correo, direccion } = req.body;
            db.query(
                `UPDATE us_proveedores SET proveedor = ?, contacto = ?, correo = ?, direccion = ? WHERE id = ?;`,
                [proveedor, contacto, correo, direccion, id],
                (err, rows) => {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    if (rows.affectedRows == 1)
                        res.status(200).json({ respuesta: '¡Registro actualizado con éxito!' });
                    else
                        res.status(404).json({ respuesta: 'Proveedor no encontrado' });
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
// Borrar un equipo medico por ID
borrar(req, res) {
    const id = Number(req.params.id);
    console.log("ID para borrar:", id);  
    try {
        db.query(`DELETE FROM us_proveedores WHERE id = ?;`, [id], (err, rows) => {
            if (err) {
                return res.status(400).send(err);
            }
            if (rows.affectedRows == 1)
                res.status(200).json({ respuesta: '¡Registro eliminado con éxito!' });
            else
                res.status(404).json({ respuesta: 'Proveedor no encontrado' });
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
                `INSERT INTO cursos_estudiantes (curso_id, estudiantes_id) VALUES(?, ?);`,
                [curso_id, estudiante_id],
                (err, rows) => {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    res.status(201).json({ respuesta: 'Estudiante registrado con éxito' });
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

module.exports = new ProveedorController();
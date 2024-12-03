const db = require('../database/conexion.js');
const moment = require('moment'); 

class InformeController {
    constructor() {}

    
    consultar(req, res) {
        try {
            db.query(`SELECT * FROM trabajos_equipos`, (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }

                // Formatea las fechas antes de enviarlas
                rows = rows.map(row => ({
                    ...row,
                    fecha_trabajo: row.fecha_trabajo ? moment(row.fecha_trabajo).format('YYYY-MM-DD') : null,
                }));

                res.status(200).json(rows);
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

   
    consultarDetalles(req, res) {
        const { id_trabajo } = req.params;

        try {
            db.query(`SELECT * FROM trabajos_equipos WHERE id_trabajo = ?`, [id_trabajo], (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }
                if (rows.length > 0) {
                    const result = rows[0];
                    result.fecha_trabajo = result.fecha_trabajo ? moment(result.fecha_trabajo).format('YYYY-MM-DD') : null;
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "Informe no encontrado" });
                }
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }


ingresar(req, res) {
    try {
        const {
            numero_serie,
            nombre,
            marca,
            modelo,
            numero_invetario,
            servicio_clinico,
            referente_clinico,
            estado_garantia,
            folio,
            fecha_trabajo,
            tecnico,
            descripcion,
        } = req.body;

        const formattedDate = fecha_trabajo ? moment(fecha_trabajo).format('YYYY-MM-DD') : null;

        db.query(
            `INSERT INTO trabajos_equipos (
                numero_serie, nombre, marca, modelo, numero_invetario, servicio_clinico,
                referente_clinico, estado_garantia, folio, fecha_trabajo, tecnico, descripcion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                numero_serie,
                nombre,
                marca,
                modelo,
                numero_invetario,
                servicio_clinico,
                referente_clinico,
                estado_garantia,
                folio,
                formattedDate,
                tecnico,
                descripcion,
            ],
            (err, rows) => {
                if (err) {
                    console.error("Error al insertar el registro:", err);
                    return res.status(400).send(err);
                }
                res.status(201).json({ id: rows.insertId });
            }
        );
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).send(err.message);
    }
}


    
actualizar(req, res) {
    const { id_trabajo } = req.params; // ID del trabajo recibido en la URL
    try {
        const { 
            numero_serie,
            nombre,
            marca,
            modelo,
            numero_invetario,
            servicio_clinico,
            referente_clinico,
            estado_garantia,
            folio,
            fecha_trabajo,
            tecnico,
            descripcion 
        } = req.body;

        db.query(
            `UPDATE trabajos_equipos SET 
                numero_serie = ?,
                nombre = ?,
                marca = ?,
                modelo = ?,
                numero_invetario = ?,
                servicio_clinico = ?,
                referente_clinico = ?,
                estado_garantia = ?,
                folio = ?,
                fecha_trabajo = ?,
                tecnico = ?,
                descripcion = ?
            WHERE id_trabajo = ?;`,
            [
                numero_serie,
                nombre,
                marca,
                modelo,
                numero_invetario,
                servicio_clinico,
                referente_clinico,
                estado_garantia,
                folio,
                fecha_trabajo,
                tecnico,
                descripcion,
                id_trabajo
            ],
            (err, rows) => {
                if (err) {
                    console.error("Error al actualizar el registro:", err);
                    return res.status(400).send(err);
                }
                if (rows.affectedRows === 1) {
                    res.status(200).json({ respuesta: "¡Registro actualizado con éxito!" });
                } else {
                    res.status(404).json({ respuesta: "Trabajo no encontrado" });
                }
            }
        );
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).send(err.message);
    }
}



borrar(req, res) {
    const { id_trabajo } = req.params;

    try {
        db.query(
            `DELETE FROM trabajos_equipos WHERE id_trabajo = ?;`,
            [id_trabajo],
            (err, result) => {
                if (err) {
                    console.error("Error al eliminar el informe:", err);
                    return res.status(400).json({ error: "No se pudo eliminar el informe." });
                }
                if (result.affectedRows === 1) {
                    res.status(200).json({ message: "Informe eliminado con éxito." });
                } else {
                    res.status(404).json({ message: "Informe no encontrado." });
                }
            }
        );
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error en el servidor." });
    }
}



consultarPorNumeroSerie(req, res) {
    const { numero_serie } = req.params;

    try {
        db.query(
            `SELECT id_ie, nombre, marca, modelo, numero_invetario, servicio_clinico, referente_clinico, estado_garantia
             FROM ie_equipos_medicos
             WHERE numero_serie = ?`,
            [numero_serie],
            (err, rows) => {
                if (err) {
                    console.error("Error al ejecutar la consulta:", err);
                    return res.status(400).send(err);
                }
                if (rows.length > 0) {
                    res.status(200).json(rows[0]); // Devuelve el primer resultado
                } else {
                    res.status(404).json({ message: "Registro no encontrado" });
                }
            }
        );
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).send(err.message);
    }
}


    
}

module.exports = new InformeController();
const db = require('../database/conexion.js');
const moment = require('moment');

class MantencionespcController {
    constructor() {}

    // Consultar todos los equipos medicos
    consultar(req, res) {
        try {
            db.query(`SELECT * FROM ot_correctivo_preventivo`, (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }
    
                // Formatear las fechas en cada fila
                const formattedRows = rows.map((row) => ({
                    ...row,
                    fecha_generacion: row.fecha_generacion ? moment(row.fecha_generacion).format('YYYY-MM-DD') : null,
                    fecha_ejecucion: row.fecha_ejecucion ? moment(row.fecha_ejecucion).format('YYYY-MM-DD') : null,
                    fecha_cierre_ot: row.fecha_cierre_ot ? moment(row.fecha_cierre_ot).format('YYYY-MM-DD') : null,
                }));
    
                res.status(200).json(formattedRows);
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Consultar detalle de un equipo medico por ID


    consultarDetalles(req, res) {
        const { id_mc } = req.params;

        try {
            db.query(`SELECT * FROM ot_correctivo_preventivo WHERE id_mc = ?`, [id_mc], (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }

                if (rows.length === 0) {
                    return res.status(404).json({ mensaje: "No se encontró el registro solicitado." });
                }

                // Formatear las fechas en la fila encontrada
                const formattedRow = {
                    ...rows[0],
                    fecha_generacion: rows[0].fecha_generacion ? moment(rows[0].fecha_generacion).format('YYYY-MM-DD') : null,
                    fecha_ejecucion: rows[0].fecha_ejecucion ? moment(rows[0].fecha_ejecucion).format('YYYY-MM-DD') : null,
                    fecha_cierre_ot: rows[0].fecha_cierre_ot ? moment(rows[0].fecha_cierre_ot).format('YYYY-MM-DD') : null,
                };

                res.status(200).json(formattedRow);
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }


    ingresar(req, res) {
        try {
            const {
                    numero_sap,
                    numero_orden,
                    responsable_gestion,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    equipos_de_acreditacion,
                    garantia_vigente,
                    servicio_clinico,
                    referente_clinico,
                    fecha_generacion,
                    descripcion,
                    modalidad_servicio,
                    tipo_servicio,
                    proveedor,
                    fecha_ejecucion,
                    tipo_compra,
                    numero_orden_compra,
                    codigo_o_id_licitacion,
                    costo_con_iva,
                    fecha_cierre_ot,
                    recepcion
            } = req.body;
    
            const query = `
                INSERT INTO ot_correctivo_preventivo (
                    numero_sap,
                    numero_orden,
                    responsable_gestion,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    equipos_de_acreditacion,
                    garantia_vigente,
                    servicio_clinico,
                    referente_clinico,
                    fecha_generacion,
                    descripcion,
                    modalidad_servicio,
                    tipo_servicio,
                    proveedor,
                    fecha_ejecucion,
                    tipo_compra,
                    numero_orden_compra,
                    codigo_o_id_licitacion,
                    costo_con_iva,
                    fecha_cierre_ot,
                    recepcion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
    
            db.query(
                query,
                [
                    numero_sap,
                    numero_orden,
                    responsable_gestion,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    equipos_de_acreditacion,
                    garantia_vigente,
                    servicio_clinico,
                    referente_clinico,
                    fecha_generacion,
                    descripcion,
                    modalidad_servicio,
                    tipo_servicio,
                    proveedor,
                    fecha_ejecucion,
                    tipo_compra,
                    numero_orden_compra,
                    codigo_o_id_licitacion,
                    costo_con_iva,
                    fecha_cierre_ot,
                    recepcion
                ],
                (err, result) => {
                    if (err) {
                        return res.status(400).json({ error: err.message });
                    }
                    res.status(201).json({ id_mc: result.insertId });
                }
            );
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    


    
    actualizar(req, res) {
        const { id_mc } = req.params;
    
        if (isNaN(id_mc)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
    
        try {
            const {
                numero_sap,
                numero_orden,
                responsable_gestion,
                nombre,
                marca,
                modelo,
                numero_serie,
                numero_invetario,
                equipos_de_acreditacion,
                garantia_vigente,
                servicio_clinico,
                referente_clinico,
                fecha_generacion,
                descripcion,
                modalidad_servicio,
                tipo_servicio,
                proveedor,
                fecha_ejecucion,
                tipo_compra,
                numero_orden_compra,
                codigo_o_id_licitacion,
                costo_con_iva,
                fecha_cierre_ot,
                recepcion
            } = req.body;
    
            const query = `
                UPDATE ot_correctivo_preventivo SET  
                    numero_sap = ?,
                    numero_orden = ?,
                    responsable_gestion = ?,
                    nombre = ?,
                    marca = ?,
                    modelo = ?,
                    numero_serie = ?,
                    numero_invetario = ?,
                    equipos_de_acreditacion = ?,
                    garantia_vigente = ?,
                    servicio_clinico = ?,
                    referente_clinico = ?,
                    fecha_generacion = ?,
                    descripcion = ?,
                    modalidad_servicio = ?,
                    tipo_servicio = ?,
                    proveedor = ?,
                    fecha_ejecucion = ?,
                    tipo_compra = ?,
                    numero_orden_compra = ?,
                    codigo_o_id_licitacion = ?,
                    costo_con_iva = ?,
                    fecha_cierre_ot = ?,
                    recepcion = ?

                    WHERE id_mc = ?;
            `;
    
            db.query(
                query,
                [
                    numero_sap,
                    numero_orden,
                    responsable_gestion,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    equipos_de_acreditacion,
                    garantia_vigente,
                    servicio_clinico,
                    referente_clinico,
                    fecha_generacion,
                    descripcion,
                    modalidad_servicio,
                    tipo_servicio,
                    proveedor,
                    fecha_ejecucion,
                    tipo_compra,
                    numero_orden_compra,
                    codigo_o_id_licitacion,
                    costo_con_iva,
                    fecha_cierre_ot,
                    recepcion,
                    id_mc,
                ],
                (err, rows) => {
                    if (err) {
                        return res.status(400).json({ error: err.message });
                    }
                    if (rows.affectedRows === 1) {
                        res.status(200).json({ respuesta: '¡Registro de orden de trabajo actualizada con éxito!' });
                    } else {
                        res.status(404).json({ respuesta: 'Orden de trabajo no encontrada' });
                    }
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

  // Borrar un equipo por ID
  borrar(req, res) {
    const id_mc = Number(req.params.id_mc);
    console.log("ID para borrar:", id_mc);  
    try {
        db.query(`DELETE FROM ot_correctivo_preventivo WHERE id_mc = ?;`, [id_mc], (err, rows) => {
            if (err) {
                return res.status(400).send(err);
            }
            if (rows.affectedRows == 1)
                res.status(200).json({ respuesta: '¡Registro eliminado con éxito!' });
            else
                res.status(404).json({ respuesta: 'Orden de Trabajo  no encontrado' });
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
                    res.status(201).json({ respuesta: 'Estudiante registrado con éxito' });
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

module.exports = new MantencionespcController();
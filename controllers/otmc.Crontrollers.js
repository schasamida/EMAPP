
const db = require('../database/conexion.js');
const moment = require('moment');

class OrdenesController {
    constructor() {}

    // Consultar todos los equipos medicos
    

    consultar(req, res) {
        try {
            db.query(`SELECT * FROM ot_ordenes_trabajos`, (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }

                // Formatear las fechas en cada fila antes de enviarlas al cliente
                const formattedRows = rows.map((row) => ({
                    ...row,
                    fecha_generacion: row.fecha_generacion ? moment(row.fecha_generacion).format('YYYY-MM-DD') : null,
                    fecha_cierre_ot: row.fecha_cierre_ot ? moment(row.fecha_cierre_ot).format('YYYY-MM-DD') : null,
                    fecha: row.fecha ? moment(row.fecha).format('YYYY-MM-DD') : null,
                    fecha_ejecucion: row.fecha_ejecucion ? moment(row.fecha_ejecucion).format('YYYY-MM-DD') : null,
                }));

                res.status(200).json(formattedRows);
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }


    // Consultar detalle de un equipo medico por ID
    consultarDetalles(req, res) {
        const { id_ot } = req.params;
    
        try {
            db.query(`SELECT * FROM ot_ordenes_trabajos WHERE id_ot = ?`, [id_ot], (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }
    
                if (rows.length === 0) {
                    return res.status(404).json({ message: 'Orden de trabajo no encontrada' });
                }
    
                // Formatear las fechas en la fila antes de enviarla al cliente
                const formattedRow = {
                    ...rows[0],
                    fecha_generacion: rows[0].fecha_generacion ? moment(rows[0].fecha_generacion).format('YYYY-MM-DD') : null,
                    fecha_cierre_ot: rows[0].fecha_cierre_ot ? moment(rows[0].fecha_cierre_ot).format('YYYY-MM-DD') : null,
                    fecha: rows[0].fecha ? moment(rows[0].fecha).format('YYYY-MM-DD') : null,
                    fecha_ejecucion: rows[0].fecha_ejecucion ? moment(rows[0].fecha_ejecucion).format('YYYY-MM-DD') : null,
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
                    equipos_de_acreditacion,
                    numero_orden,
                    modalidad_servicio,
                    tipo_servicio,
                    responsable_gestion,
                    fecha_generacion,
                    fecha_cierre_ot,
                    estado_ot,
                    servicio_clinico,
                    referente_clinico,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    garantia_vigente,
                    numero_sap,
                    fecha,
                    descripcion,
                    tipo_compra,
                    codigo_o_id_licitacion,
                    numero_orden_compra,
                    costo_con_iva,
                    proveedor,
                    nombre_ejecutador,
                    fecha_ejecucion,
                    numero_informe_tecnico,
                    estado_servicio,
                    operatividad_equipo,
                    observaciones
            } = req.body;
    
            const query = `
                INSERT INTO ot_ordenes_trabajos (
                    equipos_de_acreditacion,
                    numero_orden,
                    modalidad_servicio,
                    tipo_servicio,
                    responsable_gestion,
                    fecha_generacion,
                    fecha_cierre_ot,
                    estado_ot,
                    servicio_clinico,
                    referente_clinico,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    garantia_vigente,
                    numero_sap,
                    fecha,
                    descripcion,
                    tipo_compra,
                    codigo_o_id_licitacion,
                    numero_orden_compra,
                    costo_con_iva,
                    proveedor,
                    nombre_ejecutador,
                    fecha_ejecucion,
                    numero_informe_tecnico,
                    estado_servicio,
                    operatividad_equipo,
                    observaciones
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
    
            db.query(
                query,
                [
                    equipos_de_acreditacion,
                    numero_orden,
                    modalidad_servicio,
                    tipo_servicio,
                    responsable_gestion,
                    fecha_generacion,
                    fecha_cierre_ot,
                    estado_ot,
                    servicio_clinico,
                    referente_clinico,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    garantia_vigente,
                    numero_sap,
                    fecha,
                    descripcion,
                    tipo_compra,
                    codigo_o_id_licitacion,
                    numero_orden_compra,
                    costo_con_iva,
                    proveedor,
                    nombre_ejecutador,
                    fecha_ejecucion,
                    numero_informe_tecnico,
                    estado_servicio,
                    operatividad_equipo,
                    observaciones
                ],
                (err, result) => {
                    if (err) {
                        return res.status(400).json({ error: err.message });
                    }
                    res.status(201).json({ id_ot: result.insertId });
                }
            );
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    


    
    actualizar(req, res) {
        const { id_ot } = req.params;
    
        if (isNaN(id_ot)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
    
        try {
            const {
                    equipos_de_acreditacion,
                    numero_orden,
                    modalidad_servicio,
                    tipo_servicio,
                    responsable_gestion,
                    fecha_generacion,
                    fecha_cierre_ot,
                    estado_ot,
                    servicio_clinico,
                    referente_clinico,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    garantia_vigente,
                    numero_sap,
                    fecha,
                    descripcion,
                    tipo_compra,
                    codigo_o_id_licitacion,
                    numero_orden_compra,
                    costo_con_iva,
                    proveedor,
                    nombre_ejecutador,
                    fecha_ejecucion,
                    numero_informe_tecnico,
                    estado_servicio,
                    operatividad_equipo,
                    observaciones
            } = req.body;
    
            const query = `
                UPDATE ot_ordenes_trabajos SET  

                    equipos_de_acreditacion = ?,
                    numero_orden = ?,
                    modalidad_servicio = ?,
                    tipo_servicio = ?,
                    responsable_gestion = ?,
                    fecha_generacion = ?,
                    fecha_cierre_ot = ?,
                    estado_ot = ?,
                    servicio_clinico = ?,
                    referente_clinico = ?,
                    nombre = ?,
                    marca = ?,
                    modelo = ?,
                    numero_serie = ?,
                    numero_invetario = ?,
                    garantia_vigente = ?,
                    numero_sap = ?,
                    fecha = ?,
                    descripcion = ?,
                    tipo_compra = ?,
                    codigo_o_id_licitacion = ?,
                    numero_orden_compra = ?,
                    costo_con_iva = ?,
                    proveedor = ?,
                    nombre_ejecutador = ?,
                    fecha_ejecucion = ?,
                    numero_informe_tecnico = ?,
                    estado_servicio = ?,
                    operatividad_equipo = ?,
                    observaciones = ?

                WHERE id_ot = ?;
            `;
    
            db.query(
                query,
                [
                    equipos_de_acreditacion,
                    numero_orden,
                    modalidad_servicio,
                    tipo_servicio,
                    responsable_gestion,
                    fecha_generacion,
                    fecha_cierre_ot,
                    estado_ot,
                    servicio_clinico,
                    referente_clinico,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    garantia_vigente,
                    numero_sap,
                    fecha,
                    descripcion,
                    tipo_compra,
                    codigo_o_id_licitacion,
                    numero_orden_compra,
                    costo_con_iva,
                    proveedor,
                    nombre_ejecutador,
                    fecha_ejecucion,
                    numero_informe_tecnico,
                    estado_servicio,
                    operatividad_equipo,
                    observaciones,
                    id_ot,
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
    const id_ot = Number(req.params.id_ot);
    console.log("ID para borrar:", id_ot);  
    try {
        db.query(`DELETE FROM ot_ordenes_trabajos WHERE id_ot = ?;`, [id_ot], (err, rows) => {
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

module.exports = new OrdenesController();
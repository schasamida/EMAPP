const db = require('../database/conexion.js');
const moment = require('moment');//

class EquiposController {
    constructor() {}

    // Consultar todos los equipos medicos
    consultar(req, res) {
        try {
            db.query(`SELECT * FROM ie_equipos_medicos`, (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }

                // Formatear las fechas en cada registro
                const formattedRows = rows.map(row => ({
                    ...row,
                    fecha_puesta_marcha: row.fecha_puesta_marcha ? moment(row.fecha_puesta_marcha).format('YYYY-MM-DD') : null,
                    fecha_rcd: row.fecha_rcd ? moment(row.fecha_rcd).format('YYYY-MM-DD') : null,
                    fecha_termino_garantia: row.fecha_termino_garantia ? moment(row.fecha_termino_garantia).format('YYYY-MM-DD') : null,
                    fecha_inicio_obsolescencia: row.fecha_inicio_obsolescencia ? moment(row.fecha_inicio_obsolescencia).format('YYYY-MM-DD') : null,
                }));

                res.status(200).json(formattedRows);
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }


    // Consultar detalle de un equipo medico por ID
    consultarDetalles(req, res) {
        const { id_ie } = req.params;
    
        try {
            db.query(`SELECT * FROM ie_equipos_medicos WHERE id_ie = ?`, [id_ie], (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }
    
                if (rows.length > 0) {
                    // Formatear las fechas del registro encontrado
                    const formattedRow = {
                        ...rows[0],
                        fecha_puesta_marcha: rows[0].fecha_puesta_marcha ? moment(rows[0].fecha_puesta_marcha).format('YYYY-MM-DD') : null,
                        fecha_rcd: rows[0].fecha_rcd ? moment(rows[0].fecha_rcd).format('YYYY-MM-DD') : null,
                        fecha_termino_garantia: rows[0].fecha_termino_garantia ? moment(rows[0].fecha_termino_garantia).format('YYYY-MM-DD') : null,
                        fecha_inicio_obsolescencia: rows[0].fecha_inicio_obsolescencia ? moment(rows[0].fecha_inicio_obsolescencia).format('YYYY-MM-DD') : null,
                    };
    
                    res.status(200).json(formattedRow);
                } else {
                    res.status(404).json({ message: 'Registro no encontrado' });
                }
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Ingresar un nuevo equipo medico
    ingresar(req, res) {
        try {
            const {
                servicio_clinico,
                    referente_clinico,
                    recinto,
                    ubicacion_tecnica,
                    ubicacion_actual,
                    piso,
                    familia,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    propiedad,
                    equipos_de_acreditacion,
                    pais_origen,
                    id_1,
                    oc,
                    proveedor,
                    fecha_puesta_marcha,
                    fecha_rcd,
                    garantia_meses,
                    fecha_termino_garantia,
                    estado_garantia,
                    valor_neto,
                    vida_util_anos,
                    fecha_inicio_obsolescencia,
                    estado_obsolescencia,
                    equipo_informatico,
                    watts,
                    kw_equipo,
                    l_min_equipo,
                    observaciones
                } = req.body;
    
                 const query = `
                INSERT INTO ie_equipos_medicos (
                    servicio_clinico,
                    referente_clinico,
                    recinto,
                    ubicacion_tecnica,
                    ubicacion_actual,
                    piso,
                    familia,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    propiedad,
                    equipos_de_acreditacion,
                    pais_origen,
                    id_1,
                    oc,
                    proveedor,
                    fecha_puesta_marcha,
                    fecha_rcd,
                    garantia_meses,
                    fecha_termino_garantia,
                    estado_garantia,
                    valor_neto,
                    vida_util_anos,
                    fecha_inicio_obsolescencia,
                    estado_obsolescencia,
                    equipo_informatico,
                    watts,
                    kw_equipo,
                    l_min_equipo,
                    observaciones

                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
    
            db.query(query, [
                    servicio_clinico,
                    referente_clinico,
                    recinto,
                    ubicacion_tecnica,
                    ubicacion_actual,
                    piso,
                    familia,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    propiedad,
                    equipos_de_acreditacion,
                    pais_origen,
                    id_1,
                    oc,
                    proveedor,
                    fecha_puesta_marcha,
                    fecha_rcd,
                    garantia_meses,
                    fecha_termino_garantia,
                    estado_garantia,
                    valor_neto,
                    vida_util_anos,
                    fecha_inicio_obsolescencia,
                    estado_obsolescencia,
                    equipo_informatico,
                    watts,
                    kw_equipo,
                    l_min_equipo,
                    observaciones
               ], (err, result) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                res.status(201).json({ id_ie: result.insertId });
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
    
    actualizar(req, res) {
        const { id_ie } = req.params;
    
        if (isNaN(id_ie)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
    
        try {
            const {
                servicio_clinico,
                referente_clinico,
                recinto,
                ubicacion_tecnica,
                ubicacion_actual,
                piso,
                familia,
                nombre,
                marca,
                modelo,
                numero_serie,
                numero_invetario,
                propiedad,
                equipos_de_acreditacion,
                pais_origen,
                id_1,
                oc,
                proveedor,
                fecha_puesta_marcha,
                fecha_rcd,
                garantia_meses,
                fecha_termino_garantia,
                estado_garantia,
                valor_neto,
                vida_util_anos,
                fecha_inicio_obsolescencia,
                estado_obsolescencia,
                equipo_informatico,
                watts,
                kw_equipo,
                l_min_equipo,
                observaciones,
            } = req.body;
    
            const query = `
                UPDATE ie_equipos_medicos SET  
                    servicio_clinico = ?,
                    referente_clinico = ?,
                    recinto = ?,
                    ubicacion_tecnica = ?,
                    ubicacion_actual = ?,
                    piso = ?,
                    familia = ?,
                    nombre = ?,
                    marca = ?,
                    modelo = ?,
                    numero_serie = ?,
                    numero_invetario = ?,
                    propiedad = ?,
                    equipos_de_acreditacion = ?,
                    pais_origen = ?,
                    id_1 = ?,
                    oc = ?,
                    proveedor = ?,
                    fecha_puesta_marcha = ?,
                    fecha_rcd = ?,
                    garantia_meses = ?,
                    fecha_termino_garantia = ?,
                    estado_garantia = ?,
                    valor_neto = ?,
                    vida_util_anos = ?,
                    fecha_inicio_obsolescencia = ?,
                    estado_obsolescencia = ?,
                    equipo_informatico = ?,
                    watts = ?,
                    kw_equipo = ?,
                    l_min_equipo = ?,
                    observaciones = ?
                WHERE id_ie = ?;
            `;
    
            db.query(
                query,
                [
                    servicio_clinico,
                    referente_clinico,
                    recinto,
                    ubicacion_tecnica,
                    ubicacion_actual,
                    piso,
                    familia,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    numero_invetario,
                    propiedad,
                    equipos_de_acreditacion,
                    pais_origen,
                    id_1,
                    oc,
                    proveedor,
                    fecha_puesta_marcha,
                    fecha_rcd,
                    garantia_meses,
                    fecha_termino_garantia,
                    estado_garantia,
                    valor_neto,
                    vida_util_anos,
                    fecha_inicio_obsolescencia,
                    estado_obsolescencia,
                    equipo_informatico,
                    watts,
                    kw_equipo,
                    l_min_equipo,
                    observaciones,
                    id_ie,
                ],
                (err, rows) => {
                    if (err) {
                        return res.status(400).json({ error: err.message });
                    }
                    if (rows.affectedRows === 1) {
                        res.status(200).json({ respuesta: '¡Registro de equipo médico actualizado con éxito!' });
                    } else {
                        res.status(404).json({ respuesta: 'Equipo no encontrado' });
                    }
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

  // Borrar un equipo por ID
  borrar(req, res) {
    const id_ie = Number(req.params.id_ie);
    console.log("ID para borrar:", id_ie);  
    try {
        db.query(`DELETE FROM ie_equipos_medicos WHERE id_ie = ?;`, [id_ie], (err, rows) => {
            if (err) {
                return res.status(400).send(err);
            }
            if (rows.affectedRows == 1)
                res.status(200).json({ respuesta: '¡Registro eliminado con éxito!' });
            else
                res.status(404).json({ respuesta: 'Euqipo medico no encontrado' });
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

module.exports = new EquiposController();
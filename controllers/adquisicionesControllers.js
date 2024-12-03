const db = require('../database/conexion.js');
const moment = require('moment');

class AdquisicionesController {
    constructor() {}

    // Consultar todos los proveedores
    consultar(req, res) {
        try {
            db.query(`SELECT * FROM a_adquisiciones_equipos`, (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }

                // Formatear las fechas antes de enviarlas al cliente
                const formattedRows = rows.map(row => ({
                    ...row,
                    fecha_real_entrega: row.fecha_real_entrega ? moment(row.fecha_real_entrega).format('YYYY-MM-DD') : null,
                    fecha_comprometida: row.fecha_comprometida ? moment(row.fecha_comprometida).format('YYYY-MM-DD') : null,
                    fecha_instalacion: row.fecha_instalacion ? moment(row.fecha_instalacion).format('YYYY-MM-DD') : null,
                    fecha_puesta_marcha: row.fecha_puesta_marcha ? moment(row.fecha_puesta_marcha).format('YYYY-MM-DD') : null,
                    fecha_rcd: row.fecha_rcd ? moment(row.fecha_rcd).format('YYYY-MM-DD') : null,
                    fecha_termino_garantia: row.fecha_termino_garantia ? moment(row.fecha_termino_garantia).format('YYYY-MM-DD') : null,
                }));

                res.status(200).json(formattedRows);
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }


    // Consultar detalle de un proveedor por ID
    // Consultar detalle de una adquisición por ID
consultarDetalles(req, res) {
    const { id_a } = req.params;

    try {
        db.query(`SELECT * FROM a_adquisiciones_equipos WHERE id_a = ?`, [id_a], (err, rows) => {
            if (err) {
                return res.status(400).send(err);
            }

            // Verificar si se encontraron registros
            if (rows.length === 0) {
                return res.status(404).json({ message: "Adquisición no encontrada" });
            }

            // Formatear las fechas
            const formattedRow = rows.map(row => ({
                ...row,
                fecha_real_entrega: row.fecha_real_entrega ? moment(row.fecha_real_entrega).format('YYYY-MM-DD') : null,
                fecha_comprometida: row.fecha_comprometida ? moment(row.fecha_comprometida).format('YYYY-MM-DD') : null,
                fecha_instalacion: row.fecha_instalacion ? moment(row.fecha_instalacion).format('YYYY-MM-DD') : null,
                fecha_puesta_marcha: row.fecha_puesta_marcha ? moment(row.fecha_puesta_marcha).format('YYYY-MM-DD') : null,
                fecha_rcd: row.fecha_rcd ? moment(row.fecha_rcd).format('YYYY-MM-DD') : null,
                fecha_termino_garantia: row.fecha_termino_garantia ? moment(row.fecha_termino_garantia).format('YYYY-MM-DD') : null,
            }));

            res.status(200).json(formattedRow[0]); // Enviar solo el objeto (ya que es un detalle único)
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
}


    ingresar(req, res) {
        try {
            const {
                estado_adquisiciones,
                modalidad_compra,
                id_licitacion,
                orden_compra,
                proveedor,
                valor_unitario_neto,
                servicio_clinico,
                nombre,
                marca,
                modelo,
                numero_serie,
                recepcionado_si_no,
                fecha_real_entrega,
                numero_guia_despacho,
                numero_factura,
                carta_compromiso,
                pendientes_comprometidos,
                fecha_comprometida,
                estado_instalacion,
                fecha_instalacion,
                estado_puesta_marcha,
                fecha_puesta_marcha,
                estado_capacitacion,
                rcd_generada,
                fecha_rcd,
                garantia_meses,
                mp_incluidos,
                fecha_termino_garantia,
                observaciones
            } = req.body;
    
            const query = `
                INSERT INTO a_adquisiciones_equipos (
                    estado_adquisiciones,
                    modalidad_compra,
                    id_licitacion,
                    orden_compra,
                    proveedor,
                    valor_unitario_neto,
                    servicio_clinico,
                    nombre,
                    marca,
                    modelo,
                    numero_serie,
                    recepcionado_si_no,
                    fecha_real_entrega,
                    numero_guia_despacho,
                    numero_factura,
                    carta_compromiso,
                    pendientes_comprometidos,
                    fecha_comprometida,
                    estado_instalacion,
                    fecha_instalacion,
                    estado_puesta_marcha,
                    fecha_puesta_marcha,
                    estado_capacitacion,
                    rcd_generada,
                    fecha_rcd,
                    garantia_meses,
                    mp_incluidos,
                    fecha_termino_garantia,
                    observaciones
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
    
            db.query(query, [
                estado_adquisiciones,
                modalidad_compra,
                id_licitacion,
                orden_compra,
                proveedor,
                valor_unitario_neto,
                servicio_clinico,
                nombre,
                marca,
                modelo,
                numero_serie,
                recepcionado_si_no,
                fecha_real_entrega,
                numero_guia_despacho,
                numero_factura,
                carta_compromiso,
                pendientes_comprometidos,
                fecha_comprometida,
                estado_instalacion,
                fecha_instalacion,
                estado_puesta_marcha,
                fecha_puesta_marcha,
                estado_capacitacion,
                rcd_generada,
                fecha_rcd,
                garantia_meses,
                mp_incluidos,
                fecha_termino_garantia,
                observaciones
            ], (err, result) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                res.status(201).json({ id_a: result.insertId });
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
////////////////////////// Actualizar un proveedor por ID ////////////////////////////
actualizar(req, res) {
    const { id_a } = req.params; // Asegúrate de que uses el parámetro correcto
    try {
        const {
            estado_adquisiciones,
            modalidad_compra,
            id_licitacion,
            orden_compra,
            proveedor,
            valor_unitario_neto,
            servicio_clinico,
            nombre,
            marca,
            modelo,
            numero_serie,
            recepcionado_si_no,
            fecha_real_entrega,
            numero_guia_despacho,
            numero_factura,
            carta_compromiso,
            pendientes_comprometidos,
            fecha_comprometida,
            estado_instalacion,
            fecha_instalacion,
            estado_puesta_marcha,
            fecha_puesta_marcha,
            estado_capacitacion,
            rcd_generada,
            fecha_rcd,
            garantia_meses,
            mp_incluidos,
            fecha_termino_garantia,
            observaciones
        } = req.body;

        // La consulta SQL para actualizar el registro
        const query = `
            UPDATE a_adquisiciones_equipos SET 
                estado_adquisiciones = ?, 
                modalidad_compra = ?, 
                id_licitacion = ?, 
                orden_compra = ?, 
                proveedor = ?, 
                valor_unitario_neto = ?, 
                servicio_clinico = ?, 
                nombre = ?, 
                marca = ?, 
                modelo = ?, 
                numero_serie = ?, 
                recepcionado_si_no = ?, 
                fecha_real_entrega = ?, 
                numero_guia_despacho = ?, 
                numero_factura = ?, 
                carta_compromiso = ?, 
                pendientes_comprometidos = ?, 
                fecha_comprometida = ?, 
                estado_instalacion = ?, 
                fecha_instalacion = ?, 
                estado_puesta_marcha = ?, 
                fecha_puesta_marcha = ?, 
                estado_capacitacion = ?, 
                rcd_generada = ?, 
                fecha_rcd = ?, 
                garantia_meses = ?, 
                mp_incluidos = ?, 
                fecha_termino_garantia = ?, 
                observaciones = ? 
            WHERE id_a = ?;
        `;

        // Ejecutar la consulta con los valores
        db.query(
            query,
            [
                estado_adquisiciones,
                modalidad_compra,
                id_licitacion,
                orden_compra,
                proveedor,
                valor_unitario_neto,
                servicio_clinico,
                nombre,
                marca,
                modelo,
                numero_serie,
                recepcionado_si_no,
                fecha_real_entrega,
                numero_guia_despacho,
                numero_factura,
                carta_compromiso,
                pendientes_comprometidos,
                fecha_comprometida,
                estado_instalacion,
                fecha_instalacion,
                estado_puesta_marcha,
                fecha_puesta_marcha,
                estado_capacitacion,
                rcd_generada,
                fecha_rcd,
                garantia_meses,
                mp_incluidos,
                fecha_termino_garantia,
                observaciones,
                id_a // Identificador único para actualizar
            ],
            (err, rows) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                if (rows.affectedRows === 1) {
                    res.status(200).json({ respuesta: '¡Registro actualizado con éxito!' });
                } else {
                    res.status(404).json({ respuesta: 'Registro no encontrado' });
                }
            }
        );
    } catch (err) {
        res.status(500).send(err.message);
    }
}

    // Borrar un proveedor por ID
    borrar(req, res) {
        const id_a = Number(req.params.id_a);
        console.log("ID para borrar:", id_a);  
        try {
            db.query(`DELETE FROM a_adquisiciones_equipos WHERE id_a = ?;`, [id_a], (err, rows) => {
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
                `INSERT INTO a_adquisiciones_equipos (curso_id, estudiantes_id) VALUES(?, ?);`,
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

module.exports = new AdquisicionesController();
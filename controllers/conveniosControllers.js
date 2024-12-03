const db = require('../database/conexion.js');
const moment = require('moment');//


class ConveniosController {
    constructor() {}

    // Consultar todos los convenios
    consultar(req, res) {
        try {
            db.query(`SELECT * FROM con_convenios`, (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }
                
                // Formatear las fechas usando moment
                const formattedRows = rows.map(row => ({
                    ...row, // Copia los datos originales
                    fecha_inicio_convenio: moment(row.fecha_inicio_convenio).format('YYYY-MM-DD'),
                    fecha_termino_convenio: moment(row.fecha_termino_convenio).format('YYYY-MM-DD'),
                }));
    
                res.status(200).json(formattedRows); // Retornar los datos formateados
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Consultar detalle de un proveedor por ID
    consultarDetalles(req, res) {
        const { id_con } = req.params;

        try {
            db.query(`SELECT * FROM con_convenios WHERE id_con = ?`, [id_con], (err, rows) => {
                if (err) {
                    return res.status(400).send(err);
                }

                if (rows.length > 0) {
                    // Formatear las fechas usando moment
                    const formattedRow = {
                        ...rows[0], // Copia el registro original
                        fecha_inicio_convenio: moment(rows[0].fecha_inicio_convenio).format('YYYY-MM-DD'),
                        fecha_termino_convenio: moment(rows[0].fecha_termino_convenio).format('YYYY-MM-DD'),
                    };

                    res.status(200).json(formattedRow); // Retorna el registro formateado
                } else {
                    res.status(404).json({ mensaje: 'No se encontró el convenio con el ID especificado' });
                }
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
}

    // Ingresar un nuevo proveedor
    ingresar(req, res) {
        try {
            const {
                nombre,
                marca,
                modelo,
                equipos_de_acreditacion,
                cantidad_equipos,
                cantidad_mp_1_ano,
                proveedor,
                estado_convenio,
                tipo_convenio,
                modalidad_compra,
                id_oc,
                duracion,
                fecha_inicio_convenio,
                fecha_termino_convenio,
                observaciones
            } = req.body;
    
            const query = `
                INSERT INTO con_convenios (
                    nombre, 
                    marca, 
                    modelo, 
                    equipos_de_acreditacion, 
                    cantidad_equipos, 
                    cantidad_mp_1_ano, 
                    proveedor, 
                    estado_convenio, 
                    tipo_convenio, 
                    modalidad_compra, 
                    id_oc, 
                    duracion, 
                    fecha_inicio_convenio, 
                    fecha_termino_convenio, 
                    observaciones
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
    
            db.query(query, [
                nombre,
                marca,
                modelo,
                equipos_de_acreditacion,
                cantidad_equipos,
                cantidad_mp_1_ano,
                proveedor,
                estado_convenio,
                tipo_convenio,
                modalidad_compra,
                id_oc,
                duracion,
                fecha_inicio_convenio,
                fecha_termino_convenio,
                observaciones
            ], (err, result) => {
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
        const { id_con } = req.params;
        try {
            const {nombre,
                marca,
                modelo,
                equipos_de_acreditacion,
                cantidad_equipos,
                cantidad_mp_1_ano,
                proveedor,
                estado_convenio,
                tipo_convenio,
                modalidad_compra,
                id_oc,
                duracion,
                fecha_inicio_convenio,
                fecha_termino_convenio,
                observaciones } = req.body;
            db.query(
                `UPDATE con_convenios SET  nombre = ?, 
                    marca = ?,
                    modelo = ?, 
                    equipos_de_acreditacion = ?, 
                    cantidad_equipos = ?, 
                    cantidad_mp_1_ano = ?, 
                    proveedor = ?, 
                    estado_convenio = ?, 
                    tipo_convenio = ?, 
                    modalidad_compra = ?, 
                    id_oc = ?, 
                    duracion = ?, 
                    fecha_inicio_convenio = ?, 
                    fecha_termino_convenio = ?, 
                    observaciones = ?
                
                 WHERE id_con = ?;`
                
                
                ,
                [nombre,
                    marca,
                    modelo,
                    equipos_de_acreditacion,
                    cantidad_equipos,
                    cantidad_mp_1_ano,
                    proveedor,
                    estado_convenio,
                    tipo_convenio,
                    modalidad_compra,
                    id_oc,
                    duracion,
                    fecha_inicio_convenio,
                    fecha_termino_convenio,
                    observaciones, id_con],
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

    // Borrar un proveedor por ID
    borrar(req, res) {
        const id_con = Number(req.params.id_con);
        console.log("ID para borrar:", id_con);  
        try {
            db.query(`DELETE FROM con_convenios WHERE id_con = ?;`, [id_con], (err, rows) => {
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

module.exports = new ConveniosController();
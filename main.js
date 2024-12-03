let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    scrollX: true,
    pageLength: 6,
    destroy: true,
    language: {
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ registros",
        zeroRecords: "No se encontraron resultados",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

/***Función genérica para inicializar cualquier tabla*/
const initDataTable = async (tableId, listFunction) => {
    if (dataTableIsInitialized) {
        $(`#${tableId}`).DataTable().destroy(); // Destruye la instancia previa de DataTable
    }

    document.querySelector(`#${tableId} tbody`).innerHTML = ''; 
    await listFunction(); 
    $(`#${tableId}`).DataTable(dataTableOptions); 
    dataTableIsInitialized = true;
};

// Inicializaciones específicas de tablas
const initDataTableProveedores = async () => initDataTable('datatable_proveedores', listProveedores);
const initDataTableUsers = async () => initDataTable('datatable_users', listUsers);
const initDataTableAdquisiciones = async () => initDataTable('datatable_adquisiciones', listAdquisiciones);
const initDataTableEquipos = async () => initDataTable('datatable_equipos', listEquipos);
const initDataTableOTMC = async () => initDataTable('datatable_otmc', listOTMC);
const initDataTableMantenciones = async () => initDataTable('datatable_mantenciones', listMantenciones);
const initDataTableInformes = async() => initDataTable('datatable_informes', listInformes);

/**********************************************************************************/
/*************************** Función para listar proveedor ************************/

// 
const listProveedores = async () => { 
    try {
        const response = await fetch("http://localhost:3000/api/proveedor");
        const proveedores = await response.json();

        let content = ``;
        proveedores.forEach((proveedor, index) => {
            content += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${proveedor.proveedor}</td>
                    <td>${proveedor.contacto}</td>
                    <td>${proveedor.correo}</td>
                    <td>${proveedor.direccion}</td>
                    <td>
                        <button class="btn-sm btn-primary" onclick="editProveedor(${proveedor.id})"><i class="fa-solid fa-pencil"></i></button>
                        <button class="btn-sm btn-danger" onclick="deleteProveedor(${proveedor.id})"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>`;
        });
        document.getElementById('tableBody-proveedores').innerHTML = content;
    } catch (error) {
        console.error("Error al listar usuarios:", error);
    }
};
/******************** Borrar proveedor ********************/
// Función específica para eliminar proveedores
const deleteProveedor = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/proveedor/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                alert("Proveedor eliminado con éxito!");
                document.querySelector('#datatable_proveedores tbody').innerHTML = ''; 
                await initDataTableProveedores(); 
            } else {
                alert("¡Error al eliminar el proveedor seleccionado!");
            }
        } catch (error) {
            console.error("¡Error al eliminar el proveedor:!", error);
        }
    }
};


/*********************   Guardar y editar proveedor ***********************************************/
document.addEventListener("DOMContentLoaded", () => {
    const proveedoresModal = new bootstrap.Modal(document.getElementById("proveedoresModal"));
    const saveProveedorButton = document.getElementById("saveproveedorButton");
    const proveedorForm = document.getElementById("proveedor-form");

    // Función para abrir el modal en modo agregar
    const openAddModal = () => {
        if (proveedorForm) proveedorForm.reset(); 
        saveProveedorButton.dataset.action = "add"; 
        saveProveedorButton.dataset.id = ""; 
        proveedoresModal.show();
    };

    /** Función para abrir el modal en modo editar*/ 
    window.editProveedor = async (id) => {
        if (!id) {
            alert("ID del proveedor no válido.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/proveedor/${id}`);
            if (!response.ok) throw new Error("No se pudo obtener el proveedor");

            const proveedor = await response.json();
            if (proveedorForm) proveedorForm.reset();

            /** Cargar los datos del proveedor en el formularior*/             
            document.getElementById("proveedor").value = proveedor.proveedor || "";
            document.getElementById("contacto").value = proveedor.contacto || "";
            document.getElementById("correo").value = proveedor.correo || "";
            document.getElementById("direccion").value = proveedor.direccion || "";

            saveProveedorButton.dataset.action = "edit"; 
            saveProveedorButton.dataset.id = id;

            proveedoresModal.show();
        } catch (error) {
            console.error("Error al cargar los datos del proveedor:", error);
            alert("No se pudo cargar los datos del proveedor.");
        }
    };

    /** Función para manejar guardar o editar*/
     const handleSaveOrEdit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const action = saveProveedorButton.dataset.action;
        const id = saveProveedorButton.dataset.id;

        const proveedorData = {
            proveedor: document.getElementById("proveedor").value.trim(),
            contacto: document.getElementById("contacto").value.trim(),
            correo: document.getElementById("correo").value.trim(),
            direccion: document.getElementById("direccion").value.trim(),
        };

        if (!proveedorData.proveedor || !proveedorData.contacto || !proveedorData.correo) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        try {
            let response;
            if (action === "edit" && id) {
                
                response = await fetch(`http://localhost:3000/api/proveedor/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(proveedorData),
                });
            } else {
                
                response = await fetch("http://localhost:3000/api/proveedor", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(proveedorData),
                });
            }

            if (response.ok) {
                alert("Operación realizada con éxito.");
                proveedoresModal.hide(); 
                proveedorForm.reset(); 
                window.location.href = "proveedor.html"; 
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "Error desconocido"}`);
            }
        } catch (error) {
            console.error("Error al guardar o editar el proveedor:", error);
        }
    };

    document.getElementById("proveedoresModal").addEventListener("hidden.bs.modal", () => {
        proveedorForm.reset();
        saveProveedorButton.dataset.action = "";
        saveProveedorButton.dataset.id = "";
    });

       document.getElementById("add-item-btn").addEventListener("click", openAddModal);
  
    saveProveedorButton.addEventListener("click", handleSaveOrEdit);
});






/***********************************************************************************/
/********* Funcion para listar ordenes de trabajo **********************************/
const listOTMC = async () => { // hace referencia listOTMC -> ot-ordenes-trabajo (considerar)
    try {
        const response = await fetch("http://localhost:3000/api/otmc");
        const otmc = await response.json();

        let content = ``;
        otmc.forEach((ot, id_ot) => {
            content += `
                <tr>
                    <td>${id_ot + 1}</td>
                    <td>${ot.equipos_de_acreditacion}</td>
                    <td>${ot.numero_orden}</td>
                    <td>${ot.modalidad_servicio}</td>
                    <td>${ot.tipo_servicio}</td>
                    <td>${ot.responsable_gestion}</td>
                    <td>${ot.fecha_generacion}</td>
                    <td>${ot.fecha_cierre_ot}</td>
                    <td>${ot.estado_ot}</td>
                    <td>${ot.servicio_clinico}</td>
                    <td>${ot.referente_clinico}</td>
                    <td>${ot.nombre}</td>
                    <td>${ot.marca}</td>
                    <td>${ot.modelo}</td>
                    <td>${ot.numero_serie}</td>
                    <td>${ot.numero_invetario}</td>
                    <td>${ot.garantia_vigente}</td>
                    <td>${ot.numero_sap}</td>
                    <td>${ot.fecha}</td>
                    <td>${ot.descripcion}</td>
                    <td>${ot.tipo_compra}</td>
                    <td>${ot.codigo_o_id_licitacion}</td>
                    <td>${ot.numero_orden_compra}</td>
                    <td>${ot.costo_con_iva}</td>
                    <td>${ot.proveedor}</td>
                    <td>${ot.nombre_ejecutador}</td>
                    <td>${ot.fecha_ejecucion}</td>
                    <td>${ot.numero_informe_tecnico}</td>
                    <td>${ot.estado_servicio}</td>
                    <td>${ot.operatividad_equipo}</td>
                    <td>${ot.observaciones}</td>
                    <td>
                        <button class="btn-sm btn-primary" onclick="editOrden(${ot.id_ot})"><i class="fa-solid fa-pencil"></i></button>
                        <button class="btn-sm btn-danger" onclick="deleteOrden(${ot.id_ot})"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>`;
        });
        document.getElementById('otmc-list').innerHTML = content;
    } catch (error) {
        console.error("Error al listar OT MC:", error);
    }
};

/******************** Borrar orden de trabajo ********************/
const deleteOrden = async (id_ot) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta orden de trabajo?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/otmc/${id_ot}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                alert("Orden de trabajo eliminada con éxito!");
                document.querySelector('#datatable_otmc tbody').innerHTML = ''; 
                await initDataTableOTMC(); 
            } else {
                alert("¡Error al eliminar la orden de trabajo!");
            }
        } catch (error) {
            console.error("¡Error al eliminar la orden de trabajo:!", error);
        }
    }
};


/****************************** Guardar y editar ordenes*******************************************/
document.addEventListener("DOMContentLoaded", () => {
    const otModal = new bootstrap.Modal(document.getElementById("ordenesModal"));
    const saveOrdenButton = document.getElementById("saveordenButton");
    const ordenForm = document.getElementById("orden-form");

    if (!otModal || !saveOrdenButton || !ordenForm) {
        console.error("No se encontraron elementos clave del modal.");
        return;
    }

    
    const openAddModal = (event) => {
        event.preventDefault();
        event.stopPropagation();
        ordenForm.reset();
        saveOrdenButton.dataset.action = "add";
        saveOrdenButton.dataset.id_ot = "";
        otModal.show();
    };

    
    window.editOrden = async (id_ot) => {
        if (!id_ot) {
            alert("ID de la orden no válido.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/otmc/${id_ot}`);
            if (!response.ok) throw new Error("No se pudo obtener la orden de trabajo");

            const ot = await response.json();
            ordenForm.reset();

           /**Datos de la tabla ordenes */
            document.getElementById("equipos_de_acreditacion").value = ot.equipos_de_acreditacion || "";
            document.getElementById("numero_orden").value = ot.numero_orden || "";
            document.getElementById("modalidad_servicio").value = ot.modalidad_servicio || "";
            document.getElementById("tipo_servicio").value = ot.tipo_servicio || "";
            document.getElementById("responsable_gestion").value = ot.responsable_gestion || "";
            document.getElementById("fecha_generacion").value = ot.fecha_generacion || "";
            document.getElementById("fecha_cierre_ot").value = ot.fecha_cierre_ot || "";
            document.getElementById("estado_ot").value = ot.estado_ot || "";
            document.getElementById("servicio_clinico").value = ot.servicio_clinico || "";
            document.getElementById("referente_clinico").value = ot.referente_clinico || "";
            document.getElementById("nombre").value = ot.nombre || "";
            document.getElementById("marca").value = ot.marca || "";
            document.getElementById("modelo").value = ot.modelo || "";
            document.getElementById("numero_serie").value = ot.numero_serie || "";
            document.getElementById("numero_invetario").value = ot.numero_invetario || "";
            document.getElementById("garantia_vigente").value = ot.garantia_vigente || "";
            document.getElementById("numero_sap").value = ot.numero_sap || "";
            document.getElementById("fecha").value = ot.fecha || "";
            document.getElementById("descripcion").value = ot.descripcion || "";
            document.getElementById("tipo_compra").value = ot.tipo_compra || "";
            document.getElementById("codigo_o_id_licitacion").value = ot.codigo_o_id_licitacion || "";
            document.getElementById("numero_orden_compra").value = ot.numero_orden_compra || "";
            document.getElementById("costo_con_iva").value = ot.costo_con_iva || "";
            document.getElementById("proveedor").value = ot.proveedor || "";
            document.getElementById("nombre_ejecutador").value = ot.nombre_ejecutador || "";
            document.getElementById("fecha_ejecucion").value = ot.fecha_ejecucion || "";
            document.getElementById("numero_informe_tecnico").value = ot.numero_informe_tecnico || "";
            document.getElementById("estado_servicio").value = ot.estado_servicio || "";
            document.getElementById("operatividad_equipo").value = ot.operatividad_equipo || "";
            document.getElementById("observaciones").value = ot.observaciones || "";

            saveOrdenButton.dataset.action = "edit";
            saveOrdenButton.dataset.id_ot = id_ot;

            otModal.show();
        } catch (error) {
            console.error("Error al cargar los datos de la orden:", error);
            alert("No se pudo cargar los datos de la orden.");
        }
    };

   
    const handleSaveOrEdit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const action = saveOrdenButton.dataset.action;
        const id_ot = saveOrdenButton.dataset.id_ot;

        const ordenData = {
            equipos_de_acreditacion: document.getElementById("equipos_de_acreditacion").value.trim(),
            numero_orden: document.getElementById("numero_orden").value.trim(),
            modalidad_servicio: document.getElementById("modalidad_servicio").value.trim(),
            tipo_servicio: document.getElementById("tipo_servicio").value.trim(),
            responsable_gestion: document.getElementById("responsable_gestion").value.trim(),
            fecha_generacion: document.getElementById("fecha_generacion").value || null,
            fecha_cierre_ot: document.getElementById("fecha_cierre_ot").value || null,
            estado_ot: document.getElementById("estado_ot").value.trim(),
            servicio_clinico: document.getElementById("servicio_clinico").value.trim(),
            referente_clinico: document.getElementById("referente_clinico").value.trim(),
            nombre: document.getElementById("nombre").value.trim(),
            marca: document.getElementById("marca").value.trim(),
            modelo: document.getElementById("modelo").value.trim(),
            numero_serie: document.getElementById("numero_serie").value.trim(),
            numero_invetario: document.getElementById("numero_invetario").value.trim(),
            garantia_vigente: document.getElementById("garantia_vigente").value.trim(),
            numero_sap: document.getElementById("numero_sap").value.trim(),
            fecha: document.getElementById("fecha").value || null,
            descripcion: document.getElementById("descripcion").value.trim(),
            tipo_compra: document.getElementById("tipo_compra").value.trim(),
            codigo_o_id_licitacion: document.getElementById("codigo_o_id_licitacion").value.trim(),
            numero_orden_compra: document.getElementById("numero_orden_compra").value.trim(),
            costo_con_iva: document.getElementById("costo_con_iva").value.trim(),
            proveedor: document.getElementById("proveedor").value.trim(),
            nombre_ejecutador: document.getElementById("nombre_ejecutador").value.trim(),
            fecha_ejecucion: document.getElementById("fecha_ejecucion").value || null,
            numero_informe_tecnico: document.getElementById("numero_informe_tecnico").value.trim(),
            estado_servicio: document.getElementById("estado_servicio").value.trim(),
            operatividad_equipo: document.getElementById("operatividad_equipo").value.trim(),
            observaciones: document.getElementById("observaciones").value.trim(),
        };

        if (!ordenData.nombre || !ordenData.marca || !ordenData.modelo) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        try {
            let response;
            if (action === "edit" && id_ot) {
                response = await fetch(`http://localhost:3000/api/otmc/${id_ot}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ordenData),
                });
            } else {
                response = await fetch("http://localhost:3000/api/otmc", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ordenData),
                });
            }

            if (response.ok) {
                alert("Operación realizada con éxito.");
                window.location.href = "ordenes-trabajo.html";
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "Error desconocido"}`);
            }
        } catch (error) {
            console.error("Error al guardar o editar la orden:", error);
        }
    };

    document.getElementById("add-item-btn").addEventListener("click", openAddModal);
    saveOrdenButton.addEventListener("click", handleSaveOrEdit);
    listOTMC();
});








/***********************************************************************************/
/********* Funcion para listar la tabla equipos ************************************/
const listEquipos = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/equipos");
        const equipos = await response.json();

        let content = ``;
        equipos.forEach((equipo, id_ie) => {
            content += `
                <tr>
                    <td>${id_ie + 1}</td>
                    <td>${equipo.servicio_clinico}</td>
                    <td>${equipo.referente_clinico}</td>
                    <td>${equipo.recinto}</td>
                    <td>${equipo.ubicacion_tecnica}</td>
                    <td>${equipo.ubicacion_actual}</td>
                    <td>${equipo.piso}</td>
                    <td>${equipo.familia}</td>
                    <td>${equipo.nombre}</td>
                    <td>${equipo.marca}</td>
                    <td>${equipo.modelo}</td>
                    <td>${equipo.numero_serie}</td>
                    <td>${equipo.numero_invetario}</td>
                    <td>${equipo.propiedad}</td>
                    <td>${equipo.equipos_de_acreditacion}</td>
                    <td>${equipo.pais_origen}</td>
                    <td>${equipo.id_1}</td>
                    <td>${equipo.oc}</td>
                    <td>${equipo.proveedor}</td>
                    <td>${equipo.fecha_puesta_marcha}</td>
                    <td>${equipo.fecha_rcd}</td>
                    <td>${equipo.garantia_meses}</td>
                    <td>${equipo.fecha_termino_garantia}</td>
                    <td>${equipo.estado_garantia}</td>
                    <td>${equipo.valor_neto}</td>
                    <td>${equipo.vida_util_anos}</td>  
                    <td>${equipo.fecha_inicio_obsolescencia}</td>
                    <td>${equipo.estado_obsolescencia}</td>
                    <td>${equipo.equipo_informatico}</td>
                    <td>${equipo.watts}</td>
                    <td>${equipo.kw_equipo}</td>
                    <td>${equipo.l_min_equipo}</td>      
                    <td>${equipo.observaciones}</td>  
                    <td>
                        <button class="btn-sm btn-primary" onclick="editEquipo(${equipo.id_ie})"><i class="fa-solid fa-pencil"></i></button>
                        <button class="btn-sm btn-danger" onclick="deleteEquipo(${equipo.id_ie})"><i class="fa-solid fa-trash-can"></i></button>
                    </td>       
                </tr>`;
        });
        document.getElementById('equipo-list').innerHTML = content;
    } catch (error) {
        console.error("Error al listar equipos:", error);
    }
};


/******************** Borrar equipo ********************/
const deleteEquipo = async (id_ie) => {
    if (confirm("¿Estás seguro de que deseas eliminar este equipo médico?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/equipos/${id_ie}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                alert("Equipo médico eliminado con éxito!");
                document.querySelector('#datatable_equipos tbody').innerHTML = ''; // Limpia el contenido de la tabla
                await initDataTableEquipos(); // Refresca la tabla inmediatamente
            } else {
                alert("Error al eliminar el equipo médico");
            }
        } catch (error) {
            console.error("Error al eliminar equipo médico:", error);
        }
    }
};


/********************** Guardar y editar equipos ******************************************/
document.addEventListener("DOMContentLoaded", () => {
    const equipoModal = new bootstrap.Modal(document.getElementById("equipoModal"));
    const saveEquiposButton = document.getElementById("savequiposButton");
    const equipoForm = document.getElementById("equipomedicos-form");

    if (!equipoModal || !saveEquiposButton || !equipoForm) {
        console.error("No se encontraron elementos clave del modal.");
        return;
    }

    
    const openAddModal = () => {
        equipoForm.reset(); 
        saveEquiposButton.dataset.action = "add"; 
        saveEquiposButton.dataset.id_ie = ""; 
        equipoModal.show(); 
    };

    
    window.editEquipo = async (id_ie) => {
        if (!id_ie) {
            alert("ID del equipo no válido.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/equipos/${id_ie}`);
            if (!response.ok) throw new Error("No se pudo obtener el equipo");

            const equipo = await response.json();
            equipoForm.reset();

           
            document.getElementById("servicio_clinico").value = equipo.servicio_clinico || "";
            document.getElementById("referente_clinico").value = equipo.referente_clinico || "";
            document.getElementById("recinto").value = equipo.recinto || "";
            document.getElementById("ubicacion_tecnica").value = equipo.ubicacion_tecnica || "";
            document.getElementById("ubicacion_actual").value = equipo.ubicacion_actual || "";
            document.getElementById("piso").value = equipo.piso || "";
            document.getElementById("familia").value = equipo.familia || "";
            document.getElementById("nombre").value = equipo.nombre || "";
            document.getElementById("marca").value = equipo.marca || "";
            document.getElementById("modelo").value = equipo.modelo || "";
            document.getElementById("numero_serie").value = equipo.numero_serie || "";
            document.getElementById("numero_invetario").value = equipo.numero_invetario || "";
            document.getElementById("propiedad").value = equipo.propiedad || "";
            document.getElementById("equipos_de_acreditacion").value = equipo.equipos_de_acreditacion || "";
            document.getElementById("pais_origen").value = equipo.pais_origen || "";
            document.getElementById("id_1").value = equipo.id_1 || "";
            document.getElementById("oc").value = equipo.oc || "";
            document.getElementById("proveedor").value = equipo.proveedor || "";
            document.getElementById("fecha_puesta_marcha").value = equipo.fecha_puesta_marcha || "";
            document.getElementById("fecha_rcd").value = equipo.fecha_rcd || "";
            document.getElementById("garantia_meses").value = equipo.garantia_meses || "";
            document.getElementById("fecha_termino_garantia").value = equipo.fecha_termino_garantia || "";
            document.getElementById("estado_garantia").value = equipo.estado_garantia || "";
            document.getElementById("valor_neto").value = equipo.valor_neto || "";
            document.getElementById("vida_util_anos").value = equipo.vida_util_anos || "";
            document.getElementById("fecha_inicio_obsolescencia").value = equipo.fecha_inicio_obsolescencia || "";
            document.getElementById("estado_obsolescencia").value = equipo.estado_obsolescencia || "";
            document.getElementById("equipo_informatico").value = equipo.equipo_informatico || "";
            document.getElementById("watts").value = equipo.watts || "";
            document.getElementById("kw_equipo").value = equipo.kw_equipo || "";
            document.getElementById("l_min_equipo").value = equipo.l_min_equipo || "";
            document.getElementById("observaciones").value = equipo.observaciones || "";

            saveEquiposButton.dataset.action = "edit";
            saveEquiposButton.dataset.id_ie = id_ie;

            equipoModal.show();
        } catch (error) {
            console.error("Error al cargar los datos del equipo:", error);
            alert("No se pudo cargar los datos del equipo.");
        }
    };

    
    const handleSaveOrEdit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const action = saveEquiposButton.dataset.action;
        const id_ie = saveEquiposButton.dataset.id_ie;

        const equipoData = {
            servicio_clinico: document.getElementById("servicio_clinico").value.trim(),
            referente_clinico: document.getElementById("referente_clinico").value.trim(),
            recinto: document.getElementById("recinto").value.trim(),
            ubicacion_tecnica: document.getElementById("ubicacion_tecnica").value.trim(),
            ubicacion_actual: document.getElementById("ubicacion_actual").value.trim(),
            piso: document.getElementById("piso").value.trim(),
            familia: document.getElementById("familia").value.trim(),
            nombre: document.getElementById("nombre").value.trim(),
            marca: document.getElementById("marca").value.trim(),
            modelo: document.getElementById("modelo").value.trim(),
            numero_serie: document.getElementById("numero_serie").value.trim(),
            numero_invetario: document.getElementById("numero_invetario").value.trim(),
            propiedad: document.getElementById("propiedad").value.trim(),
            equipos_de_acreditacion: document.getElementById("equipos_de_acreditacion").value.trim(),
            pais_origen: document.getElementById("pais_origen").value.trim(),
            id_1: document.getElementById("id_1").value.trim(),
            oc: document.getElementById("oc").value.trim(),
            proveedor: document.getElementById("proveedor").value.trim(),
            fecha_puesta_marcha: document.getElementById("fecha_puesta_marcha").value || null,
            fecha_rcd: document.getElementById("fecha_rcd").value || null,
            garantia_meses: document.getElementById("garantia_meses").value || null,
            fecha_termino_garantia: document.getElementById("fecha_termino_garantia").value || null,
            estado_garantia: document.getElementById("estado_garantia").value.trim(),
            valor_neto: document.getElementById("valor_neto").value.trim(),
            vida_util_anos: document.getElementById("vida_util_anos").value || null,
            fecha_inicio_obsolescencia: document.getElementById("fecha_inicio_obsolescencia").value || null,
            estado_obsolescencia: document.getElementById("estado_obsolescencia").value.trim(),
            equipo_informatico: document.getElementById("equipo_informatico").value.trim(),
            watts: document.getElementById("watts").value || null,
            kw_equipo: document.getElementById("kw_equipo").value.trim(),
            l_min_equipo: document.getElementById("l_min_equipo").value || null,
            observaciones: document.getElementById("observaciones").value.trim(),
        };

        try {
            let response;
            if (action === "edit" && id_ie) {
                response = await fetch(`http://localhost:3000/api/equipos/${id_ie}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(equipoData),
                });
            } else {
                response = await fetch("http://localhost:3000/api/equipos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(equipoData),
                });
            }

            if (response.ok) {
                alert("Operación realizada con éxito.");
                window.location.href = "equipos.html"; // Refresca la página
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "Error desconocido"}`);
            }
        } catch (error) {
            console.error("Error al guardar o editar el equipo:", error);
        }
    };

    
    document.getElementById("equipoModal").addEventListener("hidden.bs.modal", () => {
        equipoForm.reset();
        saveEquiposButton.dataset.action = "";
        saveEquiposButton.dataset.id_ie = "";
    });

    // Asignar evento para abrir el modal en modo agregar
    document.getElementById("add-item-btn").addEventListener("click", openAddModal);

    // Asignar evento para el botón guardar
    saveEquiposButton.addEventListener("click", handleSaveOrEdit);

    // Inicializar la lista de equipos
    listEquipos();
});









/***********************************************************************************/
/********* Funcion para lostar la tabla convenios **********************************/
const listUsers = async () => { ////// referencia a con-convenio
    try {

        
        const response = await fetch("http://localhost:3000/api/convenios");
        const users = await response.json();

        let content = ``;
        users.forEach((user, index) => {
            content += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${user.nombre}</td>
                    <td>${user.marca}</td>
                    <td>${user.modelo}</td>
                    <td>${user.equipos_de_acreditacion}</td>
                    <td>${user.cantidad_equipos}</td>
                    <td>${user.cantidad_mp_1_ano}</td>
                    <td>${user.proveedor}</td>
                    <td>${user.estado_convenio}</td>
                    <td>${user.tipo_convenio}</td>
                    <td>${user.modalidad_compra}</td>
                    <td>${user.id_oc}</td>
                    <td>${user.duracion}</td>
                    <td>${user.fecha_inicio_convenio}</td>
                    <td>${user.fecha_termino_convenio}</td>
                    <td>${user.observaciones}</td>
                    <td>
                                             
                        <button class="btn-sm btn-primary" onclick="editConvenio(${user.id_con})"><i class="fa-solid fa-pencil"></i></button>
                        <button class="btn-sm btn-danger" onclick="deleteConvenio(${user.id_con})"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>`;
        });
        document.getElementById('tableBody_users').innerHTML = content;//
    } catch (error) {
        console.error("Error al listar convenios:", error);
    }
};

/******************************* Borrar convenio ***********************************/
// Función específica para eliminar convenios
const deleteConvenio = async (id_con) => {
    if (confirm("¿Estás seguro de que deseas eliminar este convenio?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/convenios/${id_con}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                alert("¡Convenio eliminado con éxito!");
                document.querySelector('#datatable_users tbody').innerHTML = ''; 
                await initDataTableUsers(); 
            } else {
                alert("Error al eliminar el convenio");
            }
        } catch (error) {
            console.error("Error al eliminar convenio:", error);
        }
    }
};
/*********************   Guardar y editar convenio ********************************************/
document.addEventListener("DOMContentLoaded", () => {
    const conveniosModal = new bootstrap.Modal(document.getElementById("conveniosModal"));
    const saveConvenioButton = document.getElementById("saveConveniosButton");
    const convenioForm = document.getElementById("convenios-form");

    if (!conveniosModal || !saveConvenioButton || !convenioForm) {
        console.error("No se encontraron elementos clave del modal.");
        return;
    }

    
    const openAddModal = () => {
        convenioForm.reset();
        saveConvenioButton.dataset.action = "add"; 
        saveConvenioButton.dataset.id_con = ""; 
        conveniosModal.show(); 
    };

    
    window.editConvenio = async (id_con) => {
        if (!id_con) {
            alert("ID del convenio no válido.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/convenios/${id_con}`);
            if (!response.ok) throw new Error("No se pudo obtener el convenio");

            const convenio = await response.json();
            convenioForm.reset();

            
            document.getElementById("nombre").value = convenio.nombre || "";
            document.getElementById("marca").value = convenio.marca || "";
            document.getElementById("modelo").value = convenio.modelo || "";
            document.getElementById("equipos_de_acreditacion").value = convenio.equipos_de_acreditacion || "";
            document.getElementById("cantidad_equipos").value = convenio.cantidad_equipos || 0;
            document.getElementById("cantidad_mp_1_ano").value = convenio.cantidad_mp_1_ano || 0;
            document.getElementById("proveedor").value = convenio.proveedor || "";
            document.getElementById("estado_convenio").value = convenio.estado_convenio || "";
            document.getElementById("tipo_convenio").value = convenio.tipo_convenio || "";
            document.getElementById("modalidad_compra").value = convenio.modalidad_compra || "";
            document.getElementById("id_oc").value = convenio.id_oc || "";
            document.getElementById("duracion").value = convenio.duracion || 0;
            document.getElementById("fecha_inicio_convenio").value = convenio.fecha_inicio_convenio || "";
            document.getElementById("fecha_termino_convenio").value = convenio.fecha_termino_convenio || "";
            document.getElementById("observaciones").value = convenio.observaciones || "";

            saveConvenioButton.dataset.action = "edit";
            saveConvenioButton.dataset.id_con = id_con;

            conveniosModal.show();
        } catch (error) {
            console.error("Error al cargar los datos del convenio:", error);
            alert("No se pudo cargar los datos del convenio.");
        }
    };

   
    const handleSaveOrEdit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const action = saveConvenioButton.dataset.action;
        const id_con = saveConvenioButton.dataset.id_con;

        const convenioData = {
            nombre: document.getElementById("nombre").value.trim(),
            marca: document.getElementById("marca").value.trim(),
            modelo: document.getElementById("modelo").value.trim(),
            equipos_de_acreditacion: document.getElementById("equipos_de_acreditacion").value.trim(),
            cantidad_equipos: parseInt(document.getElementById("cantidad_equipos").value, 10) || 0,
            cantidad_mp_1_ano: parseInt(document.getElementById("cantidad_mp_1_ano").value, 10) || 0,
            proveedor: document.getElementById("proveedor").value.trim(),
            estado_convenio: document.getElementById("estado_convenio").value.trim(),
            tipo_convenio: document.getElementById("tipo_convenio").value.trim(),
            modalidad_compra: document.getElementById("modalidad_compra").value.trim(),
            id_oc: document.getElementById("id_oc").value.trim(),
            duracion: parseInt(document.getElementById("duracion").value, 10) || 0,
            fecha_inicio_convenio: document.getElementById("fecha_inicio_convenio").value || null,
            fecha_termino_convenio: document.getElementById("fecha_termino_convenio").value || null,
            observaciones: document.getElementById("observaciones").value.trim(),
        };

        if (!convenioData.nombre || !convenioData.marca || !convenioData.modelo) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        try {
            let response;
            if (action === "edit" && id_con) {
                response = await fetch(`http://localhost:3000/api/convenios/${id_con}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(convenioData),
                });
            } else {
                response = await fetch("http://localhost:3000/api/convenios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(convenioData),
                });
            }

            if (response.ok) {
                alert("Operación realizada con éxito.");
                window.location.href = "convenios.html"; 
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "Error desconocido"}`);
            }
        } catch (error) {
            console.error("Error al guardar o editar el convenio:", error);
        }
    };

   
    document.getElementById("conveniosModal").addEventListener("hidden.bs.modal", () => {
        convenioForm.reset();
        saveConvenioButton.dataset.action = "";
        saveConvenioButton.dataset.id_con = "";
    });

   
    document.getElementById("add-item-btn").addEventListener("click", openAddModal);

  
    saveConvenioButton.addEventListener("click", handleSaveOrEdit);

    
    listUsers(); 
});






/***********************************************************************************/
/**************** Listar mantenimiento correctivo y preventivo *********************/
const listMantenciones = async () => { 
    try {
        const response = await fetch("http://localhost:3000/api/mantencionespc");
        const mantenciones = await response.json();
       

        let content = ``;
        mantenciones.forEach((mantencion, id_mc) => {
            content += `
                <tr>
                    <td>${id_mc + 1}</td>
                    <td>${mantencion.numero_sap}</td>
                    <td>${mantencion.numero_orden}</td>
                    <td>${mantencion.responsable_gestion}</td>
                    <td>${mantencion.nombre}</td>
                    <td>${mantencion.marca}</td>
                    <td>${mantencion.modelo}</td>
                    <td>${mantencion.numero_serie}</td>
                    <td>${mantencion.numero_invetario}</td>
                    <td>${mantencion.equipos_de_acreditacion}</td>
                    <td>${mantencion.garantia_vigente}</td>
                    <td>${mantencion.servicio_clinico}</td>
                    <td>${mantencion.referente_clinico}</td>
                    <td>${mantencion.fecha_generacion}</td>
                    <td>${mantencion.descripcion}</td>
                    <td>${mantencion.modalidad_servicio}</td>
                    <td>${mantencion.tipo_servicio}</td>
                    <td>${mantencion.proveedor}</td>
                    <td>${mantencion.fecha_ejecucion}</td>
                    <td>${mantencion.tipo_compra}</td>
                    <td>${mantencion.numero_orden_compra}</td>
                    <td>${mantencion.codigo_o_id_licitacion}</td>
                    <td>${mantencion.costo_con_iva}</td>
                    <td>${mantencion.fecha_cierre_ot}</td>
                    <td>${mantencion.recepcion}</td>
                    <td>
                        
                        <button class="btn-sm btn-primary" onclick="editMantencion(${mantencion.id_mc})"><i class="fa-solid fa-trash-can"></i></button>
                        <button class="btn-sm btn-danger" onclick="deleteMantencion(${mantencion.id_mc})"><i class="fa-solid fa-trash-can"></i></button>
                    </td>                
                </tr>`;
        });

        document.getElementById('tableBody-mantenciones').innerHTML = content;
    } catch (error) {
        console.error("Error al listar Mantenciones:", error);
    }
};

/************************************ Borrar mantención ****************************/
const deleteMantencion = async (id_mc) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta mantención?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/mantencionespc/${id_mc}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                alert("¡Mantención eliminada con éxito!");
                document.querySelector('#datatable_mantenciones tbody').innerHTML = ''; 
                await initDataTableMantenciones();
            } else {
                alert("Error al eliminar la mantención");
            }
        } catch (error) {
            console.error("Error al eliminar la mantención:", error);
        }
    }
};


/********************************** Boton agregar guardar mantencion **********************************************/

document.addEventListener("DOMContentLoaded", () => {
    const mantencionesModal = new bootstrap.Modal(document.getElementById("mantencionesModal"));
    const saveMantencionButton = document.getElementById("savemantencionButton");
    const mantencionForm = document.getElementById("equipo-form");

    if (!mantencionesModal || !saveMantencionButton || !mantencionForm) {
        console.error("No se encontraron elementos clave del modal.");
        return;
    }

    const openAddModal = () => {
        mantencionForm.reset(); 
        saveMantencionButton.dataset.action = "add"; 
        saveMantencionButton.dataset.id_mc = ""; 
        mantencionesModal.show(); 
    };

    
    window.editMantencion = async (id_mc) => {
        if (!id_mc) {
            alert("ID de la mantención no válido.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/mantencionespc/${id_mc}`);
            if (!response.ok) throw new Error("No se pudo obtener la mantención");

            const mantencion = await response.json();
            mantencionForm.reset();

            
            document.getElementById("numero_sap").value = mantencion.numero_sap || "";
            document.getElementById("numero_orden").value = mantencion.numero_orden || "";
            document.getElementById("responsable_gestion").value = mantencion.responsable_gestion || "";
            document.getElementById("nombre").value = mantencion.nombre || "";
            document.getElementById("marca").value = mantencion.marca || "";
            document.getElementById("modelo").value = mantencion.modelo || "";
            document.getElementById("numero_serie").value = mantencion.numero_serie || "";
            document.getElementById("equipos_de_acreditacion").value = mantencion.equipos_de_acreditacion || "";
            document.getElementById("garantia_vigente").value = mantencion.garantia_vigente || "";
            document.getElementById("servicio_clinico").value = mantencion.servicio_clinico || "";
            document.getElementById("referente_clinico").value = mantencion.referente_clinico || "";
            document.getElementById("fecha_generacion").value = mantencion.fecha_generacion || "";
            document.getElementById("modalidad_servicio").value = mantencion.modalidad_servicio || "";
            document.getElementById("tipo_servicio").value = mantencion.tipo_servicio || "";
            document.getElementById("proveedor").value = mantencion.proveedor || "";
            document.getElementById("fecha_ejecucion").value = mantencion.fecha_ejecucion || "";
            document.getElementById("tipo_compra").value = mantencion.tipo_compra || "";
            document.getElementById("numero_orden_compra").value = mantencion.numero_orden_compra || "";
            document.getElementById("codigo_o_id_licitacion").value = mantencion.codigo_o_id_licitacion || "";
            document.getElementById("costo_con_iva").value = mantencion.costo_con_iva || "";
            document.getElementById("fecha_cierre_ot").value = mantencion.fecha_cierre_ot || "";
            document.getElementById("descripcion").value = mantencion.descripcion || "";
            document.getElementById("recepcion").value = mantencion.recepcion || "";

            saveMantencionButton.dataset.action = "edit";
            saveMantencionButton.dataset.id_mc = id_mc;

            mantencionesModal.show();
        } catch (error) {
            console.error("Error al cargar los datos de la mantención:", error);
            alert("No se pudo cargar los datos de la mantención.");
        }
    };

    
    const handleSaveOrEdit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const action = saveMantencionButton.dataset.action;
        const id_mc = saveMantencionButton.dataset.id_mc;

        const mantencionData = {
            numero_sap: document.getElementById("numero_sap").value.trim(),
            numero_orden: document.getElementById("numero_orden").value.trim(),
            responsable_gestion: document.getElementById("responsable_gestion").value.trim(),
            nombre: document.getElementById("nombre").value.trim(),
            marca: document.getElementById("marca").value.trim(),
            modelo: document.getElementById("modelo").value.trim(),
            numero_serie: document.getElementById("numero_serie").value.trim(),
            equipos_de_acreditacion: document.getElementById("equipos_de_acreditacion").value.trim(),
            garantia_vigente: document.getElementById("garantia_vigente").value.trim(),
            servicio_clinico: document.getElementById("servicio_clinico").value.trim(),
            referente_clinico: document.getElementById("referente_clinico").value.trim(),
            fecha_generacion: document.getElementById("fecha_generacion").value || null,
            modalidad_servicio: document.getElementById("modalidad_servicio").value.trim(),
            tipo_servicio: document.getElementById("tipo_servicio").value.trim(),
            proveedor: document.getElementById("proveedor").value.trim(),
            fecha_ejecucion: document.getElementById("fecha_ejecucion").value || null,
            tipo_compra: document.getElementById("tipo_compra").value.trim(),
            numero_orden_compra: document.getElementById("numero_orden_compra").value.trim(),
            codigo_o_id_licitacion: document.getElementById("codigo_o_id_licitacion").value.trim(),
            costo_con_iva: document.getElementById("costo_con_iva").value.trim(),
            fecha_cierre_ot: document.getElementById("fecha_cierre_ot").value || null,
            descripcion: document.getElementById("descripcion").value.trim(),
            recepcion: document.getElementById("recepcion").value.trim(),
        };

        try {
            let response;
            if (action === "edit" && id_mc) {
                response = await fetch(`http://localhost:3000/api/mantencionespc/${id_mc}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(mantencionData),
                });
            } else {
                response = await fetch("http://localhost:3000/api/mantencionespc", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(mantencionData),
                });
            }

            if (response.ok) {
                alert("Operación realizada con éxito.");
                window.location.href = "ordenes-mp-mc.html"; 
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "Error desconocido"}`);
            }
        } catch (error) {
            console.error("Error al guardar o editar la mantención:", error);
        }
    };

    
    document.getElementById("mantencionesModal").addEventListener("hidden.bs.modal", () => {
        mantencionForm.reset();
        saveMantencionButton.dataset.action = "";
        saveMantencionButton.dataset.id_mc = "";
    });

    
    document.getElementById("add-item-btn").addEventListener("click", openAddModal);

    
    saveMantencionButton.addEventListener("click", handleSaveOrEdit);

    
    listMantenciones(); 
});






/***********************************************************************************/
/*****************  Funcion para lista la tabla adquisiciones **********************/
const listAdquisiciones = async () => { 
    try {
        const response = await fetch("http://localhost:3000/api/adquisiciones");
        const adquisiciones = await response.json();

        let content = ``;
        adquisiciones.forEach((adquisicion, id_a) => {
            content += `
                <tr>
                    <td>${id_a + 1}</td>
                    <td>${adquisicion.estado_adquisiciones}</td>
                    <td>${adquisicion.modalidad_compra}</td>
                    <td>${adquisicion.id_licitacion}</td>
                    <td>${adquisicion.orden_compra}</td>
                    <td>${adquisicion.proveedor}</td>
                    <td>${adquisicion.valor_unitario_neto}</td>
                    <td>${adquisicion.servicio_clinico}</td>
                    <td>${adquisicion.nombre}</td>
                    <td>${adquisicion.marca}</td>
                    <td>${adquisicion.modelo}</td>
                    <td>${adquisicion.numero_serie}</td>
                    <td>${adquisicion.recepcionado_si_no}</td>
                    <td>${adquisicion.fecha_real_entrega}</td>
                    <td>${adquisicion.numero_guia_despacho}</td>
                    <td>${adquisicion.numero_factura}</td>
                    <td>${adquisicion.carta_compromiso}</td>
                    <td>${adquisicion.pendientes_comprometidos}</td>
                    <td>${adquisicion.fecha_comprometida}</td>
                    <td>${adquisicion.estado_instalacion}</td>
                    <td>${adquisicion.fecha_instalacion}</td>
                    <td>${adquisicion.estado_puesta_marcha}</td>
                    <td>${adquisicion.fecha_puesta_marcha}</td>
                    <td>${adquisicion.estado_capacitacion}</td>
                    <td>${adquisicion.rcd_generada}</td>
                    <td>${adquisicion.fecha_rcd}</td>
                    <td>${adquisicion.garantia_meses}</td>
                    <td>${adquisicion.mp_incluidos}</td>
                    <td>${adquisicion.fecha_termino_garantia}</td>
                    <td>${adquisicion.observaciones}</td>
                                       
                    <td>
                        <button class="btn-sm btn-primary" onclick="editAdquisicion(${adquisicion.id_a})"><i class="fa-solid fa-pencil"></i></button>                        
                        <button class="btn-sm btn-danger" onclick="deleteAdquisicion(${adquisicion.id_a})"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>`;
        });
        document.getElementById('tableBody_adquisiciones').innerHTML = content;
    } catch (error) {
        console.error("Error al Adquisiciones:", error);
    }
};

/****************************** Borrar adquisiciones *******************************/
const deleteAdquisicion = async (id_a) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta adquisición?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/adquisiciones/${id_a}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                alert("¡Adquisición eliminada con éxito!");
                document.querySelector('#datatable_adquisiciones tbody').innerHTML = ''; 
                await initDataTableAdquisiciones(); 
            } else {
                alert("Error al eliminar la adquisición seleccionada");
            }
        } catch (error) {
            console.error("Error al eliminar la adquisición seleccionada:", error);
        }
    }
};

/*****************  Boton guardar y editar adquisiciones **********************/
document.addEventListener("DOMContentLoaded", () => {
    const adquisicionesModal = new bootstrap.Modal(document.getElementById("adquisicioesModal"));
    const saveAdquisicionButton = document.getElementById("saveadquisicionButton");
    const adquisicionForm = document.getElementById("equipo-form");

    if (!adquisicionesModal || !saveAdquisicionButton || !adquisicionForm) {
        console.error("No se encontraron elementos clave del modal.");
        return;
    }

  
    const openAddModal = (event) => {
        event.preventDefault();
        event.stopPropagation(); 
        saveAdquisicionButton.dataset.action = "add"; 
        saveAdquisicionButton.dataset.id_a = ""; 
        adquisicionesModal.show(); 
    };

    
    window.editAdquisicion = async (id_a) => {
        if (!id_a) {
            alert("ID de la adquisición no válido.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/adquisiciones/${id_a}`);
            if (!response.ok) throw new Error("No se pudo obtener la adquisición");

            const adquisicion = await response.json();
            adquisicionForm.reset();

            // Cargar los datos de la adquisición en el formulario
            document.getElementById("estado_adquisiciones").value = adquisicion.estado_adquisiciones || "";
            document.getElementById("modalidad_compra").value = adquisicion.modalidad_compra || "";
            document.getElementById("id_licitacion").value = adquisicion.id_licitacion || "";
            document.getElementById("orden_compra").value = adquisicion.orden_compra || "";
            document.getElementById("proveedor").value = adquisicion.proveedor || "";
            document.getElementById("valor_unitario_neto").value = adquisicion.valor_unitario_neto || "";
            document.getElementById("servicio_clinico").value = adquisicion.servicio_clinico || "";
            document.getElementById("nombre").value = adquisicion.nombre || "";
            document.getElementById("marca").value = adquisicion.marca || "";
            document.getElementById("modelo").value = adquisicion.modelo || "";
            document.getElementById("numero_serie").value = adquisicion.numero_serie || "";
            document.getElementById("recepcionado_si_no").value = adquisicion.recepcionado_si_no || "";
            document.getElementById("fecha_real_entrega").value = adquisicion.fecha_real_entrega || "";
            document.getElementById("numero_guia_despacho").value = adquisicion.numero_guia_despacho || "";
            document.getElementById("numero_factura").value = adquisicion.numero_factura || "";
            document.getElementById("carta_compromiso").value = adquisicion.carta_compromiso || "";
            document.getElementById("pendientes_comprometidos").value = adquisicion.pendientes_comprometidos || "";
            document.getElementById("fecha_comprometida").value = adquisicion.fecha_comprometida || "";
            document.getElementById("estado_instalacion").value = adquisicion.estado_instalacion || "";
            document.getElementById("fecha_instalacion").value = adquisicion.fecha_instalacion || "";
            document.getElementById("estado_puesta_marcha").value = adquisicion.estado_puesta_marcha || "";
            document.getElementById("fecha_puesta_marcha").value = adquisicion.fecha_puesta_marcha || "";
            document.getElementById("estado_capacitacion").value = adquisicion.estado_capacitacion || "";
            document.getElementById("rcd_generada").value = adquisicion.rcd_generada || "";
            document.getElementById("fecha_rcd").value = adquisicion.fecha_rcd || "";
            document.getElementById("garantia_meses").value = adquisicion.garantia_meses || 0;
            document.getElementById("mp_incluidos").value = adquisicion.mp_incluidos || 0;
            document.getElementById("fecha_termino_garantia").value = adquisicion.fecha_termino_garantia || "";
            document.getElementById("observaciones").value = adquisicion.observaciones || "";

            saveAdquisicionButton.dataset.action = "edit";
            saveAdquisicionButton.dataset.id_a = id_a;

            adquisicionesModal.show();
        } catch (error) {
            console.error("Error al cargar los datos de la adquisición:", error);
            alert("No se pudo cargar los datos de la adquisición.");
        }
    };

    
    const handleSaveOrEdit = async (event) => {
        event.preventDefault(); 
        event.stopPropagation(); 

        const action = saveAdquisicionButton.dataset.action;
        const id_a = saveAdquisicionButton.dataset.id_a;

        const adquisicionData = {
            estado_adquisiciones: document.getElementById("estado_adquisiciones").value.trim(),
            modalidad_compra: document.getElementById("modalidad_compra").value.trim(),
            id_licitacion: document.getElementById("id_licitacion").value.trim(),
            orden_compra: document.getElementById("orden_compra").value.trim(),
            proveedor: document.getElementById("proveedor").value.trim(),
            valor_unitario_neto: document.getElementById("valor_unitario_neto").value.trim(),
            servicio_clinico: document.getElementById("servicio_clinico").value.trim(),
            nombre: document.getElementById("nombre").value.trim(),
            marca: document.getElementById("marca").value.trim(),
            modelo: document.getElementById("modelo").value.trim(),
            numero_serie: document.getElementById("numero_serie").value.trim(),
            recepcionado_si_no: document.getElementById("recepcionado_si_no").value.trim(),
            fecha_real_entrega: document.getElementById("fecha_real_entrega").value || null,
            numero_guia_despacho: document.getElementById("numero_guia_despacho").value.trim(),
            numero_factura: document.getElementById("numero_factura").value.trim(),
            carta_compromiso: document.getElementById("carta_compromiso").value.trim(),
            pendientes_comprometidos: document.getElementById("pendientes_comprometidos").value.trim(),
            fecha_comprometida: document.getElementById("fecha_comprometida").value || null,
            estado_instalacion: document.getElementById("estado_instalacion").value.trim(),
            fecha_instalacion: document.getElementById("fecha_instalacion").value || null,
            estado_puesta_marcha: document.getElementById("estado_puesta_marcha").value.trim(),
            fecha_puesta_marcha: document.getElementById("fecha_puesta_marcha").value || null,
            estado_capacitacion: document.getElementById("estado_capacitacion").value.trim(),
            rcd_generada: document.getElementById("rcd_generada").value.trim(),
            fecha_rcd: document.getElementById("fecha_rcd").value || null,
            garantia_meses: parseInt(document.getElementById("garantia_meses").value, 10) || 0,
            mp_incluidos: parseInt(document.getElementById("mp_incluidos").value, 10) || 0,
            fecha_termino_garantia: document.getElementById("fecha_termino_garantia").value || null,
            observaciones: document.getElementById("observaciones").value.trim(),
        };

        if (!adquisicionData.nombre || !adquisicionData.marca || !adquisicionData.modelo) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        try {
            let response;
            if (action === "edit" && id_a) {
                response = await fetch(`http://localhost:3000/api/adquisiciones/${id_a}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(adquisicionData),
                });
            } else if (action === "add") {
                response = await fetch("http://localhost:3000/api/adquisiciones", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(adquisicionData),
                });
            } else {
                console.error("Acción no válida:", action);
                return;
            }

            if (response.ok) {
                alert("Operación realizada con éxito.");
                window.location.href = "adquisiciones.html"; 
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "Error desconocido"}`);
            }
        } catch (error) {
            console.error("Error al guardar o editar la adquisición:", error);
        }
    };

    // Escucha el evento de cierre del modal para resetear el formulario
    document.getElementById("adquisicioesModal").addEventListener("hidden.bs.modal", () => {
        adquisicionForm.reset();
        saveAdquisicionButton.dataset.action = "";
        saveAdquisicionButton.dataset.id_a = "";
    });

    // Asignar evento para abrir el modal en modo agregar
    document.getElementById("add-item-btn").addEventListener("click", openAddModal);

    // Asignar evento para el botón guardar
    saveAdquisicionButton.addEventListener("click", handleSaveOrEdit);

    // Inicializar la lista de adquisiciones
    listAdquisiciones();
});


/***********************************************************************************/
/***************************** Funcion registro ************************************/
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const nombreUsuario = document.getElementById("usuario").value.trim();
            const email = document.getElementById("email").value.trim();
            const clave = document.getElementById("clave").value.trim();
            const repetirClave = document.getElementById("repetirClave").value.trim();

            if (clave !== repetirClave) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/api/usuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre_usuario: nombreUsuario, email, clave }),
                });

                if (response.ok) {
                    alert("¡Registro exitoso!");
                    registerForm.reset();
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || "No se pudo completar el registro"}`);
                }
            } catch (error) {
                console.error("Error en el registro:", error);
                alert("Hubo un error al intentar registrarse. Intente nuevamente más tarde.");
            }
        });
    }
});

/***********************************************************************************/
/********************** Boton descarga de archivos *********************************/
document.addEventListener("DOMContentLoaded", () => {
    // Función para inicializar los botones y asociarlos con la descarga
    const initDownloadButton = (buttonId, url, fileName, headers, mapping) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener("click", async () => {
                await downloadTable(url, fileName, headers, mapping);
            });
        }
    };

    // Configuración de botones y sus tablas
    initDownloadButton(
        "download-csv-convenios",
        "http://localhost:3000/api/convenios",
        "convenios.xlsx",
        [
            "ID", "Nombre", "Marca", "Modelo", "Acreditación", "Cantidad Equipos",
            "Cant.MP1 Años", "Proveedor", "Estado", "Tipo Convenio",
            "Modalidad Compra", "ID/OC", "Duración", "Fecha Inicio Convenio",
            "Fecha Término Convenio", "Observaciones"
        ],
        {
            "ID": "id_con",//
            "Nombre": "nombre",
            "Marca": "marca",
            "Modelo": "modelo",
            "Acreditación": "equipos_de_acreditacion",
            "Cantidad Equipos": "cantidad_equipos",
            "Cant.MP1 Años": "cantidad_mp_1_ano",
            "Proveedor": "proveedor",
            "Estado": "estado_convenio",
            "Tipo Convenio": "tipo_convenio",
            "Modalidad Compra": "modalidad_compra",
            "ID/OC": "id_oc",
            "Duración": "duracion",
            "Fecha Inicio Convenio": "fecha_inicio_convenio",
            "Fecha Término Convenio": "fecha_termino_convenio",
            "Observaciones": "observaciones"
        }
    );

    initDownloadButton(
        "download-csv-adquisiciones",
        "http://localhost:3000/api/adquisiciones",
        "adquisiciones.xlsx",
        [
            "ID", "Estado Adquisiciones", "Modalidad Compra", "ID Licitación",
            "Orden Compra", "Proveedor", "Valor Unitario Neto", "Servicio Clínico",
            "Nombre", "Marca", "Modelo", "Número Serie", "Recepcionado SI/NO",
            "Fecha Real Entrega", "N° Guía Despacho", "N° Factura",
            "Carta Compromiso", "Pendiente Comprometida", "Fecha Comprometida",
            "Estado Instalación", "Fecha Instalación", "Estado Puesta en Marcha",
            "Fecha Puesta en Marcha", "Estado Capacitación", "RCD Generada",
            "Fecha RCD", "Garantía (Meses)", "Mp Incluidos", "Fecha Término Garantía",
            "Observaciones"
        ],
        {
            "ID": "id",
            "Estado Adquisiciones": "estado_adquisiciones",
            "Modalidad Compra": "modalidad_compra",
            "ID Licitación": "id_licitacion",
            "Orden Compra": "orden_compra",
            "Proveedor": "proveedor",
            "Valor Unitario Neto": "valor_unitario_neto",
            "Servicio Clínico": "servicio_clinico",
            "Nombre": "nombre",
            "Marca": "marca",
            "Modelo": "modelo",
            "Número Serie": "numero_serie",
            "Recepcionado SI/NO": "recepcionado_si_no",
            "Fecha Real Entrega": "fecha_real_entrega",
            "N° Guía Despacho": "numero_guia_despacho",
            "N° Factura": "numero_factura",
            "Carta Compromiso": "carta_compromiso",
            "Pendiente Comprometida": "pendientes_comprometidos",
            "Fecha Comprometida": "fecha_comprometida",
            "Estado Instalación": "estado_instalacion",
            "Fecha Instalación": "fecha_instalacion",
            "Estado Puesta en Marcha": "estado_puesta_marcha",
            "Fecha Puesta en Marcha": "fecha_puesta_marcha",
            "Estado Capacitación": "estado_capacitacion",
            "RCD Generada": "rcd_generada",
            "Fecha RCD": "fecha_rcd",
            "Garantía (Meses)": "garantia_meses",
            "Mp Incluidos": "mp_incluidos",
            "Fecha Término Garantía": "fecha_termino_garantia",
            "Observaciones": "observaciones"
        }
    );

    initDownloadButton(
        "download-csv-equipos",
        "http://localhost:3000/api/equipos",
        "equipos.xlsx",
        [
            "ID", "Servicio Clínico", "Referente Clínico", "Recinto",
            "Ubicación Técnica", "Ubicación Actual", "Piso", "Familia",
            "Nombre", "Marca", "Modelo", "Número Serie", "Inventario",
            "Propiedad", "Acreditación", "País Origen", "ID 1", "OC",
            "Proveedor", "Fecha Puesta Marcha", "Fecha RCD",
            "Garantía (Meses)", "Fecha Término Garantía", "Estado Garantía",
            "Valor Neto", "Vida Útil (Años)", "Fecha Inicio Obsolescencia",
            "Estado Obsolescencia", "Equipo Informático", "Watts",
            "KW Equipos", "L/min Equipo", "Observaciones"
        ],
        {
            "ID": "id_ie",
            "Servicio Clínico": "servicio_clinico",
            "Referente Clínico": "referente_clinico",
            "Recinto": "recinto",
            "Ubicación Técnica": "ubicacion_tecnica",
            "Ubicación Actual": "ubicacion_actual",
            "Piso": "piso",
            "Familia": "familia",
            "Nombre": "nombre",
            "Marca": "marca",
            "Modelo": "modelo",
            "Número Serie": "numero_serie",
            "Inventario": "numero_inventario",
            "Propiedad": "propiedad",
            "Acreditación": "equipos_de_acreditacion",
            "País Origen": "pais_origen",
            "ID 1": "id_1",
            "OC": "oc",
            "Proveedor": "proveedor",
            "Fecha Puesta Marcha": "fecha_puesta_marcha",
            "Fecha RCD": "fecha_rcd",
            "Garantía (Meses)": "garantia_meses",
            "Fecha Término Garantía": "fecha_termino_garantia",
            "Estado Garantía": "estado_garantia",
            "Valor Neto": "valor_neto",
            "Vida Útil (Años)": "vida_util_anos",
            "Fecha Inicio Obsolescencia": "fecha_inicio_obsolescencia",
            "Estado Obsolescencia": "estado_obsolescencia",
            "Equipo Informático": "equipo_informatico",
            "Watts": "watts",
            "KW Equipos": "kw_equipo",
            "L/min Equipo": "l_min_equipo",
            "Observaciones": "observaciones"
        }
    );

    initDownloadButton(
        "download-csv-proveedores",
        "http://localhost:3000/api/proveedor",
        "proveedores.xlsx",
        [
            "ID", "Nombre Proveedor", "Contacto", "Correo", "Dirección"
        ],
        {
            "ID": "id",
            "Nombre Proveedor": "nombre_proveedor",
            "Contacto": "contacto",
            "Correo": "correo",
            "Dirección": "direccion"
        }
    );

    initDownloadButton(
        "download-csv-ordenes",
        "http://localhost:3000/api/otmc",
        "ordenes.xlsx",
        [
            "ID", "Acreditación", "N° Orden", "Modalidad Servicio", "Tipo Servicio",
            "Responsable Gestión", "Fecha Generación", "Fecha Cierre OT", "Estado OT",
            "Servicio Clínico", "Referente Clínico", "Nombre", "Marca", "Modelo",
            "Serie", "Inventario", "Garantía", "N° SAP", "Fecha", "Descripción",
            "Tipo Compra", "Código o ID Licitación", "N° Orden Compra", "Costo con IVA",
            "Proveedor", "Nombre Ejecutador", "Fecha Ejecución", "N° Informe",
            "Estado Servicio", "Operatividad Equipo", "Observaciones"
        ],
        {
            "ID": "id",
            "Acreditación": "equipos_de_acreditacion",
            "N° Orden": "numero_orden",
            "Modalidad Servicio": "modalidad_servicio",
            "Tipo Servicio": "tipo_servicio",
            "Responsable Gestión": "responsable_gestion",
            "Fecha Generación": "fecha_generacion",
            "Fecha Cierre OT": "fecha_cierre_ot",
            "Estado OT": "estado_ot",
            "Servicio Clínico": "servicio_clinico",
            "Referente Clínico": "referente_clinico",
            "Nombre": "nombre",
            "Marca": "marca",
            "Modelo": "modelo",
            "Serie": "numero_serie",
            "Inventario": "inventario",
            "Garantía": "garantia",
            "N° SAP": "numero_sap",
            "Fecha": "fecha",
            "Descripción": "descripcion",
            "Tipo Compra": "tipo_compra",
            "Código o ID Licitación": "codigo_o_id_licitacion",
            "N° Orden Compra": "numero_orden_compra",
            "Costo con IVA": "costo_con_iva",
            "Proveedor": "proveedor",
            "Nombre Ejecutador": "nombre_ejecutador",
            "Fecha Ejecución": "fecha_ejecucion",
            "N° Informe": "numero_informe_tecnico",
            "Estado Servicio": "estado_servicio",
            "Operatividad Equipo": "operatividad_equipo",
            "Observaciones": "observaciones"
        }
    );

    initDownloadButton(
        "download-csv-mantenciones",
        "http://localhost:3000/api/mantencionespc",
        "mantenciones.xlsx",
        [
            "ID", "N° SAP", "N° Orden", "Responsable Gestión", "Nombre", "Marca",
            "Modelo", "N° Serie", "N° Inventario", "Equipo Acreditación", "Garantía Vigente",
            "Servicio Clínico", "Referente Clínico", "Fecha Generación", "Descripción",
            "Modalidad Servicio", "Tipo Servicio", "Proveedor", "Fecha Ejecución",
            "Tipo Compra", "N° Orden Compra", "Código o ID Licitación", "Costo con IVA",
            "Fecha Cierre OT", "Recepción"
        ],
        {
            "ID": "id",
            "N° SAP": "numero_sap",
            "N° Orden": "numero_orden",
            "Responsable Gestión": "responsable_gestion",
            "Nombre": "nombre",
            "Marca": "marca",
            "Modelo": "modelo",
            "N° Serie": "numero_serie",
            "N° Inventario": "numero_inventario",
            "Equipo Acreditación": "equipo_acreditacion",
            "Garantía Vigente": "garantia_vigente",
            "Servicio Clínico": "servicio_clinico",
            "Referente Clínico": "referente_clinico",
            "Fecha Generación": "fecha_generacion",
            "Descripción": "descripcion",
            "Modalidad Servicio": "modalidad_servicio",
            "Tipo Servicio": "tipo_servicio",
            "Proveedor": "proveedor",
            "Fecha Ejecución": "fecha_ejecucion",
            "Tipo Compra": "tipo_compra",
            "N° Orden Compra": "numero_orden_compra",
            "Código o ID Licitación": "codigo_o_id_licitacion",
            "Costo con IVA": "costo_con_iva",
            "Fecha Cierre OT": "fecha_cierre_ot",
            "Recepción": "recepcion"
        }
    );
});


/***********************************************************************************/
/**  Función reutilizable para descargar tablas como Excel ********/
const downloadTable = async (url, fileName, headers, mapping) => {
    try {
        if (typeof XLSX === "undefined") {
            throw new Error("Biblioteca XLSX no encontrada. Asegúrate de cargarla correctamente.");
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al obtener los datos.");
        }

        const data = await response.json();

        const worksheetData = [headers];
        data.forEach((item) => {
            const row = headers.map((header) => item[mapping[header]] || "");
            worksheetData.push(row);
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

        XLSX.writeFile(workbook, fileName);
    } catch (error) {
        console.error("Error al descargar el archivo XLSX:", error);
        alert("Ocurrió un error al generar el archivo Excel. Revisa la consola para más detalles.");
    }
};









/***********************************************************************************/
/********************* Boton guardar registro* *************************************/
document.addEventListener("DOMContentLoaded", () => {
    const registroButton = document.getElementById("registroButton");

    if (registroButton) {
        registroButton.addEventListener("click", async (event) => {
            event.preventDefault();

            // Capturar valores del formulario
            const usuarioData = {
                nombre_usuario: document.getElementById("usuario").value.trim(),
                email: document.getElementById("email").value.trim(),
                contraseña: document.getElementById("clave").value.trim(),
                repetirContraseña: document.getElementById("repetirClave").value.trim(),
            };

            // Validar campos vacíos
            if (!usuarioData.nombre_usuario || !usuarioData.email || !usuarioData.contraseña || !usuarioData.repetirContraseña) {
                alert("Todos los campos son obligatorios.");
                return;
            }

            // Validar que las contraseñas sean iguales
            if (usuarioData.contraseña !== usuarioData.repetirContraseña) {
                alert("Las contraseñas no coinciden. Por favor, verifica e inténtalo nuevamente.");
                return;
            }

            try {
                // Enviar datos al backend
                const response = await fetch("http://localhost:3000/api/usuarios", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre_usuario: usuarioData.nombre_usuario,
                        email: usuarioData.email,
                        contraseña: usuarioData.contraseña,
                    }),
                });

                if (response.ok) {
                    alert("¡Usuario registrado con éxito!");
                    document.getElementById("registerForm").reset();
                } else {
                    const errorData = await response.json();
                    alert(`Error al registrarse: ${errorData.error || "Error desconocido"}`);
                }
            } catch (error) {
                console.error("Error al registrar usuario:", error);
                alert("Ocurrió un error durante el registro. Por favor, intenta nuevamente.");
            }
        });
    }
});

/***********************************************************************************/
/***************************** Boton Ingreso ***************************************/
document.addEventListener("DOMContentLoaded", () => {
    const ingresoButton = document.getElementById("ingresoButton");

    if (ingresoButton) {
        ingresoButton.addEventListener("click", async (event) => {
            event.preventDefault();

          
            const loginData = {
                nombre_usuario: document.getElementById("loginName").value.trim(),
                contraseña: document.getElementById("loginPassword").value.trim(),
            };

         
            if (!loginData.nombre_usuario || !loginData.contraseña) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            try {
              
                const response = await fetch("http://localhost:3000/api/usuarios/login", {  
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(loginData),
                });

                if (response.ok) {
                    const result = await response.json();
                    alert("¡Ingreso exitoso!");
                    
                    window.location.href = "convenios.html"; 
                } else {
                    const errorData = await response.json();
                    alert(`Error al ingresar: ${errorData.error || "Credenciales inválidas"}`);
                }
            } catch (error) {
                console.error("Error al ingresar:", error);
                alert("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.");
            }
        });
    }
});





/*******************************************************************************************************************************/
const listInformes = async () => {
    try {
        // Llamada a la API para obtener los datos de informes
        const response = await fetch("http://localhost:3000/api/informes");
        const informes = await response.json();

        let content = ``; // Contenedor para las filas de la tabla
        informes.forEach((informe, index) => {
            content += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${informe.numero_serie}</td>
                    <td>${informe.nombre}</td>
                    <td>${informe.marca}</td>
                    <td>${informe.modelo}</td>
                    <td>${informe.servicio_clinico}</td>
                    <td>${informe.referente_clinico}</td>
                    <td>${informe.estado_garantia}</td>
                    <td>${informe.folio}</td>
                    <td>${informe.fecha_trabajo}</td>
                    <td>${informe.tecnico}</td>
                    <td>${informe.descripcion}</td>
                    <td>
                        <button class="btn-sm btn-primary" onclick="editImprimir(${informe.id_trabajo})"><i class="fa-solid fa-print"></i></button>
                        <button class="btn-sm btn-danger" onclick="deleteInforme(${informe.id_trabajo})"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>`;
        });

        // Insertar las filas generadas en el cuerpo de la tabla
        document.getElementById('tableBody-informes').innerHTML = content;
    } catch (error) {
        console.error("Error al listar los informes:", error);
    }
};

const deleteInforme = async (id_trabajo) => {
    if (confirm("¿Estás seguro de que deseas eliminar este informe?")) {
        try {
            // Realizar la solicitud DELETE al backend
            const response = await fetch(`http://localhost:3000/api/informes/${id_trabajo}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                alert("Informe eliminado con éxito.");
                // Vuelve a cargar la lista de informes para reflejar los cambios
                await listInformes();
            } else {
                const errorData = await response.json();
                alert(`Error al eliminar el informe: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error al eliminar el informe:", error);
            alert("Ocurrió un error al intentar eliminar el informe.");
        }
    }
};






/*******************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("saveInformeButton").addEventListener("click", async () => {
        // Captura los valores del formulario
        const numeroSerie = document.getElementById("numero_serie").value.trim();
        const nombre = document.getElementById("nombre").value.trim();
        const marca = document.getElementById("marca").value.trim();
        const modelo = document.getElementById("modelo").value.trim();
        const numeroInventario = document.getElementById("numero_invetario").value.trim();
        const servicioClinico = document.getElementById("servicio_clinico").value.trim();
        const referenteClinico = document.getElementById("referente_clinico").value.trim();
        const estadoGarantia = document.getElementById("estado_garantia").value.trim();
        const folio = document.getElementById("folio").value.trim();
        const fechaTrabajo = document.getElementById("fecha_trabajo").value;
        const tecnico = document.getElementById("tecnico").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();

        // Validación básica
        if (!numeroSerie || !nombre || !marca || !modelo) {
            alert("Por favor completa los campos obligatorios.");
            return;
        }

        // Crear el objeto de datos
        const data = {
            numero_serie: numeroSerie,
            nombre: nombre,
            marca: marca,
            modelo: modelo,
            numero_invetario: numeroInventario,
            servicio_clinico: servicioClinico,
            referente_clinico: referenteClinico,
            estado_garantia: estadoGarantia,
            folio: folio,
            fecha_trabajo: fechaTrabajo,
            tecnico: tecnico,
            descripcion: descripcion,
        };

        try {
            // Enviar los datos al backend
            const response = await fetch("http://localhost:3000/api/informes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("¡Datos guardados con éxito!");
                // Reinicia el formulario y actualiza la tabla
                document.getElementById("informe-form").reset();
                $('#informesModal').modal('hide'); // Oculta el modal
                initDataTableInformes(); // Actualiza la tabla (si tienes esta función)
            } else {
                const errorData = await response.json();
                console.error("Error al guardar:", errorData);
                alert("Error al guardar los datos.");
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            alert("Hubo un problema al conectar con el servidor.");
        }
    });
});




document.addEventListener("DOMContentLoaded", () => {
    // Definimos la función en el ámbito global para que sea accesible desde el HTML
    window.editImprimir = async (id_trabajo) => {
        try {
            // Llama al backend para obtener los datos del informe
            const response = await fetch(`http://localhost:3000/api/informes/${id_trabajo}`);
            if (!response.ok) throw new Error("Error al obtener el informe.");

            const informe = await response.json();

            // Prepara los datos para generar el informe
            const worksheetData = [
                [`INFORME TÉCNICO NÚMERO: ${id_trabajo}`],
                ["Número Serie:", informe.numero_serie],
                [],
                ["Nombre Equipo:", informe.nombre],
                [],
                ["Marca:", informe.marca],
                [],
                ["Modelo:", informe.modelo],
                [],
                ["Número Inventario:", informe.numero_invetario],
                [],
                ["Servicio Clínico:", informe.servicio_clinico],
                [],
                ["Referente Clínico:", informe.referente_clinico],
                [],
                ["Estado Garantía:", informe.estado_garantia],
                [],
                ["Folio:", informe.folio],
                [],
                ["Fecha Trabajo:", informe.fecha_trabajo],
                [],
                ["Técnico:", informe.tecnico],
                [],
                [],
                ["Descripción:", informe.descripcion],
            ];

            // Genera el archivo Excel
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, `Informe_${id_trabajo}`);

            // Descarga el archivo
            XLSX.writeFile(workbook, `informe_${id_trabajo}.xlsx`);

            alert("¡Informe generado con éxito!");
        } catch (error) {
            console.error("Error al generar el informe:", error);
            alert("Hubo un error al generar el informe.");
        }
    };
});



// Carga inicial de tablas según la página actual
window.addEventListener("load", async () => {
    const isProveedoresPage = document.getElementById('datatable_proveedores');
    const isUsersPage = document.getElementById('datatable_users');
    const isAdquisicionesPage = document.getElementById('datatable_adquisiciones');
    const isEquiposPage = document.getElementById('datatable_equipos');
    const isOTMCPage = document.getElementById('datatable_otmc');
    const isMantencionesPage = document.getElementById('datatable_mantenciones');
    const isInformesPage = document.getElementById('datatable_informes');

    if (isProveedoresPage) {
        await initDataTableProveedores();
    } else if (isUsersPage) {
        await initDataTableUsers();
    } else if (isAdquisicionesPage) {
        await initDataTableAdquisiciones();
    } else if (isEquiposPage) {
        await initDataTableEquipos();
    } else if (isOTMCPage) {
        await initDataTableOTMC();
    } else if (isMantencionesPage) {
        await initDataTableMantenciones();
    } else if (isInformesPage){
        await initDataTableInformes();
    }
});



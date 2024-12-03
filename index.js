// Importación de dependencias
const express = require('express');  
const cors = require('cors'); 
const app = express();   
const path = require("path");


app.use(express.static(path.join(__dirname, "public")));


const proveedorRouters = require('./routes/proveedorRouters.js');
const conveniosRouters = require('./routes/conveniosRouters.js');
const adquisicionesRouters = require('./routes/adquisicionesRouters.js');
const registroRouters = require('./routes/registroRouters.js');
const equiposRouters = require('./routes/equiposRouters.js');
const otmcRouters = require('./routes/otmcRouters.js');
const mantencionespcRouters = require('./routes/mantencionespcRouters.js');
const usuariosRouters = require('./routes/usuariosRouters.js');
const informeRouters = require('./routes/informeRouters.js');




app.use(express.json());  
app.use(cors());          


app.get('/', (req, res) =>  {
    res.send('¡Esto está funcionando!');
});


app.use("/api/proveedor", proveedorRouters);
app.use("/api/convenios", conveniosRouters);
app.use("/api/adquisiciones", adquisicionesRouters);
app.use("/api/registro", registroRouters);
app.use("/api/equipos", equiposRouters);
app.use("/api/otmc", otmcRouters);
app.use("/api/mantencionespc", mantencionespcRouters);
app.use("/api/usuarios",usuariosRouters);
app.use('/api/informes', informeRouters); 




app.listen(3000, () => {
    console.log('Servidor activo en el puerto 3000');
});


